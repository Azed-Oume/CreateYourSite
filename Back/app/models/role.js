

import { Model, DataTypes } from 'sequelize';
import sequelize from "../database/database.js";


const Role = sequelize.define('role', {
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING(60),
        allowNull: false
    },

}, {

    tableName: 'role', // on peut demander à sequelize de ranger les infos liées à ce modèle dans la table de notre choix

    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,

    // // If don't want createdAt
    // createdAt: false,

    // // If don't want updatedAt
    // updatedAt: false,

});

export default Role;