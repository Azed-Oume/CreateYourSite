import React, { useState } from 'react';
import { Form, Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../AuthSecure/BackButton.jsx';
import AjouterImageArticle from './AjouterImageArticle.jsx';

const Article = () => {
    const [titre, setTitre] = useState('');
    const [contenu, setContenu] = useState('');
    const [categorie, setCategorie] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/create/article`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Inclure le token dans l'en-tête Authorization
                },
                body: JSON.stringify({
                    titre,
                    contenu,
                    categorie // Inclusion de la catégorie dans la requête
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la soumission de l\'article');
            }

            // Si requête réussie, réinitialisez les champs du formulaire
            setTitre('');
            setContenu('');
            setCategorie(''); 
            alert('Article soumis avec succès !');
            const responseJson = await response.json();
            const articleId = responseJson.article.article_id;
            localStorage.setItem('articleId', articleId);
            setMessage('Article soumis avec succès !');
            // Redirection vers une nouvelle page
            navigate(`/AjouterImageArticle/${articleId}`);             
        } catch (error) {
            // Gestion des erreurs
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la soumission de l\'article');
        }
    };

    // Fonction pour gérer les changements dans le champ de catégorie
    const handleInputChange = (event) => {
        setCategorie(event.target.value);
    };


    return (
        <> 
        <section className='pt-5' style={{marginBottom: "400px"}}>
            <article className="bg-secondary col-md-9 mx-auto text-white text-center rounded " >
                <Form onSubmit={handleSubmit}>
                    <fieldset className="row col-md-12 mx-auto">
                        <legend>Veuillez remplir tous les champs !</legend>
                        <div className='row col_md_12 mx-auto'>
                        <FormGroup className="text-center col-md-6 ">
                            <FormLabel className="h4" htmlFor='titre'>Titre (max 155 caractères)</FormLabel>
                            <FormControl 
                                id='titre'
                                name="titre"
                                as="textarea" 
                                placeholder="Le Titre de l'Article" 
                                maxLength={155}
                                value={titre}
                                onChange={(event) => setTitre(event.target.value)}
                                required
                            />
                        </FormGroup>
                        <FormGroup className="text-center col-md-6">
                            <FormLabel className="h4" htmlFor='categorie'>Categories (max 155 caractères)</FormLabel>
                                <select
                                    id='categorie'
                                    className="form-select mb-2 mx-auto"
                                    name="categorie"
                                    value={categorie}
                                    onChange={handleInputChange} // Utilisation de la fonction de gestion de changement
                                    required
                                >
                                    <option value="">Sélectionnez une catégorie</option>
                                    <option value="Bio">Bio</option>
                                    <option value="Business">Business</option>
                                    <option value="Cuisine">Cuisine</option>
                                    <option value="Mode">Mode</option>
                                    <option value="Politique">Politique</option>
                                    <option value="Technologie">Technologie</option>
                                    <option value="Voyages">Voyages</option>
                                </select>
                        </FormGroup>
                        </div>
                        <FormGroup className="col-md-12">
                            <FormLabel className="h4" htmlFor='contenu'>Votre Article</FormLabel>
                            <FormControl 
                                id='contenu'
                                as="textarea" 
                                placeholder="Ici votre Article" 
                                name='contenu'
                                value={contenu}
                                onChange={(event) => setContenu(event.target.value)}
                                required
                            />
                        </FormGroup>
                    </fieldset>
                    <FormGroup className="d-flex justify-content-around p-3 ">
                        <BackButton />
                        <Button
                            type="submit"
                            variant='success'
                            className=" col-md-4 fw-bold"
                            aria-label="Retour au tableau de bord candidat"
                        >
                            Créer l'article
                        </Button>
                    </FormGroup>
                </Form>
                {message && (
                        <div role="alert" aria-live="assertive" className="mt-3">
                            {message}
                        </div>
                    )}
            </article>
            </section>
        </>
    );
};

export default Article;
