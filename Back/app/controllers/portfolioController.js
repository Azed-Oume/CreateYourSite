import Portfolio from '../models/portfolio.js'
import sequelize from '../database/database.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const portfolioController = {

    addDescription: async function (req, res) {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        console.log(req.body, "en ligne 18 XXXXXXXXXXXXXXXXXXXXXX");
        try {
            // Récupération des données de la requête
            const { description, id } = req.body;
    
            // Vérification de l'existence de l'image
            const portfolio = await Portfolio.findByPk(id, { transaction: t });
            console.log(portfolio, "en ligne 25 XXXXXXXXXXXX");
            if (!portfolio) {
                // Annulation de la transaction et envoi d'un message d'erreur si l'Image n'existe pas
                await t.rollback();
                return res.status(400).json({ message: "L'image n'existe pas" });
            }
                
            // Mise à jour de la description de l'image dans la base de données 
            await portfolio.update({ description: description }, { transaction: t });
    
            // Validation de la transaction
            await t.commit();
    
            // Réponse avec l'image mise à jour
            res.status(201).json({ message: 'Description ajoutée à l\'image', portfolio: portfolio });
        } catch (error) {
            // Gestion des erreurs 
            console.error('Erreur lors de l\'ajout de la description pour la photo :', error);
            // Annulation de la transaction en cas d'erreur et envoi d'un message d'erreur
            await t.rollback();
            res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout de la description pour la photo :' });
        }
    },


// Create a new image entry
createImage : async (req, res) => {
    const t = await sequelize.transaction(); // Début de la transaction Sequelize
    if (req.files && req.files.length > 0) { // Vérifie s'il y a des fichiers téléchargés
        try {
            const fileDetails = req.files.map(file => ({
                nom: file.filename,
                taille: file.size,
                type: file.mimetype,
                url: `http://localhost:3000/imagePortfolio/${file.filename}` // Mise à jour du chemin de stockage
            }));

            // Enregistre les détails des fichiers dans la base de données
            const newImages = await Promise.all(fileDetails.map(async (fileDetail) => {
                const newImage = await Portfolio.create(fileDetail, { transaction: t }); // Utilisation de la transaction Sequelize
                return newImage;
            }));

            await t.commit(); // Valider la transaction

            console.log('Téléchargement des photos réussi');
            res.status(201).json(newImages);
        } catch (error) {
            await t.rollback(); // Annuler la transaction en cas d'erreur
            console.error('Erreur lors du téléchargement des photos :', error);
            res.status(500).json({ error: 'Erreur lors du téléchargement des photos !' });
        }
    } else {
        await t.rollback(); // Annuler la transaction si aucun fichier n'est téléchargé
        console.log('Aucun fichier téléchargé.');
        res.status(400).json({ error: 'Aucun fichier téléchargé' });
    }
},


// Pérmet de récupérer toutes les photos !
getAllImages : async (req, res) => {
    let transaction; // Déclaration de la variable de transaction

    try {
        // Début de la transaction Sequelize
        transaction = await sequelize.transaction();

        // Récupérer l'ID de l'utilisateur connecté à partir du token JWT
        // const utilisateurId = req.user.utilisateur_id;

        // Récupérer toutes les images de l'utilisateur à partir de la base de données
        const images = await Portfolio.findAll();

        // Valider la transaction
        await transaction.commit();

        console.log('All images:', images);
        // Renvoyer les images récupérées dans la réponse
        res.status(200).json({ images });
    } catch (error) {
        console.error('Error fetching images:', error);
        // Si une erreur se produit, annuler la transaction
        if (transaction) await transaction.rollback();
        // Répondre avec une erreur
        res.status(500).json({ error: 'Erreur lors de la récupération des images' });
    }
},


// Get a single image entry by ID
getImageById : async (req, res) => {
    try {
        const { id } = req.params;
        const image = await Portfolio.findByPk(id);
        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

// Update an image entry by ID
updateImage : async (req, res) => {
    try {
        const { id } = req.params;
        const { filename, size, type, location } = req.body;
        const [updated] = await Portfolio.update({ filename, size, type, location }, {
            where: { id }
        });
        if (!updated) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const updatedImage = await Portfolio.findByPk(id);
        res.status(200).json(updatedImage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

// Delete an image entry by ID
deleteImage : async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Portfolio.destroy({
            where: { id }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

}
export default portfolioController
