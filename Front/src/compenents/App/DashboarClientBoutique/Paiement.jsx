import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const Paiement = ({ total, codePromotionnel, finaliserAchats }) => {
  const [infoPaiement, setInfoPaiement] = useState({
    nom: '',
    numeroCarte: '',
    dateExpiration: '',
    cvv: ''
  });
  const [erreur, setErreur] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfoPaiement(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePayer = async () => {
    try {
      // Envoi des informations de paiement au serveur
      const response = await fetch('url_du_serveur_banque_postal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(infoPaiement)
      });

      // Vérifier si la requête s'est bien déroulée
      if (!response.ok) {
        throw new Error('Erreur lors du paiement');
      }

      // Si le paiement est réussi, appeler la fonction pour finaliser les achats
      finaliserAchats();

      // Rediriger vers "/boutique" une fois le paiement effectué
      window.location.href = '/boutique';
    } catch (error) {
      setErreur('Une erreur est survenue lors du paiement. Veuillez réessayer.');
    }
  };

  const masquerNumeroCarte = (numeroCarte) => {
    const longueur = numeroCarte.length;
    if (longueur >= 4) {
      const chiffresMasques = '*'.repeat(longueur - 4);
      const derniersChiffres = numeroCarte.slice(-4);
      return chiffresMasques + derniersChiffres;
    } else {
      return numeroCarte;
    }
  };

  const masquerDateExpiration = (dateExpiration) => {
    const longueur = dateExpiration.length;
    if (longueur >= 2) {
      const chiffresMasques = '*'.repeat(longueur - 2);
      const derniersChiffres = dateExpiration.slice(-2);
      return chiffresMasques + derniersChiffres;
    } else {
      return dateExpiration;
    }
  };

  return (
    <div className='rounded p-2' style={{ marginTop: "60px", backgroundColor: "white" }}>
      <h3 className='rounded p-2 text-center '>Procéder au paiement</h3>
      <Form>
        <Form.Group>
          <Form.Label>Total à payer :</Form.Label>
          <span className='text-center bg-success fw-bold p-2 rounded'>{total.toFixed(2)} €</span>
        </Form.Group>
        <Form.Group controlId="nom">
          <Form.Label>Nom sur la carte</Form.Label>
          <Form.Control type="text" name="nom" value={infoPaiement.nom} onChange={handleChange} placeholder="Entrez le nom sur la carte" />
        </Form.Group>
        <Form.Group controlId="numeroCarte">
          <Form.Label>Numéro de carte</Form.Label>
          <Form.Control type="text" name="numeroCarte" value={masquerNumeroCarte(infoPaiement.numeroCarte)} onChange={handleChange} placeholder="Entrez le numéro de carte" />
          <Form.Text className="text-muted">
            Entrez le numéro de votre carte de crédit à 16 chiffres.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="dateExpiration">
          <Form.Label>Date d'expiration</Form.Label>
          <Form.Control type="text" name="dateExpiration" value={masquerDateExpiration(infoPaiement.dateExpiration)} onChange={handleChange} placeholder="MM/AA" />
          <Form.Text className="text-muted">
            Entrez la date d'expiration de votre carte au format MM/AA.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="cvv">
          <Form.Label>CVV</Form.Label>
          <Form.Control type="text" name="cvv" value={infoPaiement.cvv} onChange={handleChange} placeholder="Entrez le CVV" />
          <Form.Text className="text-muted">
            Entrez le code CVV à 3 chiffres au dos de votre carte.
          </Form.Text>
        </Form.Group>
        {erreur && <Alert variant="danger">{erreur}</Alert>}
        <Button className='m-2' variant="primary" onClick={() => { handlePayer() }}>
          Payer {codePromotionnel ? `(avec remise)` : ''}
        </Button>
      </Form>
    </div>
  );
};

export default Paiement;
