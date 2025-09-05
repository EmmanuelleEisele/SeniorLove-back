//import des variables d"environnement .env
import 'dotenv/config';
//import path from 'node:path';
import { router } from './src/routers/router.js';
import express from "express";
import cors from 'cors';
import { errorMiddleware } from './src/middleware/error.middleware.js';
// Import des modèles pour initialiser les associations
import './src/models/association.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'https://seniorlove-zeta.vercel.app',
  ],
  credentials: true, 
}));


app.use(express.json());

// définition du dossier de fichiers statique
app.use("/avatar", express.static("./public/avatar"));
app.use("/uploads", express.static("uploads"));

app.use(router);
app.use(errorMiddleware);


app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Erreur serveur:', err);
});