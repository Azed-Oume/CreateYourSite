import sequelize from '../database/database.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import Image from '../models/image.js';
import User from '../models/user.js';





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imgController = {

    updateAvatar: async function (req, res) {
        if (req.file) {
            console.log('Fichier téléchargé :', req.file);
            const fileName = req.file.filename;
    
            // Formez l'URL directe vers le fichier téléchargé
            const fileURL = `http://localhost:3000/fileAvatar/${fileName}`; // Modifier avec l'URL correcte
            // Récupérez l'ID de l'utilisateur
            const userId = req.user.utilisateur_id;
    
            try {
                // Mettez à jour le champ "avatar" pour l'utilisateur spécifié avec l'URL directe
                const result = await User.update(
                    { avatar: fileURL },
                    { where: { utilisateur_id: userId } }
                );
                
                if (result[0] === 1) {
                    console.log('Mise à jour de l\'avatar réussie');
                    console.log('Champ "avatar" mis à jour pour l\'utilisateur.');
    
                    // Renvoyer un message de succès dans la réponse JSON
                    return res.status(200).json({ message: "Mise à jour de l'avatar réussie" });
                } else {
                    throw new Error("Échec de la mise à jour de l'avatar");
                }
            } catch (error) {
                console.error('Erreur lors de la mise à jour du champ "avatar" :', error);
                return res.status(500).json({ error: 'Erreur lors de la mise à jour du champ "avatar"' });
            }
        } else {
            console.log('Aucun fichier téléchargé.');
            return res.status(400).json({ error: 'Aucun fichier téléchargé' });
        }
    },


    getPhotos: async function (req, res) {
        const { produitId } = req.params; // Récupère l'ID du produit à partir des paramètres de la requête
        console.log(produitId, "en ligne 46");
        if (req.files && req.files.length > 0) { // Vérifie s'il y a des fichiers téléchargés
            try {
                const fileURLs = []; // Initialise un tableau pour stocker les URL des fichiers téléchargés
    
                // Parcourir tous les fichiers téléchargés
                for (const file of req.files) {
                    console.log('Fichier téléchargé :', file);
                    const fileName = file.filename;
                    const fileURL = `http://localhost:3000/photoProduit/${fileName}`; // Construit l'URL complète du fichier téléchargé
                    fileURLs.push(fileURL); // Ajoute l'URL du fichier au tableau
                }
    
                // Mettre à jour la base de données avec les URL des fichiers téléchargés
                // const results = await Promise.all(fileURLs.map(fileURL =>
                //     Image.create({ photo: fileURL, produitId }) // Crée une entrée dans la base de données pour chaque fichier téléchargé
                // ));
                const results = await Promise.all(fileURLs.map(async (fileURL, index) => {
                    const image = await Image.create({ photo: fileURL, produit_id: produitId });
                    return image;
                }));
                
    
                console.log('Téléchargement des photos réussi');
    
                // Renvoyer un message de succès dans la réponse JSON
                return res.status(200).json({ message: "Téléchargement des photos réussi" });
            } catch (error) {
                console.error('Erreur lors du Téléchargement des photos :', error);
                return res.status(500).json({ error: 'Erreur lors du Téléchargement des photos !' });
            }
        } else {
            console.log('Aucun fichier téléchargé.');
            return res.status(400).json({ error: 'Aucun fichier téléchargé' });
        }
    },

    deletePhotoProduit: async function (req, res) {
        const t = await sequelize.transaction();
        try {
            // Récupération de l'id de la photo dans req.params de la requête
            const { imageId } = req.params;
            console.log(imageId, "en ligne 90");
            // Vérification de l'existence de l'image
            const image = await Image.findOne({ where: { image_id: imageId } });
            if (!image) {
                await t.rollback();
                return res.status(400).json({ message: "La photo n'existe pas !" });
            }
    
            // Récupération des noms des fichiers associés a l'image
            const photos = await Image.findAll({ where: { image_id: imageId } });
            const fileNames = photos.map(photo => photo.photo);
    
            // Suppression de la photos associées au produit, si elles existent
            if (photos.length > 0) {
                await Image.destroy({ where: { image_id: imageId }, transaction: t });
    
                // Supprimer physiquement les photos du répertoire photoProduit
                await Promise.all(fileNames.map(async (fileName) => {
                    const filePath = path.join(__dirname, '', fileName);
                    const cleanedFilePath = filePath.replace(/\\controllers\\http:\\localhost:3000\\photoProduit\\/g, '\\public\\photoProduit\\');

                    try {
                        await fs.unlink(cleanedFilePath); // Utilisez fs.promises.unlink pour supprimer le fichier
                        console.log('Photo supprimée avec succès :', cleanedFilePath);
                    } catch (err) {
                        console.error('Erreur lors de la suppression de la photo :', err);
                    }
                }));
            }
    
            // Suppression de la photo elle-même
            await Image.destroy({ where: { image_id: imageId }, transaction: t });
    
            await t.commit();
    
            res.status(200).json({ message: "La photo a été supprimé avec succès" });
        } catch (error) {
            console.error("Erreur lors de la Suppression de la photo :", error);
            await t.rollback();
            res.status(500).json({ message: "Une Erreur est survenue lors de la suppression de la photo !" });
        }
    },
    
    


    

}

export default imgController;