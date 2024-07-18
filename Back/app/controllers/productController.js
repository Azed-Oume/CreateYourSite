import sequelize from '../database/database.js';
import Categoriesproduits from '../models/categoriesproduits.js';
import Produits from '../models/produit.js';
import Image from '../models/image.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const productController = {

    setProduct: async function (req, res) {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupération des données de la requête
            const { nom, categorie, tarif, detail, quantite } = req.body;
    
            // Vérification de l'existence du produit
            const produit = await Produits.findOne({ where: { nom }, transaction: t });
            if (produit) {
                await t.rollback(); // Annulation de la transaction en cas d'échec
                return res.status(400).json({ message: "Le Produit existe déjà avec ce nom !" });
            }
    
            // Récupération de l'ID de la catégorie à partir de son nom
            let categoriesproduits_id;
            let categorieExistante = await Categoriesproduits.findOne({ where: { nom: categorie }, transaction: t });
            if (categorieExistante) {
                categoriesproduits_id = categorieExistante.categoriesproduits_id;
            } else {
                // Si la catégorie n'existe pas, la créer et récupérer son ID
                const nouvelleCategorie = await Categoriesproduits.create({ nom: categorie }, { transaction: t });
                categoriesproduits_id = nouvelleCategorie.categoriesproduits_id;
            }
    
            // Création du produit dans la base de données avec la catégorie correspondante
            const nouveauProduit = await Produits.create({
                nom,
                quantite,
                detail,
                tarif,
                categoriesproduits_id
                // Ajoutez d'autres attributs si nécessaire
            }, { transaction: t });
    
            // Validation de la transaction
            await t.commit();
    
            // Réponse avec le produit créé
            res.status(201).json({ message: 'Produit créé avec succès', produit: nouveauProduit });
        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur lors de la création du produit :', error);
            await t.rollback(); // Annulation de la transaction en cas d'erreur
            res.status(500).json({ message: 'Une erreur est survenue lors de la création du produit' });
        }
    },

/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/    
    getProduct: async function (req, res) {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer les produits à partir de la base de données avec la transaction
            const produits = await Produits.findAll({
                include: [{ model: Categoriesproduits, transaction: t }, { model: Image, transaction: t }] // Inclusion des relations avec la transaction
            });
    
            // Vérifier si des produits existent
            if (produits && produits.length > 0) {
                // Formater les produits selon les besoins
                const formattedProducts = produits.map(produit => ({
                    produit_id: produit.produit_id,
                    statut: produit.statut,
                    nom: produit.nom,
                    quantite: produit.quantite,
                    detail: produit.detail,
                    tarif: produit.tarif,
                    categorie: produit.Categoriesproduit ? produit.Categoriesproduit.nom : null, // Utiliser le nom correct de la relation
                    photos: produit.Images ? produit.Images.map(image => image.photo) : [], // Utiliser produit.Images au lieu de produit.Image
                    // Ajoutez d'autres champs si nécessaire
                }));
                // Validation de la transaction
                await t.commit();
                // Retourner les produits au format JSON
                return res.status(200).json({ produits: formattedProducts });
            } else {
                // Si aucun produit n'est trouvé, annuler la transaction et retourner un message approprié
                await t.rollback();
                return res.status(404).json({ message: "Aucun produit trouvé" });
            }
        } catch (error) {
            // Gérer les erreurs de récupération des produits
            console.error('Erreur lors de la récupération des produits :', error);
            // Annuler la transaction en cas d'erreur et retourner un message d'erreur
            await t.rollback();
            return res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des produits', error });
        }
    },
    
/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    getOneProduct: async function (req, res) {
        // Début de la transaction Sequelize
        const t = await sequelize.transaction();
        try {
            // Récupérer l'ID du produit depuis les paramètres de la requête
            const { produitId } = req.params;
            console.log(produitId, 'Id du produit depuis les paramètres en ligne 87');
            
            // Recherche du produit dans la base de données avec la transaction
            const produit = await Produits.findOne({
                where: { produit_id: produitId }, // Recherche par ID
                include: [{ model: Categoriesproduits, transaction: t }, { model: Image, transaction: t }] // Inclusion des relations avec la transaction
            });
    
            // Vérifier si le produit a été trouvé
            if (produit) {
                // Formater le produit selon les besoins
                const formattedProduct = {
                    produit_id: produit.produit_id,
                    statut: produit.statut,
                    nom: produit.nom,
                    quantite: produit.quantite,
                    detail: produit.detail,
                    tarif: produit.tarif,
                    categorie: produit.Categoriesproduit ? produit.Categoriesproduit.nom : null, // Utiliser le nom correct de la relation
                    photos: produit.Images ? produit.Images.map(image => ({
                        image_id: image.image_id,
                        photo: image.photo,
                    })) : [],
                    // Ajoutez d'autres champs si nécessaire
                };
                console.log(formattedProduct, 'en ligne 138 XXXXXXXXXXXXXXXXX');
                // Validation de la transaction
                await t.commit();
                // Retourner le produit au format JSON
                return res.status(200).json({ produit: formattedProduct });
            } else {
                // Si aucun produit n'est trouvé, annuler la transaction et retourner un message approprié
                await t.rollback();
                return res.status(404).json({ message: "Aucun produit trouvé avec cet ID" });
            }
        } catch (error) {
            // Gérer les erreurs de récupération du produit
            console.error('Erreur lors de la récupération du produit :', error);
            // Annuler la transaction en cas d'erreur et retourner un message d'erreur
            await t.rollback();
            return res.status(500).json({ message: 'Une erreur est survenue lors de la récupération du produit', error });
        }
    },
   
