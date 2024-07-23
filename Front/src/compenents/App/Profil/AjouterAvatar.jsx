import React, { useState, useEffect } from 'react';
import { Form, FormGroup, FormLabel, FormControl, Button, ProgressBar, Alert } from 'react-bootstrap';
import BackButton from '../../AuthSecure/BackButton';
import logo from "../../images/logofondblanc.png";

const AjouterAvatar = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isFileSubmitted, setIsFileSubmitted] = useState(false);
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
          // Permet de savoir si le compte est validé ou pas
          const [userStatut, setUserStatut] = useState(null);
          const [userAvatar, setUserAvatar] = useState(null);
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
          // Fonction asynchrone pour récupérer le statut depuis l'API
              // Utilisation de useEffect pour appeler les fonctions de récupération des données lors du montage du composant
              useEffect(() => {
                  fetchStatut();
              }, []);
          
          const fetchStatut = async () => {
              try {
                  // Récupère le token d'authentification depuis le stockage local
                  const token = localStorage.getItem('token');
      
                  const response2 = await fetch(`${import.meta.env.VITE_URL_API}/api/getUser`, {
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
                  setUserAvatar(data2.avatar);
              } catch (error) {
                  console.error(error);
              }
          };
          console.log(userAvatar, " en ligne 46 XXXXXXXXXXXXXXXXXXXXXXX");
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

    const handleFileSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('avatar', selectedFile);
        formData.append('fileName', fileName); // Ajout du nom du fichier à formData
        formData.append('userAvatar', userAvatar);

        if (selectedFile) {
            try {
                for (let i = 0; i <= 100; i += 10) {
                    setTimeout(() => setUploadProgress(i), 1000);
                }

                const token = localStorage.getItem('token');
                const fetchOptions = {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                };

                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/update/avatar`, fetchOptions);
                

                if (response.ok) {
                    setIsFileSubmitted(true);
                    setTimeout(() => {
                        window.location.href = "/Profil";
                    }, 3000); // Délai de 3 secondes avant la redirection
                } else {
                    console.error('Erreur lors de la requête :', response.status, response.statusText);
                }
                
            } catch (error) {
                console.error('Erreur Fetch: ', error);
            }
        } else {
            console.error('Aucun fichier sélectionné.');
        }
    };

    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
        }
    };
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

    return (
        <>
        {userStatut === 1 && <h1 className='fw-bold d-flex justify-content-center align-items-center' style={{ color: "#f28500" }}>En attente de validation</h1>}
            {userStatut === 2 && <h1 className='fw-bold d-flex justify-content-center align-items-center' style={{ color: "#f28500" }}>Inscription refusé</h1>}
            {userStatut == 3 && (
        <section className="bg-white mx-auto mt-5 row container col-12" >
            <div align="center">
                <img
                    src={logo}
                    alt="Handi-Vision.fr, un portail pour favoriser l'insertion"
                    width="80"
                />
            </div>
                    <Form onSubmit={handleFileSubmit} encType="multipart/form-data">
                        <fieldset className="border border-3 border-dark rounded-4 p-3 m-2">
                            <legend>Télécharger Avatar :</legend>
                            <FormGroup>
                                <FormLabel>Avatar</FormLabel>
                                    <FormControl
                                        className="form-control"
                                        type="file"
                                        accept="image/*"
                                        name="avatar"
                                        onChange={handleFileChange}
                                    />
                                    </FormGroup>
                                    <FormGroup>
                                        <ProgressBar
                                            className="progress progress-bar"
                                            role="progressbar"
                                            style={{ width: `${uploadProgress}%` }}
                                            aria-valuenow={uploadProgress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        />
                                            {uploadProgress}%
                                        
                                    </FormGroup>
                        </fieldset>
                        <FormGroup className="d-flex justify-content-around text-center m-3">
                            <Button
                                className=""
                                type="submit"
                                disabled={!selectedFile}
                            >
                                Envoyer
                            </Button>
                            <BackButton/>
                        </FormGroup>
                    </Form>
                {isFileSubmitted && (
                    <Alert className="alert alert-success mt-3" role="alert">
                        Fichier envoyé avec succès!
                    </Alert>
                )}
        </section>
        )}
      </>
    );
};

export default AjouterAvatar;