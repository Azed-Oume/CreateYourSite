// import React, { useState } from 'react';
// import { Form, Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// const Comment = () => {
//     const [titre, setTitre] = useState('');
//     const [contenu, setContenu] = useState('');
//     const [categorie, setCategorie] = useState(''); // Ajout de l'état pour la catégorie

//     const handleSubmit = async (event) => {
//         event.preventDefault();
        
//         try {
//             const token = localStorage.getItem('token');
            
//             const response = await fetch('http://localhost:3000/api/create/article', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}` // Inclure le token dans l'en-tête Authorization
//                 },
//                 body: JSON.stringify({
//                     titre,
//                     contenu,
//                     categorie // Inclusion de la catégorie dans la requête
//                     // Ajoutez d'autres champs ici si nécessaire
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error('Erreur lors de la soumission de l\'article');
//             }

//             // Si la requête est réussie, réinitialisez les champs du formulaire
//             setTitre('');
//             setContenu('');
//             setCategorie(''); // Réinitialisation du champ catégorie
//             alert('Article soumis avec succès !');
//         } catch (error) {
//             // Gestion des erreurs
//             console.error('Erreur:', error);
//             alert('Une erreur est survenue lors de la soumission de l\'article');
//         }
//     };

//     // Fonction pour gérer les changements dans le champ de catégorie
//     const handleInputChange = (event) => {
//         setCategorie(event.target.value);
//     };

//     return (
//         <>
//             <article className="bg-secondary col-md-9 mx-auto m-3 text-white text-center rounded" >
//                 <Form onSubmit={handleSubmit}>
//                     <fieldset className="row col-md-12 mx-auto">
//                         <legend>Veuillez remplir tous les champs !</legend>
//                         <div className='row col_md_12 mx-auto'>
//                         <FormGroup className="text-center col-md-6 ">
//                             <FormLabel className="h3">Titre (max 155 caractères)</FormLabel>
//                             <FormControl 
//                                 as="textarea" 
//                                 placeholder="Le Titre de l'Article" 
//                                 maxLength={155}
//                                 value={titre}
//                                 onChange={(event) => setTitre(event.target.value)}
//                             />
//                         </FormGroup>
                        
//                         </div>
//                         <FormGroup className="col-md-12">
//                             <FormLabel className="h3">Votre Commentaire</FormLabel>
//                             <FormControl 
//                                 as="textarea" 
//                                 placeholder="Ici votre Article" 
//                                 value={contenu}
//                                 onChange={(event) => setContenu(event.target.value)}
//                             />
//                         </FormGroup>
//                     </fieldset>
//                     {/* Bouton de soumission */}
//                     <FormGroup className="row col-md-12 mx-auto ">
                        
//                         <Button
//                             type="submit"
//                             variant='success'
//                             className="mb-3 col-md-4 mx-auto fw-bold"
//                             aria-label="Retour au tableau de bord candidat"
//                         >
//                             Créer l'article
//                         </Button>
//                     </FormGroup>
//                 </Form>
//             </article>
//         </>
//     );
// };

// export default Comment;
