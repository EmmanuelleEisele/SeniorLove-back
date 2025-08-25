// error.js

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Ressource non trouvée") {
    super(message, 404);
    this.name = "NotFoundError"; // Pour une identification plus facile
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Requête invalide") {
    super(message, 400);
    this.name = "BadRequestError"; // Pour une identification plus facile
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflit de ressource") {
    super(message, 409);
    this.name = "ConflictError"; // Pour une identification plus facile
  }
}

// Tu peux en ajouter d'autres si besoin :
export class UnauthorizedError extends AppError {
  constructor(message = "Non autorisé") {
    super(message, 401);
    this.name = "UnauthorizedError"; // Pour une identification plus facile
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Accès interdit") {
    super(message, 403);
    this.name = "ForbiddenError"; // Pour une identification plus facile
  }
}
export class InternalServerError extends AppError {
  constructor(message = "Erreur interne du serveur") {
    super(message, 500);
    this.name = "InternalServerError"; // Pour une identification plus facile
  }
} 
