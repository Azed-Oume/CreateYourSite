import { DataTypes } from "sequelize";
import User from "./user.js";
import Article from "./articles.js";
import sequelize from "../database/database.js";

const UserArticleLove = sequelize.define('UserArticleLove', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'utilisateur_id'
        }
    },
    article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Article,
            key: 'article_id'
        }
    },
    date_love: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "userarticlelove",
    timestamps: true, // Gardez ceci pour gérer `createdAt` et `updatedAt`
    createdAt: 'date_love',
    updatedAt: false,
});

// Associer les modèles
Article.belongsToMany(User, { through: UserArticleLove, as: "Lovers", foreignKey: 'article_id' });
User.belongsToMany(Article, { through: UserArticleLove, as: "LovedArticles", foreignKey: 'utilisateur_id' });

export default UserArticleLove;
