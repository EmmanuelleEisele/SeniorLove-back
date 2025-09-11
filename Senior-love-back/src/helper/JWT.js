import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Génère un access token (court terme)
export const generateToken=(payload, expiresIn = '1m')=>{
    return jwt.sign(payload, SECRET, {expiresIn}) 
}

// Génère un refresh token (long terme)
export const generateRefreshToken = (payload, expiresIn = '30d') => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn });
};

// Vérifie access token
export const verifyToken=(token)=>{
    return jwt.verify(token, SECRET)
}

// Vérifie refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};