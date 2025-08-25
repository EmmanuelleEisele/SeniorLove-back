import { ForbiddenError } from "./error.js";

//fonction a ajouter sur les routes qui seront utilisables que par les admin
export function isAdmin (req, res, next) {
    if (req.user?.role !== 'admin') {
      return next(new ForbiddenError('Accès refusé (admin uniquement)'));
    }
    next();
  };

