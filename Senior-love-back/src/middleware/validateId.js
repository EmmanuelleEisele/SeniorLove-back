export function validateIdParam(req, res, next) {
    const id = req.params.id;
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: 'Invalid ID. It must be a number.' });
    }
    next();
  }
