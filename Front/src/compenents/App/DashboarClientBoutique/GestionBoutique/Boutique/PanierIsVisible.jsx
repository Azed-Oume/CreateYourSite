import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Form, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";
import Paiement from "./Paiement.jsx";
import ReserveForAdmin from "../../../../AuthSecure/ReserveForAdmin.jsx";

const PanierIsVisible = ({ panier}) => {
    console.log(panier, " en ligne 7 XXXXXXXXXXXXXXXXXXXXXXXXXX");
const [isVisible, setIsVisible] = useState(false);
const [isCodeVisible, setIsCodeVisible] = useState(false);
const [payementIsVisible, setPayementIsVisible] = useState(false);
const [codePromotionnel, setCodePromotionnel] = useState('');
const [showModal, setShowModal] = useState(false); // Modal de paiement
const [showPaiementModal, setShowPaiementModal] = useState(false); // Modal de paiement
const [totalAvecRemise, setTotalAvecRemise] = useState(null); // Définissez l'état pour totalAvecRemise
const [erreur, setErreur] = useState('');

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
let total = 0;
// Calcul du total du panier
const calculerTotalPanier = () => {
  console.log('panier:', panier); // Ajoutez ceci pour vérifier le contenu du panier
  total = panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0);
  console.log('total avant toFixed:', total); // Ajoutez ceci pour vérifier la valeur de total avant toFixed
  return total;
};

