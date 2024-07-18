{/*  OUMESSAOUD Azzedine: oumessaoud@hotmail.fr */ }

import express from 'express';
// import {upload, file,  uploadImage, uploadImageEntreprise } from './midleware/storageFiles.js';
import usersController from './controllers/usersController.js';
import connexionController from './controllers/connexionController.js';
import articleController from './controllers/articleController.js';
import commentController from './controllers/commentController.js';
import avatarController from './controllers/imgController.js';
import formController from './controllers/formController.js';
import productController from './controllers/productController.js';
import { uploadImage, uploadImageArticle, uploadPhotoProduit, uploadPortfolio, uploadPhotosPortfolio } from './midleware/storageFiles.js';
import jwtGuard from './midleware/jwtGuard.js';
import roleCheck from './midleware/roleCheck.js';
import imgController from './controllers/imgController.js';
import devisController from './controllers/devisController.js';
import portfolioController from './controllers/portfolioController.js';
import commandeController from './controllers/commandeController.js';
import decodeToken from './midleware/decodeToken.js';
import factureController from './controllers/factureController.js';


const router = express.Router();

/* 
code_role 1 => Abonné
code_role 2 => Éditeur
code_role 3 => Cient
code_role 4 => Administarteur 
*/
// Utilisation de roleCheck dans le routeur



router.post('/api/user/register', usersController.setUser);//Permet l'enregistrement d'un nouvel utilisateur.
router.post('/api/set-new-login', usersController.setNewLogin); // Route pour demander la réinitialisation du mot de passe
router.post('/api/reset-password/:token', decodeToken, usersController.resetPassword); // Route pour réinitialiser le mot de passe
router.get('/api/getUser', jwtGuard ,roleCheck([1,2,3,4,5]), usersController.getUser );  // pérmet de récuperer le profil de l'utilisateur connécter
router.get('/api/getAllUser', jwtGuard ,roleCheck([1,2,3,4,5]), usersController.getAllUser );  // pérmet de récuperer la listes des utilisateur
router.put('/api/updateUserStatut/:userId', jwtGuard, roleCheck([1]), usersController.updateUserStatut) 
router.get('/api/getSociete/:utilisateurId', usersController.getSociete );  // pérmet de récuperer le profil de la société du site !
router.patch('/api/updateUser', jwtGuard, roleCheck([1,2,3,4,5]), usersController.updateUser); // pérmet de modiffier le profil de l'utilisateur connécter
router.post('/api/users/login', connexionController.login);// Gère l'authentification des utilisateurs  //
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
router.post('/api/create/article', jwtGuard, roleCheck([1,2,3,4,5]), articleController.setArticle); // pérmer de créer un article !
router.get('/api/get/article', jwtGuard, roleCheck([1,2,3,4,5]), articleController.getArticle); // pérmer de recuperer tout les articles de l'utilisateur conécter !
router.get('/api/get/all/articles',  articleController.getAllArticles); // pérmer de recuperer tout les articles de tout les utilisateur !
router.delete('/api/remove/article', jwtGuard, roleCheck([1,2,3,4,5]), articleController.deleteArticle); // pérmet de supprimer un article
router.patch('/api/update/love', jwtGuard, roleCheck([1,2,3,4,5]), articleController.updateLove); // pérmet la mise a jour du champ love nbr de likes
// router.post('/api/uploade/image/article', jwtGuard, roleCheck([1,2,3,4,5]), uploadImageArticle.single('image Article'), articleController.updateImageArticle);
router.patch('/api/uploade/image/article/:articleId', jwtGuard, roleCheck([1,2,3,4,5]), uploadImageArticle.single('image_couverture'), articleController.updateImageArticle);
// router.patch('/api/uploade/image/article', jwtGuard, roleCheck([1,2,3,4,5]), uploadImageArticle.single('image_couverture'), articleController.updateImageArticle);
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
router.post('/api/create/comment', jwtGuard, roleCheck([1,2,3,4,5]), commentController.setComment); // pérmer de créer un Commentaire !
router.get('/api/get/comment', jwtGuard, roleCheck([1,2,3,4,5]), commentController.getComment); // pérmer de recuperer tout les Commentaire de l'articles de l'utilisateur conécter !
router.delete('/api/remove/comment', jwtGuard, roleCheck([1,2,3,4,5]), commentController.deleteComment); // pérmet de supprimer un Commentaire
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
// router.post('/api/create/avatar', jwtGuard, roleCheck([1,2,3,4,5]), avatarController.setAvatar); // pérmet d'ajouter un Avatar pour le profil
router.patch('/api/update/avatar', jwtGuard, roleCheck([1,2,3,4,5]), uploadImage.single('avatar'), imgController.updateAvatar); // pérmet de Modiffier un Avatar pour le profil
router.post('/api/get/photos/:produitId', jwtGuard, roleCheck([1,2,3,4,5]), uploadPhotoProduit.array('photos'), imgController.getPhotos); // pérmet d'ajouter une ou plusieurs photo pour le produit 
router.delete('/api/delete/photo/:imageId', jwtGuard, roleCheck([1,2,3,4,5]), imgController.deletePhotoProduit); // pérmet de supprimer une photo d'un produit avec son id !
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
router.post('/api/formvip/contact/:utilisateurId', jwtGuard, roleCheck([1,2,3,4,5]), formController.setConectedContact); // Pérmet a un Utilisateur connecter d'envoyer un Formulaire
router.post('/api/form/contact', formController.setNoConectedContact); // Pérmet a un Utilisateur non connecter d'envoyer un Formulaire
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
router.post('/api/create/product', jwtGuard, roleCheck([1,2,3,4,5]), productController.setProduct); // permet de créer un produits
router.get('/api/get/product', productController.getProduct); // permet de récupérer tout les produits
router.get('/api/get/one/product/:produitId', jwtGuard, roleCheck([1,2,3,4,5]), productController.getOneProduct); // permet de récupérer un produits avec son Id
router.patch('/api/update/product/:produitId', jwtGuard, roleCheck([1,2,3,4,5]), productController.updateProduct); // permet la mise a jour d'un produit avec son Id
router.delete('/api/delete/product/:produitId', jwtGuard, roleCheck([1,2,3,4,5]), productController.deleteProduct); // permet de Supprimer un produit avec son Id
router.patch('/api/update/statut/product/:produitId', jwtGuard, roleCheck([1,2,3,4,5]), productController.updateStatutProduct);
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
router.get('/api/get/categoriesproduits', jwtGuard, roleCheck([1,2,3,4,5]), productController.getCategoriesProduits); // permet de récupérer toutes les Categories
router.post('/api/create/categoriesproduits', jwtGuard, roleCheck([1,2,3,4,5]), productController.setCategoriesProduits); // permet de créer une Categories
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
router.post('/api/create/devis', jwtGuard, roleCheck([1,2,3,4,5]), devisController.createDevis); // permet d'enregistrer un devis !
router.get('/api/get/devis/utilisateur', jwtGuard, roleCheck([1,2,3,4,5]), devisController.getDevisUtilisateur); // permet de récupèrer tout les devis de l'utilisateur conécter !
router.get('/api/get/devis/utilisateur/:devisId', jwtGuard, roleCheck([1,2,3,4,5]), devisController.getDevisUtilisateurId); // permet de récupèrer un devis (par son Id), de l'utilisateur conécter !
router.delete('/api/delete/devis/:devisId', jwtGuard, roleCheck([1, 2, 3, 4, 5]), devisController.deleteDevis); // pérmet de supprimer un devis avec toutes ces relation avec son devis_id !
router.post('/api/update/devis/:devisId', jwtGuard, roleCheck([1, 2, 3, 4, 5]), devisController.updateDevis); // permet de modiffier un devis !
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
router.post('/api/create/facture', jwtGuard, roleCheck([1,2,3,4,5]), factureController.createFacture); // permet d'enregistrer une facture !
router.get('/api/get/facture/utilisateur', jwtGuard, roleCheck([1,2,3,4,5]), factureController.getFactureUtilisateur); // permet de récupèrer toutes les factures de l'utilisateur conécter !
router.get('/api/get/facture/utilisateur/:factureId', jwtGuard, roleCheck([1,2,3,4,5]), factureController.getFactureUtilisateurId); // permet de récupèrer une facture (par son Id), de l'utilisateur conécter !
// router.delete('/api/delete/facture/:factureId', jwtGuard, roleCheck([1, 2, 3, 4, 5]), factureController.deleteFacture); // pérmet de supprimer une facture avec toutes ces relation avec son devis_id !
// router.post('/api/update/facture/:factureId', jwtGuard, roleCheck([1, 2, 3, 4, 5]), factureController.updateFacture); // permet de modiffier une facture !
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//

