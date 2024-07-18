import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import logo from "../images/logofondblanc.png";
import ReserveForAdmin from '../AuthSecure/ReserveForAdmin';

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
            if (!token) {
                // Si le token est absent, ne pas faire de fetch
                return;
              }
            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            };

            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/images`, fetchOptions);

            if (response.ok) {
                setIsFileSubmitted(true);
                setTimeout(() => {
                    window.location.href = "/portfolio";
                }, 3000); // Délai de 3 secondes avant la redirection
            } else {
                console.error('Erreur lors du Téléchargement des photos :', response.status, response.statusText);
            }
        } catch (error) {
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            setSelectedFiles(Array.from(files));
        }
    };

    return (
        <section className="container graylogo p-4 rounded-4 mx-auto mt-5">
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
            <ReserveForAdmin/>
        )}
            
        </section>
    );
};

export default AjouterPhotoPortfolio;
