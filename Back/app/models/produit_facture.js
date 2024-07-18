import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Produits from "./produit.js";
import Facture from "./facture.js"; 

const Produit_facture = sequelize.define('Produit_facture', {
    facture_produit_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    facture_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Facture,
            key: "facture_id"
        }
    },
    produit_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produits,
            key: "produit_id"
        }
    },    
    quantite: {
        type: DataTypes.INTEGER,
        allowNull: false // Vous pouvez ajuster cela selon vos besoins
    }
},{
    tableName: "produit_facture",
    timestamps: false
}
);

Produits.belongsToMany(Facture, { through: Produit_facture, as: "Facture", foreignKey: "produit_id" });
Facture.belongsToMany(Produits, { through: Produit_facture, as: "Produits", foreignKey: "facture_id" });


export default Produit_facture;