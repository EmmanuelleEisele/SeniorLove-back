import { z } from "zod";

//Vérification des infos de connexion
export const connexionSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).trim(),
})