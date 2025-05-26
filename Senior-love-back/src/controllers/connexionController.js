import { generateToken } from "../helper/JWT.js";
import {
	BadRequestError,
	ConflictError,
	NotFoundError,
} from "../middleware/error.js";
import { Activity, Category, User } from "../models/association.js";
import argon2 from "argon2";
import validator from "validator";



export const connexionController = {
    
    async login(req, res, next){
        try {

            const {email, password} = req.validatedData;
            
            // Vérification de l'utilisateur
            const user = await User.findOne({where:{ email }});
            if (!user) {
                return next(new NotFoundError('Email ou mot de passe incorrect') )
            }
            
            // Vérification du mot de passe
            const isMatch = await argon2.verify(user.password, password);
			if (!isMatch) {
				return next(new NotFoundError('Email ou mot de passe incorrect') );
			}

			// Token
			const token = generateToken({
				id: user.id,
				email: user.email,
				pseudo: user.pseudo,
				role: user.role
			});

			return res.status(200).json({
				message: "Connexion réussie",
				user: { id: user.id, email: user.email, pseudo: user.pseudo, role: user.role},
				token,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Erreur Serveur" });
		}
	},
async create(req, res, next){
        try {

            const {email, password, pseudo, birth_date, role = "user", gender = "other"} = req.validatedData;

            //Vérification de l'existance du mail - car unique
            const existantEmail = await User.findOne({where: {email}})
            if(existantEmail){
                return next(new ConflictError('Email déjà utilisé'));
            }

            //Vérification de l'existance du pseudo - car unique
            const existantPseudo = await User.findOne({where:{pseudo}});
            if(existantPseudo){
                return next(new ConflictError('Pseudo déjà utilisé'));
            }
			// Hashage du mdp
			const hashPassword = await argon2.hash(password);
            //Sanitize
            const sanitizePseudo = validator.escape(validator.trim(pseudo));
            
            // Récupération des Catégories d'activité
            const categories = await Category.findAll(); 

            // Récupération des activités par catégories
            const activities = await Activity.findAll({
                include: {
                    model: Category,
                    as: 'category',
                    where: { id: categories.map((category) => category.id) },
                },
            });

            const initialInterets = {};

            for (const activity of activities) {
                const categoryName = activity.category.name;
                const activityName = activity.name;

                if (!initialInterets[categoryName]){
                    initialInterets[categoryName] = {};
                }

                initialInterets[categoryName][activityName] = false;
            }

            console.log(initialInterets);

            //Création d'un nouvel utilisateur
            const newUser = await User.create({email, password: hashPassword, pseudo: sanitizePseudo, birth_date, role, gender, interest: initialInterets});
        
            res.status(201).json(newUser);
        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Erreur Serveur'})
        }
    },
};
