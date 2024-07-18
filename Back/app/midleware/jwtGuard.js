{/*  OUMESSAOUD Azzedine: oumessaoud@hotmail.fr */ }


import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const jwtGuard = async (req, res, next) => {

    const bearer = req.headers.authorization;
    /*  console.log('coucou '); */
    // je verifie si le bearer est bien defini
    if (bearer === undefined) {
        res.status(401).send("token is missing");
        return;
    }

    if (!bearer.includes('Bearer')) {
        res.status(401).send("bad token");
        return;
    }

    const token = bearer.split(' ');
    /*  console.log(token[1]) */
    try {
        const payload = jwt.verify(token[1], process.env.SECRET_KEY);
        const user = await User.findByPk(payload.userId);
        req.user = user; // req.user <=> req.header.user
        console.log(user)

        
        next();
    } catch (e) {
        res.status(401).send(e.message);
        
    }


}
export default jwtGuard;