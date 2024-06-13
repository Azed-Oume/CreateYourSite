import Devis  from "../models/devis.js"; // Importez votre modèle Sequelize
import Produit_devis from "../models/produit_devis.js";
import User from "../models/user.js";
import Produits from "../models/produit.js";
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Facture from "../models/facture.js";
import Produit_facture from "../models/produit_facture.js";

const factureController = {


    createFacture: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Extraire les données du formulaire de la demande
            const { numeroFacture, detailProjet, panier, montantTotal, modePaiement, informationPaiement } = req.body;
            
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
            const utilisateurId = req.user.utilisateur_id;
            
            // Rechercher l'utilisateur dans la table Utilisateurs
            const utilisateur = await User.findOne({ where: { utilisateur_id: utilisateurId } });
    
            // Vérifier si l'utilisateur existe
            if (!utilisateur) {
                throw new Error('Utilisateur non trouvé');
            }
    
            // Enregistrer la facture dans la table Facture avec le nom du client
            const nouvelleFacture = await Facture.create({
                utilisateur_id: utilisateurId,
                numero_facture: numeroFacture,
                nom_client: utilisateur.nom,
                date_facture: new Date(),
                date_echeance: new Date(),
                montant_total: montantTotal,
                detail_projet: detailProjet,
                mode_paiement: modePaiement,
                statut_facture: 1, // ou une autre valeur par défaut
                information_paiement: informationPaiement
            }, { transaction: t });
    
            // Récupérer l'ID de la facture créée
            const factureId = nouvelleFacture.facture_id;
    
            // Enregistrer les produits associés à la facture dans la table Produit_facture
            await Promise.all(panier.map(async (produit) => {
                // Enregistrer chaque produit du panier dans la table Produit_facture
                await Produit_facture.create({
                    facture_id: factureId, // Utiliser l'ID de la facture créée
                    produit_id: produit.produit_id,
                    quantite: produit.quantite
                }, { transaction: t });
            }));
    
            // Valider la transaction
            await t.commit();
    
            // Répondre avec un succès
            res.status(201).json({ message: 'Facture créée avec succès' });
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
    
            // Répondre avec une erreur
            res.status(500).json({ error: 'Erreur lors de la création de la facture' });
        }
    },
    

    getFactureUtilisateur: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
            const utilisateurId = req.user.utilisateur_id;
            console.log(utilisateurId, "en ligne 75 XXXXXXXXXXXXX");
            
            // Rechercher les factures de l'utilisateur dans la table Factures
            const factureUtilisateur = await Facture.findAll({
                where: { utilisateur_id: utilisateurId },
                transaction: t // Utilisation de la transaction Sequelize
            });
    
            // Valider la transaction
            await t.commit();
    
            // Répondre avec les factures de l'utilisateur
            res.status(200).json({ facture: factureUtilisateur });
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
            // Répondre avec une erreur
            res.status(500).json({ error: 'Erreur lors de la récupération des factures de l\'utilisateur' });
        }
    },
    

    getFactureUtilisateurId: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer l'ID de la facture à partir des paramètres de la requête
            const factureId = req.params.factureId;
            console.log(factureId, " en ligne 143 du getDevisUtilisateurId");
            
            // Rechercher la facture dans la base de données en fonction de son ID
            const facture = await Facture.findByPk(factureId, {
                include: [{
                    model: Produits,
                    through: Produit_facture,
                    as: 'Produits' // Assurez-vous d'utiliser le bon alias
                }],
                transaction: t // Utilisation de la transaction Sequelize
            });
    
            // Valider la transaction
            await t.commit();
            console.log("Facture récupéré avec succès !");
            
            // Vérifier si le devis existe
            if (!facture) {
                // Si la facture n'est pas trouvé, répondre avec un code 404 (Not Found)
                return res.status(404).json({ error: 'Facture non trouvé' });
            }
    
            // Récupérer les quantités de produits associées au devis
            const quantites = facture.Produits.map(produit => ({
                produit_id: produit.produit_id,
                quantite: produit.Produit_facture.quantite // Assurez-vous d'utiliser le bon alias pour la quantité
            }));
    
            // Répondre avec la facture trouvé et les quantités de produits
            res.status(200).json({ facture, quantites });
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
            // Répondre avec une erreur en cas d'erreur lors de la récupération de la facture
            res.status(500).json({ error: 'Erreur lors de la récupération de la facture' });
        }
    },


    // deleteFacture: async (req, res) => {
    //     const t = await sequelize.transaction(); // Début de la transaction Sequelize
    //     try {
    //         // Récupérer l'ID de la facture à partir des paramètres de la requête
    //         const factureId = req.params.factureId;
    //         console.log(factureId, " en ligne 148 du getDevisUtilisateurId");
    
    //         // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
    //         const utilisateurId = req.user.utilisateur_id;
    //         console.log(utilisateurId, "en ligne 151 XXXXXXXXXXXXX");
    
    //         // Rechercher l'utilisateur dans la table Utilisateurs
    //         const utilisateur = await User.findOne({ where: { utilisateur_id: utilisateurId } });
    
    //         // Vérifier si l'utilisateur existe
    //         if (!utilisateur) {
    //             throw new Error('Utilisateur non trouvé');
    //         }
    
    //         // Rechercher les produits associés a la facture dans la table Produits_facture
    //         const produits = await Produit_facture.findAll({ where: { facture_id: factureId }, transaction: t });
    
    //         // Supprimer les produits associés a la facture dans la table Produit_facture
    //         await Promise.all(produits.map(async (produit) => {
    //             await Produit_facture.destroy({ where: { facture_produit_id: produit.facture_produit_id }, transaction: t });
    //         }));
    
    //         // Supprimer la facture dans la table Facture
    //         await Devis.destroy({ where: { facture_id: factureId }, transaction: t });
    
    //         // Valider la transaction
    //         await t.commit();
    
    //         // Répondre avec un succès
    //         res.status(200).json({ message: 'Facture supprimé avec succès' });
    //         console.log("Facture supprimé avec succès");
    //     } catch (error) {
    //         console.error(error);
    //         // Si une erreur se produit, annuler la transaction
    //         await t.rollback();
    
    //         // Répondre avec une erreur
    //         res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });
    //     }
    // },

    // updateDevis: async (req, res) => {
    //     const t = await sequelize.transaction(); // Début de la transaction Sequelize
    //     try {
    //         // Récupérer l'ID du devis à partir des paramètres de la requête
    //         const devisId = req.params.devisId;
    //         console.log(devisId, " en ligne 148 du getDevisUtilisateurId");
    
    //         // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
    //         const utilisateurId = req.user.utilisateur_id;
    //         console.log(utilisateurId, "en ligne 151 XXXXXXXXXXXXX");
    
    //         // Rechercher l'utilisateur dans la table Utilisateurs
    //         const utilisateur = await User.findOne({ where: { utilisateur_id: utilisateurId } });
    
    //         // Vérifier si l'utilisateur existe
    //         if (!utilisateur) {
    //             throw new Error('Utilisateur non trouvé');
    //         }
    
    //         // Rechercher les produits associés au devis dans la table Produits_devis
    //         const produits = await Produit_devis.findAll({ where: { devis_id: devisId }, transaction: t });
    
    //         // Supprimer les produits associés au devis dans la table Produit_devis
    //         await Promise.all(produits.map(async (produit) => {
    //             await Produit_devis.destroy({ where: { produit_devis_id: produit.produit_devis_id }, transaction: t });
    //         }));
    
    //         // Supprimer le devis dans la table Devis
    //         await Devis.destroy({ where: { devis_id: devisId }, transaction: t });
    
    //         // Extraire les données du formulaire de la demande
    //         const { numeroDevis, validateDevis, detailProjet, panier } = req.body;
    //         console.log(numeroDevis, validateDevis, detailProjet, panier, "en ligne 17 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    
    //         // Enregistrer le devis dans la table Devis avec le nom du client
    //         const nouveauDevis = await Devis.create({
    //             utilisateur_id: utilisateurId,
    //             numero_devis: numeroDevis,
    //             validite_devis: validateDevis,
    //             detail_projet: detailProjet,
    //             nom_client: utilisateur.nom
    //         }, { transaction: t });
    
    //         // Récupérer l'ID du devis créé
    //         const nouveauDevisId = nouveauDevis.devis_id;
    
    //         // Enregistrer les produits associés au devis dans la table Produit_devis
    //         await Promise.all(panier.map(async (produit) => {
    //             // Enregistrer chaque produit du panier dans la table Produit_devis
    //             await Produit_devis.create({
    //                 devis_id: nouveauDevisId,
    //                 produit_id: produit.produit_id,
    //                 quantite: produit.quantite
    //             }, { transaction: t });
    //         }));
    
    //         // Valider la transaction
    //         await t.commit();
    
    //         // Répondre avec un succès
    //         res.status(200).json({ message: 'Devis mis à jour avec succès' });
    //     } catch (error) {
    //         console.error(error);
    //         // Si une erreur se produit, annuler la transaction
    //         await t.rollback();
    //         // Répondre avec une erreur
    //         res.status(500).json({ error: 'Erreur lors de la mise à jour du devis' });
    //     }
    // },
    
    
    
    
   
    
    

}
export default factureController;



