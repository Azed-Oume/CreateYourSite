import { DataTypes } from "sequelize";
import User from "./user";
import Article from "./articles";
import { combineTableNames } from "sequelize/lib/utils";



const UserArticleLove = sequelize.define('UserArticleLove', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        utilisateur_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        article_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date_love: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
    tableName: "UserArticleLove",
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    });

  UserArticleLove.associate = function(models) {
    UserArticleLove.belongsTo(models.User, { foreignKey: 'utilisateur_id' });
    UserArticleLove.belongsTo(models.Article, { foreignKey: 'article_id' });
  };

export default UserArticleLove;
