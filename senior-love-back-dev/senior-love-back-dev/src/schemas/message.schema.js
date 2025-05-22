import { z } from "zod";
import sanitizeHtml from "sanitize-html";

const sanitizeTextarea = (schema) =>
    schema.transform((value) =>
        sanitizeHtml(value, {
            allowedTags: ["b", "i", "em", "strong", "p", "ul", "li", "ol", "br"],
            allowedAttributes: {},
        }),
    );

//Vérification contenu du message
export const createMessageSchema = z.object({
    content:sanitizeTextarea(
        z.string()
            .min(1, { message: "Le message ne peut pas être vide" })
            .max(800, {
                message: "Le message ne peut pas contenir plus de 800 caractères",
            }),
    ),
})
