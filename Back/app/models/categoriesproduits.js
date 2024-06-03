import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const Categoriesproduits = sequelize.define('Categoriesproduits', {
    categoriesproduits_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "categoriesproduits",
    timestamps: false
}
);
export default Categoriesproduits;