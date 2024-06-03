import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Article from './articles.js';

const Comment = sequelize.define('Comment', {
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contenu: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date_commentaire: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    auteur: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statut_commentaire: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Article,
            key: 'article_id'
        }
    }
}, {
    tableName: 'commentaires',
    timestamps: true,
    createdAt: false,
    updatedAt: false
});

// Ajout de la relation avec la table des articles
Comment.belongsTo(Article, { foreignKey: 'article_id' });
Article.hasMany(Comment, { foreignKey: 'article_id' });

export default Comment;
