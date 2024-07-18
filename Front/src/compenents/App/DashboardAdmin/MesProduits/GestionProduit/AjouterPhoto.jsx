{/*  OUMESSAOUD Azzedine: oumessaoud@hotmail.fr
*/ }

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import logo from "../../../../images/logofondblanc.png";
import { Form } from 'react-bootstrap';

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const AjouterPhoto = () => {
    const { produitId } = useParams();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isFileSubmitted, setIsFileSubmitted] = useState(false);

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        selectedFiles.forEach((file, index) => {
            formData.append("photos", file); // Utilisation d'un index pour chaque fichier
        });

        try {
            for (let i = 0; i <= 100; i += 10) {
                setTimeout(() => setUploadProgress(i), 1000);
            }

            const token = localStorage.getItem('token');
            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            };

            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/photos/${produitId}`, fetchOptions);
            
            if (response.ok) {
                window.location.href = "/VoirMesProduits";
            } else {
                console.error('Erreur lors du Téléchargement des photos :', response.status, response.statusText);
            }

            setIsFileSubmitted(true);
        } catch (error) {
            alert('Erreur du Fetch lors du Téléchargement des photos : ', error);
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            setSelectedFiles(Array.from(files)); // Convertit la liste de fichiers en un tableau
        }
    };

    return (
        <div style={{marginTop:"120px"}}>
            <div className="bg-white mx-auto mb-3 row container mt-4 col-12" >
            <p align="center">
                <img
                    src={logo}
                    alt="Handi-Vision.fr, un portail pour favoriser l'insertion"
                    width="80"
                />
            </p>
                {/* Le reste du contenu reste inchangé */}
                <div className="" >
                    <Form onSubmit={handleFileSubmit} encType="multipart/form-data">
                        <fieldset className="border border-3 border-dark rounded-4 p-3 m-2">
                            <legend>Télécharger Les Photos :</legend>
                            <div className="card-body text-center">
                                <div className="mb-5">
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept="image/*"
                                        name="photo"
                                        onChange={handleFileChange}
                                        multiple // Permet de sélectionner plusieurs fichiers
                                    />
                                    <div className="progress mt-2">
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{ width: `${uploadProgress}%` }}
                                            aria-valuenow={uploadProgress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {uploadProgress}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div className="text-center mt-3">
                            <button
                                className="btn btn-primary mb-3"
                                type="submit"
                                disabled={selectedFiles.length === 0}
                            >
                                Envoyer
                            </button>
                        </div>
                    </Form>
                </div>
                {isFileSubmitted && (
                    <div className="alert alert-success mt-3" role="alert">
                        Fichier envoyé avec succès!
                    </div>
                )}
            </div>
        </div>
    );
};

export default AjouterPhoto;
