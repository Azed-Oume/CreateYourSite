import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Forbidden = () => {
    const [showTitle, setShowTitle] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTitle(false);
        }, 10000); // Affiche le titre pendant 10 secondes

        return () => clearTimeout(timer);
    }, []); // Utilisez un tableau vide pour exécuter cet effet une seule fois après le premier rendu

    return (
        <div className='bg-secondary col-md-10 mx-auto p-4 ' style={{ marginTop: "140px", marginBottom: "700px" }}>
            {showTitle && (
                <h1 className="row col-md-8 bg-primary p-2 m-2 mx-auto text-center text-white">Vous n'êtes pas autorisé pour le moment. Vous devez vous connecter ou vous inscrire pour débloquer un accès.</h1>
            )}
            {!showTitle && <Navigate to="/Connexion" />}
        </div>
    );
};

export default Forbidden;
