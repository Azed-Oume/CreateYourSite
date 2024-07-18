import Commande  from "../models/commande.js"; // Importez votre modèle Sequelize
import Produit_commande from "../models/produit_commande.js";
import User from "../models/user.js";
import Produits from "../models/produit.js";
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const commandeController = {

    
    
    createCommande : async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Extraire les données du formulaire de la demande
            const { numeroCommande, validateCommande, detailProjet, panier } = req.body;
            console.log(numeroCommande, validateCommande, detailProjet, panier, "en ligne 17 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
            const utilisateurId = req.user.utilisateur_id;
            console.log(utilisateurId, "en ligne 21 XXXXXXXXXXXXX");
            
            // Rechercher l'utilisateur dans la table Utilisateurs
            const utilisateur = await User.findOne({ where: { utilisateur_id: utilisateurId } });
    
            // Vérifier si l'utilisateur existe
            if (!utilisateur) {
                throw new Error('Utilisateur non trouvé');
            }
    
                // Enregistrer la commande dans la table Commande avec le nom du client
                const nouvelleCommande = await Commande.create({
                    // Données du devis
                    utilisateur_id: utilisateurId,
                    numero_commande: numeroCommande,
                    validite_commande: validateCommande,
                    detail_projet: detailProjet,
                    nom_client: utilisateur.nom
                }, { transaction: t });
                    
                console.log(numeroCommande, " en ligne 42 XXXXXXXXXXXXXX");
                // Récupérer l'ID de la commande créé
                const commandeId = nouvelleCommande.commande_id;

                // Enregistrer les produits associés a la commande dans la table Produit_commande
                await Promise.all(panier.map(async (produit) => {
                    // Enregistrer chaque produit du panier dans la table Produit_devis
                    await Produit_commande.create({
                        commande_id: commandeId, // Utiliser l'ID de la commande créé
                        produit_id: produit.produit_id,
                        quantite: produit.quantite
                    }, { transaction: t });
                }));

                // Valider la transaction
                await t.commit();

                // Répondre avec un succès
                res.status(201).json({ message: 'Commande créé avec succès' });
                console.log("Commande créé avec succès");
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();

            // Répondre avec une erreur
            res.status(500).json({ error: 'Erreur lors de la création de la commande' });
        }
    },

    getCommandeUtilisateur: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
            const utilisateurId = req.user.utilisateur_id;
            console.log(utilisateurId, "en ligne 75 XXXXXXXXXXXXX");
            
            // Rechercher les commandes de l'utilisateur dans la table Commande
            const commandeUtilisateur = await Commande.findAll({
                where: { utilisateur_id: utilisateurId },
                transaction: t // Utilisation de la transaction Sequelize
            });
    
            // Valider la transaction
            await t.commit();
    
            // Répondre avec les commandes de l'utilisateur
            res.status(200).json({ commande: commandeUtilisateur });
            console.log(commandeUtilisateur, " en ligne 89 XXXXXXXXXXXXX");
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
            // Répondre avec une erreur
            res.status(500).json({ error: 'Erreur lors de la récupération des commandes de l\'utilisateur' });
        }
    },
    

    getCommandeUtilisateurId: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer l'ID de la commande à partir des paramètres de la requête
            const commandeId = req.params.commandeId;
            console.log(commandeId, " en ligne 143 du getCommandeUtilisateurId");
            
            // Rechercher la commande dans la base de données en fonction de son ID
            const commande = await Commande.findByPk(commandeId, {
                include: [{
                    model: Produits,
                    through: Produit_commande,
                    as: 'Produits' // Assurez-vous d'utiliser le bon alias
                }],
                transaction: t // Utilisation de la transaction Sequelize
            });
    
            // Valider la transaction
            await t.commit();
            console.log("Commande récupéré avec succès !");
            
            // Vérifier si la commande existe
            if (!commande) {
                // Si la commande n'est pas trouvé, répondre avec un code 404 (Not Found)
                return res.status(404).json({ error: 'Commande non trouvé' });
            }
    
            // Récupérer les quantités de produits associées a la commande
            const quantites = commande.Produits.map(produit => ({
                produit_id: produit.produit_id,
                quantite: produit.Produit_commande.quantite // Assurez-vous d'utiliser le bon alias pour la quantité
            }));
    
            // Répondre avec le commande trouvé et les quantités de produits
            res.status(200).json({ commande, quantites });
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
            // Répondre avec une erreur en cas d'erreur lors de la récupération du commande
            res.status(500).json({ error: 'Erreur lors de la récupération du commande' });
        }
    },


    deleteCommande: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer l'ID du commande à partir des paramètres de la requête
            const commandeId = req.params.commandeId;
            console.log(commandeId, " en ligne 148 du getCommandeUtilisateurId");
    
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
            const utilisateurId = req.user.utilisateur_id;
            console.log(utilisateurId, "en ligne 151 XXXXXXXXXXXXX");
    
            // Rechercher l'utilisateur dans la table Utilisateurs
            const utilisateur = await User.findOne({ where: { utilisateur_id: utilisateurId } });
    
            // Vérifier si l'utilisateur existe
            if (!utilisateur) {
                throw new Error('Utilisateur non trouvé');
            }
    
            // Rechercher les produits associés a la commande dans la table Produits_commande
            const produits = await Produit_commande.findAll({ where: { commande_id: commandeId }, transaction: t });
    
            // Supprimer les produits associés au devis dans la table Produit_devis
            await Promise.all(produits.map(async (produit) => {
                await Produit_commande.destroy({ where: { produit_commande_id: produit.produit_commande_id }, transaction: t });
            }));
    
            // Supprimer le devis dans la table Commande
            await Commande.destroy({ where: { commande_id: commandeId }, transaction: t });
    
            // Valider la transaction
            await t.commit();
    
            // Répondre avec un succès
            res.status(200).json({ message: 'Commande supprimé avec succès' });
            console.log("Commande supprimé avec succès");
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
    
            // Répondre avec une erreur
            res.status(500).json({ error: 'Erreur lors de la suppression de la commande' });
        }
    },

    updateCommande: async (req, res) => {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer l'ID de la commande à partir des paramètres de la requête
            const commandeId = req.params.commandeId;
            console.log(commandeId, " en ligne 148 du getCommandeUtilisateurId");
    
            // Récupérer l'ID de l'utilisateur connecté à partir des informations stockées dans la demande
            const utilisateurId = req.user.utilisateur_id;
            console.log(utilisateurId, "en ligne 151 XXXXXXXXXXXXX");
    
            // Rechercher l'utilisateur dans la table Utilisateurs
            const utilisateur = await User.findOne({ where: { utilisateur_id: utilisateurId } });
    
            // Vérifier si l'utilisateur existe
            if (!utilisateur) {
                throw new Error('Utilisateur non trouvé');
            }
    
            // Rechercher les produits associés a la commande dans la table Produits_commande
            const produits = await Produit_commande.findAll({ where: { commande_id: commandeId }, transaction: t });
    
            // Supprimer les produits associés a la commande dans la table Produit_commande
            await Promise.all(produits.map(async (produit) => {
                await Produit_commande.destroy({ where: { produit_commande_id: produit.produit_commande_id }, transaction: t });
            }));
    
            // Supprimer la commande dans la table Commande
            await Commande.destroy({ where: { commande_id: commandeId }, transaction: t });
    
            // Extraire les données du formulaire de la demande
            const { numeroCommande, validateCommande, detailProjet, panier } = req.body;
            console.log(numeroCommande, validateCommande, detailProjet, panier, "en ligne 17 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    
            // Enregistrer la commande dans la table commande avec le nom du client
            const nouvelleCommande = await Commande.create({
                utilisateur_id: utilisateurId,
                numero_commande: numeroCommande,
                validite_commande: validateCommande,
                detail_projet: detailProjet,
                nom_client: utilisateur.nom
            }, { transaction: t });
    
            // Récupérer l'ID de la Commande créé
            const nouvelleCommandeId = nouvelleCommande.commande_id;
    
            // Enregistrer les produits associés au devis dans la table Produit_commande
            await Promise.all(panier.map(async (produit) => {
                // Enregistrer chaque produit du panier dans la table Produit_commande
                await Produit_commande.create({
                    commande_id: nouvelleCommandeId,
                    produit_id: produit.produit_id,
                    quantite: produit.quantite
                }, { transaction: t });
            }));
    
            // Valider la transaction
            await t.commit();
    
            // Répondre avec un succès
            await res.status(200).json({ message: 'Commande mise à jour avec succès en ligne 251 XXXXXXXXXXXX' });
        } catch (error) {
            console.error(error);
            // Si une erreur se produit, annuler la transaction
            await t.rollback();
            // Répondre avec une erreur
            res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande !' });
        }
    },
    
    
    
    
   
    
    

}
export default commandeController;



