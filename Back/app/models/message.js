import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import User from './user.js';
import formController from '../controllers/formController.js';

const Message = sequelize.define('Message', {
    message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pseudo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sujet: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
    utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id',
            defaultValue: 1
        }
    }
}, {
    tableName: 'message',
    timestamps: false
});

// Ajout de la relation avec la table des articles
User.hasMany(Message, { foreignKey: 'utilisateur_id' });
Message.belongsTo(User, { foreignKey: 'utilisateur_id' });

export default Message;
