import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import BackButton from '../../../AuthSecure/BackButton';
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    sujet: '',
    message: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {  // pérmet de récuperer le profil de l'utilisateur connécter
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_URL_API}/api/getUser`, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Une erreur est survenue lors de la récupération du profil utilisateur');
        } else {
          const data = await response.json();
          setFormData(prevData => ({
            ...prevData,
            pseudo: data.pseudo || '',
            email: data.email || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const userIsLoggedIn = localStorage.getItem('token');
    if (userIsLoggedIn) {
      fetchProfile();
    }
  }, []);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const utilisateurId = localStorage.getItem('id');
      const endpoint = token ? `${import.meta.env.VITE_URL_API}/api/formvip/contact/${utilisateurId} ` : `${import.meta.env.VITE_URL_API}/api/form/contact`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission du message');
      }

      setFormData({
        pseudo: '',
        email: '',
        sujet: '',
        message: '',
      });
      
      alert('Message soumis avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la soumission du message');
    }
  };

  useEffect(() => {
    gsap.utils.toArray('.contact').forEach((article, index) => {
      gsap.from(article, {
        scrollTrigger: {
          trigger: article,
          toggleActions: 'restart pause resume pause',
          start: 'top 80%',
        },
        opacity: 0,
        x: index % 2 === 0 ? -1800 : 1800,
        duration: .5,
        delay: 1 * index,
        onComplete: () => {
          article.style.opacity = 1;
          // Animation de rebondissement
          bounceAndStop(article, [
            { x: -150, duration: 0.2 },
            { x: -10, duration: 0.1 },
            { x: 0, duration: 0.1 },
          ]);
        },
      });
    });
    
    function bounceAndStop(element, steps) {
      if (steps.length === 0) return;
    
      const step = steps.shift();
      gsap.to(element, {
        ...step,
        ease: 'easeOut',
        onComplete: () => {
          bounceAndStop(element, steps);
        },
      });
    }
    
    
  }, []);

  return (
    <>
      <div className="contact container graylogo col-md-10 rounded-4 mt-5 p-2">
        <h2 className="h2 text-center graylogo rounded-4 text-white  mx-auto p-2 ">Formulaire de Contact :</h2>
        <Form className="row mb-2 mt-4 mx-auto" method="POST" onSubmit={handleSubmit}>
          <FormGroup className="col-md-6 mx-auto">
            <FormLabel htmlFor="pseudo" className="form-control bg-secondary mx-auto text-white fw-bold mb-2">Pseudo</FormLabel>
            <FormControl
              // className="form-control mb-2 mx-auto"
              autoComplete="username"
              type="text"
              name="pseudo"
              value={formData.pseudo}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup className="col-md-6 mx-auto">
            <FormLabel htmlFor="email" className="form-control bg-secondary mx-auto text-white fw-bold mb-2">Adresse Email</FormLabel>
            <FormControl
              // className="form-control mb-2 mx-auto"
              autoComplete="email"
              type="text"
              name="email" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup className="col-md-6 mx-auto">
            <FormLabel htmlFor='sujet' className="form-control bg-secondary mx-auto text-white fw-bold mb-2">Sujet</FormLabel>
            <FormControl
              // className="form-select mb-2 mx-auto"
              as="select"
              name="sujet"
              value={formData.sujet}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionnez un Sujet</option> {/* Ajout d'une option vide pour la sélection par défaut */}
              <option value="Création d'un Site">Création d'un Site</option>
              <option value="Suivie SAV">Suivie SAV !</option>
              <option value="Création d'une Base De Donnée">Création d'une Base De Donnée</option>
              <option value="Gestion de la Partie FRONT">Gestion de la Partie FRONT</option>
              <option value="Gestion de la partie BACK">Gestion de la partie BACK</option>
              <option value="Les Techno Utilisées">Les Techno Utilisées</option> {/* Correction de la faute de frappe ici */}
              <option value="Poser une Question">Poser une Question</option> {/* Correction de la faute de frappe ici */}
            </FormControl>
          </FormGroup>
          <FormGroup className="col-md-6 mx-auto">
            <FormLabel className="form-control bg-secondary mx-auto text-white fw-bold mb-2" htmlFor="message">Texte :</FormLabel>
            <FormControl
              as="textarea"
              // className="form-control mx-auto"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
              required
            ></FormControl>
          </FormGroup>
          <div className="d-flex justify-content-between mx-auto m-2">
            <Button className="btn btn-success" type="submit">
              Envoyer
            </Button>
            <BackButton />
          </div>
        </Form>
      </div>
    </>
  );
  
};

export default Contact;
