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
import { refreshTokenController } from "../controllers/refreshTokenController.js";

export const router = new Router();

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

// LOGOUT
router
  .route("/logout")
  .post(connexionController.logout);

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
// Debug endpoint pour tester messaging
router.get("/debug-messaging", authenticate, async (req, res) => {
  try {
    console.log('🔍 Debug messaging - User:', req.user);
    const userId = req.user.id;
    
    // Test 1: Import des modèles
    const { Conversation, User } = await import("../models/association.js");
    console.log('✅ Modèles importés');
    
    // Test 2: Recherche conversations sender
    const sender = await Conversation.findAll({
      where: { sender_id: userId },
      attributes: ["receiver_id"],
    });
    console.log('✅ Sender conversations:', sender.length);
    
    // Test 3: Recherche conversations receiver  
    const receiver = await Conversation.findAll({
      where: { receiver_id: userId },
      attributes: ["sender_id"],
    });
    console.log('✅ Receiver conversations:', receiver.length);
    
    return res.json({
      success: true,
      userId,
      senderCount: sender.length,
      receiverCount: receiver.length
    });
    
  } catch (err) {
    console.error('❌ Erreur debug messaging:', err);
    return res.status(500).json({ 
      error: err.message,
      stack: err.stack
    });
  }
});

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

router.post("/refresh-token", refreshTokenController.refresh);

// gestion des erreurs
router.use(errorMiddleware);
