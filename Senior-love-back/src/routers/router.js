import { Router } from "express";
import { profileController } from "../controllers/profileController.js";
import { eventController } from "../controllers/eventController.js";
import { validateIdParam } from "../middleware/validateId.js";
import { authenticate } from "../middleware/authenticate.js";
import { connexionController } from "../controllers/connexionController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { validate } from "../middleware/validate.js";
import { connexionSchema } from "../schemas/connexion.schema.js";
import { createUserSchema } from "../schemas/user.schema.js";
import {
  createEventSchema,
  updateEventSchema,
} from "../schemas/event.schema.js";
import { upload } from "../middleware/upload.js";
import { messageController } from "../controllers/messageController.js";
import { createMessageSchema } from "../schemas/message.schema.js";
import { errorMiddleware } from "../middleware/error.middleware.js";
import { User } from "../models/User.js";
import { sequelize } from "../models/sequelize.js";
import argon2 from "argon2";

export const router = new Router();

// Endpoint de debug temporaire pour tester la DB
router.get("/debug-db", async (req, res) => {
  try {
    await sequelize.authenticate();
    const userCount = await User.count();
    const databaseUrl = process.env.DATABASE_URL ? 'DATABASE_URL is set' : 'DATABASE_URL not set';
    const pgUrl = process.env.PG_URL ? 'PG_URL is set' : 'PG_URL not set';
    
    res.json({
      status: 'connected',
      userCount,
      databaseUrl,
      pgUrl,
      usedUrl: process.env.DATABASE_URL || process.env.PG_URL,
      jwtSecret: process.env.JWT_SECRET ? 'JWT_SECRET is set' : 'JWT_SECRET not set',
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ? 'JWT_REFRESH_SECRET is set' : 'JWT_REFRESH_SECRET not set',
      nodeEnv: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'DATABASE_URL is set' : 'DATABASE_URL not set',
      pgUrl: process.env.PG_URL ? 'PG_URL is set' : 'PG_URL not set'
    });
  }
});