// Appel de la fonction et formatage du total
const totalFormatted = parseFloat(calculerTotalPanier()).toFixed(2);
console.log(totalFormatted, " en ligne 30 XXXXXXXXXXXXXXXXXXXXXXXXXX");

  const calculerNombreArticlesDansPanier = () => {
    return panier.length;
  };

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// Dans la fonction handlePaiment on calcul la remise en fonction du codePromotionnel
const handlePaiement = () => {
    const totalAvecRemise = (calculerTotalPanier() - (calculerTotalPanier() / 100) * obtenirPourcentageRemise(codePromotionnel)).toFixed(2);
    setShowPaiementModal(true);
    setShowModal(false);
  };
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Dans la fonction finaliserAchats, on calcule le total avec remise et on le transmettez au composant Paiement
const finaliserAchats = () => {
    const totalAvecRemise = codePromotionnel ? (((calculerTotalPanier()).toFixed(2)) - ((calculerTotalPanier() / 100) * obtenirPourcentageRemise(codePromotionnel)).toFixed(2)) : null;
    setShowModal(true);
    setShowPaiementModal(false); // Afficher également le modal de paiement
    // Transmettez le total avec remise au composant Paiement
    setTotalAvecRemise(totalAvecRemise);
  };
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// Definition des code Promo
const obtenirPourcentageRemise = (codePromotionnel) => {
    switch (codePromotionnel) {
      case "CODE1":
        return 5;
      case "CODE2":
        return 10;
      case "CODE3":
        return 15;
      case "CODE4":
        return 20;
      default:
        return 0; // Aucune remise si le code n'est pas valide
    }
  };
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
useEffect(() => {
  if (calculerTotalPanier() > 0 ) {
     setPayementIsVisible(true);
  } else{setPayementIsVisible(false)}
 })
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const handlePaymentResponse = async (responseMessage) => {
  alert(responseMessage);
  setShowPaiementModal(false);

  if (responseMessage === 'Paiement accepté') {
      try {
        const token = localStorage.getItem('token');
          // Préparez les données de la facture à envoyer
          const factureData = {
            numeroFacture: numero_facture,
            dateFacture: date_facture,
            dateEcheance: date_echeance,
            montantTotal: montant_total,
            detailProjet: detail_projet,
            modePaiement: mode_paiement,
            informationPaiement: information_paiement,
            statutFacture: statut_facture,
            panier: panier,
        };

          const response = await fetch('http://localhost:3000/api/create/facture', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(factureData)
          });

          if (!response.ok) {
              throw new Error('Erreur lors de la création de la facture');
          }

          const result = await response.json();
          alert('Facture créée avec succès');
      } catch (error) {
          console.error('Erreur:', error);
          setErreur('Erreur lors de la création de la facture. Veuillez réessayer.');
      }
  }
};



    return(
        <>
        
        <section className="m-1">            
                <Button 
                    variant='success'
                    className=' mx-auto fw-bold p-2' 
                    style={{ position: "fixed", top: "160px", start: "500px", translate: "middle" }}
                    onClick={() => setIsVisible(!isVisible)}
                >
                    {isVisible ? "Fermer le panier" : "Ouvrir le panier"} ({calculerNombreArticlesDansPanier()} articles - {calculerTotalPanier().toFixed(2)} €)
                </Button>
                        {isVisible && (
                              <div style={{ overflow: "auto", height: "300px"}}> 
                                  {/* Affichage du contenu du panier */}
                                  <Form className='col-md-2 mx-auto graylogo rounded p-2' style={{ position: "fixed", top: "220px", start: "500px", translate: "middle", zIndex:"10", opacity:"1", overflow: "auto", height: "600px", width: "400px"}}>
                                      {/* Affichage du total du panier */}
                                      <table className="table">
                                          <thead>
                                              <tr>
                                                  <th>Nom</th>
                                                  <th>Tarif HT</th>
                                                  <th>Quantité</th>
                                                  <th>TVA 20%</th>
                                                  <th>Total TTC</th>
                                              </tr>
                                          </thead>
                                          <tbody>
                                              {panier && panier.map((produit, index) => (
                                                  <tr
                                                      key={index}
                                                      data-name={produit.nom}
                                                      data-tarif={produit.tarif}
                                                      data-quantite={produit.quantite}
                                                      data-tva={(produit.tarif * .2).toFixed(2)}
                                                      data-total={(produit.tarif * produit.quantite * 1.2).toFixed(2)}
                                                  >
                                                      <td>{produit.nom}</td>
                                                      <td>{produit.tarif} €</td>
                                                      <td>{produit.quantite}</td>
                                                      <td>{(produit.tarif * .2).toFixed(2)}</td>
                                                      <td>{(produit.tarif * produit.quantite * 1.2).toFixed(2)} €</td>
                                                </tr>
                                              ))}
                                              {/* Total de la commande */}
                                              <tr>
                                                  <td colSpan="4" className="fw-bold text-end">Total de la commande :</td>
                                                  <td className="fw-bold">
                                                      <span name="total" value={panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0).toFixed(2)}>{panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0).toFixed(2)} €</span>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                          <h5 className="p-2 rounded">Total du panier :  {(calculerTotalPanier()).toFixed(2)} €</h5>
                                          {payementIsVisible && (
                                            <div>
                                        <FormGroup className="fw-bold">
                                      <Button 
                                          variant='info'
                                          className=' mx-auto fw-bold m-2 p-2' 
                                          onClick={() => setIsCodeVisible(!isCodeVisible)}>
                                          {isCodeVisible ? "J'ai pas de code" : "Code Promo"}
                                      </Button>
                                              {isCodeVisible && (
                                        <div>
                                          <FormControl
                                            className="fw-bold p-2 mb-2 rounded"
                                            type="text"
                                            placeholder="Code promotionnel"
                                            value={codePromotionnel}
                                            onChange={(e) => setCodePromotionnel(e.target.value)}
                                          />
                                            <FormLabel className="bg-white p-2 rounded">Remise du panier :   {((calculerTotalPanier() / 100) * obtenirPourcentageRemise(codePromotionnel)).toFixed(2)} € </FormLabel>
                                            <FormLabel className="bg-white p-2 rounded">Total du panier remise : {((calculerTotalPanier() - (calculerTotalPanier() / 100) * obtenirPourcentageRemise(codePromotionnel))).toFixed(2)} €</FormLabel>
                                        </div>             
                                              )}
                                              </FormGroup>
                                          
                                              <Button
                                                variant='success'
                                                className=' mx-auto fw-bold p-2'
                                                onClick={finaliserAchats}
                                              >
                                                {codePromotionnel ? "Finaliser mes achats (avec remise)" : "Finaliser mes achats"}
                                              </Button>
                                              </div>
                                              )}
                                  </Form>
                              </div>
                          )}
                                              
                                             {/* Modal de paiement */}
                                              
                                             <Modal show={showModal} onHide={() => setShowModal(false)}>
                                              <Modal.Header closeButton>
                                                <Modal.Title>Montant de vos achats</Modal.Title>
                                              </Modal.Header>
                                              <Modal.Body>
                                                {codePromotionnel ? (
                                                  <p>Total avec remise : {((calculerTotalPanier() - (calculerTotalPanier() / 100) * obtenirPourcentageRemise(codePromotionnel))).toFixed(2)} €</p>
                                                ) : (
                                                  <p>Total du panier : {calculerTotalPanier().toFixed(2)} €</p>
                                                  // <span className='text-white fw-bold fs-6' name="total" value={panier.reduce((total, produit) => total + produit.tarif * produit.quantite, 0).toFixed(2)}>{panier.reduce((total, produit) => total + produit.tarif * produit.quantite, 0).toFixed(2)} €</span>
                                                )}
                                              </Modal.Body>
                                              <Modal.Footer>
                                                <Button variant="primary" onClick={handlePaiement}>
                                                  Payer
                                                </Button>
                                              </Modal.Footer>
                                            </Modal>
                                            
                                             {/* Modal de paiement pour carte bancaire */}
                                <Modal show={showPaiementModal} onHide={() => setShowPaiementModal(false)}>
                                  <Paiement 
                                      total={codePromotionnel ? totalAvecRemise : calculerTotalPanier()} // Utilisez le total avec remise si un code promotionnel est appliqué, sinon utilisez le total sans remise
                                      codePromotionnel={codePromotionnel}
                                      finaliserAchats={finaliserAchats}
                                      onPaymentResponse={handlePaymentResponse} // Passez le callback au composant enfant
                                  />
                                </Modal>
                          </section>    
                          
        </>
    )
}
export default PanierIsVisible;