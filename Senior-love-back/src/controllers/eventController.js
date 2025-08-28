import axios from "axios";
import { NotFoundError } from "../middleware/error.js";
import { Activity, Category, Event, Localisation, User } from "../models/association.js";
import { Op } from "sequelize";

export const eventController = {
    // fonction pour trouver tous les évènements, classé par date du plus proche au plus loin
    async getAll(req, res, next) {
        try {
            const { localisation } = req.query;

            const whereFiltre = {};

            if (localisation) {
                whereFiltre[Op.or] = [
                     { city: { [Op.iLike]: `%${localisation}%` } },
                     { department: { [Op.iLike]: `%${localisation}%` } },
                ];
            }

            const events = await Event.findAll(
                {
                    include: [
                        {
                            model: Localisation,
                            as: "localisation", //alias défini dans l'association à utiliser pour que la fonction marche
                            attributes: ["city", "department"],
                            where: whereFiltre,
                        },
                        {
                            model: Activity,
                            as: "activities",
                            include: [
                                {
                                    model: Category,
                                    as: "category",
                                    attributes: ["id", "name"],
                                },
                            ],
                        },
                    ],
                    order: [["date", "ASC"]],
                },
            );
            if (events.length === 0) {
                return next(new NotFoundError("Events not found"));
            }
            res.status(200).json(events);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur Serveur" });
        }
    },

    //fonction pour récupérer un profil utilisateur avec son id
    // ainsi que la ville ou à lieu l'évènement.
    async getOne(req, res, next) {
        try {
            const eventId = Number(req.params.id);
            const event = await Event.findByPk(eventId, {
                include: [
                    {
                        model: Localisation,
                        as: "localisation", //alias défini dans l'association à utiliser pour que la fonction marche
                    },
                    {
                        model: User,
                        as: "users", //alias défini dans l'association à utiliser pour que la fonction marche
                    },
                    {
                        model: Activity,
                        as: "activities",
                        include: [
                            {
                                model: Category,
                                as: "category",
                                attributes: ["id", "name"],
                            },
                        ],
                    },
                ],
            });

            if (!event) {
                return next(new NotFoundError("Event not found"));
            }

            res.status(200).json(event);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur Serveur" });
        }
    },

    //ajouter un utilisateur à un évènement avec son id
    async addUserToEvent(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return next();
            }

            const { user_id } = req.body;
            //console.log({ event_id, user_id })

            //verifier que l'évènement existe bien
            const event = await Event.findByPk(id, {
                include: {
                    model: User,
                    as: "users",
                },
            });
            //console.log(event);
            if (!event) {
                return next(new NotFoundError("Event not found"));
            }

            //verifier que l'utilisateur existe bien
            const user = await User.findByPk(user_id);
            if (!user) {
                return next(new NotFoundError("User not found"));
            }

            //vérifier s'il y a une limite de place (availability) et si elle est atteinte
            if (event.availability !== null && event.users.length >= event.availability) {
                return res.status(400).json({ message: "Event complet." });
            }

            //Ajout de l'utilisateur à l'évènement (via association)
            await event.addUser(user);

            // Mise à jour disponibilité
            if (event.availability !== null) {
                event.availability = event.availability - 1; //on décrémente l'availability quand un utilisateur s'inscrit
                await event.save();
            }

            // après avoir ajouté l'utilisateur, on est obligé de mettre à jour l'évènement pour que les changements soient pris en compte (ex si nombre de place limité = "-1")
            await event.reload({
                include: {
                    model: User,
                    as: "users", //alias défini dans l'association
                },
            });

            res.status(200).json(event, { message: `${user.pseudo} inscrit à l'événement avec succès. Nombre d'inscrit = ${event.users.length}` });
            console.log({ message: `${user.pseudo} inscrit à l'événement avec succès. Nombre d'inscrit = ${event.users.length}` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur Serveur" });
        }
    },

    // création d'un évènement
    async create(req, res) {
        try {
            // Vérification supplémentaire du rôle admin
            if (req.user?.role !== 'admin') {
                return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent créer des événements.' });
            }
            
            // Associer l'événement à l'utilisateur admin qui le crée
            eventData.user_id = req.user.id;

            //recuperation de city et les éléments de event (department est ignoré car récupéré via API)
            const { city, activities, ...eventData } = req.validatedData;


            // Gérer la localisation uniquement si city est fourni
            if (city) {
                //---------------insertion du code du call API Geolocalisation -------------------
                const response = await axios.get("https://geo.api.gouv.fr/communes", {
                    params: {
                        nom: city,
                        fields: "departement",
                        boost: "population",
                        limit: 1,
                    },
                });

                const result = response.data[0];
                console.log("ici le resultat de la ville", result);

                if (!result || !result.departement) {
                    return res.status(400).json({
                        message: `La ville "${city}" est introuvable via l'API Géo.`,
                    });
                }

                const departmentName = result.departement.nom;

                // ---------------- Trouver ou créer la localisation en BDD via l'API -----------------------
                const [localisation] = await Localisation.findOrCreate({
                    where: {
                        city: result.nom,
                        department: departmentName,
                    },
                });

                eventData.localisation_id = localisation.id;
            }

            // creation de l'évènement
            const event = await Event.create(eventData, {
                include: [
                    { model: Localisation, as: "localisation", attributes: ["city", "department"] },
                    { model: Activity, as: "activities" },
                ],
            });

            // Gérer la ou les activités uniquement si fournis
            if (activities && activities.length > 0) {
                //Associer les activités à l'évènement
                await event.addActivities(activities);
            }

            // recharger l'événement avec les activités, la ville
            await event.reload({
                include: [
                    { model: Localisation, as: "localisation", attributes: ["city", "department"] },
                    { model: Activity, as: "activities" },
                ],
            });

            // Retourner la réponse avec les activités
            res.status(201).json(event);
            console.log({ message: `Événement "${event.name}" créé avec succès.` }, event);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur Serveur" });
        }
    },

    // Modification d'un évènement
    async update(req, res, next) {
        try {
            // Vérification supplémentaire du rôle admin
            if (req.user?.role !== 'admin') {
                return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent modifier des événements.' });
            }

            // recuperer les éléments du formulaire
            const eventId = Number(req.params.id);
            if (Number.isNaN(eventId)) {
                return next();
            }
            //recuperation de city et department puis les éléments de event
            const { city, activities, ...eventData } = req.validatedData;
            console.log(req.validatedData);
            //verifier que l'évènement existe bien
            const event = await Event.findByPk(eventId, {
                include: [
                    {
                        model: Localisation,
                        as: "localisation", //alias défini dans l'association à utiliser pour que la fonction marche
                        attributes: ["city", "department"],
                    },
                    {
                        model: User,
                        as: "users",
                    },
                ],
            });
            if (!event) {
                return next(new NotFoundError("Event not found"));
            }

            // Gérer la localisation uniquement si city est fourni
            if (city) {
                //---------------insertion du code du call API Geolocalisation -------------------
                const response = await axios.get("https://geo.api.gouv.fr/communes", {
                    params: {
                        nom: city,
                        fields: "departement",
                        boost: "population",
                        limit: 1,
                    },
                });

                const result = response.data[0];
                console.log("ici le resultat de la ville", result);

                if (!result || !result.departement) {
                    return res.status(400).json({
                        message: `La ville "${city}" est introuvable via l'API Géo.`,
                    });
                }

                const departmentName = result.departement.nom;

                // ---------------- Trouver ou créer la localisation en BDD via l'API -----------------------
                const [localisation] = await Localisation.findOrCreate({
                    where: {
                        city: result.nom,
                        department: departmentName,
                    },
                });

                eventData.localisation_id = localisation.id;
            }

            // validation de la modification de l'évènement
            await event.update(eventData);

            // Gérer la ou les activités uniquement si fournis
            if (activities && activities.length > 0) {
                await event.setActivities(activities); //Associer les activités à l'évènement
            }

            // recharger l'événement avec les activités
            await event.reload({
                include: [
                    { model: Localisation, as: "localisation", attributes: ["city", "department"] },
                    { model: Activity, as: "activities" },
                ],
            });

            // Retourner la réponse
            res.status(201).json(event);
            console.log({ message: `Événement "${event.name}" modifié avec succès.` }, event);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur Serveur" });
        }
    },
    async delete(req, res, next) {
        try {
            // Vérification supplémentaire du rôle admin
            if (req.user?.role !== 'admin') {
                return res.status(403).json({ message: 'Accès refusé. Seuls les administrateurs peuvent supprimer des événements.' });
            }

            const id = req.params.id;
            if (Number.isNaN(id)) {
                return next();
            }
            // Chercher l'événement pour vérifier son existence
            const event = await Event.findByPk(id, {
                include: [
                    { model: Activity, as: "activities" },
                    { model: User, as: "users" },
                ],
            });

            if (!event) {
                return next(new NotFoundError("Event not found"));
            }

            // Supprimer les associations si besoin
            await event.setActivities([]); // retire les associations avec activités
            await event.setUsers([]); // retire les participants liés
            await event.setLocalisation(null); // Détache la localisation de l'evenement

            // Supprimer l'événement
            await event.destroy();

            res.status(200).json({ message: `Événement "${event.name}" supprimé avec succès.` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur Serveur" });
        }
    },
};
