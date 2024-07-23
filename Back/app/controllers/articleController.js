// import validator from 'validator';
// import bcrypt from 'bcrypt';
// import { Sequelize } from 'sequelize';
// import {Op, literal} from 'sequelize';
import { config as configDotenv } from 'dotenv';
import Article from '../models/articles.js';
import Articles_tags from '../models/articles_tags.js';
// import UserArticleLove from '../models/userArticleLove.js';
import Category from '../models/categories.js';
import Comment from '../models/commentaires.js';
import Tags from '../models/tags.js';
import User from '../models/user.js';
import sequelize from '../database/database.js';
import { fileURLToPath } from 'url';
import path from 'path';
// import fs from 'fs/promises';
import fs from 'fs';
import UserArticleLove from '../models/userArticleLove.js';

configDotenv();
const URL_API = process.env.URL_API;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articleController = {

    setArticle: async function (req, res) {
        let t;
        console.log(req.user.utilisateur_id, " en ligne 17 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        try {
            // Récupération des données de la requête
            const { titre, contenu, categorie } = req.body;
            console.log(categorie, "en ligne 20");
            // Recherche de la catégorie par son nom
            const categorieExist = await Category.findOne({ where: { nom: categorie } });
            // Vérification de l'existence de la catégorie
            if (!categorieExist) {
                return res.status(400).json({ message: "La catégorie n'existe pas" });
            }
    
            // Récupération de l'ID de l'utilisateur à partir du token décodé par le middleware jwtGuard
            const utilisateur_id = req.user.utilisateur_id;
            console.log(utilisateur_id, 'en ligne 31')
            // Récupération du pseudo de l'utilisateur à partir de son ID
            const utilisateur = await User.findByPk(utilisateur_id);
            if (!utilisateur) {
                return res.status(400).json({ message: "L'utilisateur n'existe pas" });
            }
            const auteur = utilisateur.pseudo;
    
            // Commencer une transaction
            t = await sequelize.transaction();
    
            // Création de l'article dans la base de données avec l'ID de la catégorie trouvée et le pseudo de l'utilisateur
            const nouvelArticle = await Article.create({
                titre: titre,
                contenu: contenu,
                // image_couverture: image_couverture,
                categorie_id: categorieExist.categorie_id,
                auteur: auteur,
                utilisateur_id: utilisateur_id
                // Ajoutez d'autres attributs si nécessaire
            }, { transaction: t });
            const articleID = nouvelArticle.article_id;
    
            // Extraction des mots clés du contenu de l'article
            const motsCles = contenu.match(/\b\w{4,}\b/g);
    
            // Filtrer les mots clés
            const motsClesFiltres = motsCles.filter((mot, index) => {
                return mot !== "le" && mot !== "les" && mot !== "et" && mot !== "ou" && mot !== "dans" && index < 10;
            });
    
            // Préparation des données pour la création en masse
            const tagsData = motsClesFiltres.map(mot => ({ nom: mot }));
    
            // Création des tags en masse
            const createdTags = await Tags.bulkCreate(tagsData, { ignoreDuplicates: true, transaction: t });
    
            // Récupération des IDs des tags créés
            const tagIds = createdTags.map(tag => tag.tag_id);
    
            // Création des entrées dans la table de liaison en masse
            const articlesTagsData = tagIds.map(tagId => ({ article_id: articleID, tag_id: tagId }));
    
            await Articles_tags.bulkCreate(articlesTagsData, { transaction: t });
    
            // Valider la transaction
            await t.commit();
    
            
            // Réponse avec l'article créé et son ID
            res.status(201).json({ message: 'Article créé avec succès', article: nouvelArticle, article_id: articleID });
        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur lors de la création de l\'article :', error);
            if (t) await t.rollback(); // Annuler la transaction en cas d'erreur
            res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'article' });
        }
    },



    getArticle: async function (req, res) {
        let t;
        try {
            // Commencer une transaction
            t = await sequelize.transaction();
    
            // Ajoutez ici la logique pour récupérer les articles de l'utilisateur
            const articles = await Article.findAll({
                where: {
                    utilisateur_id: req.user.utilisateur_id // Supposons que l'ID de l'utilisateur soit stocké dans req.user.id
                },
                include: [
                    {
                        model: Comment,
                        required: false,
                        transaction: t
                    },
                    { model: Category, transaction: t }
                ],
                order: [['date_publication', 'DESC']],
                transaction: t
            });
    
            // Valider la transaction
            await t.commit();
    
            // Vérifiez si des articles ont été trouvés
            if (articles.length > 0) {
                // Formater les données pour inclure seulement les informations nécessaires dans la réponse JSON
                const formattedArticles = articles.map(article => {
                    const formattedArticle = {
                        article_id: article.article_id,
                        titre: article.titre,
                        contenu: article.contenu,
                        image_couverture: article.image_couverture, 
                        date_publication: new Date(article.date_publication).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        }),
                        vues: article.vues,
                        love: article.love,
                        auteur: article.auteur,
                        // Ajoutez d'autres champs si nécessaire
                    };
    
                    // Vérifier si des commentaires existent
                    if (article.Comments && article.Comments.length > 0) {
                        formattedArticle.comments = article.Comments.map(comment => ({
                            commentId: comment.comment_id,
                            titre: comment.titre,
                            contenu: comment.contenu,
                            auteur: comment.auteur,
                            // date_commentaire: comment.date_commentaire,
                            date_commentaire: new Date(comment.date_commentaire).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            }),
                            // Ajoutez d'autres champs si nécessaire
                        }));
                    }
    
                    // Ajouter la catégorie
                    if (article.Category) {
                        formattedArticle.category = {
                            id: article.Category.id,
                            nom: article.Category.nom,
                            // Ajoutez d'autres champs si nécessaire
                        };
                    }
    
                    return formattedArticle;
                });
    
                res.status(200).json({ articles: formattedArticles });
            } else {
                res.status(404).json({ message: 'Vous n\'avez pas d\'articles pour le moment.' });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des articles :', error);
            if (t) await t.rollback(); // Annuler la transaction en cas d'erreur
            res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des articles', error });
        }
    },
    


    getAllArticles: async function (req, res) {
        let t;
        try {
            // Commencer une transaction
            t = await sequelize.transaction();
    
            const articles = await Article.findAll({
                include: [
                    { model: Comment, required: false, transaction: t },
                    { model: Category, transaction: t }
                ],
                transaction: t
            });
    
            // Valider la transaction
            await t.commit();
    
            if (articles.length > 0) {
                const formattedArticles = articles.map(article => {
                    const formattedArticle = {
                        article_id: article.article_id,
                        titre: article.titre,
                        contenu: article.contenu,
                        image_couverture: article.image_couverture,
                        date_publication: new Date(article.date_publication).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        }),
                        vues: article.vues,
                        love: article.love,
                        auteur: article.auteur,
                        // Ajoutez d'autres champs si nécessaire
                    };
    
                    if (article.Comments && article.Comments.length > 0) {
                        formattedArticle.comments = article.Comments.map(comment => ({
                            commentId: comment.comment_id,
                            titre: comment.titre,
                            contenu: comment.contenu,
                            auteur: comment.auteur,
                            date_commentaire: new Date(comment.date_commentaire).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            }),
                            // Ajoutez d'autres champs si nécessaire
                        }));
                    }
    
                    if (article.Category) {
                        formattedArticle.category = {
                            id: article.Category.id,
                            nom: article.Category.nom,
                            // Ajoutez d'autres champs si nécessaire
                        };
                    }
    
                    return formattedArticle;
                });
    
                res.status(200).json({ articles: formattedArticles });
            } else {
                res.status(404).json({ message: 'Aucun article trouvé.' });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des articles :', error);
            if (t) await t.rollback(); // Annuler la transaction en cas d'erreur
            res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des articles', error });
        }
    },
    

    deleteArticle: async function (req, res) {
        const t = await sequelize.transaction(); // Pour Commencer une Transactions
        try {
            const { article_id } = req.body;
            const utilisateur_id = req.user.utilisateur_id;
            console.log(article_id, " en ligne 239 XXXXXXXXXXXXXX");
            console.log(utilisateur_id, " en ligne 240 XXXXXXXXXXXXXX");
            // Vérifier si l'article appartient à l'utilisateur connecté
            const article = await Article.findByPk(article_id, { transaction: t});
            if (!article) {
                await t.rollback(); // Annuler la Transaction si l'Article n'est pas trouvé
                 // Si l'article n'existe pas, retourner une réponse avec un statut 404
                return res.status(404).json({ message: "L'article n'existe pas" });
            }
    
            if (article.utilisateur_id !== utilisateur_id) {
                await t.rollback(); // Annuler la Transaction si l'utilisateur n'est pas autorisé a supprimer cette article
                  // Si l'article n'appartient pas à l'utilisateur connecté, retourner une réponse avec un statut 403
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cet article" });
            }
    
            const tags = await Articles_tags.findAll({
                where: { article_id: article_id},
                attributes: ['tag_id'],
                transaction: t
            });
            const tagIds = tags.map(tag => tag.tag_id);
            console.log(tagIds, "en ligne293 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            // Récupérer uniquement les valeurs tag_id du tableau tagIds

            // Supprimer les commentaires liés à l'article
            await Comment.destroy({ where: { article_id: article_id }, transaction: t });

            // Supprimer les liaisons liés a l'article via la table de liaison Articles_tags
            await Articles_tags.destroy({ where: { article_id: article_id}, transaction: t });
            
            // Supprimer les Tags liés a l'article dans la table Tags
            await Tags.destroy({ where: { tag_id: tagIds}, transaction: t });

            // Supprimer l'image de couverture physiquement
            // Récupération du nom de fichier associé à l'article
            const fileName = article.image_couverture;
            console.log(fileName, "nom du fichier récupéré en 286 XXXXXXXXXXXXX");
            // const cleanedFileName = fileName.replace(/http:\/\/localhost:3000\/imageArticle\//g, ''); // Retirer le segment 
            const cleanedFileName = fileName.replace(/^.*\/imageArticle\//, ''); // Retirer le segment 

            console.log(cleanedFileName," nom du fichier apre le netoyage du nom en ligne 288");
            // Vérification si le nom de fichier est présent
            if (fileName) {
                // Construction du chemin complet du fichier
                const imageDirectory = path.join(__dirname, '..', 'public', 'imageArticle');
                const filePath = path.join(imageDirectory, cleanedFileName);

                console.log(filePath, "chemin construit avec succès en ligne 296 XXXXXXXXXXX");
                try {
                    // Suppression de l'image de couverture physiquement
                    // await fs.promises.unlink(filePath);
                    fs.unlinkSync(filePath);
                    console.log('Image de couverture supprimée avec succès');
                } catch (err) {
                    console.error('Erreur lors de la suppression de l\'image de couverture :', err);
                    console.log('Erreur lors de la suppression de l\'image de couverture :');
                }
            }
            // Supprimer l'article lui-même
            await article.destroy({transaction: t });

            await t.commit(); // Valider la transaction
    
            res.status(200).json({ message: 'Article supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'article :', error);
            await t.rollback(); // Annuler la transaction en cas d'erreur
            res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de l\'article' });
        }
    },
    

    updateLove: async function(req, res) {
        let t;
        try {
            // Récupération de l'ID de l'article à mettre à jour et du nouveau nombre de "loves"
            const { articleId, loveCount } = req.body;
            // Récupération de l'ID de l'utilisateur à partir du token décodé par le middleware jwtGuard
            const utilisateur_id = req.user.utilisateur_id;
            
            // Démarrer une transaction
            t = await sequelize.transaction();
    
            // Vérifier si l'utilisateur a déjà aimé cet article
            const existingLove = await UserArticleLove.findOne({
                where: { utilisateur_id, article_id: articleId },
                transaction: t
            });
    
            if (existingLove) {
                // Retirer le "love" existant en supprimant l'enregistrement dans UserArticleLove
                await existingLove.destroy({ transaction: t });
    
                // Décrémenter le compteur "love" dans l'article
                await Article.decrement('love', { where: { article_id: articleId }, transaction: t });
    
                console.log('Love retiré car vous avez déjà aimé cet article');
            } else {
                // Ajouter un nouvel enregistrement dans la table UserArticleLove
                await UserArticleLove.create({
                    utilisateur_id,
                    article_id: articleId
                }, { transaction: t });
    
                // Incrémenter le compteur "love" dans l'article
                await Article.increment('love', { where: { article_id: articleId }, transaction: t });
    
                console.log('Nouvel enregistrement ajouté dans UserArticleLove');
            }
    
            // Valider la transaction
            await t.commit();
    
            // Renvoyer une réponse de succès
            res.status(200).json({ message: 'Nombre de loves mis à jour avec succès' });
        } catch (error) {
            // Si une erreur survient, annuler la transaction
            if (t) await t.rollback();
            // Renvoyer une réponse d'erreur
            console.error('Erreur lors de la mise à jour du nombre de loves :', error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour du nombre de loves' });
        }
    },
    
    updateImageArticle: async function (req, res) {
        const t = await sequelize.transaction(); // Démarrer une transaction
        try {
            if (!req.file) {
                console.log('Aucun fichier téléchargé.');
                return res.status(400).json({ error: 'Aucun fichier téléchargé' });
            }

            console.log('Fichier téléchargé :', req.file);
            const fileName = req.file.filename;

            // Formez l'URL directe vers le fichier téléchargé
            const fileURL = `${URL_API}/imageArticle/${fileName}`; // Utilisez la variable d'environnement

            // Récupérez l'ID de l'article
            const articleId = req.params.articleId;

            // Mettez à jour le champ "image_couverture" pour l'article spécifié avec l'URL directe
            const result = await Article.update(
                { image_couverture: fileURL },
                { where: { article_id: articleId }, transaction: t } // Inclure la transaction
            );

            if (result[0] !== 1) {
                throw new Error("Échec du Téléchargement de l'image de couverture !");
            }

            // Confirmer la transaction
            await t.commit();
            console.log('Téléchargement de l\'image de couverture réussi');

            // Renvoyer un message de succès dans la réponse JSON
            return res.status(200).json({ message: 'Téléchargement de l\'image de couverture réussi' });
        } catch (error) {
            // Annuler la transaction en cas d'erreur
            await t.rollback();
            console.error("Erreur lors du Téléchargement de l'image de couverture :", error);
            return res.status(500).json({ error: "Erreur lors du Téléchargement de l'image de couverture" });
        }
    },

}

export default articleController;