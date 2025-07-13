export const errorMiddleware = (error, _, res) => {
    //Gestion des mauvaise requetes
    if (error.name === "BadRequestError") {
        return res.status(400).json({ message: error.message });
    }

    //Gestion des requetes non trouvées
    if (error.name === "NotFoundError") {
        return res.status(404).json({ message: error.message });
    }

    //Gestion des confilts de requetes
    if (error.name === "ConflictError") {
        return res.status(409).json({ message: error.message });
    }
    //Gestion de toutes les autres erreurs
    return res.status(500).json({ message: "Une erreur inattendue est survenue." });
};
