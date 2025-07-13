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
import { createEventSchema, updateEventSchema } from "../schemas/event.schema.js";
import { upload } from "../middleware/upload.js";
import { messageController } from "../controllers/messageController.js";
import { createMessageSchema } from "../schemas/message.schema.js";

export const router = new Router();

// route de test /accueil back
router.get("/", (req, res) => {
    res.send("Bienvenue sur Senior Love ! ❤️ que la force soit avec toi apprenti dev ! ");
});

// LOGIN
router.route("/login").post(validate(connexionSchema), connexionController.login);

// Validation de l'inscription
router.route("/register").post(validate(createUserSchema), connexionController.create);

//Page mon profil
router
    .route("/myprofile")
    .get(authenticate, profileController.getMyProfile)
    .patch(authenticate, upload.single("profile_picture"), profileController.updateOne) // -> modification du profil utilisateur
    .delete(authenticate, profileController.deleteUser); // -> suppression du profil utilisateur

// Page profil public
router.route("/profile/:pseudo").get(authenticate, profileController.getOne);

// Page des profils utilisateurs
router.route("/meet").get(authenticate, profileController.getAll);

// Page des contacts avec qui l'utilisateur à échangé des messages
router.route("/messaging").get(authenticate, messageController.getContacts);

// Page de la messagerie avec historique de conversation
router.route("/message/:id").get(authenticate, validateIdParam, messageController.getMessages).post(authenticate, validate(createMessageSchema), validateIdParam, messageController.create);

// Page Evenement
router
    .route("/events/:id")
    .get(authenticate, validateIdParam, eventController.getOne)
    .post(authenticate, validateIdParam, eventController.addUserToEvent) // Inscription a un évènement
    .patch(authenticate, validate(updateEventSchema), isAdmin, validateIdParam, eventController.update) // Modification d'un evenement - si admin
    .delete(authenticate, isAdmin, validateIdParam, eventController.delete); // suppression d'un evenement - si admin

// Page des Evenements
router.route("/events").get(authenticate, eventController.getAll);

// Ajout d'un évenement - si admin
router.route("/event/form").post(authenticate, validate(createEventSchema), isAdmin, eventController.create);

// Dans le cas ou la route n'existe pas
router.use((err, _, res) => {
    // On renvoi vers le middleware de centralisation des erreurs
    if (err.name === "NotFoundError") {
        return res.status(404).json({ message: err.message });
    }

    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
});
