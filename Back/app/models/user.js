import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import bcrypt from 'bcrypt';
import Role from './role.js';

const User = sequelize.define('User', {
    utilisateur_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    societe: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Adresse e-mail invalide'
            }
        }
    },
    mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rue: {
        type: DataTypes.STRING,
    },
    ville: {
        type: DataTypes.STRING,
    },
    code_postal: {
        type: DataTypes.INTEGER,
    },
    avatar: {
        type: DataTypes.STRING,
    },
    statut: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0
    },
    date_inscription: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    biographie: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'role_id'
        }
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    siret: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numero_tva: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'utilisateurs',
    timestamps: true,
    createdAt: false,
    updatedAt: false,
});

// Ajout de l'association avec le modèle de rôle
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

// Définition de la méthode `authenticate` pour l'authentification de l'utilisateur
User.authenticate = async (email, motDePasse) => {
    try {
        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            throw new Error("Identifiants incorrects");
        }

        const passwordMatch = await bcrypt.compare(motDePasse, user.mot_de_passe);

        if (!passwordMatch) {
            throw new Error("Identifiants incorrects");
        }

        return user;
    } catch (error) {
        throw error;
    }
};
export default User;