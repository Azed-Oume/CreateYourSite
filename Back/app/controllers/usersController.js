import sequelize from '../database/database.js';
import User from '../models/user.js';
import Role from '../models/role.js'; // Importez le modèle de rôle
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'; // Utilisez import pour nodemailer
import { config } from 'dotenv';
config();

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const secretKey = process.env.SECRET_KEY;
const url_client = process.env.URL_CLIENT;

async function generateResetLink(user) {
    console.log(user.email, " en ligne 20 XXXXXXXXXXXX");
    const email = user.email;
    let utilisateur = await User.findOne({ where: { email } });
    console.log(utilisateur, " en ligne 23 XXXXXXXXXXXXX");

    if (!utilisateur) {throw new Error('Utilisateur non trouvé.')};

    const token = jwt.sign({ userId: utilisateur.utilisateur_id }, secretKey, { expiresIn: '5m' });
    console.log(utilisateur.utilisateur_id, token, "en ligne 28 XXXXXXXXX");

    const resetLink = `${url_client}/resetpassword/${encodeURIComponent(token)}`;  // Correction de l'URL
    console.log(resetLink, " en ligne 31 XXXXXXXXXXXXXXXX");
    return resetLink;
}


async function sendResetEmail(to, link) {
    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // Utiliser STARTTLS
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });console.log(emailUser, emailPass, " en ligne 43 XXXXXXXXXXXXXX");

    let mailOptions = {
        from: emailUser,
        to: to,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Vous recevez cet email parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n
        Cliquez sur le lien suivant ou copiez-collez dans votre navigateur pour compléter le processus:\n\n
        ${link}\n\n
        Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email et votre mot de passe restera inchangé.\n`
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId, " en ligne 56 XXXXXXXXX");
}


async function sendConfirmChangeEmail(to, link) {
    // Création du transporteur de courrier
    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // Utiliser STARTTLS
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });

    console.log(emailUser, emailPass, " en ligne 72 XXXXXXXXXXXXXX");

    // Définition des options de l'email
    let mailOptions = {
        from: emailUser,
        to: to,
        subject: 'Regénération de votre mot de passe',
        text: `Le mot de passe de votre compte a été regénéré avec succès.\n\n
        Si vous n'êtes pas à l'origine de ce changement, veuillez contacter d'urgence le support.\n`
    };

    // Envoi de l'email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId, " en ligne 86 XXXXXXXXX");
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
}

