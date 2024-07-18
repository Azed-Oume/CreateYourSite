import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Tags = sequelize.define('Tags', {
    // Définition des attributs du tag
    tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'tags',
    timestamps: false
});


export default Tags;
