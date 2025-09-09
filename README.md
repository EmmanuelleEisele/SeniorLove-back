# 💌 Senior Love - Back-end

## Description  
Senior Love est une application web destinée aux personnes de plus de 60 ans, visant à rompre l’isolement et favoriser les rencontres.  
Ce dépôt contient la partie **back-end** de l’application : une API REST développée avec **Node.js, Express et TypeScript**, connectée à une base de données **PostgreSQL** via **Sequelize**.  

L’API gère l’authentification sécurisée, la gestion des utilisateurs, la messagerie asynchrone, les événements et la modération.

---

##  Stack technique

- **Node.js** + **Express** → serveur et routes REST  
- **TypeScript** → robustesse et typage fort  
- **PostgreSQL** → base relationnelle  
- **Sequelize (ORM)** → gestion des modèles et migrations  
- **JWT** → authentification et autorisation  
- **Argon2** → hachage sécurisé des mots de passe  
- **Zod** + **sanitize-html** → validation et nettoyage des données  
- **Multer** → gestion des images uploadées  
- **CORS** → sécurité des requêtes cross-origin  
- **PM2 + Nginx** (prod) → déploiement sur VM Linux  

---

## Installation et lancement

### 1️ Cloner le projet
```bash
git clone https://github.com/ton-repo/seniorlove-back.git
cd seniorlove-back
```
### 2 Installer les dépendances
```bash
pnpm install
```

### 3 Créer le fichier .env
Exemple de configuration :
DATABASE_URL=postgres://user:password@localhost:5432/seniorlove
JWT_SECRET=tonSecretUltraSecurise
PORT=3000

### 4 Lancer les migrations et seeds
```bash
pnpm  db:create
pnpm  db:seed
pnpm  db:reset
```
#### 5️ Démarrer le serveur
En développement :
```bash
pnpm run dev
```
En production (avec build) :
```bash
pnpm run build
pnpm start
```
## Principales routes de l’API
### Authentification

POST /register → inscription d’un utilisateur

POST /login → connexion avec email + mot de passe

### Profils

GET /myprofile → récupérer son profil (authentifié)

PATCH /myprofile → modifier son profil

DELETE /myprofile → supprimer son compte

GET /profile/:pseudo → consulter un profil public

### Messagerie

GET /messaging → liste des contacts avec qui j’ai échangé

GET /message/:id → historique de conversation avec un utilisateur

POST /message/:id → envoyer un message

### Événements

GET /events → liste des événements

GET /events/:id → détails d’un événement

POST /event/form → créer un événement (admin)

## Sécurité

Argon2 pour hacher les mots de passe

JWT pour sécuriser l’accès aux routes privées

Zod + sanitize-html pour valider et assainir les entrées

CORS configuré pour limiter les origines autorisées

Export BDD avec pg_dump pour sauvegarde

## Auteurs

Projet réalisé dans le cadre du Titre Professionnel DWWM (2024-2025)
Équipe : Emmanuelle Eiselé & Marine Ligny
