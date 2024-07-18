import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const SupprimerProduit = ({ produitId, fetchProduits }) => {
    const [showModal, setShowModal] = useState(false);

    // Fonction pour ouvrir la modal
    const handleShowModal = () => setShowModal(true);

    // Fonction pour fermer la modal
    const handleCloseModal = () => setShowModal(false);

    // Fonction pour supprimer le produit
    const handleDeleteProduit = async () => {
        try {
            const token = localStorage.getItem('token');
            const fetchOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            };
            // Supprimer le produit en envoyant une requête DELETE au serveur
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/delete/product/${produitId}`, fetchOptions);

            if (response.ok) {
                // Rafraîchir la liste des articles après suppression
                // alert("Le produit a était Spprimer avec succès !");
                // Fermer la modal après suppression réussie
                handleCloseModal();
                // Rafraîchir la liste des articles après suppression
                alert("Le produit a était Spprimer avec succès !");
                fetchProduits();
                // Rafraîchir la liste des articles après suppression
                // alert("Le produit a était Spprimer avec succès !");
                // Redirection vers la page MesProduits après suppression
                window.location.href = "/VoirMesProduits";
                // Rafraîchir la liste des articles après suppression
                // alert("Le produit a était Spprimer avec succès !");
            } else {
                 // Si la suppression a échoué, afficher une alerte d'erreur
            alert("Erreur lors de la suppression du produit !");
            }
        } catch (error) {
            // Rafraîchir la liste des articles après suppression
            // alert("GROS SOUCIS !");
            console.error("Erreur lors de la suppression du produit :", error);
            alert("GROS SOUCIS !");
        }
    };
    
    return (
        <>
            {/* Bouton pour ouvrir la modal */}
            <Button className='m-2' variant="danger" onClick={handleShowModal}>Supprimer Produit</Button>

            {/* Modal de confirmation */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de Suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
                    <Button variant="danger" onClick={handleDeleteProduit}>Confirmer la Suppression</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SupprimerProduit;
