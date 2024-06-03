{/*  OUMESSAOUD Azzedine: oumessaoud@hotmail.fr */ }


import * as dotenv from 'dotenv'
import express from 'express'
import router from './app/router.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
//permet de Créer des fichiers Lire ,Écrire, Copier , Renommer, Supprimer des fichiers
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Je creer mon serveur et je le stock dans app
const app = express()

app.use(express.json())
// Charge toutes les variables du fichier .env dans process.env
app.use(cors()); // Utilisez le middleware cors pour autoriser les requêtes depuis tous les domaines
dotenv.config()

const sqlFilePath = './migration.sql';
const data = fs.readFileSync(sqlFilePath, 'utf8');


const port = process.env.PORT || 3000  // Defini le port selon la valeur de la variable d'environnement PORT
const dbPort = process.env.DB_PORT;    // ou le port 3000 si cette derniere est vide
console.log(`Le port de la base de données baracuda est : ${dbPort}`, __dirname);

app.use('/node_modules', express.static(__dirname + '/node_modules'));
 /* pour servir les fichier dans public */
app.use(express.static('./app/public'));

app.use(router)
app.listen(port, () => {
    console.log(`L'application deve-oume.com Dev WEb Web Mobile écoute sur le port http://localhost:${port}`)
})