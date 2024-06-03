import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Paiement from "../../Paiement";

const FactureIsVisible = ({ajouterAuPanier, panier, totalFacture}) => {
    
const [isVisible, setIsVisible] = useState(true);
const [codePromotionnel, setCodePromotionnel] = useState('');
const [isCodeVisible, setIsCodeVisible] = useState(false);
const [showModal, setShowModal] = useState(false); // Modal de paiement
const [showPaiementModal, setShowPaiementModal] = useState(false); // Modal de paiement
const [totalAvecRemise, setTotalAvecRemise] = useState(null); // Définissez l'état pour totalAvecRemise
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// Dans la fonction handlePaiment on calcul la remise en fonction du codePromotionnel
const handlePaiement = () => {
    const totalAvecRemise = (totalFacture - (totalFacture / 100) * obtenirPourcentageRemise(codePromotionnel)).toFixed(2);
    setShowPaiementModal(true);
    setShowModal(false);
  };
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Dans la fonction finaliserAchats, on calcule le total avec remise et on le transmettez au composant Paiement
const finaliserAchats = () => {
    const totalAvecRemise = codePromotionnel ? (((totalFacture).toFixed(2)) - ((totalFacture / 100) * obtenirPourcentageRemise(codePromotionnel)).toFixed(2)) : null;
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
        <nav>            
                <Button 
                    variant='success'
                    className=' mx-auto fw-bold p-2' 
                    style={{ position: "fixed", top: "160px", start: "500px", translate: "middle" }}
                    aria-expanded={isVisible}
                    onClick={() => setIsVisible(!isVisible)}
                >
                    {isVisible ? "Fermer le panier" : "Ouvrir le panier"} 
                </Button>
        </nav>
                        {isVisible && (
                              <section className='col-md-2 mx-auto graylogo p-2' style={{ position: "fixed", top: "220px", start: "500px", translate: "middle", zIndex:"10", opacity:".9" }}> 
                                  {/* Affichage du contenu du panier */}
                                  
                                      <div>
                                          <h5>Total des achats :</h5>
                                          <p className='text-white fw-bold fs-6'>{(totalFacture).toFixed(2)} €</p>
                                      </div>
                                      
                                      <div>
                                      <Button 
                                          variant='info'
                                          className=' mx-auto fw-bold m-2 p-2' 
                                          aria-expanded={isCodeVisible}
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
                                        <p className='text-white fw-bold fs-6'>{((totalFacture / 100) * obtenirPourcentageRemise(codePromotionnel)).toFixed(2)} €</p>
                                        <div>
                                          <h5>Total du panier remise :</h5>
                                          <p className='text-white fw-bold fs-6'>
                                            {((totalFacture - (totalFacture / 100) * obtenirPourcentageRemise(codePromotionnel))).toFixed(2)} €
                                          </p>
                                        </div>
                                        </div>   
                                                                             
                                              )}
                                              <Button
                                        variant='success'
                                        className=' mx-auto fw-bold p-2'
                                        onClick={finaliserAchats}
                                      >
                                        {codePromotionnel ? "Finaliser mes achats (avec remise)" : "Finaliser mes achats"}
                                      </Button>
                                      </div>
                              </section>
                          )}
                                             {/* Modal de paiement */}
                                             <Modal show={showModal} onHide={() => setShowModal(false)}>
                                              <Modal.Header closeButton>
                                                <Modal.Title>Montant de vos achats</Modal.Title>
                                              </Modal.Header>
                                              <Modal.Body>
                                                {codePromotionnel ? (
                                                  <p>Total avec remise : {((totalFacture - (totalFacture / 100) * obtenirPourcentageRemise(codePromotionnel))).toFixed(2)} €</p>
                                                ) : (
                                                  <p>Total du panier : {totalFacture.toFixed(2)} €</p>
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
                                    total={codePromotionnel ? totalAvecRemise : totalFacture} // Utilisez le total avec remise si un code promotionnel est appliqué, sinon utilisez le total sans remise
                                    codePromotionnel={codePromotionnel}
                                    finaliserAchats={finaliserAchats}
                                />
                                </Modal>    
        </>
    )
}
export default FactureIsVisible;