import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Category = sequelize.define('Category', {
    categorie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'categoriesarticles',
    timestamps: false
});

export default Category;
