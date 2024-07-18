import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import User from "./user.js";

const Facture = sequelize.define("Facture", {
    facture_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_facture: {
        type: DataTypes.STRING,
        allowNull:false
    },
    nom_client: {
        type: DataTypes.STRING,
        allowNull:false
    },
    date_facture: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    date_echeance: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    montant_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    detail_projet: {
        type: DataTypes.STRING,
        allowNull:true
    },
    mode_paiement: {
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue: "Carte Bancaire"
    },
    statut_facture: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    information_paiement: {
        type: DataTypes.INTEGER,
        allowNull: true
        
    },
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "utilisateur_id"
        }
    }
},{
    tableName: "facture",
    timestamps: false
}
);
export default Facture;

Facture.belongsTo(User, {foreignKey: "utilisateur_id"});
User.hasMany(Facture, {foreignKey: "utilisateur_id"});