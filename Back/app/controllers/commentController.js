import Article from '../models/articles.js';
import Comment from '../models/commentaires.js';
import User from '../models/user.js';
import sequelize from '../database/database.js';

const commentController = {

    setComment: async function (req, res) {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        // console.log(req.body, "en ligne 10 XXXXXXXXXXXXXXXXXXXXXX");
        try {
            // Récupération des données de la requête
            const { titre, contenu, article_id } = req.body;
    
            // Vérification de l'existence de l'article
            const article = await Article.findByPk(article_id, { transaction: t });
            // console.log(article, "en ligne 17 XXXXXXXXXXXX");
            if (!article) {
                // Annulation de la transaction et envoi d'un message d'erreur si l'article n'existe pas
                await t.rollback();
                return res.status(400).json({ message: "L'article n'existe pas" });
            }
            
            // Récupération de l'ID de l'utilisateur à partir du token décodé par le middleware jwtGuard
            const utilisateur_id = req.user.utilisateur_id;
            console.log(utilisateur_id, " en ligne 26 XXXXXXXXXXXXXX");
            // Récupération du pseudo de l'utilisateur à partir de son ID
            const utilisateur = await User.findByPk(utilisateur_id, { transaction: t });
            if (!utilisateur) {
                // Annulation de la transaction et envoi d'un message d'erreur si l'utilisateur n'existe pas
                await t.rollback();
                return res.status(400).json({ message: "L'utilisateur n'existe pas" });
            }
            const auteur = utilisateur.pseudo;
    
            // Création du Commentaire dans la base de données avec l'ID de l'article
            const nouveauCommentaire = await Comment.create({
                titre: titre,
                contenu: contenu,
                auteur: auteur,
                utilisateur_id: utilisateur_id,
                article_id: article_id
                // Ajoutez d'autres attributs si nécessaire
            }, { transaction: t });
    
            // Validation de la transaction
            await t.commit();
    
            // Réponse avec l'article créé
            res.status(201).json({ message: 'Commentaire créé avec succès', comment: nouveauCommentaire });
        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur lors de la création du Commentaire :', error);
            // Annulation de la transaction en cas d'erreur et envoi d'un message d'erreur
            await t.rollback();
            res.status(500).json({ message: 'Une erreur est survenue lors de la création du commentaire' });
        }
    },
    
    




    getComment: async function (req, res) {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            // Récupérer les commentaires à partir de la base de données (supposons que la variable Comment est déjà définie)
            // Vérifier si des commentaires existent
            if (Comment && Comment.length > 0) {
                // Formater les commentaires selon les besoins
                Comment = Comment.map(comment => ({
                    id: comment.id,
                    titre: comment.titre,
                    contenu: comment.contenu,
                    auteur: comment.auteur,
                    date_commentaire: comment.date_commentaire,
                    // Ajoutez d'autres champs si nécessaire
                }));
            }
    
            // Validation de la transaction
            await t.commit();
    
            // Envoyer une réponse avec les commentaires formatés
            res.status(200).json({ Comment: Comment });
        } catch (error) {
            // Gérer les erreurs de récupération des commentaires
            console.error('Erreur lors de la récupération des commentaires :', error);
            // Annulation de la transaction en cas d'erreur et envoi d'un message d'erreur
            await t.rollback();
            res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des commentaires', error });
        }
    },
    
    // deleteComment: async function (req, res) {
    //     const t = await sequelize.transaction(); // Début de la transaction Sequelize
    //     try {
    //         const { articleId } = req.body;
    //         const { commentId } = req.body;
    //         const utilisateur_id = req.user.utilisateur_id;
            
    //         // Suppression des commentaires liés à l'article s'ils existent
    //         if (await Comment.findOne({ where: { article_id: articleId } })) {
    //             await Comment.destroy({ where: { comment_id: commentId }, transaction: t });
    //         }
    
    //         // Validation de la transaction
    //         await t.commit();
    
    //         // Envoyer une réponse indiquant que le commentaire a été supprimé avec succès
    //         res.status(200).json({ message: 'Commentaire supprimé avec succès' });
    //     } catch (error) {
    //         // Gérer les erreurs survenues lors de la suppression du commentaire
    //         console.error('Erreur lors de la suppression du Commentaire :', error);
    //         // Annulation de la transaction en cas d'erreur et envoi d'un message d'erreur
    //         await t.rollback();
    //         res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du Commentaire' });
    //     }
    // },
    
    deleteComment: async function (req, res) {
        const t = await sequelize.transaction(); // Début de la transaction Sequelize
        try {
            const { articleId, commentId } = req.body; // Destructuration des IDs depuis le corps de la requête
            const utilisateur_id = req.user.utilisateur_id; // Récupération de l'ID de l'utilisateur connecté depuis le token
    
            // Récupérer le pseudo de l'utilisateur connecté
            const utilisateur = await User.findByPk(utilisateur_id, { transaction: t });
            if (!utilisateur) {
                await t.rollback();
                return res.status(400).json({ message: "L'utilisateur n'existe pas" });
            }
            const auteur = utilisateur.pseudo;
    
            // Vérifier si le commentaire existe, appartient à l'utilisateur connecté, et est lié à l'article
            const comment = await Comment.findOne({ 
                where: { comment_id: commentId, auteur: auteur, article_id: articleId }, 
                transaction: t 
            });
            if (!comment) {
                await t.rollback(); // Annuler la transaction si le commentaire n'est pas trouvé ou ne satisfait pas les conditions
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce commentaire" });
            }
    
            // Suppression du commentaire
            await Comment.destroy({ where: { comment_id: commentId }, transaction: t });
    
            // Validation de la transaction
            await t.commit();
    
            // Envoyer une réponse indiquant que le commentaire a été supprimé avec succès
            res.status(200).json({ message: 'Commentaire supprimé avec succès' });
        } catch (error) {
            // Gérer les erreurs survenues lors de la suppression du commentaire
            console.error('Erreur lors de la suppression du Commentaire :', error);
            // Annulation de la transaction en cas d'erreur et envoi d'un message d'erreur
            await t.rollback();
            res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du Commentaire' });
        }
    },
    
    

}

export default commentController;