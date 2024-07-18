import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Categoriesproduits from "./categoriesproduits.js";


const Produits = sequelize.define("Produits", {
    produit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantite: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    detail: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tarif: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    statut: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1

    },
    categoriesproduits_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categoriesproduits,
            key: "categoriesproduits_id"
        }
    }
}, {
    tableName: "produit",
    timestamps: false
}
);
export default Produits;


Produits.belongsTo(Categoriesproduits, {foreignKey: "categoriesproduits_id"});
Categoriesproduits.hasMany(Produits, {foreignKey: "categoriesproduits_id"});