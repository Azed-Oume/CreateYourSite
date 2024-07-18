import React, { useState } from 'react';
import { Form, FormGroup, Button, FormLabel, FormControl } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Connexion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: ''
  });
  
  // État pour stocker l'identifiant utilisateur
  const [userId, setUserId] = useState(null);
 // Fonction de soumission du formulaire
  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {

      // On fait une requête POST pour envoyer les informations d'authentification au backend
      const response = await fetch(`${import.meta.env.VITE_URL_API}/api/users/login`, {
        method: 'POST', // Methode POST pour envoyer les données
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // On convertie l'objet en JSON et on l'envoye dans le corps de la requête
      });

      if (response.status === 200) {
        // La connexion a réussi, on stocke le token et les informations de l'utilisateur
        const responseData = await response.json();
        const token = responseData.token;
        const utilisateur_id = responseData.utilisateur_id
        const role_id = responseData.role_id
        const statut = responseData.statut
        
        // Stockage des informations dans le stockage local du navigateur
        localStorage.setItem('token', token);
        localStorage.setItem('id', utilisateur_id);
        localStorage.setItem('role', role_id);
        localStorage.setItem('statut', statut);
          navigate("/");

        // On redirige l'utilisateur vers une autre page 
      } else if (response.status === 401) {
        // Identifiants incorrects
        alert("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
        
      } else {
        // oû d'autres cas d'erreur
        alert("Erreur de l'identifiant ou du mot de passe. Veuillez réessayer.");
      }
    } catch (error) {
      alert("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
    }
  };

  const handleInputChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setFormData({ ...formData, [fieldName]: fieldValue });
  };

  const handleClick = () => {
    navigate("/ChoixDuCompte");
  };

  return (
    <div className="container graylogo col-md-10 p-4 rounded-4" style={{ marginTop: "140px"}}>
      <h2 className="h2 text-center bg-secondary text-white fw-bold mb-2">Connexion</h2>
      <Form className="row mb-2 mx-auto" method="POST" onSubmit={handleSubmit}>
        <FormGroup className="mb-3 col-md-6">
          <FormLabel className="form-control bg-secondary text-white fw-bold mb-2" htmlFor="email">
            Email
          </FormLabel>
          <FormControl
            className="form-control mx-auto"
            autoComplete="username"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup className="mb-3 col-md-6 mx-auto">
          <FormLabel className="form-control bg-secondary text-white fw-bold mb-2" htmlFor="mot_de_passe">
            Mot de Passe
          </FormLabel>
          <FormControl
            className="form-control mx-auto"
            autoComplete="current-password"
            type="password"
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleInputChange}
          />
        </FormGroup>
        <div className="mb-3">
          {/* Affichage des erreurs ici si besoin */}
        </div>
        <div className="mb-3 d-flex">
          <Button 
            variant='success'
            className="mx-auto" type="submit">
            Se connecter
          </Button>
          <Link className='text-white bg-success rounded p-2 fw-bold mx-auto' as={Link} to="/motDePassePerdu" aria-label='Connexion' > (Mot de passe perdu)
          </Link>
        </div>
      </Form>
      <div className="mb-3 mx-auto col-md-6">
        <p className="form-control bg-secondary text-white fw-bold mb-2">
          Vous n'avez pas de Compte !
        </p>
        <Button className="btn btn-success mx-auto" type="button" onClick={handleClick}>
          Créez un Compte
        </Button>
      </div>
    </div>
  );
};

export default Connexion;
