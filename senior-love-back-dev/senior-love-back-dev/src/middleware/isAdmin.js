//fonction a ajouter sur les routes qui seront utilisables que par les admin
export function isAdmin (req, res, next) {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé (admin uniquement)' });
    }
    next();
  };