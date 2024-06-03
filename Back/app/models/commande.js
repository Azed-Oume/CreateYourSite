import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import User from "./user.js";
import Facture from "./facture.js";
// import Facture from "./facture.js";

const Commande = sequelize.define("Commande", {
    commande_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_commande: {
        type: DataTypes.STRING,
        allowNull:false
    },
    nom_client: {
        type: DataTypes.STRING,
        allowNull:false
    },
    date_commande:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    validite_commande: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detail_projet: {
        type: DataTypes.STRING,
        allowNull: true
    },
    statut_commande: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 1
    },
    utilisateur_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "utilisateur_id"
        }
    },
    facture_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Facture,
            key: "facture_id"
        }
    },
    vendu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false // Valeur par défaut
    }
},{
    tableName: "commande",
    timestamps: false
}
);
export default Commande;

Commande.belongsTo(User, {foreignKey: "utilisateur_id"});
User.hasMany(Commande, {foreignKey: "utilisateur_id"});
Commande.belongsTo(Facture, {foreignKey: "facture_id"});
Facture.hasMany(Commande, {foreignKey: "facture_id"});