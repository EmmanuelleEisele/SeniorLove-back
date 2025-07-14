import { Op } from "sequelize";
import { Conversation, Localisation, User } from "../models/association.js";
import validator from "validator";


export const messageController = {
    async getContacts(req, res) {
        try {
            const userId = req.user.id;
            // Récupère les IDs des users à qui l'utilisateur a écrit
            const sender = await Conversation.findAll({
                where: { sender_id: userId },
                attributes: ['receiver_id']
            })
            // Récupère les IDs des users qui lui ont écrit
            const receiver = await Conversation.findAll({
                where: { receiver_id: userId },
                attributes: ['sender_id']
            })
            // Utilisation de Set ici pour éviter les doublons d'ids 
            // (ex: si conversation avec plusieurs messages, il ne récupère qu'un seul id en faisant le tri au préalable)
            const contactIds = new Set();
            // utilisation de boucle for of pour rechercher les ids des sender et receiver tout en evitant les doublons
            for (const messages of sender) {
                contactIds.add(messages.receiver_id);
            }
            for (const messages of receiver) {
                contactIds.add(messages.sender_id);
            }
            // on récupère un tableau avec tous les ids des users avec qui l'utilisateur a échangé (après le tri ci dessus)
            const ids = Array.from(contactIds);
            //console.log(ids);
            // on récupère les infos (pseudo, photo...) des users avec leur id
            const users = await User.findAll({
                where: { id: ids },
                attributes: {
                    exclude: ["password", "email", "role"]
                },
                include: [{
                    model: Localisation,
                    as: 'localisation'
                }]
            });

            //console.log(users);
            res.status(200).json(users);

        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Erreur Serveur'})
        }
    },
    async getMessages(req, res){
        try {
            const userId = req.user.id;
            const contactId = Number(req.params.id);

            const messages = await Conversation.findAll({
                where: {
                [Op.or]: [
                    { sender_id: userId, receiver_id: contactId }, //Ici on récupère tous les messages où on est sender 
                    { sender_id: contactId, receiver_id: userId } // ou receiver
                ]
                },
                include: [
                    {
                        model: User,
                        as: 'sender',  // On inclu l'expéditeur
                        attributes: ['id', 'pseudo', 'profile_picture']
                    },
                    {
                        model: User,
                        as: 'receiver',  // On inclu le destinataire
                        attributes: ['id', 'pseudo', 'profile_picture']
                    }
                ],
                order: [['createdAt', 'ASC']]
            });

            res.status(200).json(messages);

        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Erreur Serveur'})

        }

    },
    async create(req, res){
        try {
            const userId = req.user.id;
            const contactId = Number(req.params.id);
            
            const inputData = req.validatedData;
            
            // S'assurer que le contenu n'injecte pas de requete html
            const sanitizeInputData = validator.escape(inputData.content);
            
            
            const message = await Conversation.create({
                        sender_id: userId, 
                        receiver_id: contactId, 
                        content: sanitizeInputData 
            });
            
            res.status(201).json (message)
            console.log({message:'un nouveau message a été créé avec succès.'},message);
        
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Erreur Serveur'})

        }
    }
    
}