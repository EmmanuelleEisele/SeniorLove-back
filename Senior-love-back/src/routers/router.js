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
      usedUrl: process.env.DATABASE_URL || process.env.PG_URL
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
