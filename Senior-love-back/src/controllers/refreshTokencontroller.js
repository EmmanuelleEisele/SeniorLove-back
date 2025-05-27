import { verifyRefreshToken, generateToken } from "../helper/JWT.js";
import { BadRequestError, ForbiddenError } from "../middleware/error.js";
import { RefreshToken } from "../models/RefreshToken.js";

export const refreshTokenController = {
  async refresh(req, res, next) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new BadRequestError("Refresh token manquant"));
    }

    try {
      // Vérifier si le token est bien stocké
      const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });

      if (!storedToken) {
        return res.status(403).json({ message: "Refresh token invalide" });
      }

      // Vérifier la validité du token
      const payload = verifyRefreshToken(refreshToken);

      // Re-générer un access token
      const newToken = generateToken({
        id: payload.id,
        pseudo: payload.pseudo
      });

      return res.status(200).json({
        message: "Token renouvelé avec succès",
        token: newToken,
      });

    } catch (error) {
      console.log(error);
      return next(new ForbiddenError("Refresh token expiré ou invalide" ));
    }
  }
};
