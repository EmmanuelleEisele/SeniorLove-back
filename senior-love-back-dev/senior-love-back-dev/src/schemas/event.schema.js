import { z } from "zod";

// Création de l'événement par l'admin
export const createEventSchema = z.object({
    name: z.string().max(50),
    date: z.string({
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
      .transform(str => new Date(str)),
    description: z.string(),
    availability: z.number().int().optional(),
    disponibility: z.boolean().optional(),
    picture: z.string(),
    city: z.string().min(1).optional(),
    department: z.string().min(1).optional(), // localisation est optionnel
    activities: z.array(z.number().int().positive()).optional()  // tableau d'activités

});

// Modification de l'événement par l'admin
export const updateEventSchema = z.object({
    name: z.string().max(50).optional(),
    date: z.string({
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
      .optional(),
    description: z.string().optional(),
    availability: z.number().int().optional(),
    disponibility: z.boolean().optional(),
    picture: z.string().optional(),
    city: z.string().min(1).optional(),
    department: z.string().min(1).optional(), // localisation est optionnel
    activities: z.array(z.number().int().positive()).optional()  // tableau d'activités

});