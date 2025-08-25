// errorMiddleware.js

export const errorMiddleware = (error, req, res, next) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error("Erreur inattendue :", error , next);

  return res.status(500).json({
    message: "Une erreur inattendue est survenue.",
  });
};
