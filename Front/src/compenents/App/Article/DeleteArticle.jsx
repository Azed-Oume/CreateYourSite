import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const DeleteArticleModal = ({ articleId, fetchArticles }) => {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { return  alert("Vous n'êtes pas autorisé à supprimer cet article, connécter vous si vous etes l'auteur de cette article !");}
                    
            const response = await fetch(`http://localhost:3000/api/remove/article`, {
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
            onClick={handleShowModal}>Supprimer Cet Article</Button>
            <Modal 
            show={showModal} 
            onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de Suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer cet article ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
                    <Button variant="danger" onClick={handleDelete}>Confirmer la Suppression</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteArticleModal;
