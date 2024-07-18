{/*  OUMESSAOUD Azzedine: oumessaoud@hotmail.fr */ }


const roleCheck = (allowedRoles) => {
    return (req, res, next) => {

        try {
            const userRole = req.user.role_id;

            let isRoleAllowed = false;

            for (let i = 0; i < allowedRoles.length; i++) {
                if (allowedRoles[i] == userRole) {
                    isRoleAllowed = true;
                    break;
                }
            }

            if (isRoleAllowed) {
                next(); // Accès autorisé
            } else {
                res.status(403).json({ message: 'Accès refusé. Vous n\'avez pas les droits nécéssaire pour acceder a cette page .' });
            }
        } catch (e) {
            res.status(401).send(e.message);
        }


    }
}
export default roleCheck;
