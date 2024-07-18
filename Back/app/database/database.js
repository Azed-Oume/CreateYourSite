{/*  OUMESSAOUD Azzedine: oumessaoud@hotmail.fr */ }


import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
    }
);

const isDbConnected = async () => {
    try {
        await sequelize.authenticate();
        console.log('La connexion à la base de données a été établie avec succès.');
    } catch (error) {
        switch (error.name) {
            case 'SequelizeConnectionError':
                console.error('Impossible d\'établir une connexion à la base de données :', error);
                break;
            case 'SequelizeAuthenticationError':
                console.error('Échec de l\'authentification. Nom d\'utilisateur ou mot de passe incorrect :', error);
                break;
            case 'SequelizeHostNotReachableError':
                console.error('L\'hôte de la base de données n\'est pas accessible :', error);
                break;
            default:
                console.error('Une erreur inattendue s\'est produite lors de la connexion à la base de données :', error);
        }
    }
}
isDbConnected();
export default sequelize;


// const isDbConnected = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('La connexion à la base de données est établie avec succès... YESS');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// }