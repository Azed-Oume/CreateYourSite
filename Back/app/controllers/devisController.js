import Devis  from "../models/devis.js"; // Importez votre modèle Sequelize
import Produit_devis from "../models/produit_devis.js";
import User from "../models/user.js";
import Produits from "../models/produit.js";
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const devisController = {

    
    
    createDevis : async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Extraire les données du formulaire de la demande
            const { numeroDevis, validateDevis, detailProjet, panier } = req.body;
            console.log(numeroDevis, validateDevis, detailProjet, panier, "en ligne 17 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
            const utilisateurId = req.user.utilisateur_id;
            console.log(utilisateurId, "en ligne 21 XXXXXXXXXXXXX");
            
            // Rechercher l'utilisateur dans la table Utilisateurs
            const utilisateur = await User.findOne({ where: { utilisateur_id: utilisateurId } });
    
            // Vérifier si l'utilisateur existe
            if (!utilisateur) {
                throw new Error('Utilisateur non trouvé');
            }
    
                // Enregistrer le devis dans la table Devis avec le nom du client
                const nouveauDevis = await Devis.create({
                    // Données du devis
                    utilisateur_id: utilisateurId,
                    numero_devis: numeroDevis,
                    validite_devis: validateDevis,
                    detail_projet: detailProjet,
                    nom_client: utilisateur.nom
                }, { transaction: t });

                // Récupérer l'ID du devis créé
                const devisId = nouveauDevis.devis_id;

                // Enregistrer les produits associés au devis dans la table Produit_devis
                await Promise.all(panier.map(async (produit) => {
                    // Enregistrer chaque produit du panier dans la table Produit_devis
                    await Produit_devis.create({
                        devis_id: devisId, // Utiliser l'ID du devis créé
                        produit_id: produit.produit_id,
                        quantite: produit.quantite
                    }, { transaction: t });
                }));

                // Valider la transaction
                await t.commit();

                // Répondre avec un succès
                res.status(201).json({ message: 'Devis créé avec succès' });
                console.log("Devis créé avec succès");
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();

            // Répondre avec une erreur
            res.status(500).json({ error: 'Erreur lors de la création du devis' });
        }
    },

    getDevisUtilisateur: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
            const utilisateurId = req.user.utilisateur_id;
            console.log(utilisateurId, "en ligne 75 XXXXXXXXXXXXX");
            
            // Rechercher les devis de l'utilisateur dans la table Devis
            const devisUtilisateur = await Devis.findAll({
                where: { utilisateur_id: utilisateurId },
                transaction: t // Utilisation de la transaction Sequelize
            });
    
            // Valider la transaction
            await t.commit();
    
            // Répondre avec les devis de l'utilisateur
            res.status(200).json({ devis: devisUtilisateur });
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
            // Répondre avec une erreur
            res.status(500).json({ error: 'Erreur lors de la récupération des devis de l\'utilisateur' });
        }
    },
    

    getDevisUtilisateurId: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer l'ID du devis à partir des paramètres de la requête
            const devisId = req.params.devisId;
            console.log(devisId, " en ligne 143 du getDevisUtilisateurId");
            
            // Rechercher le devis dans la base de données en fonction de son ID
            const devis = await Devis.findByPk(devisId, {
                include: [{
                    model: Produits,
                    through: Produit_devis,
                    as: 'Produits' // Assurez-vous d'utiliser le bon alias
                }],
                transaction: t // Utilisation de la transaction Sequelize
            });
    
            // Valider la transaction
            await t.commit();
            console.log("Devis récupéré avec succès !");
            
            // Vérifier si le devis existe
            if (!devis) {
                // Si le devis n'est pas trouvé, répondre avec un code 404 (Not Found)
                return res.status(404).json({ error: 'Devis non trouvé' });
            }
    
            // Récupérer les quantités de produits associées au devis
            const quantites = devis.Produits.map(produit => ({
                produit_id: produit.produit_id,
                quantite: produit.Produit_devis.quantite // Assurez-vous d'utiliser le bon alias pour la quantité
            }));
    
            // Répondre avec le devis trouvé et les quantités de produits
            res.status(200).json({ devis, quantites });
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
            // Répondre avec une erreur en cas d'erreur lors de la récupération du devis
            res.status(500).json({ error: 'Erreur lors de la récupération du devis' });
        }
    },


    deleteDevis: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer l'ID du devis à partir des paramètres de la requête
            const devisId = req.params.devisId;
            console.log(devisId, " en ligne 148 du getDevisUtilisateurId");
    
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
            const utilisateurId = req.user.utilisateur_id;
            console.log(utilisateurId, "en ligne 151 XXXXXXXXXXXXX");
    
            // Rechercher l'utilisateur dans la table Utilisateurs
            const utilisateur = await User.findOne({ where: { utilisateur_id: utilisateurId } });
    
            // Vérifier si l'utilisateur existe
            if (!utilisateur) {
                throw new Error('Utilisateur non trouvé');
            }
    
            // Rechercher les produits associés au devis dans la table Produits_devis
            const produits = await Produit_devis.findAll({ where: { devis_id: devisId }, transaction: t });
    
            // Supprimer les produits associés au devis dans la table Produit_devis
            await Promise.all(produits.map(async (produit) => {
                await Produit_devis.destroy({ where: { produit_devis_id: produit.produit_devis_id }, transaction: t });
            }));
    
            // Supprimer le devis dans la table Devis
            await Devis.destroy({ where: { devis_id: devisId }, transaction: t });
    
            // Valider la transaction
            await t.commit();
    
            // Répondre avec un succès
            res.status(200).json({ message: 'Devis supprimé avec succès' });
            console.log("Devis supprimé avec succès");
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
    
            // Répondre avec une erreur
            res.status(500).json({ error: 'Erreur lors de la suppression du devis' });
        }
    },

    updateDevis: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer l'ID du devis à partir des paramètres de la requête
            const devisId = req.params.devisId;
            console.log(devisId, " en ligne 148 du getDevisUtilisateurId");
    
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
            const utilisateurId = req.user.utilisateur_id;
            console.log(utilisateurId, "en ligne 151 XXXXXXXXXXXXX");
    
            // Rechercher l'utilisateur dans la table Utilisateurs
            const utilisateur = await User.findOne({ where: { utilisateur_id: utilisateurId } });
    
            // Vérifier si l'utilisateur existe
            if (!utilisateur) {
                throw new Error('Utilisateur non trouvé');
            }
    
            // Rechercher les produits associés au devis dans la table Produits_devis
            const produits = await Produit_devis.findAll({ where: { devis_id: devisId }, transaction: t });
    
            // Supprimer les produits associés au devis dans la table Produit_devis
            await Promise.all(produits.map(async (produit) => {
                await Produit_devis.destroy({ where: { produit_devis_id: produit.produit_devis_id }, transaction: t });
            }));
    
            // Supprimer le devis dans la table Devis
            await Devis.destroy({ where: { devis_id: devisId }, transaction: t });
    
            // Extraire les données du formulaire de la demande
            const { numeroDevis, validateDevis, detailProjet, panier } = req.body;
            console.log(numeroDevis, validateDevis, detailProjet, panier, "en ligne 17 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    
            // Enregistrer le devis dans la table Devis avec le nom du client
            const nouveauDevis = await Devis.create({
                utilisateur_id: utilisateurId,
                numero_devis: numeroDevis,
                validite_devis: validateDevis,
                detail_projet: detailProjet,
                nom_client: utilisateur.nom
            }, { transaction: t });
    
            // Récupérer l'ID du devis créé
            const nouveauDevisId = nouveauDevis.devis_id;
    
            // Enregistrer les produits associés au devis dans la table Produit_devis
            await Promise.all(panier.map(async (produit) => {
                // Enregistrer chaque produit du panier dans la table Produit_devis
                await Produit_devis.create({
                    devis_id: nouveauDevisId,
                    produit_id: produit.produit_id,
                    quantite: produit.quantite
                }, { transaction: t });
            }));
    
            // Valider la transaction
            await t.commit();
    
            // Répondre avec un succès
            res.status(200).json({ message: 'Devis mis à jour avec succès' });
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
            // Répondre avec une erreur
            res.status(500).json({ error: 'Erreur lors de la mise à jour du devis' });
        }
    },
    
    
    
    
   
    
    

}
export default devisController;



