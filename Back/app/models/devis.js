import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Facture from "./facture.js";
import User from "./user.js";


const Devis = sequelize.define('Devis', {
    devis_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_devis: {
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    nom_client: {
        type: DataTypes.STRING,
        allowNull:false
    },
    date_devis: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    validite_devis: {
        type: DataTypes.STRING,
        allowNull: false
    },
    detail_projet: {
        type: DataTypes.STRING,
        allowNull: true
    },
    statut_devis: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    utilisateur_id: {
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
    tableName: "devis",
    timestamps: false
}
);
export default Devis;

Devis.belongsTo(User, {foreignKey: "utilisateur_id"});
User.hasMany(Devis, {foreignKey: "utilisateur_id"});
Devis.belongsTo(Facture, {foreignKey: "facture_id"});
Facture.hasMany(Devis, {foreignKey: "facture_id"});