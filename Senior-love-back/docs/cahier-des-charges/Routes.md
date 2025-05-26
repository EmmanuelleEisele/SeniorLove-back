## Liste des routes

### Backend

| url | methode HTTP| Description | Role |
| --- | --- | --- |--- |
| /login | POST | page de login | visiteur |
| /register | POST | page d'inscription | visiteur |
| /profile | GET | page du profil | utilisateur |
| /profile | PATCH | page qui permet modifier notre profil | utilisateur |
| /meet | GET | page qui permet de voir ou filtrer les utilisateurs selon ses critères | utilisateur |
| /message/:id | GET | page de messagerie créée avec un et un seul autre utilisateur | utilisateur |
| /event/:id | GET | Visualisation des détails d'un évènement | utilisateur |
| /event/:id | POST | Inscription à un évènement | utilisateur |
| /event | GET | page qui permet de voir ou filtrer les events disponibles selon ses critères  | utilisateur |
| /admin/event | POST | Add - Ajout d'un event | admin |
| /admin/event/:id | PATCH | Modification d'un event | admin |
| /admin/event/:id | DELETE | Suppression d'un event | admin |
| /admin/profile/:id | PATCH | Validation d'un profil (passage en True si ok) & blocage du profil (passage en False) | admin |


### Frontend

| url | methode HTTP| Description | Role |
| --- | --- | --- |--- |
| / | GET | page d'accueil | All |
| /contact | GET | page de contact | All |
| /login | GET | page de login | visiteur |
| /register | GET | page d'inscription | visiteur |
| /profile | GET | page du profil | utilisateur |
| /profile/:id | GET | page profil d'un autre utilisateur | utilisateur |
| /meet | GET | page qui permet de voir ou filtrer les utilisateurs selon ses critères | utilisateur |
| /message | GET | page de "mes messages" | utilisateur |
| /message/:id | GET | page de messagerie | utilisateur |
| /event | GET | page qui permet de voir ou filtrer les events disponibles selon ses critères  | utilisateur |
| /event/:id | GET | Visualisation des détails d'un évènement | utilisateur |
| /event | GET | un bouton "ajouter un évènement" | admin |
| /logout | GET | page de logout, puis redirige vers la page d'accueil | utilisateur |