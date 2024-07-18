import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AttenteConfirmation = () => {
    const [showTitle, setShowTitle] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTitle(false);
        }, 15000); // Affiche le titre pendant 15 secondes

        return () => clearTimeout(timer);
    }, []); // Utilisez un tableau vide pour exécuter cet effet une seule fois après le premier rendu

    return (
        <div className='bg-secondary col-md-10 mx-auto p-4 ' style={{ marginTop: "140px", marginBottom: "700px" }}>
            {showTitle && (
                <h1 className="row col-md-8 bg-primary p-2 m-2 mx-auto text-center text-white">Bientôt, les portes de l'attente s'ouvriront sur un monde de possibilités, où chaque clic sera une affirmation de votre existence numérique. Patience, votre confirmation approche, prête à dévoiler un nouveau chapitre dans votre voyage en ligne.</h1>
            )}
            {!showTitle && <Navigate to="/Connexion" />}
        </div>
    );
};

export default AttenteConfirmation;
