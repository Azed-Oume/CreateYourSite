import React, { useState, useEffect } from 'react';
import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent';
import { useCookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';


// Fonction pour obtenir les cookies détectés dynamiquement
const scanCookies = () => {
  const cookiesString = document.cookie;
  return cookiesString.split('; ').map(cookie => {
    const [name, value] = cookie.split('=');
    return { name, value };
  }).filter(cookie => cookie.name && cookie.value);
};

const CookieConsentComponent = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['userConsent']);
  const [showModal, setShowModal] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState([]);
  const navigate = useNavigate();
  // Ajouter des cookies de test
  useEffect(() => {
    document.cookie = "user=John Doe; path=/";
    document.cookie = "cookieconsent_status=dismiss; path=/";
    
    // Scan des cookies après ajout
    const detectedCookies = scanCookies();
    const preferences = detectedCookies.map(cookie => ({
      name: cookie.name,
      enabled: true, // Par défaut, les cookies sont activés
      required: ['__stripe_mid', '__stripe_sid', 'cookieconsent_status'].includes(cookie.name)
    }));
    setCookiePreferences(preferences);
  }, []);

  const handleAcceptCookie = () => {
    setCookie('userConsent', 'true', { path: '/' });
    handleSavePreferences(); // Enregistrer les préférences lors de l'acceptation
  };

  const handleDeclineCookie = () => {
    removeCookie('userConsent', { path: '/' });
    handleSavePreferences(); // Enregistrer les préférences lors du refus
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCookieToggle = (name) => {
    setCookiePreferences(prevPreferences => 
      prevPreferences.map(cookie => 
        cookie.name === name
          ? { ...cookie, enabled: !cookie.enabled }
          : cookie
      )
    );
  };

  const handleSavePreferences = () => {
    cookiePreferences.forEach(cookie => {
      if (cookie.required) {
        // Les cookies obligatoires sont toujours activés
        setCookie(cookie.name, 'true', { path: '/' });
      } else {
        if (cookie.enabled) {
          // Activer le cookie
          setCookie(cookie.name, 'true', { path: '/' });
        } else {
          // Désactiver le cookie
          removeCookie(cookie.name, { path: '/' });
        }
      }
    });
    setCookie('userConsent', 'true', { path: '/' }); // Simule l'acceptation des cookies pour fermer la bannière
    handleCloseModal();
    navigate("/");
    window.location.reload(); // Recharger la page pour que la bannière soit mise à jour
  };

  return (
    <>
      {!getCookieConsentValue() && (
        <CookieConsent
          location="bottom"
          buttonText="Accepter"
          declineButtonText="Refuser"
          onAccept={handleAcceptCookie}
          onDecline={handleDeclineCookie}
          enableDeclineButton
          cookieName="userConsent"
          expires={150}
          hideOnAccept={true}
        >
          Ce site utilise des cookies pour vous garantir la meilleure expérience sur notre site.{" "}
          <a href="/politique-de-confidentialite">En savoir plus</a>
          <button onClick={handleShowModal} className="btn btn-link ml-2">
            Régler
          </button>
        </CookieConsent>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Préférences de Cookies</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choisissez vos préférences en matière de cookies :</p>
          <div className="form-check">
            {cookiePreferences.length > 0 ? (
              cookiePreferences.map(cookie => (
                <div key={cookie.name} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={cookie.enabled}
                    onChange={() => handleCookieToggle(cookie.name)}
                    disabled={cookie.required} // Désactiver le contrôle pour les cookies obligatoires
                  />
                  <label className="form-check-label">
                    {cookie.name}
                  </label>
                </div>
              ))
            ) : (
              <p>Aucun cookie détecté</p>
            )}
          </div>
          <Button variant="primary" onClick={handleSavePreferences} className="mt-3">
            Sauvegarder les préférences
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CookieConsentComponent;