const usersController = {
    // Contrôleur pour définir un nouveau login
setNewLogin: async function (req, res) {
    const transaction = await sequelize.transaction();

    try {
        const email = req.body.email;
        const existingUser = await User.findOne({ where: { email }, transaction });

        if (existingUser) {
            const resetLink = await generateResetLink(existingUser);
            await sendResetEmail(existingUser.email, resetLink);

            await transaction.commit();

            return res.status(200).json({ message: "Cet e-mail existe. Un lien pour régénérer le mot de passe a été envoyé." });
        } else {
            await transaction.rollback();
            return res.status(404).json({ message: "Cet e-mail n'existe pas dans notre base de données." });
        }
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return res.status(500).json({ message: "Une erreur s'est produite. Veuillez réessayer plus tard." });
    }
},

// Contrôleur pour la réinitialisation du mot de passe
resetPassword: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { token, newPassword } = req.body;
        const payload = jwt.verify(token, secretKey);
        const user = await User.findByPk(payload.userId, { transaction });

        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Options de validation du mot de passe
        const options = { minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 };

        // Vérifier si le mot de passe est fort
        if (!validator.isStrongPassword(newPassword, options)) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Le mot de passe doit comporter au moins 12 caractères et au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial' });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe de l'utilisateur
        await user.update({ mot_de_passe: hashedPassword }, { transaction });

        await transaction.commit();
        sendConfirmChangeEmail(user.email);

        return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
    }
},


    setUser: async function (req, res) {
        const transaction = await sequelize.transaction();
        try {
            console.log("Requête d'inscription reçue avec les données suivantes :");
            console.log(req.body);
    
            // Options de validation du mot de passe
            const options = { minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 };
    
            // Vérifier si l'email est déjà utilisé
            const existingUser = await User.findOne({ where: { email: req.body.email }, transaction });
            if (existingUser) {
                await transaction.rollback();
                return res.status(409).json({ error: "Cet e-mail est déjà utilisé." }); // 409 Conflict
            }
    
            // Vérifier si le mot de passe est fort
            if (!validator.isStrongPassword(req.body.mot_de_passe, options)) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Le mot de passe doit comporter au moins 12 caractères et au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial' }); // 400 Bad Request
            }
    
            // Rechercher le rôle correspondant
            const role = await Role.findOne({ where: { nom: req.body.role_id }, transaction });
            if (!role) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Le rôle spécifié n\'existe pas' }); // 400 Bad Request
            }
    
            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(req.body.mot_de_passe, 10);
    
            // Création de l'utilisateur dans la base de données
            const user = await User.create({
                utlisateurId:req.body.utlisateur_id,
                nom: req.body.nom,
                prenom: req.body.prenom,
                societe: req.body.societe,
                pseudo: req.body.pseudo,
                telephone: req.body.telephone,
                siret: req.body.siret,
                numero_tva: req.body.numero_tva,
                email: req.body.email,
                mot_de_passe: hashedPassword,
                role_id: role.role_id,
                rue: req.body.rue,
                ville: req.body.ville,
                code_postal: req.body.code_postal,
                avatar: req.body.avatar,
                statut: req.body.statut,
                biographie: req.body.biographie,
                role: req.body.role
            }, {transaction} );
            await transaction.commit();
    
            console.log("Données correctement envoyées à la base de données :");
            console.log(user);
            res.status(201).json(user); // 201 Created
        } catch (error) {
            console.error("Erreur lors de l'enregistrement des données :", error.message);
            if (transaction) await transaction.rollback();
            res.status(500).json({ error: "Une erreur est survenue lors de l'enregistrement des données." }); // 500 Internal Server Error
        }
    },
    

    getUser: async function (req, res) {
        const transaction = await sequelize.transaction();
        try {
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande (par exemple, à partir du token JWT)
            const userId = req.user.utilisateur_id;
            console.log(userId, "en ligne 231");
            // Rechercher l'utilisateur dans la base de données en utilisant son ID
            const user = await User.findByPk(userId, {transaction} );

            if (!user) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Supprimer le mot de passe de la réponse pour des raisons de sécurité
            const { mot_de_passe, ...userInfo } = user.toJSON();
            await transaction.commit();

            // Renvoyer les informations de l'utilisateur
            res.status(200).json(userInfo);
        } catch (error) {
            await transaction.rollback();
            console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
            res.status(500).json({ error: 'Erreur de serveur lors de la récupération des informations de l\'utilisateur' });
        }
    },


    getAllUser: async function (req, res) {
        try {
            // Vérifier si l'utilisateur est authentifié et a un rôle défini
            if (!req.user || typeof req.user.role_id !== 'number') {
                return res.status(401).json({ message: "Utilisateur non authentifié ou rôle non défini" });
            }
    
            // Récupérer le rôle de l'utilisateur connecté
            const roleId = req.user.role_id;
            console.log(`Rôle de l'utilisateur connecté: ${roleId}`);
    
            // Vérifier si l'utilisateur est administrateur
            if (roleId !== 1) {
                return res.status(403).json({ message: "Cette section est réservée à l'administrateur" });
            }
    
            // Récupérer tous les utilisateurs si le rôle est administrateur
            const utilisateurs = await User.findAll({
                attributes: { exclude: ['mot_de_passe'] } // Exclure le mot de passe de la réponse
            });
    
            // Renvoyer les informations des utilisateurs
            res.status(200).json(utilisateurs);
        } catch (error) {
            console.error("Erreur lors de la récupération des informations des utilisateurs :", error);
            res.status(500).json({ error: 'Erreur de serveur lors de la récupération des informations des utilisateurs' });
        }
    },


    updateUserStatut : async function (req, res) {
        const { userId } = req.params; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
        const { statut } = req.body; // Récupérer le nouveau statut à partir du corps de la requête
    
        const transaction = await sequelize.transaction();
        
        try {
            // Vérifier si l'utilisateur existe
            const utilisateur = await User.findByPk(userId, { transaction });
    
            if (!utilisateur) {
                await transaction.rollback();
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }
    
            // Mettre à jour le statut de l'utilisateur
            utilisateur.statut = statut;
            await utilisateur.save({ transaction });
    
            // Valider la transaction
            await transaction.commit();

            // Renvoyer l'utilisateur mis à jour en réponse
            const utilisateurSansMotDePasse = await User.findByPk(userId, {
                attributes: { exclude: ['mot_de_passe'] }, // Exclure le mot de passe de la réponse
            });
            res.status(200).json(utilisateurSansMotDePasse);
    

        } catch (error) {
            // Annuler la transaction en cas d'erreur
            await transaction.rollback();
            console.error("Erreur lors de la modification du statut de l'utilisateur :", error);
            res.status(500).json({ error: 'Erreur de serveur lors de la modification du statut de l\'utilisateur' });
        }
    },

    // updateUserStatut: async function (req, res) {
    //     const { userId } = req.params; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
    //     const { statut } = req.body; // Récupérer le nouveau statut à partir du corps de la requête
    
    //     let transaction;
        
    //     try {
    //         // Début de la transaction
    //         transaction = await sequelize.transaction();
    
    //         // Vérifier si l'utilisateur existe
    //         const utilisateur = await User.findByPk(userId, { transaction });
    
    //         if (!utilisateur) {
    //             await transaction.rollback();
    //             return res.status(404).json({ message: "Utilisateur non trouvé" });
    //         }
    
    //         // Mettre à jour le statut de l'utilisateur
    //         utilisateur.statut = statut;
    //         await utilisateur.save({ transaction });
    
    //         // Valider la transaction
    //         await transaction.commit();
    
    //         // Renvoyer l'utilisateur mis à jour en réponse
    //         const utilisateurSansMotDePasse = await User.findByPk(userId, {
    //             attributes: { exclude: ['mot_de_passe'] }, // Exclure le mot de passe de la réponse
    //             transaction
    //         });
    //         res.status(200).json(utilisateurSansMotDePasse);
    //     } catch (error) {
    //         // Vérifier si la transaction existe et rollback si elle n'a pas été validée
    //         if (transaction) {
    //             try {
    //                 await transaction.rollback();
    //             } catch (rollbackError) {
    //                 console.error("Erreur lors du rollback de la transaction :", rollbackError);
    //             }
    //         }
    
    //         console.error("Erreur lors de la modification du statut de l'utilisateur :", error);
    //         res.status(500).json({ error: 'Erreur de serveur lors de la modification du statut de l\'utilisateur' });
    //     }
    // },
    
    
    getSociete: async function (req, res) {
        const transaction = await sequelize.transaction();
        try {
            // Récupérer l'ID  connecté à partir des informations stockées dans la demande (req.params)
            const userId = req.params.utilisateurId;
            console.log(userId, "en ligne 373 XXXXXXXXXXXXX");
            // Rechercher l'utilisateur dans la base de données en utilisant son ID
            const user = await User.findByPk(userId, {transaction} );
            console.log(userId, " en ligne 376 XXXXXXXXXXXX")
            if (!user) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            // Supprimer le mot de passe de la réponse pour des raisons de sécurité
            const { mot_de_passe, ...userInfo } = user.toJSON();
            await transaction.commit();

            // Renvoyer les informations de l'utilisateur
            res.status(200).json(userInfo);
        } catch (error) {
            await transaction.rollback();
            console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
            res.status(500).json({ error: 'Erreur de serveur lors de la récupération des informations de l\'utilisateur' });
        }
    },


    updateUser: async function (req, res) {
        const transaction = await sequelize.transaction();
        try {
            const userId = req.body.utilisateur_id;
            console.log(userId, " en ligne 400 XXXXXXXXXXXXXX");
            let user = await User.findByPk(userId, { transaction });
    
            if (!user) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
    
            // Mettre à jour les informations de l'utilisateur avec les nouvelles données de la requête
            user = await user.update(req.body, { transaction });
    
            // Supprimer le mot de passe de la réponse pour des raisons de sécurité
            const { mot_de_passe, ...userInfo } = user.toJSON();
    
            // Commit de la transaction après la mise à jour réussie
            await transaction.commit();
    
            // Renvoyer les informations de l'utilisateur mises à jour
            res.status(200).json(userInfo);
    
            console.log('Informations utilisateur mises à jour avec succès');
        } catch (error) {
            // En cas d'erreur, rollback de la transaction et gestion de l'erreur
            await transaction.rollback();
            console.error("Erreur lors de la mise à jour des informations de l'utilisateur :", error);
    
            if (error.name === 'SequelizeValidationError') {
                res.status(400).json({ error: 'Données de mise à jour non valides' });
            } else {
                res.status(500).json({ error: 'Erreur de serveur lors de la mise à jour des informations de l\'utilisateur' });
            }
        }
    },
    
    
};

function displayError(err, res) {
    if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(409).json({
            error: `'${err.errors[0].value}' existe déjà`,
            champ: err.errors[0].path
        });
    } else {
        res.status(500).json({ error: err.message });
    }
}



export default usersController;
