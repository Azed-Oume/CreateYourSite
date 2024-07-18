// OUMESSAOUD Azzedine: oumessaoud@hotmail.fr

import multer from 'multer';
// import path from 'path';
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// C:\COUR\TOUT-MES-REPO\Oume-Azed\Back\app\public\fileAvatar
const storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "C:/COUR/TOUT-MES-REPO/CreateYourSite/Back/app/public/fileAvatar"); // Le dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
        // Utilisation d'un préfixe pour différencier les fichiers des Utilisateurs.
        const uniquePrefix = 'utilisateur-';
        // Générez un nom de fichier unique, par exemple, en ajoutant une horodatage
        cb(null, uniquePrefix + Date.now() + '-' + file.originalname);
    },
});

export const uploadImage = multer({ storage: storageImage });
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


const storageImageArticle = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "C:/COUR/TOUT-MES-REPO/CreateYourSite/Back/app/public/imageArticle"); // Le dossier où les fichiers seront stockés
    },          
    // 
    filename: function (req, file, cb) {
        // Utilisation d'un préfixe pour différencier les fichiers d'entreprise.
        const uniquePrefix = 'Article-';
        // Générez un nom de fichier unique, par exemple, en ajoutant une horodatage
        cb(null, uniquePrefix + Date.now() + '-' + file.originalname);
    }
  });
  
 export const uploadImageArticle = multer({ storage: storageImageArticle });
 //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  

 const storagePhotoProduit =multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "C:/COUR/TOUT-MES-REPO/CreateYourSite/Back/app/public/photoProduit");
    },
    filename: function(req, file, cb) {
        const uniquePrefix = "photo-produit";
        cb(null, uniquePrefix + Date.now() + '_' + file.originalname);
    }
 });
 export const uploadPhotoProduit = multer({ storage: storagePhotoProduit });
 //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// C:\COUR\TOUT-MES-REPO\Oume-Azed\Back\app\public\fileAvatar
const storagePortfolio = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "C:/COUR/TOUT-MES-REPO/CreateYourSite/Back/app/public/imagePortfolio"); // Le dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
        // Utilisation d'un préfixe pour différencier les fichiers des Utilisateurs.
        const uniquePrefix = 'portfolio-';
        // Générez un nom de fichier unique, par exemple, en ajoutant une horodatage
        cb(null, uniquePrefix + Date.now() + '-' + file.originalname);
    },
});

export const uploadPortfolio = multer({ storage: storagePortfolio });
 //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

 const storagePhotosPortfolio =multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "C:/COUR/TOUT-MES-REPO/CreateYourSite/Back/app/public/imagePortfolio");
    },
    filename: function(req, file, cb) {
        const uniquePrefix = "photo-portfolio";
        cb(null, uniquePrefix + Date.now() + '_' + file.originalname);
    }
 });
 export const uploadPhotosPortfolio = multer({ storage: storagePhotosPortfolio });

