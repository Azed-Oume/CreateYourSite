import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const AddCommentModal = ({ articleId }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        titre: "",
        contenu: "",
        date_commentaire: "",
        auteur: "",
        statut_commentaire: "",
        article_id: articleId,
    });

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCreateComment = async () => {
        try {
            // Vérification des champs obligatoires
            if (!formData.titre || !formData.contenu) {
                throw new Error('Veuillez remplir tous les champs du formulaire.');
            }
    
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/create/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors de l\'ajout du commentaire');
            }
    
            // Réponse réussie, vous pouvez effectuer des opérations supplémentaires si nécessaire
            handleCloseModal();
        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur lors de l\'ajout du commentaire :', error.message);
            // Affichage d'un message d'erreur à l'utilisateur
            alert(error.message);
        }
    };
    

    return (
        // <>
        //     <Button 
        //     variant="success"
        //     onClick={handleShowModal}>Ajouter un Commentaire</Button>
        //     <Modal 
        //     show={showModal} 
        //     onHide={handleCloseModal}
        //     >
        //         <Modal.Header closeButton>
        //             <Modal.Title>Ajouter un Commentaire</Modal.Title>
        //         </Modal.Header>
        //         <Modal.Body>
        //             <Form>
        //                 <Form.Group controlId="formTitre">
        //                     <Form.Label>Titre</Form.Label>
        //                     <Form.Control type="text" name="titre" value={formData.titre} onChange={handleChange} />
        //                 </Form.Group>
        //                 <Form.Group controlId="formContenu">
        //                     <Form.Label>Contenu</Form.Label>
        //                     <Form.Control as="textarea" rows={3} name="contenu" value={formData.contenu} onChange={handleChange} />
        //                 </Form.Group>
        //                 {/* Autres champs du formulaire (date_commentaire, auteur, statut_commentaire, etc.) */}
        //             </Form>
        //         </Modal.Body>
        //         <Modal.Footer>
        //             <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
        //             <Button variant="primary" onClick={handleCreateComment}>Ajouter</Button>
        //         </Modal.Footer>
        //     </Modal>
        // </>
        <>
            <Button variant="success" onClick={handleShowModal} aria-haspopup="dialog" aria-expanded={showModal}>
                Ajouter un Commentaire
            </Button>
            <Modal show={showModal} onHide={handleCloseModal} aria-labelledby="modal-title" aria-describedby="modal-description">
                <Modal.Header closeButton>
                    <Modal.Title id="modal-title">Ajouter un Commentaire</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="modal-description">Veuillez remplir les champs ci-dessous pour ajouter un commentaire.</p>
                    <Form>
                        <Form.Group controlId="formTitre">
                            <Form.Label>Titre</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="titre" 
                                value={formData.titre} 
                                onChange={handleChange} 
                                required 
                                aria-required="true"
                            />
                        </Form.Group>
                        <Form.Group controlId="formContenu">
                            <Form.Label>Contenu</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                name="contenu" 
                                value={formData.contenu} 
                                onChange={handleChange} 
                                required 
                                aria-required="true"
                            />
                        </Form.Group>
                        {/* Autres champs du formulaire (date_commentaire, auteur, statut_commentaire, etc.) */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleCreateComment} aria-label="Ajouter le commentaire">
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
};

export default AddCommentModal;
