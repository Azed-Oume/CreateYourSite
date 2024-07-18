

import path from 'path'
import fs from 'fs';
import User from '../models/user.js';
import Company from '../models/company.js';

const uploadController = {

    uploadFile: async function (req, res) {
        if (req.file) {
            console.log('Fichier téléchargé :', req.file);
            const fileName = req.file.filename;

            // Récupérez l'ID de l'utilisateur ou tout autre moyen d'identifier l'utilisateur que vous souhaitez mettre à jour
            const userId = req.user.id; // Utilisez votre propre méthode d'authentification pour obtenir l'ID de l'utilisateur

            try {
                // Mettez à jour le champ rqth pour l'utilisateur spécifié
                const updatedUser = await User.update(
                    { rqth: fileName },
                    {
                        where: { id: userId },
                    }
                );
                res.status(200).json("Mise a jour du fichiers RQTH réussis")
                console.log('Mise a jour du fichiers RQTH réussis');

            } catch (error) {
                console.error('Erreur lors de la mise à jour du champ "rqth" :', error);
            }
        } else {
            console.log('Aucun fichier téléchargé.');
        }
    },

    getFile: async function (req, res) {
        const candidatId = req.params.candidatId;

        const user = await User.findByPk(candidatId);
        const completpath = "C:/COUR/MES-REPOS-GITHUB/PROJET-TUTORET/STAGE SIGMA-VISION/handi-vision.fr/back/app/public/uploads"
        const filePath = path.join(completpath, user.rqth); // Chemin du fichier sur le serveur

        // Vérifiez si le fichier existe
        if (!fs.existsSync(filePath)) {
            //return res.status(404).send('Fichier non trouvé');
            res.status(404).json({message:'Fichier non trouvé'})
            //return;
        }

        // Renvoyez le fichier en réponse
        res.download(filePath, user.rqth, (err) => {
            if (err) {
                console.error("Erreur lors de l'envoi du fichier :", err);
                //return res.status(500).send('Erreur lors de l\'envoi du fichier');
                res.status(500).json({message:'Erreur lors de l\'envoi du fichier'})

            }
        });
    },



    fileCandidature: async function (req, res) {
        if (req.files) {
            console.log('Fichier(s) téléchargé(s) :', req.files);
    
            const cvFile = req.files['cv'];
            const ltmFile = req.files['lettreMotivation'];
    
            const userId = req.user.id; // Obtenez l'ID de l'utilisateur (via l'authentification)
    
            try {
                if (cvFile && ltmFile) {
                    // Si les deux fichiers sont téléchargés
                    const cvFileName = cvFile[0].filename;
                    const ltmFileName = ltmFile[0].filename;
    
                    const cvFileURL = `http://localhost:3000/fileCandidature/${cvFileName}`;
                    const ltmFileURL = `http://localhost:3000/fileCandidature/${ltmFileName}`;
    
                    // Mettre à jour la base de données pour les deux fichiers
                    await User.update(
                        {
                            cv: cvFileURL,
                            lettre_motivation: ltmFileURL,
                        },
                        {
                            where: { id: userId },
                        }
                    );
    
                    res.status(200).json('Mise à jour des fichiers CV et Lettre de Motivation réussie');
                } else if (cvFile) {
                    // Si seulement le fichier 'cv' est téléchargé
                    const cvFileName = cvFile[0].filename;
                    const cvFileURL = `http://localhost:3000/fileCandidature/${cvFileName}`;
    
                    // Mettre à jour la base de données pour le fichier 'cv' uniquement
                    await User.update(
                        {
                            cv: cvFileURL,
                        },
                        {
                            where: { id: userId },
                        }
                    );
    
                    res.status(200).json('Mise à jour du fichier CV réussie');
                } else if (ltmFile) {
                    // Si seulement le fichier 'lettreMotivation' est téléchargé
                    const ltmFileName = ltmFile[0].filename;
                    const ltmFileURL = `http://localhost:3000/fileCandidature/${ltmFileName}`;
    
                    // Mettre à jour la base de données pour le fichier 'lettreMotivation' uniquement
                    await User.update(
                        {
                            lettre_motivation: ltmFileURL,
                        },
                        {
                            where: { id: userId },
                        }
                    );
    
                    res.status(200).json('Mise à jour du fichier Lettre de Motivation réussie');
                }
            } catch (error) {
                console.error('Erreur lors de la mise à jour des fichiers :', error);
                res.status(500).json('Une erreur est survenue lors de la mise à jour des fichiers');
            }
        } else {
            console.log('Aucun fichier téléchargé.');
            res.status(400).json('Aucun fichier téléchargé');
        }
    },
    



    // getFileAvatar: async function (req, res) {
    //     const userId = req.params.userId;

    //     const user = await User.findByPk(userId);

        // const completpath = "C:/COUR/MES-REPOS-GITHUB/PROJET-TUTORET/TUTORAT/HANDI-VISION/back/app/fileAvatar"
        // const filePath = path.join(completpath, user.avatar); // Chemin du fichier sur le serveur

        // // Vérifiez si le fichier existe
        // if (!fs.existsSync(filePath)) {
        //     //return res.status(404).send('Fichier non trouvé');
        //     res.status(404).json({message:'Fichier non trouvé'})
        //     return;
        // }

        // // Renvoyez le fichier en réponse
        // res.download(filePath, user.avatar, (err) => {
        //     if (err) {
        //         console.error("Erreur lors de l'envoi du fichier :", err);
        //         //return res.status(500).send('Erreur lors de l\'envoi du fichier');
        //         res.status(500).json({message:'Erreur lors de l\'envoi du fichier'})

        //     }
            
        // });
    //res.json({path: filePath})
    // res.json({avatar:user.avatar})
    // },


     fileAvatar: async function (req, res) {
        if (req.file) {
            console.log('Fichier téléchargé :', req.file);
            const fileName = req.file.filename;
    
            // Formez l'URL directe vers le fichier téléchargé
            const fileURL = `http://localhost:3000/fileAvatar/${fileName}`; // Modifier avec l'URL correcte
            // "C:\COUR\MES-REPOS-GITHUB\PROJET-TUTORET\TUTORAT\HANDI-VISION\back\app\public\fileAvatar"
            // Récupérez l'ID de l'utilisateur
            const userId = req.user.id;
    
            try {
                // Mettez à jour le champ "avatar" pour l'utilisateur spécifié avec l'URL directe
                const updatedUser = await User.update(
                    { avatar: fileURL },
                    { where: { id: userId } }
                );
                // res.status(200).json("Mise a jour de l\'Avatar réussis")
                console.log('Mise a jour de l\'Avatar réussis');
                console.log('Champ "avatar" mis à jour pour l\'utilisateur.');
    
                // Renvoyer l'URL directe du fichier téléchargé en réponse
                res.status(200).json({ fileURL }); // Renvoie l'URL directe dans la réponse JSON
            } catch (error) {
                console.error('Erreur lors de la mise à jour du champ "avatar" :', error);
                res.status(500).json({ error: 'Erreur lors de la mise à jour du champ "avatar"' });
            }
        } else {
            console.log('Aucun fichier téléchargé.');
            res.status(400).json({ error: 'Aucun fichier téléchargé' });
        }
    },


    getFileAvatarEntreprise: async function (req, res) {
        const companyId = req.params.CompanyId;
    
        // Cherche l'entreprise par son ID
        const company = await Company.findByPk(companyId);
    
        // Vérifie si l'entreprise existe
        if (!company) {
            res.status(404).json({ message: 'Entreprise non trouvée' });
            return;
        }
    
        // Obtient le chemin complet du fichier avatar de l'entreprise
        const completpath = "C:/COUR/MES-REPOS-GITHUB/PROJET-TUTORET/STAGE SIGMA-VISION/handi-vision.fr/back/app/public/fileAvatarEntreprise";
                            
        const filePath = path.join(completpath, company.avatar);
        console.log("L.224 : ",filePath)
        // Vérifie si le fichier existe sur le serveur
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'Fichier non trouvé' });
            return;
        }
    
        // Télécharge le fichier en réponse
        res.download(filePath, company.avatar, (err) => {
            if (err) {
                console.error("Erreur lors de l'envoi du fichier :", err);
                res.status(500).json({ message: 'Erreur lors de l\'envoi du fichier' });
            }
        })
    },
    

    fileAvatarEntreprise: async function (req, res) {
        if (req.file) {
            console.log(req.headers.id, "ligne 289 en backend");
            console.log('Fichier téléchargé :', req.file);
            const fileName = req.file.filename;
    
            const fileURL = `http://localhost:3000/fileAvatarEntreprise/${fileName}`;
            const userId = req.user.id;
    
            try {
                // Récupère toutes les entreprises associées à cet utilisateur
                const userCompanies = await Company.findByPk(req.headers.id );
    
                // Vérifie si des entreprises sont trouvées pour cet utilisateur
                if (!userCompanies || userCompanies.length === 0) {
                    console.error('Aucune entreprise trouvée pour cet utilisateur.');
                    return res.status(404).json({ error: 'Aucune entreprise trouvée pour cet utilisateur' });
                }
    
                await Company.update({ avatar: fileURL }, { where: { id: req.headers.id } });
    
                console.log('Champ "avatar" mis à jour pour les entreprises.');
    
                res.status(200).json({ fileURL }); // Renvoie l'URL directe dans la réponse JSON
            } catch (error) {
                console.error('Erreur lors de la mise à jour du champ "avatar" :', error.message);
                res.status(500).json({ error: 'Erreur lors de la mise à jour du champ "avatar"' });
            }
        } else {
            console.log('Aucun fichier téléchargé.');
            res.status(400).json({ error: 'Aucun fichier téléchargé' });
        }
    },


    }

    export default uploadController;

