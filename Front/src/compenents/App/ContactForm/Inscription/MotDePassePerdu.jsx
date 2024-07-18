import React, { useState } from "react";
import { Button, Form, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MotDePassePerdu = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: ''
    });
    const [message, setMessage] = useState('');

    // Fonction de soumission du formulaire
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        try {
            // Requête POST pour envoyer les informations d'authentification au backend
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/set-new-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (response.status === 200) {
                // La demande a réussi
                setMessage('Un lien pour régénérer le mot de passe a été envoyé à votre adresse e-mail.');
                setTimeout(() => {
                navigate("/Connexion");
                },3000);
                
            } else if (response.status === 404) {
                // Email non trouvé
                setMessage("Cet e-mail n'existe pas dans notre base de données.");
            } else {
                // Autres erreurs
                setMessage("Une erreur s'est produite. Veuillez réessayer.");
            }
        } catch (error) {
            
            setMessage("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="container graylogo col-md-10 p-4 rounded-4" style={{ marginTop: "140px" }}>
            <h2 className="h2 text-center text-white fw-bold rounded p-2 mb-2">Réinitialisation du mot de passe</h2>
            {message && <div className="alert alert-info">{message}</div>}
            <Form className="row mb-2 mx-auto" method="POST" onSubmit={handleSubmit}>
                <FormGroup className="mb-3 col-md-6">
                    <FormLabel className="form-control bg-secondary text-white fw-bold mb-2" htmlFor="email">
                        Votre Email
                    </FormLabel>
                    <FormControl
                        className="form-control mx-auto"
                        autoComplete="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </FormGroup>
                <div className="mb-3 d-flex">
                    <Button variant="success" className="mx-auto" type="submit">
                        Générer un nouveau mot de passe
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default MotDePassePerdu;
