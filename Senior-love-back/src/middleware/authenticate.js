import { verifyToken } from "../helper/JWT.js";
import { jwtError } from "./JWTerror.js";


export const authenticate=(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return next(new jwtError('token invalide ou expiré'))
        }
        const token = authHeader.split(' ')[1];
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        return next(new jwtError('token invalide ou expiré'))
    }
}