import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SupprimerPhotoProduit from './SupprimerPhotoProduit';
import BackButton from '../../../../AuthSecure/BackButton';

const ModiffierProduit = () => {
    const { produitId } = useParams();
    const [profileProduitData, setProfileProduitData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState( {
        produit_id: produitId,
        nom: "",
        quantite: "",
        detail: "",
        tarif: "",
        categoriesproduits_id: "",
        photo: ""
    });   
    
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    
        const fetchOneProduit = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/one/product/${produitId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Une erreur est survenue lors de la récupération du produit');
                } else {
                    const data = await response.json();
                    setProfileProduitData(data);
                    // Remplir les données du formulaire avec les données du profil
                    setFormData({
                        id: data.produit_id,
                        statut: data.produit.statut,
                        nom: data.produit.nom,
                        quantite: data.produit.quantite,
                        detail: data.produit.detail,
                        tarif: data.produit.tarif,
                        categoriesproduits_id: data.produit.categorie,
                        photo: data.produit.photos.photo
                    });
                };
            } catch (error) {
                console.error('Erreur du Fetch fetchProduit:', error);
            }
        };

        useEffect(() => {
        fetchOneProduit();
    }, [produitId]);

    
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    const handleUpdateProduit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/update/product/${produitId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors de la mise à jour du produit');
            }
            // Mise à jour réussie, vous pouvez effectuer des actions supplémentaires si nécessaire
            handleCloseModal();
            alert("vos Modifications sont prise en compte avec success");
        } catch (error) {
            console.error('Erreur lors de la mise a jour du produit :', error);
        }
    };

    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

    return (
        <>
        {profileProduitData ? (
        <section className="col-md-10 mx-auto mt-5" >
            <div className='d-flex mt-2 border border-black '>
                <div className="card col-md-3">
                    <div className="card-body">
                    <h5 className="card-title">Détails du Produit</h5>
                    <p className="card-text">
                        {/* <strong>ID : </strong>{profileProduitData.produit.produit_id}<br/>
                        <strong>Statut : </strong> {profileProduitData.produit.statut}<br /> */}
                        <strong>Nom : </strong> {profileProduitData.produit.nom}<br />
                        <strong>Quantité : </strong> {profileProduitData.produit.quantite}<br />
                        <strong>Détail : </strong> {profileProduitData.produit.detail}<br />
                        <strong>Tarif : </strong> {profileProduitData.produit.tarif}<br />
                        <strong>Catégorie : </strong> {profileProduitData.produit.categorie}<br />
                    </p>
                    
                    <div className="d-flex justify-content-center gap-2">
                        <Button onClick={handleShowModal} variant='success' className=''>Modifier</Button>          
                        <BackButton/>
                    </div>
                    </div>
                </div>    
                               
                {profileProduitData.produit.photos && profileProduitData.produit.photos.map((photo, index) => (
                        <div key={index}> {/* Assurez-vous d'avoir une clé unique pour chaque élément de la liste */}
                            <img src={photo.photo} alt={`photo ${index + 1}`} className='row col-md-9 rounded rounded-5' style={{ width: '300px', height: 'auto', margin: '5px' }} />
                            <p>{photo.image_id}</p>
                            <SupprimerPhotoProduit imageId={photo.image_id} fetchOneProduit={fetchOneProduit} />
                        </div>
                    ))}

                        
            </div>
        </section>
        ) : (
        <p>Chargement du Profil...</p>
        )}


            <Modal   show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le profil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group controlId="nom">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nom" 
                                value={formData.nom} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="quantite">
                            <Form.Label>Quantité</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="quantite" 
                                value={formData.quantite} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="detail">
                            <Form.Label>Détail</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="detail" 
                                value={formData.detail} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="tarif">
                            <Form.Label>Tarif</Form.Label>
                            <Form.Control 
                                type="number" 
                                name="tarif" 
                                value={formData.tarif} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        <Form.Group controlId="categoriesproduits_id">
                            <Form.Label>Categorie</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="categoriesproduits_id" 
                                value={formData.categoriesproduits_id} 
                                onChange={handleInputChange} 
                            />
                        </Form.Group>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleUpdateProduit}>
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Modal>

    </>
    );
};

export default ModiffierProduit;
