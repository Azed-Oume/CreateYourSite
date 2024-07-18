import React, { useState, useEffect } from "react";
import { Form, FormControl, FormGroup, FormLabel, Button, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReserveForAdmin from "../../../AuthSecure/ReserveForAdmin";

const AjouterCategorie = () => {

    const [categorieFormData, setCategorieFormData] = useState({
        nom: ""
    });

const handleChangeCategorie = (e) => {
    const { id, value } = e.target;
    setCategorieFormData({
        ...categorieFormData,
        [id]: value
    });
};

const handleSubmitCategorie = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            // Si le token est absent, ne pas faire de fetch
            return;
          }
        const response = await fetch(`${import.meta.env.VITE_URL_API}/api/create/categoriesproduits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(categorieFormData) // Utilisez formData au lieu de categorieFormData
        });
        if (!response.ok) {
            // Gérer les erreurs de la création de catégorie
            if (response.status === 400) {
                alert("La catégorie existe déjà avec ce nom. Veuillez choisir un autre nom.");
                throw new Error('Une erreur est survenue lors de la création de la catégorie');
            } else {
                throw new Error('Une erreur inattendue est survenue lors de la création de la catégorie');
            }
        }
        const data = await response.json();
        // Vérifier si la création de la catégorie a réussi
        if (data.message === 'Catégorie créée avec succès') {
            // Réinitialiser le formulaire après la création réussie
            setCategorieFormData({
                nom: ""
            });
            alert("La catégorie a été créée avec succès !");
        } else {
            // Afficher un message d'erreur générique si la réponse n'est pas conforme
            throw new Error('Réponse inattendue du serveur lors de la création de la catégorie');
        }
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error);
        alert("Erreur lors de la création de la catégorie.");
    }
};
    
const role = localStorage.getItem('role');
    return (
        <section className="container graylogo p-4 rounded-4 mx-auto mt-5">
            {role === "1" ? (
                <div>
            <Form className="col-md-4 mx-auto bg-white border border-secondary p-2 rounded" style={{ marginTop:"50px", minHeight: "450px" }} onSubmit={handleSubmitCategorie}>
                <fieldset className="m-2">
                    <legend>Nouvelles Categorie de Produits</legend>
                </fieldset>
                <FormGroup className="m-2">
                    <FormLabel 
                    htmlFor="nom"
                    >Nom de la Categorie :</FormLabel>
                    <FormControl 
                    id="nom" 
                    type="text" 
                    value={categorieFormData.nom} 
                    onChange={handleChangeCategorie} 
                    required/>
                </FormGroup>            
                <div className="d-flex justify-content-between p-3">
                    <Button type="submit" variant="success">Envoyer</Button>
                    <Button type="reset" variant="secondary">Réinitialiser</Button>
                </div>
            </Form>
            </div>
            ) : (
                <ReserveForAdmin/>
            )}
            </section>
    );
};

export default AjouterCategorie;
