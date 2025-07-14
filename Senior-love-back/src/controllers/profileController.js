import axios from "axios";
import { NotFoundError } from "../middleware/error.js";
import { Activity, Category, Event, Localisation, User } from "../models/association.js";
import { Op } from "sequelize";

export const profileController = {
    async getAll(req, res) {
        try {
            const { localisation } = req.query;

            const whereFiltre = {
                role: "user", // <-- filtre ici uniquement les users et non l'admin
                // On peut ajouter d'autres filtres si nécessaire
            };
            if (localisation) {
                whereFiltre[Op.or] = [ // <-- on utilise Op.or pour filtrer par ville ou département
                    // On utilise $localisation.city$ et $localisation.department$ pour accéder aux attributs de la localisation
                    // On utilise Op.iLike pour une recherche insensible à la casse
                    // On utilise % pour faire une recherche partielle
					{ "$localisation.city$": { [Op.iLike]: `%${localisation}%` } }, 
					{ "$localisation.department$": { [Op.iLike]: `%${localisation}%` } }
				];
            }
            const users = await User.findAll({
                where: whereFiltre,
                attributes: {
                    exclude: ["password", "email", "role"],
                },
                include: [
                    {
                        model: Localisation,
                        as: "localisation",
                        attributes: ["city", "department"],
                    },
                ],
            });
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur Serveur" });
        }
    },
    //Fonction pour récuperer le profil de l'utilisateur connecté
    async getMyProfile(req, res, next) {
        try {
            const profileId = req.user.id;
            //console.log(req.user);
            const user = await User.findByPk(profileId, {
                include: [
                    {
                        model: Localisation,
                        as: "localisation", //alias défini dans l'association à utiliser pour que la fonction marche
                        attributes: ["city", "department"],
                    },
                    {
                        model: Event,
                        as: "events", //alias défini dans l'association à utiliser pour que la fonction marche
                        include: [
                            {
                                model: Localisation,
                                as: "localisation",
                                attributes: ["city", "department"],
                            },
                        ],
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

            if (!user) {
                return next(new NotFoundError("Profil not found"));
            }

            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur Serveur" });
        }
    },
    //fonction pour récupérer un profil utilisateur public avec son id
    async getOne(req, res, next) {
        try {
            const pseudo = req.params.pseudo;
            const user = await User.findOne({
                where: { pseudo },
                attributes: {
                    exclude: ["password", "email", "role"],
                },
                include: [
                    {
                        model: Localisation,
                        as: "localisation", //alias défini dans l'association à utiliser pour que la fonction marche
                    },
                    {
                        model: Event,
                        as: "events",
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

            if (!user) {
                return next(new NotFoundError("Profil not found"));
            }

            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur Serveur" });
        }
    },
    //fonction pour modifier mon profil avec le token
    async updateOne(req, res, next) {
        try {
            const profileId = Number(req.user.id);
            const user = await User.findByPk(profileId, {
                attributes: {
                    exclude: ["password", "role"],
                },
                include: [
                    {
                        model: Localisation,
                        as: "localisation", //alias défini dans l'association à utiliser pour que la fonction marche
                        attributes: ["city", "department"],
                    },
                    {
                        model: Event,
                        as: "events", //alias défini dans l'association à utiliser pour que la fonction marche
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

            const inputData = req.body;
            const { city, activities, ...userData } = inputData;

            // Gérer la localisation uniquement si city est modifié
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

                userData.localisation_id = localisation.id;
            }

            //console.log(userData);
            // Gérer la ou les activités uniquement si fournis
            if (activities && activities.length > 0) {
                await user.setActivities(activities); //Associer les activités à l'utilisateur
            }

            if (!user) {
                return next(new NotFoundError("Profil not found"));
            }

            // gestion de la photo de profil
            if (req.file) {
                userData.profile_picture = `/uploads/${req.file.filename}`;
            }
            console.log(req.file);

            await user.update(userData);

            // recharger l'événement avec les activités
            await user.reload({
                attributes: {
                    exclude: ["password", "role"],
                },
                include: [
                    { model: Localisation, as: "localisation", attributes: ["city", "department"] },
                    { model: Event, as: "events" },
                    { model: Activity, as: "activities" },
                ],
            });

            //console.log("CITY:", userData.localisation.city);
            //console.log("DEPT:", department);
            //console.log("USERDATA:", userData);
            console.log(user);
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur Serveur" });
        }
    },
    //fonction pour supprimer mon profil avec le token
    async deleteUser(req, res, next) {
    try {
      const profileId = Number(req.user.id);

      const user = await User.findByPk(profileId, {
        attributes: {
          exclude: ["password", "role"],
        },
        include: [
          {
            model: Localisation,
            as: "localisation", //alias défini dans l'association à utiliser pour que la fonction marche
            attributes: ["city", "department"],
          },
          {
            model: Event,
            as: "events", //alias défini dans l'association à utiliser pour que la fonction marche
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

            if(!user){
                return next(new NotFoundError("Event not found"));
            }
            //Supprimer les associations
            await user.setActivities([]);
            await user.setEvents([]);
            await user.setLocalisation(null);

            //supprimer l'utilisateur
            await user.destroy();

            res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur Serveur" });
    }
  },
};
