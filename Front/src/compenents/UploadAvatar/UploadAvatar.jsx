{/*  OUMESSAOUD Azzedine: oumessaoud@hotmail.fr
*/ }

import React, { useState, useEffect } from 'react';
import logo from "../../../images/img/image.png";
import { Form, FormControl, FormGroup } from 'react-bootstrap';
import FormRange from 'react-bootstrap/esm/FormRange';

const UploadAvatar = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isFileSubmitted, setIsFileSubmitted] = useState(false);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          // Permet de savoir si le compte est validé ou pas
          const [userStatut, setUserStatut] = useState(null);
          ////
          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          // Fonction asynchrone pour récupérer le statut depuis l'API
              // Utilisation de useEffect pour appeler les fonctions de récupération des données lors du montage du composant
              useEffect(() => {
                  fetchStatut();
              }, []);
          
          const fetchStatut = async () => {
              try {
                  // Récupère le token d'authentification depuis le stockage local
                  const token = localStorage.getItem('token');
      
                  const response2 = await fetch(`${import.meta.env.VITE_URL_API}/api/me`, {
                      method: 'GET',
                      headers: {
                          'Authorization': `Bearer ${token}`,
                      },
                  });
                  if (!response2.ok) {
                      throw new Error('Erreur lors de la récupération des données de /api/me');
                  }
                  const data2 = await response2.json();
                  // Met à jour l'état local 'userStatut' avec le statut récupéré
                  setUserStatut(data2.statut);
              } catch (error) {
                  console.error(error);
              }
          };
          
          ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    const handleFileSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('avatar', selectedFile);
        formData.append('fileName', fileName); // Ajout du nom du fichier à formData
        

        if (selectedFile) {
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

                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/public/fileAvatar`, fetchOptions);
                

                if (response.ok) {
                    console.log('Téléchargemnt de l\'Avatar Reussi  :', response.status);
                
                } else if (!response.ok) {
                    console.error('Erreur lors de la requête :', response.status, response.statusText);
                }
                
                else {
                    setIsFileSubmitted(true);
                }
            } catch (error) {
                console.error('Erreur Fetch: ', error);
            }
        } else {
            alert('Aucun fichier sélectionné.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };

    return (
        <>
        {userStatut === 1 && <h1 className='fw-bold d-flex justify-content-center align-items-center' style={{ color: "#f28500" }}>En attente de validation</h1>}
            {userStatut === 2 && <h1 className='fw-bold d-flex justify-content-center align-items-center' style={{ color: "#f28500" }}>Inscription refusé</h1>}
            {userStatut == 3 && (
        <section className="bg-white mx-auto mb-3 row container mt-4 col-12">
            <p align="center">
                <img
                    src={logo}
                    alt="Handi-Vision.fr, un portail pour favoriser l'insertion"
                    width="80"
                />
            </p>
            <section className="row container mt-4 col-12">
                <div className="">
                    <Form onSubmit={handleFileSubmit} encType="multipart/form-data">
                        <fieldset className="border border-3 border-dark rounded-4 p-3 m-2">
                            <legend>Télécharger Avatar :</legend>
                            <FormGroup className="card-body text-center">
                                {/* <div className="mb-5"> */}
                                    <FormControl
                                        className="form-control"
                                        type="file"
                                        accept="image/*"
                                        name="avatar"
                                        onChange={handleFileChange}
                                    />
                                    {/* <div className="progress mt-2"> */}
                                        <FormRange
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{ width: `${uploadProgress}%` }}
                                            aria-valuenow={uploadProgress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {uploadProgress}%
                                        </FormRange>
                                    {/* </div> */}
                                {/* </div> */}
                            </FormGroup>
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
                    </Form>
                </div>
                {isFileSubmitted && (
                    <p className="alert alert-success mt-3" role="alert">
                        Fichier envoyé avec succès!
                    </p>
                )}
            </section>
        </section>
        )}
        </>
    );
};

export default UploadAvatar;