// Endpoint de debug pour lister les utilisateurs
router.get("/debug-users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'pseudo', 'firstname', 'lastname'],
      limit: 10
    });
    
    res.json({
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Endpoint de debug pour tester la recherche d'un utilisateur
router.get("/debug-user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'email', 'pseudo', 'firstname', 'lastname', 'password']
    });
    
    if (!user) {
      return res.json({ found: false, email });
    }
    
    res.json({
      found: true,
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
        firstname: user.firstname,
        lastname: user.lastname,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Endpoint de debug pour tester la vérification du mot de passe
router.post("/debug-password", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.json({ found: false, email });
    }
    
    const isMatch = await argon2.verify(user.password, password);
    
    res.json({
      found: true,
      email: user.email,
      pseudo: user.pseudo,
      passwordMatch: isMatch,
      testedPassword: password
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Endpoint de debug pour tester la validation
router.post("/debug-validation", (req, res) => {
  try {
    res.json({
      body: req.body,
      headers: req.headers,
      contentType: req.get('Content-Type')
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Endpoint de debug pour simuler exactement le login
router.post("/debug-login", validate(connexionSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedData;
    console.log('🔍 Debug login - Données validées:', { email, password });

    // Vérification de l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ Utilisateur non trouvé pour email:', email);
      return res.json({ step: 'user_not_found', email });
    }
    console.log('✅ Utilisateur trouvé:', user.pseudo);

    // Vérification du mot de passe
    const isMatch = await argon2.verify(user.password, password);
    console.log('🔑 Vérification mot de passe:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Mot de passe incorrect');
      return res.json({ step: 'password_incorrect', email });
    }

    console.log('✅ Connexion réussie pour:', user.pseudo);
    res.json({
      step: 'success',
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
        role: user.role,
      }
    });
  } catch (err) {
    console.error("❌ Erreur dans debug-login :", err);
    res.status(500).json({
      step: 'error',
      error: err.message,
      stack: err.stack
    });
  }
});

// Endpoint de debug complet reproduisant exactement la logique du controller
router.post("/debug-controller", validate(connexionSchema), async (req, res) => {
  try {
    console.log('🔍 Test complet simulant le controller');
    const { email, password } = req.validatedData;
    
    // Importer les dépendances exactement comme dans le controller
    const { generateRefreshToken, generateToken } = await import("../helper/JWT.js");
    const { User, RefreshToken } = await import("../models/association.js");
    
    // Vérification de l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    
    // Vérification du mot de passe
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    
    const payload = {
      id: user.id,
      pseudo: user.pseudo,
      role: user.role,
    };
    
    // Token
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken({ id: user.id });
    
    console.log('🔑 Tokens générés');
    
    // Supprimer les anciens refresh tokens
    await RefreshToken.destroy({ where: { userId: user.id } });
    console.log('🗑️ Anciens tokens supprimés');
    
    // Créer un nouveau refresh token
    await RefreshToken.create({ token: refreshToken, userId: user.id });
    console.log('✅ Nouveau token créé');
    
    // Cookie (simulation production)
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'Strict',
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
    });
    
  } catch (err) {
    console.error('❌ Erreur dans debug-controller:', err);
    return res.status(500).json({ 
      error: err.message,
      stack: err.stack
    });
  }
});

// Endpoint de debug pour la connexion réelle
router.post("/debug-login-real", validate(connexionSchema), async (req, res) => {
  try {
    console.log('🔍 Test de connexion réelle avec RefreshToken');
    const { email, password } = req.validatedData;
    
    // Test 1: Vérifier l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Utilisateur non trouvé" });
    }
    console.log('✅ Utilisateur trouvé:', user.pseudo);
    
    // Test 2: Vérifier le mot de passe
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }
    console.log('✅ Mot de passe correct');
    
    // Test 3: Importer RefreshToken depuis association
    const { RefreshToken } = await import("../models/association.js");
    console.log('✅ RefreshToken importé depuis association');
    
    // Test 4: Supprimer les anciens refresh tokens
    const deletedCount = await RefreshToken.destroy({ where: { userId: user.id } });
    console.log('✅ Anciens tokens supprimés:', deletedCount);
    
    // Test 5: Créer un nouveau refresh token
    const refreshTokenValue = 'test-refresh-token-' + Date.now();
    const newToken = await RefreshToken.create({ token: refreshTokenValue, userId: user.id });
    console.log('✅ Nouveau token créé:', newToken.id);
    
    return res.json({ 
      success: true, 
      message: "Tous les tests passés",
      user: { id: user.id, email: user.email, pseudo: user.pseudo }
    });
    
  } catch (err) {
    console.error('❌ Erreur dans debug-login-real:', err);
    return res.status(500).json({ 
      error: err.message,
      stack: err.stack
    });
  }
});

// route de test /accueil back
router.get("/", (req, res) => {
  res.send(
    "Bienvenue sur Senior Love ! ❤️ que la force soit avec toi apprenti dev ! "
  );
});

// LOGIN
router
  .route("/login")
  .post(validate(connexionSchema), connexionController.login);

// Validation de l'inscription
router
  .route("/register")
  .post(validate(createUserSchema), connexionController.create);

//Page mon profil
router
  .route("/myprofile")
  .get(authenticate, profileController.getMyProfile)
  .patch(
    authenticate,
    upload.single("profile_picture"),
    profileController.updateOne
  ) // -> modification du profil utilisateur
  .delete(authenticate, profileController.deleteUser); // -> suppression du profil utilisateur

// Page profil public
router.route("/profile/:pseudo").get(authenticate, profileController.getOne);

// Page des profils utilisateurs
router.route("/meet").get(authenticate, profileController.getAll);

// Page des contacts avec qui l'utilisateur à échangé des messages
router.route("/messaging").get(authenticate, messageController.getContacts);

// Page de la messagerie avec historique de conversation
router
  .route("/message/:id")
  .get(authenticate, validateIdParam, messageController.getMessages)
  .post(
    authenticate,
    validate(createMessageSchema),
    validateIdParam,
    messageController.create
  );

// Page Evenement
router
  .route("/events/:id")
  .get(authenticate, validateIdParam, eventController.getOne)
  .post(authenticate, validateIdParam, eventController.addUserToEvent) // Inscription a un évènement
  .patch(
    authenticate,
    validate(updateEventSchema),
    isAdmin,
    validateIdParam,
    eventController.update
  ) // Modification d'un evenement - si admin
  .delete(authenticate, isAdmin, validateIdParam, eventController.delete); // suppression d'un evenement - si admin

// Page des Evenements
router.route("/events").get(authenticate, eventController.getAll);

// Ajout d'un évenement - si admin
router
  .route("/event/form")
  .post(
    authenticate,
    validate(createEventSchema),
    isAdmin,
    eventController.create
  );

// gestion des erreurs
router.use(errorMiddleware);
