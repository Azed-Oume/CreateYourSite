import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const DeleteCommentModal = ({ commentId, articleId, fetchArticles }) => {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/remove/comment`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ commentId: commentId, articleId: articleId})
            });console.log(commentId, " en ligne 17", articleId);
            const data = await response.json(); // Parse la réponse JSON
            if (!response.ok) {
                throw new Error(data.message, handleCloseModal()); // Lance une erreur avec le message d'erreur du backend
                
            }
            // Réponse réussie, vous pouvez effectuer des opérations supplémentaires si nécessaire
            console.log('Commentaire supprimé avec succès');
            alert('Commentaires supprimé avec succès');
            handleCloseModal();
            fetchArticles(); // Récupère à nouveau les articles après la suppression réussie
        } catch (error) {
            console.error('Error deleting Commentare:', error);
            // Affichez le message d'erreur à l'utilisateur, par exemple :
            alert(error.message);
        }
    };
    

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <Button 
            className='m-2'
            variant="danger" 
            onClick={handleShowModal}>Supprimer Ce Commentaire</Button>
            <Modal 
            show={showModal} 
            onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation de Suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer Ce Commentaire ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
                    <Button variant="danger" onClick={handleDelete}>Confirmer la Suppression</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteCommentModal;
