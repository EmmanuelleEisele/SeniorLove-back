import { generateToken, verifyRefreshToken } from "../helper/JWT.js";
import { RefreshToken, User } from "../models/association.js";
import { UnauthorizedError } from "../middleware/error.js";

export const refreshTokenController = {
  async refresh(req, res, next) {
    try {
      // 1. Récupérer le refreshToken depuis le cookie
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return next(new UnauthorizedError("Aucun refresh token fourni"));
      }

      // 2. Vérifier que le token est bien stocké en DB
      const storedToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });
      if (!storedToken) {
        return next(new UnauthorizedError("Refresh token invalide ou révoqué"));
      }

      // 3. Vérifier la signature et l’expiration du refresh token
      let decoded;
      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch (error) {
        console.error("Erreur lors du refresh token :", error);
        // Si le token est expiré ou invalide → suppression en DB
        await RefreshToken.destroy({ where: { token: refreshToken } });
        return next(new UnauthorizedError("Refresh token expiré ou invalide"));
      }

      // 4. Vérifier que l’utilisateur existe toujours
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return next(new UnauthorizedError("Utilisateur non trouvé"));
      }

      // 5. Générer un nouveau access token
      const payload = {
        id: user.id,
        pseudo: user.pseudo,
        role: user.role,
      };
      const newAccessToken = generateToken(payload);
console.log('RefreshToken reçu:', req.cookies.refreshToken);
const tokenDb = await RefreshToken.findOne({ where: { token: req.cookies.refreshToken } });
console.log('En base:', tokenDb);
      // 6. Répondre avec le nouveau token
      return res.status(200).json({ token: newAccessToken });

    } catch (err) {
      console.error("Erreur lors du refresh token :", err);
      return next(new UnauthorizedError("Impossible de rafraîchir le token"));
    }
  },
};
