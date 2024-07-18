import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const SuspendreProduit = ({produitId, fetchProduits, userStatut}) => {
    // const { produitId } = useParams(); // Récupérer l'identifiant du produit depuis les paramètres de l'URL
    const [statut, setStatut] = useState(userStatut); // État local pour stocker le statut du produit, par défaut à 1
    // Fonction pour mettre à jour le statut du produit
    const handleUpdateStatut = async () => {
        try {
            const nouveauStatut = statut === 1 ? 2 : 1; // Inverser le statut actuel
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/update/statut/product/${produitId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ statut: nouveauStatut })
            });
            if (!response.ok) {
                throw new Error('Une erreur est survenue lors de la mise à jour du statut du produit');
            }
            // Mise à jour réussie, mettre à jour l'état local du statut
            setStatut(nouveauStatut);
            alert("Le statut a été modifié avec succès");
            fetchProduits();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut du produit :', error);
        }
    };

    return (
        <div>
            {/* Bouton pour mettre à jour le statut du produit */}
            <Button onClick={handleUpdateStatut}>
                {statut === 1 ? 'Suspendre' : 'Activer'}
            </Button>
        </div>
    );
};

export default SuspendreProduit;
