import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Produits from "./produit.js";

const Image = sequelize.define("Image", {
    image_id: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    photo: {
        type:DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    },
    produit_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produits,
            key: "produit_id"
        }
    }
 }, {
    tableName: "image",
    timestamps: false
});
export default Image;

Image.belongsTo(Produits, {foreignKey: "produit_id"});
Produits.hasMany(Image, {foreignKey: "produit_id"});