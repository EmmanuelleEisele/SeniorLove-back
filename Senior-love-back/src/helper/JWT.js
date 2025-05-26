import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const generateToken=(payload, expiresIn = '1d')=>{
    return jwt.sign(payload, SECRET, {expiresIn}) 
}

export const verifyToken=(token)=>{
    return jwt.verify(token, SECRET)
}