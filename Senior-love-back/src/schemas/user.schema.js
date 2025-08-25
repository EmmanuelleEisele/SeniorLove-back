import { z } from "zod";

// Création de l'utilisateur via l'inscription
export const createUserSchema = z.object({
    pseudo: z.string().regex(/^[a-zA-Z0-9]+$/, "Le pseudo doit contenir uniquement des lettres et des chiffres"),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8).trim(),
    confirmPassword: z.string().min(8).trim(),
    birth_date: z.string({
        required_error: "La date de l'événement est requise"
      })
      .min(1, "La date de l'événement ne peut pas être vide")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu : AAAA-MM-JJ")
      .refine(str => {
        const date = new Date(str);
        return !Number.isNaN(date.getTime());
      }, {
        message: "Date invalide"
      })
      .transform(str => new Date(str))
      .refine(date => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        return age > 60 || (age === 60 && monthDiff >= 0);
      }, {
        message: "Vous devez avoir au moins 60 ans pour vous inscrire",
      }),
    role: z.enum(["admin","user"]).optional()
}).refine(data => data.password === data.confirmPassword, {
    message: "Le mot de passe ne correspond pas",
    path: ["confirmPassword"],
});

//Modification du profil
export const updateUserSchema = z.object({
    pseudo: z.string().regex(/^[a-zA-Z0-9]+$/, {message: "Le pseudo doit contenir uniquement des lettres et des chiffres"}).optional(),
    email: z.string().email().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    password: z.string().min(8).trim().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    description: z.string().optional(),
    profile_picture: z.string(),
    interest: z.string().optional()
});
