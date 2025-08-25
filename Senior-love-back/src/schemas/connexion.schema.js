import { z } from "zod";

//Vérification des infos de connexion
export const connexionSchema = z.object({
    email: z.string(
        { required_error: "L'email est requis" }
    ).email(),
    password: z.string(
        { required_error: "Le mot de passe est requis" }
    ).min(8, 
        { message: "Le mot de passe doit contenir au moins 8 caractères" }
    ).trim(),
})

