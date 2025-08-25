
import { sequelize } from "../models/sequelize.js";
import  "../models/association.js";

console.log("Création des tables en cours");

await sequelize.sync({ force: true });

console.log("Synchronisation terminée");

// On pense a terminer la connexion à la BDD à la fin
await sequelize.close();