// router.post('/api/images', jwtGuard, roleCheck([1, 2, 3, 4, 5]),uploadPortfolio.single("portfolio"), portfolioController.createImage); // Pérmet d'enregistrer une nouvelle image !
router.post('/api/images', jwtGuard, roleCheck([1, 2, 3, 4, 5]),uploadPhotosPortfolio.array("portfolio"), portfolioController.createImage); // Pérmet d'enregistrer une ou plusieurs nouvelle image !
router.get('/api/images',  portfolioController.getAllImages); // Pérmet de récupérer toutes les images !
router.get('/api/images/:id', jwtGuard, roleCheck([1, 2, 3, 4, 5]), portfolioController.getImageById); // Pérmer de récupérer une image par ID !
router.put('/api/images/:id', jwtGuard, roleCheck([1, 2, 3, 4, 5]), portfolioController.updateImage); // Pérmer de mettre à jour une image par son ID !
router.delete('/api/delete/photo/portfollio/:id', jwtGuard, roleCheck([1, 2, 3, 4, 5]), portfolioController.deletePhotoPortfolio); // Pérmer de supprimer une image par son ID !
router.put('/api/images/ajouterDescription/:id', jwtGuard, roleCheck([1,2,3,4,5]), portfolioController.addDescription)
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX//
router.post('/api/create/commande', jwtGuard, roleCheck([1,2,3,4,5]), commandeController.createCommande); // permet d'enregistrer une commande !
router.get('/api/get/commande/utilisateur', jwtGuard, roleCheck([1,2,3,4,5]), commandeController.getCommandeUtilisateur); // permet de récupèrer toutes les commandes de l'utilisateur conécter !
router.get('/api/get/commande/utilisateur/:commandeId', jwtGuard, roleCheck([1,2,3,4,5]), commandeController.getCommandeUtilisateurId); // permet de récupèrer une commande (par son Id), de l'utilisateur conécter !
router.delete('/api/delete/commande/:commandeId', jwtGuard, roleCheck([1, 2, 3, 4, 5]), commandeController.deleteCommande); // pérmet de supprimer une commande avec toutes ces relation avec son commande_id !
router.post('/api/update/commande/:commandeId', jwtGuard, roleCheck([1, 2, 3, 4, 5]), commandeController.updateCommande); // permet de modiffier une commande !

export default router;

