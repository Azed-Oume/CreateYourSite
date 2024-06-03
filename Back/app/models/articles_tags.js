import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import Article from './articles.js';
import Tags from './tags.js';

const Articles_tags = sequelize.define('Articles_Tags', {
    article_Tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Article,
            key: 'article_id'
        }
    },
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tags,
            key: 'tag_id'
        }
    }
}, {
    tableName: 'articles_tags', 
    timestamps: false
});

Article.belongsToMany(Tags, { through: Articles_tags, as: "Tags", foreignKey: "article_id" });
Tags.belongsToMany(Article, { through: Articles_tags, as: "Articles", foreignKey: "tag_id" });


export default Articles_tags;
