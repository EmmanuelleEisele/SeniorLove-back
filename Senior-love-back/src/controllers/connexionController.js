import { generateToken, generateRefreshToken } from "../helper/JWT.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../middleware/error.js";
import { Activity, Category, User } from "../models/association.js";
import argon2 from "argon2";
import validator from "validator";
import { RefreshToken } from "../models/RefreshToken.js";

export const connexionController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.validatedData;

      // Vérification de l'utilisateur
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(new NotFoundError("Email ou mot de passe incorrect"));
      }

      // Vérification du mot de passe
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return next(new NotFoundError("Email ou mot de passe incorrect"));
      }

      const payload = {
        id: user.id,
        pseudo: user.pseudo,
      };
      // Token
      const token = generateToken(payload);
      const refreshToken = generateRefreshToken({ id: user.id });

      // Supprimer les anciens refresh tokens (1 seul autorisé par utilisateur)
      await RefreshToken.destroy({ where: { userId: user.id } });
      // Stocker le refresh token en base
      await RefreshToken.create({ token: refreshToken, userId: user.id });
      
      //on envoi le token en httpOnly cookie
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'Strict',              //protège contre les csrf
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });

      return res.status(200).json({
        message: "Connexion réussie",
        user: {
          id: user.id,
          email: user.email,
          pseudo: user.pseudo,
          role: user.role,
        },
        token,
        //on envoie pas le refreshtoken car il est déja envoyé dans le cookie
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur Serveur" });
    }
  },
  async register(req, res, next) {
    try {
      const {
        email,
        password,
        pseudo,
        birth_date,
        role = "user",
        gender = "other",
      } = req.validatedData;

      //Vérification de l'existance du mail - car unique
      const existantEmail = await User.findOne({ where: { email } });
      if (existantEmail) {
        return next(new ConflictError("Email déjà utilisé"));
      }

      //Vérification de l'existance du pseudo - car unique
      const existantPseudo = await User.findOne({ where: { pseudo } });
      if (existantPseudo) {
        return next(new ConflictError("Pseudo déjà utilisé"));
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
          as: "category",
          where: { id: categories.map((category) => category.id) },
        },
      });

      const initialInterets = {};

      for (const activity of activities) {
        const categoryName = activity.category.name;
        const activityName = activity.name;

        if (!initialInterets[categoryName]) {
          initialInterets[categoryName] = {};
        }

        initialInterets[categoryName][activityName] = false;
      }

      console.log(initialInterets);

      //Création d'un nouvel utilisateur
      const newUser = await User.create({
        email,
        password: hashPassword,
        pseudo: sanitizePseudo,
        birth_date,
        role,
        gender,
        interest: initialInterets,
      });

      //Création d'un token pour que la personne soit connecté une fois inscrite

      const payload = {
        id: newUser.id,
        pseudo: newUser.pseudo,
      };

      const token = generateToken(payload);
      const refreshToken = generateRefreshToken({ id: newUser.id });

      // Supprimer d’éventuels anciens tokens (par précaution)
      await RefreshToken.destroy({ where: { userId: newUser.id } });
      //Créer le token
      await RefreshToken.create({ token: refreshToken, userId: newUser.id });
      
      //on envoi le token en httpOnly cookie
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'Strict',              //protège contre les csrf
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });

      res.status(201).json({
        message: "Inscription réussie",
        user: {                          //On envoie que ce qui est sécurisé 
          id: newUser.id,
          email: newUser.email,
          pseudo: newUser.pseudo,
          role: newUser.role,
        },
        token, 
        //on envoie pas le refreshtoken car il est déja envoyé dans le cookie
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur Serveur" });
    }
  },
  async logout(req, res, next) {
    try {
      console.log("Cookies reçus:", req.cookies);
      const refreshToken  = req.cookies.refreshToken;

      if (!refreshToken) {
        return next(new BadRequestError("Refresh token manquant"));
      }

      await RefreshToken.destroy({ where: { token: refreshToken } });

      // Supprimer le cookie côté client
      //const isProd = process.env.NODE_ENV === 'production'
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure:  false,//isProd,
        sameSite: 'Strict',
        maxAge: 24 * 60 * 60 * 1000, // durée de vie cookie
      });

      return res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur Serveur" });
    }
  },
};
