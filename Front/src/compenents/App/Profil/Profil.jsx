import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBoutique from './NavBoutique.jsx';
import VoirMesDevis from '../DashboarClientBoutique/GestionBoutique/Devis/VoirMesDevis.jsx';
import BackButton from '../../AuthSecure/BackButton.jsx';

const Profil = () => {
    const [profileData, setProfileData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [componentIsVisible, setComponentIsVisible] = useState(true);
    const handleClick = () => {
        setComponentIsVisible(!componentIsVisible);
    };
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

    const [formData, setFormData] = useState({
        avatar:"",
        nom: "",
        prenom: "",
        pseudo: "",
        email: "",
        rue: "",
        ville: "",
        code_postal: "",
        role_id: "",
        societe: "",
        statut: "",
        biographie: ""
    });
    
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    // Si le token est absent, ne pas faire de fetch
                    return;
                  }
                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/getUser`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Une erreur est survenue lors de la récupération du profil utilisateur');
                } else {
                    const data = await response.json();
                    setProfileData(data);
                    setFormData(data); // Remplir les données du formulaire avec les données du profil
                };
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        useEffect(() => {
        fetchProfile();
    }, []);
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/updateUser`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors de la mise à jour du profil utilisateur');
            }
            // Mise à jour réussie, vous pouvez effectuer des actions supplémentaires si nécessaire
            fetchProfile();
            setProfileData(formData);
            handleCloseModal();
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    const isAvatarPresent = profileData && profileData.avatar !== null && profileData && profileData.avatar !== '';
    const buttonToggle = () => {
        if ( isAvatarPresent) {
            return("Modiffier Avatar");
        }else {
            return('Ajouter Avatar');
        };
    };
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    return (
                <>
                <section className="mt-5">
                    {profileData && (
                    <NavBoutique />
                )}
                    <article className="graylogo col-md-9 mx-auto">
                    <div className="col-md-6 mx-auto">
                                {profileData ? (
                                <section className="p-1">
                                    <table className="table table-striped">
                                    <tbody>
                                        <tr>
                                        <th scope="row">Avatar :</th>
                                        <td>
                                            <img
                                            src={profileData.avatar}
                                            alt="Ma photo de Profil"
                                            style={{ width: '8rem', height: '8rem', objectFit: 'cover' }}
                                            className="img-fluid rounded-circle border border-secondary border-5 row mx-auto"
                                            aria-label="Ma photo de Profil"
                                            />
                                        </td>
                                        </tr>
                                        <tr><th scope="row">Nom :</th><td>{profileData.nom}</td></tr>
                                        <tr><th scope="row">Prénom :</th><td>{profileData.prenom}</td></tr>
                                        <tr><th scope="row">Pseudo :</th><td>{profileData.pseudo}</td></tr>
                                        <tr><th scope="row">Email :</th><td>{profileData.email}</td></tr>
                                        <tr><th scope="row">Rue :</th><td>{profileData.rue}</td></tr>
                                        <tr><th scope="row">Ville :</th><td>{profileData.ville}</td></tr>
                                        <tr><th scope="row">Code Postal :</th><td>{profileData.code_postal}</td></tr>
                                        <tr><th scope="row">Société :</th><td>{profileData.societe}</td></tr>
                                        <tr><th scope="row">Téléphone :</th><td>{profileData.telephone}</td></tr>
                                        <tr><th scope="row">N° de Siret :</th><td>{profileData.siret}</td></tr>
                                        <tr><th scope="row">Numéro de TVA :</th><td>{profileData.numero_tva}</td></tr>
                                        <tr><th scope="row">Biographie :</th><td>{profileData.biographie}</td></tr>
                                    </tbody>
                                    </table>

                                    <div className="d-flex justify-content-between gap-3">
                                        <Button onClick={handleShowModal} variant="success">
                                            Modifier
                                        </Button>
                                        <Link to={'/Ajouter/Avatar'}>
                                            <Button variant="success">{buttonToggle()}</Button>
                                        </Link>
                                    </div>
                                </section>
                                ) : (
                                    <section className='p-2'>
                                        <h1 className='text-center p-2 rounded'>Pour accéder a votre profil connectez-vous ou créez un compte</h1>
                                        <div className="d-flex justify-content-around ">
                                            <Button className='text-white fw-bold' as={Link} to="/Connexion" aria-label='Connexion' variant='success'>Connexion</Button>
                                            <Button className='text-white fw-bold' as={Link} to="/ChoixDuCompte" aria-label="Pour s'inscrire" variant='success'>Inscription </Button>
                                            <BackButton />
                                        </div>
                                    </section>
                                )}

                            <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Modifier le profil</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                    <Form.Group controlId="formNom">
                                        <Form.Label>Nom</Form.Label>
                                        <Form.Control
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPrenom">
                                        <Form.Label>Prénom</Form.Label>
                                        <Form.Control
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPseudo">
                                        <Form.Label>Pseudo</Form.Label>
                                        <Form.Control
                                        type="text"
                                        name="pseudo"
                                        value={formData.pseudo}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formRue">
                                        <Form.Label>Rue</Form.Label>
                                        <Form.Control
                                        type="text"
                                        name="rue"
                                        value={formData.rue}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formVille">
                                        <Form.Label>Ville</Form.Label>
                                        <Form.Control
                                        type="text"
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formCodePostal">
                                        <Form.Label>Code Postal</Form.Label>
                                        <Form.Control
                                        type="text"
                                        name="code_postal"
                                        value={formData.code_postal}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formSociete">
                                        <Form.Label>Société</Form.Label>
                                        <Form.Control
                                        type="text"
                                        name="societe"
                                        value={formData.societe}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formTelephone">
                                        <Form.Label>Téléphone</Form.Label>
                                        <Form.Control
                                        type="text"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formSiret">
                                        <Form.Label>N° de Siret</Form.Label>
                                        <Form.Control
                                        type="text"
                                        name="siret"
                                        value={formData.siret}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formNumero_tva">
                                        <Form.Label>Numéro de TVA</Form.Label>
                                        <Form.Control
                                        type="text"
                                        name="numero_tva"
                                        value={formData.numero_tva}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formBiographie">
                                        <Form.Label>Biographie</Form.Label>
                                        <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="biographie"
                                        value={formData.biographie}
                                        onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                    Annuler
                                    </Button>
                                    <Button variant="primary" onClick={handleUpdateProfile}>
                                    Enregistrer
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </article>
                </section>
            </>
        );
};

export default Profil;
