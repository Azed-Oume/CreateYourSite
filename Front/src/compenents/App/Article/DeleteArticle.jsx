import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const DeleteArticleModal = ({ articleId, fetchArticles }) => {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { return  alert("Vous n'êtes pas autorisé à supprimer cet article, connécter vous si vous etes l'auteur de cette article !");}
                    
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/remove/article`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ article_id: articleId})
            });
            const data = await response.json(); // Parse la réponse JSON
            if (!response.ok) {
                throw new Error(data.message); // Lance une erreur avec le message d'erreur du backend
                
            }
            // Réponse réussie, vous pouvez effectuer des opérations supplémentaires si nécessaire
            alert('Article supprimé avec succès');
            handleCloseModal();
            fetchArticles(); // Récupère à nouveau les articles après la suppression réussie
        } catch (error) {
            console.error('Error deleting article:', error);
            // Affichez le message d'erreur à l'utilisateur, par exemple :
            alert(error.message);
        }
    };
    

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <Button 
                variant="danger" 
                onClick={handleShowModal}
                aria-label="Supprimer cet article"
            >
                Supprimer Cet Article
            </Button>
            <Modal 
                show={showModal} 
                onHide={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="modal-title">Confirmation de Suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body id="modal-description">
                    Êtes-vous sûr de vouloir supprimer cet article ?
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={handleCloseModal}
                        aria-label="Annuler la suppression"
                    >
                        Annuler
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDelete}
                        aria-label="Confirmer la suppression"
                    >
                        Confirmer la Suppression
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteArticleModal;
