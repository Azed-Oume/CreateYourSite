import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Paiement from "./Paiement";

const PanierIsVisible = ({ajouterAuPanier, panier}) => {
    
const [isVisible, setIsVisible] = useState(false);
const [codePromotionnel, setCodePromotionnel] = useState('');
const [isCodeVisible, setIsCodeVisible] = useState(false);
const [showModal, setShowModal] = useState(false); // Modal de paiement
const [showPaiementModal, setShowPaiementModal] = useState(false); // Modal de paiement
const [totalAvecRemise, setTotalAvecRemise] = useState(null); // Définissez l'état pour totalAvecRemise
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Calcul du total du panier
const calculerTotalPanier = () => {
    let total = 0;
    for (let produit of panier) {
      total += parseFloat(produit.tarif);
    }console.log(panier, "en ligne 22 XXXXXXXXXXX")
    return total;
    
  };
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

    return(
        <>
        <div className="m-1">            
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
                                  <div className='col-md-2 mx-auto graylogo rounded p-2' style={{ position: "fixed", top: "220px", start: "500px", translate: "middle", zIndex:"10", opacity:".9", overflow: "auto", height: "600px", width: "300px"}}>
                                    {/* Bouton pour voir le panier */}
                                      <h5 className="p-2 rounded">Mon panier :</h5>
                                      {panier.map((produit, index) => (
                                          <div className='text-white fw-bold' key={index}>
                                              <p className='fs-6'>{produit.nom} - {produit.tarif} €</p>
                                          </div>
                                      ))}
                                      {/* Affichage du total du panier */}
                                      <div>
                                          <h5 className="p-2 rounded">Total du panier :</h5>
                                          <p className='text-white fw-bold fs-6'>{(calculerTotalPanier()).toFixed(2)} €</p>
                                      </div>
                                      
                                      <Button
                                        variant='success'
                                        className=' mx-auto fw-bold p-2'
                                        onClick={finaliserAchats}
                                      >
                                        {codePromotionnel ? "Finaliser mes achats (avec remise)" : "Finaliser mes achats"}
                                      </Button>


                                      <div>
                                      <Button 
                                          variant='info'
                                          className=' mx-auto fw-bold m-2 p-2' 
                                          onClick={() => setIsCodeVisible(!isCodeVisible)}>
                                          {isCodeVisible ? "J'ai pas de code" : "Code Promo"}
                                      </Button>
                                              {isCodeVisible && (
                                        <div>
                                        <input
                                          type="text"
                                          placeholder="Code promotionnel"
                                          value={codePromotionnel}
                                          onChange={(e) => setCodePromotionnel(e.target.value)}
                                        />
                                        <h5>Remise du panier :</h5>
                                        <p className='text-white fw-bold fs-6'>{((calculerTotalPanier() / 100) * obtenirPourcentageRemise(codePromotionnel)).toFixed(2)} €</p>
                                        <div>
                                          <h5>Total du panier remise :</h5>
                                          <p className='text-white fw-bold fs-6'>
                                            {((calculerTotalPanier() - (calculerTotalPanier() / 100) * obtenirPourcentageRemise(codePromotionnel))).toFixed(2)} €
                                          </p>
                                        </div>
                                        </div>   
                                                                             
                                              )}
                                      </div>
                                  </div>
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
                                                )}
                                              </Modal.Body>
                                              <Modal.Footer>
                                                <Button variant="primary" onClick={handlePaiement}>
                                                  Payer
                                                </Button>
                                              </Modal.Footer>
                                            </Modal>

                                             {/* Modal de paiement */}
                                <Modal show={showPaiementModal} onHide={() => setShowPaiementModal(false)}>
                                <Paiement 
                                    total={codePromotionnel ? totalAvecRemise : calculerTotalPanier()} // Utilisez le total avec remise si un code promotionnel est appliqué, sinon utilisez le total sans remise
                                    codePromotionnel={codePromotionnel}
                                    finaliserAchats={finaliserAchats}
                                />
                                </Modal>
                          </div>    
        </>
    )
}
export default PanierIsVisible;