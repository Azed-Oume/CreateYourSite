import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { config } from 'dotenv';
config();

const secretKey = process.env.SECRET_KEY;

const decodeToken = async (req, res, next) => {
    const token = req.params.token || req.query.token || req.headers.authorization;  // Extraction du token

    console.log(`Token reçu en ligne 12 : ${token}`);

    if (!token) {
        return res.status(403).json({ message: 'Aucun jeton fourni.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log('Decoded token:', decoded);
        
        req.user = await User.findOne({ where: { utilisateur_id: decoded.userId } });
        console.log('Utilisateur trouvé:', req.user);

        if (!req.user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        next();
    } catch (error) {
        console.error('Erreur lors de la vérification du jeton:', error);
        return res.status(401).json({ message: 'Jeton invalide.' });
    }
};

export default decodeToken;
