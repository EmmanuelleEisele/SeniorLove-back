import { verifyToken } from "../helper/JWT.js";
import { jwtError } from "./JWTerror.js";

export const authenticate = (req, _, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new jwtError("token invalide ou expiré"));
    }
    const token = authHeader.split(" ")[1];
    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (jwtError) {
        return next(new jwtError("token invalide ou expiré"));
    }
};