/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    updateProduct: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            const { produitId } = req.params; // Récupération de l'ID du produit à partir des paramètres de la requête
            console.log(produitId, "en ligne 124");
    
            let { nom, quantite, detail, tarif, categoriesproduits_id } = req.body; // Extraction des données du corps de la requête
    
            // Recherche du produit à mettre à jour
            const product = await Produits.findOne({
                where: { produit_id: produitId },
                transaction: t // Utilisation de la transaction pour cette requête
            });
    
            // Vérification si le produit existe
            if (!product) {
                await t.rollback(); // Annulation de la transaction en cas d'échec
                return res.status(404).json({ message: "Aucun produit trouvé avec cet ID" });
            }
    
            // Recherche de la catégorie existante
            let categorieExistante = await Categoriesproduits.findByPk(categoriesproduits_id, { transaction: t });
    
            // Création d'une nouvelle catégorie si elle n'existe pas
            if (!categorieExistante) {
                let nouvelleCategorie = await Categoriesproduits.create({ nom: categoriesproduits_id }, { transaction: t });
                console.log(nouvelleCategorie, "en ligne 147");
                categoriesproduits_id = nouvelleCategorie.categoriesproduits_id;
            }
    
            // Mise à jour des données du produit
            product.nom = nom;
            product.quantite = quantite;
            product.detail = detail;
            product.tarif = tarif;
            product.categoriesproduits_id = categoriesproduits_id;
    
            // Sauvegarde des modifications dans la base de données
            await product.save({ transaction: t });
    
            await t.commit(); // Validation de la transaction si tout se passe bien
    
            return res.status(200).json({ message: "Produit mis à jour avec succès", produit: product });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit :', error);
            await t.rollback(); // Annulation de la transaction en cas d'échec
            return res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour du produit', error });
        }
    },

/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    deleteProduct: async function (req, res) {
        const t = await sequelize.transaction();
        try {
            // Récupération de l'id du produit dans req.params de la requête
            const { produitId } = req.params;
            console.log(produitId, "en ligne 199");
            // Vérification de l'existence du produit
            const produit = await Produits.findOne({ where: { produit_id: produitId } });
            if (!produit) {
                await t.rollback();
                return res.status(400).json({ message: "Le Produit n'existe pas !" });
            }
    
            // Récupération des noms des fichiers associés au produit
            const photos = await Image.findAll({ where: { produit_id: produitId } });
            const fileNames = photos.map(photo => photo.photo);
    
            // Suppression des photos associées au produit, si elles existent
            if (photos.length > 0) {
                await Image.destroy({ where: { produit_id: produitId }, transaction: t });
    
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
    
            // Suppression du produit lui-même
            await Produits.destroy({ where: { produit_id: produitId }, transaction: t });
    
            await t.commit();
    
            res.status(200).json({ message: "Le produit a été supprimé avec succès" });
        } catch (error) {
            console.error("Erreur lors de la Suppression du Produit :", error);
            await t.rollback();
            res.status(500).json({ message: "Une Erreur est survenue lors de la suppression du Produit !" });
        }
    },

/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/    
updateStatutProduct: async (req, res) => {
    const t = await sequelize.transaction(); // Début de la transaction Sequelize
    try {
        const { produitId } = req.params; // Récupération de l'ID du produit à partir des paramètres de la requête
        console.log(produitId, "en ligne 124");

        let { statut } = req.body; // Extraction des données du corps de la requête

        // Recherche du produit dans la base de données
        const product = await Produits.findOne({ where: { produit_id: produitId } });

        // Vérification si le produit existe
        if (!product) {
            await t.rollback(); // Annulation de la transaction en cas d'échec
            return res.status(404).json({ message: "Aucun produit trouvé avec cet ID" });
        }


        // Mise à jour des données du produit
        product.statut = statut;
        

        // Sauvegarde des modifications dans la base de données
        await product.save({ transaction: t });

        await t.commit(); // Validation de la transaction si tout se passe bien

        return res.status(200).json({ message: "Produit mis à jour avec succès", produit: product });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit :', error);
        await t.rollback(); // Annulation de la transaction en cas d'échec
        return res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour du produit', error });
    }
},


/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/    
    getCategoriesProduits: async function (req, res) {
        const transaction = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer les catégories à partir de la base de données avec la transaction
            const categories = await Categoriesproduits.findAll({ transaction });
    
            // Vérifier si des catégories existent
            if (categories && categories.length > 0) {
                // Formater les catégories selon les besoins
                const formattedCategories = categories.map(categorie => ({
                    id: categorie.id,
                    nom: categorie.nom,
                    // Ajoutez d'autres champs si nécessaire
                }));
                // Validation de la transaction
                await transaction.commit();
                // Retourner les catégories au format JSON
                return res.status(200).json({ categorie: formattedCategories });
            } else {
                // Si aucune catégorie n'est trouvée, annuler la transaction et retourner un message approprié
                await transaction.rollback();
                return res.status(404).json({ message: "Aucune Catégorie trouvée" });
            }
        } catch (error) {
            // Gérer les erreurs de récupération des catégories
            console.error('Erreur lors de la récupération des Catégories :', error);
            // Annuler la transaction en cas d'erreur et retourner un message d'erreur
            await transaction.rollback();
            return res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des Catégories', error });
        }
    },
    
