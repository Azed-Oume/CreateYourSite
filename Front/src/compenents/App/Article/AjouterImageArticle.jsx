import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import logo from "../../images/logofondblanc.png";

const AjouterImageArticle = () => {
    const { articleId } = useParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isFileSubmitted, setIsFileSubmitted] = useState(false);
    const [userStatut, setUserStatut] = useState(3);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image_couverture', selectedFile);
        formData.append('fileName', fileName);

        if (selectedFile) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/uploade/image/article/${articleId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    setUploadProgress(100);
                    setTimeout(() => navigate("/ReadArticles"), 2000); // Attendez 2 secondes avant de rediriger
                } else {
                    console.error('Erreur lors de la requête :', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Erreur Fetch: ', error);
            }
        } else {
            alert('Aucun fichier sélectionné.');
        }
    };


    return (
        <>
        {/* {userStatut === 1 && <h1 className='fw-bold d-flex justify-content-center align-items-center' style={{ color: "#f28500" }}>En attente de validation</h1>}
            {userStatut === 2 && <h1 className='fw-bold d-flex justify-content-center align-items-center' style={{ color: "#f28500" }}>Inscription refusé</h1>}
            {userStatut == 3 && ( */}
        <div className="bg-white mx-auto mt-5 row container col-12" >
            <p align="center">
                <img
                    src={logo}
                    alt="logo de la société"
                    width="80"
                />
            </p>
            <div className="row container mt-4 col-12">
                <div className="">
                    <form onSubmit={handleFileSubmit} encType="multipart/form-data">
                        <fieldset className="border border-3 border-dark rounded-4 p-3 m-2">
                            <legend>Télécharger l'image illustrant votre article:</legend>
                            <div className="card-body text-center">
                                <div className="mb-5">
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept="image/*"
                                        name="image_couverture"
                                        onChange={handleFileChange}
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
                                disabled={!selectedFile}
                            >
                                Envoyer
                            </button>
                        </div>
                    </form>
                </div>
                {isFileSubmitted && (
                    <div className="alert alert-success mt-3" role="alert">
                        Fichier envoyé avec succès!
                    </div>
                )}
            </div>
        </div>
        {/* )}  */}
        </>
    );
};

export default AjouterImageArticle;