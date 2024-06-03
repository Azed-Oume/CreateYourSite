import React, { useState } from 'react';
import logo from "../images/logofondblanc.png";
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AjouterPhotoPortfolio = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isFileSubmitted, setIsFileSubmitted] = useState(false);

    
    const role = localStorage.getItem('role');

    const handleFileSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("portfolio", file);
        });

        try {
            let progress = 0;
            const interval = setInterval(() => {
                if (progress >= 100) {
                    clearInterval(interval);
                } else {
                    progress += 10;
                    setUploadProgress(progress);
                }
            }, 100);

            const token = localStorage.getItem('token');
            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            };

            const response = await fetch(`http://localhost:3000/api/images/`, fetchOptions);

            if (response.ok) {
                console.log('Téléchargement des photos réussi :', response.status);
                setIsFileSubmitted(true);
                setTimeout(() => {
                    window.location.href = "/portfolio";
                }, 3000); // Délai de 3 secondes avant la redirection
            } else {
                console.error('Erreur lors du Téléchargement des photos :', response.status, response.statusText);
            }
        } catch (error) {
            console.log('Erreur du Fetch lors du Téléchargement des photos : ', error);
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            setSelectedFiles(Array.from(files));
        }
    };

    return (
        <div className="container graylogo p-4 rounded-4 mx-auto mt-5">
            {role === "1" ? (
                <>
                <h1 className="text-center mb-4">Ajouter des Photos à Votre Portfolio</h1>
                <div className="row justify-content-center">
                    <div className="col-md-6 bg-white p-4 rounded">
                        <img
                            src={logo}
                            alt="Logo"
                            className="mx-auto d-block mb-4"
                            width="80"
                        />
                        <Form onSubmit={handleFileSubmit} encType="multipart/form-data">
                            <fieldset className="border border-3 border-dark rounded-4 p-3">
                                <legend className="text-center">Télécharger les Photos :</legend>
                                <div className="card-body text-center">
                                    <div className="mb-4">
                                        <label htmlFor="portfolio-upload" className="form-label">Sélectionner des fichiers :</label>
                                        <input
                                            id="portfolio-upload"
                                            className="form-control mb-3"
                                            type="file"
                                            accept="image/*"
                                            name="portfolio"
                                            onChange={handleFileChange}
                                            multiple
                                        />
                                        <div className="progress mt-3" aria-live="polite">
                                            <div
                                                className="progress-bar bg-success"
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
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={selectedFiles.length === 0}
                                >
                                    Envoyer
                                </button>
                            </div>
                        </Form>
                        {isFileSubmitted && (
                            <div className="alert alert-success mt-3" role="alert">
                                Fichier envoyé avec succès!
                            </div>
                        )}
                    </div>
                </div>
                </>
        ) : (
            <div>
                <h1 className="p-2 rounded mb-4 text-center">Section résérver a l'Administrateur</h1>
                <section className='p-2 m-5'>
                    <h1 className='text-center p-2 rounded'>Connectez-vous ou créez un compte Administrateur</h1>
                    <div className="d-flex justify-content-center gap-5">
                    <Button className='text-white fw-bold' as={Link} to="/Connexion" aria-label='Connexion' >Connexion</Button>
                    <Button className='text-white fw-bold' as={Link} to="/Inscription" aria-label="Pour s'inscrire">Inscription </Button>
                    </div>
                </section>
            </div>
        )}
            
        </div>
    );
};

export default AjouterPhotoPortfolio;
