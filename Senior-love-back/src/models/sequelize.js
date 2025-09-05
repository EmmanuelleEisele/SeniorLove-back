import { Sequelize } from "sequelize";
import 'dotenv/config';

// Utilise DATABASE_URL en priorité (Railway) ou PG_URL en fallback (local)
const databaseUrl = process.env.DATABASE_URL || process.env.PG_URL;

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres"
});