import { sequelize } from '../models/sequelize.js';
import { Activity, User, Event } from '../models/association.js';




await sequelize.sync({ force: true });

console.log('Synchronisation terminée');

// On pense a terminer la connexion à la BDD à la fin
await sequelize.close();