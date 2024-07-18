import Message from "../models/message.js";
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";


const formController = {
    setConectedContact: async function (req, res) {
        try {
            // Récupération des données de la requête
            const { pseudo, email, sujet, message } = req.body;
             // Vérification de l'existence de l'utilisateur dans la requête
             const utilisateurId = req.params.utilisateurId ; // Utilisation de l'ID par défaut 6666 si l'utilisateur n'est pas fourni
            console.log(pseudo, email, sujet, message, utilisateurId, " en ligne 14 XXXXXXXXXXXX");
            // Création du Message dans la base de données
            const nouveauMessage = await Message.create({
                pseudo,
                email,
                sujet,
                message,
                utilisateur_id: utilisateurId,
            });
    
            // Réponse avec le message créé
            res.status(201).json({ success: true, message: 'Sujet envoyé avec succès', nouveauMessage });
        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur lors de la création du sujet :', error);
            res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la création du sujet', error });
        }
    },


    setNoConectedContact: async function (req, res) {
        try {
            // Récupération des données de la requête
            const { pseudo, email, sujet, message } = req.body;
            // Vérification de l'existence de l'utilisateur dans la requête
            const utilisateurId = req.params.utilisateurId || null // Utilisation de l'ID par défaut 6666 si l'utilisateur n'est pas fourni
            console.log(pseudo, email, sujet, message, utilisateurId, " en ligne 39 XXXXXXXXXXXX");

            // Création du Message dans la base de données
            const nouveauMessage = await Message.create({
                pseudo,
                email,
                sujet,
                message,
                utilisateur_id: utilisateurId,
            });
    
            // Réponse avec le message créé
            res.status(201).json({ success: true, message: 'Sujet envoyé avec succès', nouveauMessage });
        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur lors de la création du sujet :', error);
            res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la création du sujet', error });
        }
    },
}

export default formController;