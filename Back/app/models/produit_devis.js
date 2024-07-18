import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Produits from "./produit.js";
import Devis from "./devis.js";

const Produit_devis = sequelize.define('Produit_devis', {
    produit_devis_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    devis_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Devis,
            key: "devis_id"
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
    tableName: "produit_devis",
    timestamps: false
}
);


Devis.belongsToMany(Produits, { through: Produit_devis, as: "Produits", foreignKey: "devis_id" });
Produits.belongsToMany(Devis, { through: Produit_devis, as: "Devis", foreignKey: "produit_id" });


export default Produit_devis;