import React, { useState, useEffect } from "react";
import { Form, FormControl, FormGroup, FormLabel, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Ajouterproduit = () => {
    const [formData, setFormData] = useState({
        nom: "",
        quantite: 0,
        detail: "",
        tarif: 0,
        categorie: ""
    });
    const [categories, setCategories] = useState([]);    

    useEffect(() => {
        fetchCategoriesProduits();
    }, []);

    
    const role = localStorage.getItem('role');
    const fetchCategoriesProduits = async () => {
        try {
            const token = localStorage.getItem('token');
            // Pérmet de récuperer toutes les Categories
            const response = await fetch('http://localhost:3000/api/get/categoriesproduits', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                alert("Erreur lors de la récupération des catégories de produits.");
                throw new Error('Une erreur est survenue lors du FETCH');
            } else {
                const data = await response.json();
                console.log(data, "en ligne XX"); // Remplacez XX par le numéro de ligne approprié
                setCategories(data.categorie);
            }
        } catch (error) {
            console.error('Error fetching categories produits:', error);
        }
    }

const handleChange = (e) => {
    const { id, value } = e.target;
    
        // mettre à jour la valeur de la catégorie normalement
        setFormData({
            ...formData,
            [id]: value
        });
};


const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/create/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) {
        if (response.status === 400) {
            alert("Le produit existe déjà avec ce nom. Veuillez choisir un autre nom.");
            throw new Error('Une erreur est survenue lors de la création du produit');
        }}
        const data = await response.json();
        // Vérifier si la création du produit a réussi
        if (data.message === 'Produit créé avec succès') {
            // Réinitialiser le formulaire après soumission réussie
            setFormData({
                nom: "",
                quantite: 0,
                detail: "",
                tarif: 0,
                categorie: ""
            });
            alert("Le produit a été créé avec succès !");
        } else if (data.message === 'Le produit existe déjà avec ce nom') {
            // Afficher un message d'erreur si le produit existe déjà avec le même nom
            alert("Le produit existe déjà avec ce nom. Veuillez choisir un autre nom.");
        } else {
            // Afficher un message d'erreur générique
            throw new Error('Une erreur est survenue lors de la création du produit');
        }
    } catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        alert("Erreur lors de la création du produit.");
    }
};

    
    return (
        <section className="container graylogo p-4 rounded-4 mx-auto mt-5" >
             
             {role === "1" ? (
                <div>
                    <Form className="col-md-4 mx-auto bg-white border border-secondary p-2 rounded"  onSubmit={handleSubmit}>
                        <fieldset className="m-2">
                            <legend>Informations sur le Produit</legend>
                        </fieldset>
                        <FormGroup className="">
                            <FormLabel htmlFor="nom">Nom du Produit :</FormLabel>
                            <FormControl 
                            id="nom" 
                            type="text" 
                            value={formData.nom} 
                            onChange={handleChange} 
                            required/>
                        </FormGroup>
                        <FormGroup className="">
                            <FormLabel htmlFor="quantite">Quantité :</FormLabel>
                            <FormControl 
                            id="quantite" 
                            type="number" 
                            value={formData.quantite} 
                            onChange={handleChange} 
                            required/>
                        </FormGroup>
                        <FormGroup className="">
                            <FormLabel htmlFor="detail">Détail :</FormLabel>
                            <FormControl 
                            id="detail" 
                            as="textarea" 
                            rows={3} 
                            value={formData.detail} 
                            onChange={handleChange} 
                            required/>
                        </FormGroup>
                        <FormGroup className="">
                            <FormLabel htmlFor="tarif">Tarif :</FormLabel>
                            <FormControl 
                            id="tarif" 
                            type="number" 
                            step="0.01" 
                            value={formData.tarif} 
                            onChange={handleChange} 
                            required/>
                        </FormGroup>
                    
                        <FormGroup className="">
                            <FormLabel htmlFor="categorie">Catégorie de Produits:</FormLabel>
                            <FormControl id="categorie" as="select" value={formData.categorie} onChange={handleChange}>
                                <option value="">Sélectionnez une catégorie</option>
                                {categories.map((categorie, index) => (
                                    <option key={index} value={categorie.nom}>{categorie.nom}</option>
                                ))}
                            </FormControl>
                        </FormGroup>                

                        <div className="d-flex justify-content-between p-3">
                            <Button type="submit" variant="success">Envoyer</Button>
                            <Button type="reset" variant="secondary">Réinitialiser</Button>
                        </div>
                    </Form>
                </div>
        ) : (
            <div>
                <h1 className="p-2 rounded mb-4 text-center">Section résérver a l'Administrateur</h1>
                <section className='p-2 m-5'>
                    <h1 className='text-center p-2 rounded'>Connectez-vous ou créez un compte Administrateur</h1>
                    <div className="d-flex justify-content-center gap-5">
                    <Button className='text-white fw-bold' as={Link} to="/Connexion" aria-label='Connexion' >Connexion</Button>
                    <Button className='text-white fw-bold' as={Link} to="/Inscription" aria-label="Pour s'inscrire">Inscription </Button>
                    </div>
                </section>
            </div>
        )}
        </section>
    );
};

export default Ajouterproduit;


/*
--bs-blue: #0d6efd;
  --bs-indigo: #6610f2;
  --bs-purple: #6f42c1;
  --bs-pink: #d63384;
  --bs-red: #dc3545;
  --bs-orange: #fd7e14;
  --bs-yellow: #ffc107;
  --bs-green: #198754;
  --bs-teal: #20c997;
  --bs-cyan: #0dcaf0;
  --bs-black: #000;
  --bs-white: #fff;
  --bs-gray: #6c757d;
  --bs-gray-dark: #343a40;
  --bs-gray-100: #f8f9fa;
  --bs-gray-200: #e9ecef;
  --bs-gray-300: #dee2e6;
  --bs-gray-400: #ced4da;
  --bs-gray-500: #adb5bd;
  --bs-gray-600: #6c757d;
  --bs-gray-700: #495057;
  --bs-gray-800: #343a40;
  --bs-gray-900: #212529;
  --bs-primary: #0d6efd;
  --bs-secondary: #6c757d;
  --bs-success: #198754;
  --bs-info: #0dcaf0;
  --bs-warning: #ffc107;
  --bs-danger: #dc3545;
  --bs-light: #f8f9fa;
  --bs-dark: #212529;
  */