/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
/*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    setCategoriesProduits: async function (req, res) {
        let transaction; // Déclarer la transaction

        try {
            // Démarrer une transaction Sequelize
            transaction = await sequelize.transaction();

            // Récupérer les données de la requête
            const { nom } = req.body;

            // Vérifier si la catégorie existe déjà dans la transaction en cours
            const existingCategory = await Categoriesproduits.findOne({ where: { nom }, transaction });
            if (existingCategory) {
                await transaction.rollback(); // Annuler la transaction
                return res.status(400).json({ message: "La catégorie existe déjà" });
            }

            // Créer la nouvelle catégorie dans la transaction en cours
            const newCategory = await Categoriesproduits.create({ nom }, { transaction });

            // Valider la transaction
            await transaction.commit();

            // Répondre avec la nouvelle catégorie créée
            res.status(201).json({ message: 'Catégorie créée avec succès', categorie: newCategory });
        } catch (error) {
            // Annuler la transaction en cas d'erreur
            if (transaction) await transaction.rollback();
            
            // Gérer les erreurs
            console.error('Erreur lors de la création de la catégorie :', error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la création de la catégorie' });
        }
    },

        




    // deleteComment: async function (req, res) {
    //     try {
    //         const { id } = req.params;
    
    //         // Suppression des commentaires liés à l'article s'ils existent
    //         if (await Comment.findOne({ where: { article_id: id } })) {
    //             await Comment.destroy({ where: { article_id: id } });
    //         }
    
    
    //         res.status(200).json({ message: 'Commentaire supprimé avec succès' });
    //     } catch (error) {
    //         console.error('Erreur lors de la suppression du Commentaire :', error);
    //         res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du Commentaire' });
    //     }
    // },
    // deleteComment: async function (req, res) {
    //     const t = await sequelize.transaction(); // Début de la transaction Sequelize
    //     try {
    //         const { id } = req.params;
    
    //         // Vérifier si des commentaires sont liés à l'article dont l'ID est fourni dans les paramètres de la requête
    //         const comments = await Comment.findAll({ where: { article_id: id }, transaction: t });
            
    //         // Suppression des commentaires liés à l'article dans le cadre de la transaction
    //         await Comment.destroy({ where: { article_id: id }, transaction: t });
    
    //         // Validation de la transaction
    //         await t.commit();
    
    //         // Envoyer une réponse indiquant que le commentaire a été supprimé avec succès
    //         res.status(200).json({ message: 'Commentaire supprimé avec succès' });
    //     } catch (error) {
    //         // Gérer les erreurs survenues lors de la suppression du commentaire
    //         console.error('Erreur lors de la suppression du Commentaire :', error);
    
    //         // Annuler la transaction en cas d'erreur et envoyer un message d'erreur
    //         await t.rollback();
    //         res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du Commentaire' });
    //     }
    // }
    
    

}

export default productController;