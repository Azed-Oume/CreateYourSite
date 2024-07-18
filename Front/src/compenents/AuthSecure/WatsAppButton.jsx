

import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const WhatsAppButton = ({ phoneNumber }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(window.scrollY > 200);   
    }    

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const handleClick = () => {
        // Générer le lien profond WhatsApp avec le numéro de téléphone
        const whatsappLink = `https://wa.me/${phoneNumber}`;
        // Ouvrir WhatsApp dans un nouvel onglet lorsque le bouton est cliqué
        window.open(whatsappLink, '_blank');
    };

    return (
        <div
            // className={`position-fixed bottom-20 end-0  ${isVisible ? 'visible' : 'invisible'}`}
            // style={{ opacity: isVisible ? '0.9' : '0', transition: 'opacity 0.6s', zIndex: '10' }}

            style={{
                position: 'fixed',
                bottom: '10px',
                right: '80px',
                zIndex: '101',
                opacity: isVisible ? '0.9' : '0',
                transition: 'opacity 0.6s',
                pointerEvents: isVisible ? 'auto' : 'none',  // Désactive les interactions quand invisible
            }}
        >
            <Button 
                className='text-white fw-bold scroll'
                onClick={handleClick}
                style={{
                    boxShadow: '5px 5px 5px 5px rgba(3, 100, 24, 0.5)',
                    background: 'rgba(3, 100, 24, 01)',
                    color: 'black',
                    transition: 'box-shadow 0.3s'
                }}
                onMouseOver={(e) => e.target.style.boxShadow = '5px 5px 5px 5px rgba(3, 100, 24, 0.9)'}
                onMouseOut={(e) => e.target.style.boxShadow = '5px 5px 5px 5px rgba(3, 100, 24, 0.2)'}
            >
                Bonjour, Besoin d'aide !
            </Button>
        </div>
    );
}

export default WhatsAppButton;
