import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Category from './categories.js';
import User from './user.js';


const Article = sequelize.define('Article', {
    article_id: {
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
    date_publication: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    auteur: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statut_publication: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    vues: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    image_couverture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    categorie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'category_id'
        }
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'utilisateur_id'
        }
    },
    love: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {
    tableName: 'articles',
    timestamps: false
});



Article.belongsTo(Category, { foreignKey: 'categorie_id' });
Category.hasMany(Article, { foreignKey: 'categorie_id' });

Article.belongsTo(User, { foreignKey: 'utilisateur_id' });
User.hasMany(Article, { foreignKey: 'utilisateur_id' });


export default Article;
