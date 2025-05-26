import multer from "multer";
import path from 'node:path';

// configuration du type de fichier possible a importer
const fileFilter = (req, file, cb) => {
    const type = /jpeg|jpg|png/;
    const validType = type.test(path.extname(file.originalname).toLowerCase());
    const validMime = type.test(file.mimetype);

    if (validType && validMime) {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers .png, .jpg et .jpeg sont autorisés !'));
    }
};

// configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const pseudo = req.user?.pseudo || 'anonymous'; // ici utilise le pseudo de l'utilisateur ou "anonymous"
        const extension = path.extname(file.originalname);
        cb(null, `${pseudo}${extension}`); // Utilise le pseudo comme préfixe
    }
});

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1 * 1024 * 1024 } // 1 Mo max
});

