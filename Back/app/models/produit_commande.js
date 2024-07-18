import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Produits from "./produit.js";
import Commande from "./commande.js";

const Produit_commande = sequelize.define('Produit_commande', {
    produit_commande_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    commande_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Commande,
            key: "commande_id"
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
    tableName: "produit_commande",
    timestamps: false
}
);

Produits.belongsToMany(Commande, { through: Produit_commande, as: "Commande", foreignKey: "produit_id" });
Commande.belongsToMany(Produits, { through: Produit_commande, as: "Produits", foreignKey: "commande_id" });


export default Produit_commande;