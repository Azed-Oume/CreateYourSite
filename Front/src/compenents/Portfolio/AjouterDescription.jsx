import React, { useState } from "react";
import { Button, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";

const AjouterDescription = ({ id, initialDescription, getAllImages }) => {
    const [description, setDescription] = useState(initialDescription || "");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isComponentVisible, setIsComponentVisible] = useState(false);

    const handleOnClick = () => {
        setIsComponentVisible(!isComponentVisible);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!description.trim()) {
                setError("La description ne peut pas être vide.");
                return;
            }

            const token = localStorage.getItem('token');
            const fetchOptions = {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description, id })
            };

            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/images/ajouterDescription/${id}`, fetchOptions);
            
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de la description.');
            }

            setSuccess(true);
            setError("");
            setDescription("");
            handleOnClick();
            await getAllImages();
        } catch (error) {
            console.error("Error:", error);
            setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
        }
    };

    return (
        <section className="border rounded p-2 " aria-labelledby={`ajouter-description-title-${id}`}>
            <h2 id={`ajouter-description-title-${id}`} className="visually-hidden">Ajouter ou modifier une description</h2>
            <Button
                variant="success"
                type="button" 
                onClick={handleOnClick}>
                {initialDescription ? "Modifier Description" : "Ajouter Description"}
            </Button>
            {isComponentVisible && (
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormLabel
                            className="form-control bg-secondary mx-auto text-white fw-bold m-2"
                            htmlFor={`description-${id}`}>Description :</FormLabel>
                        <FormControl 
                            className="form-control m-2 mx-auto"
                            as="textarea" 
                            id={`description-${id}`} 
                            value={description} 
                            onChange={handleDescriptionChange} 
                            aria-describedby={`description-error-${id} description-success-${id}`}
                        />
                        <Button type="submit">Valider</Button>
                        {error && (
                            <p id={`description-error-${id}`} style={{ color: 'red' }} aria-live="assertive">
                                {error}
                            </p>
                        )}
                        {success && (
                            <p id={`description-success-${id}`} style={{ color: 'green' }} aria-live="polite">
                                Description ajoutée avec succès.
                            </p>
                        )}
                    </FormGroup>
                </Form>
            )}
        </section>
    );
};

export default AjouterDescription;
