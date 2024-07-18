import React, { useState } from 'react';
import { Button, Form, FormControl, FormGroup, FormLabel, ProgressBar } from 'react-bootstrap';
import BackButton from '../../../AuthSecure/BackButton';

// Fonction de validation du mot de passe
const validatePassword = (password, options) => {
  if (typeof password !== 'string' || !password.length) return false;
  if (password.length < options.minLength) return false;

  const lowercaseRegex = /[a-z]/;
  if (!lowercaseRegex.test(password)) return false;

  const uppercaseRegex = /[A-Z]/;
  if (!uppercaseRegex.test(password)) return false;

  const numbersRegex = /[0-9]/;
  if (!numbersRegex.test(password)) return false;

  const symbolsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (!symbolsRegex.test(password)) return false;

  return true;
};

const InscriptionUser = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    pseudo: '',
    telephone: '',
    email: '',
    ConfirmerEmail: '',
    mot_de_passe: '',
    ConfirmerMot_dePasse: '',
    code_role: '',
    rue: '',
    ville: '',
    code_postal: '',
    biographie: '',
    role_id: '',
  });

  const [emailMatchError, setEmailMatchError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const options = { minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email' || name === 'ConfirmerEmail') {
      setEmailMatchError(false);
    }
    if (name === 'mot_de_passe' || name === 'ConfirmerMot_dePasse') {
      setPasswordMatchError(false);
    }
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return formData.nom && formData.prenom && formData.pseudo && formData.telephone && formData.biographie && formData.role_id;
      case 2:
        return formData.rue && formData.ville && formData.code_postal;
      case 3:
        const isPasswordValid = validatePassword(formData.mot_de_passe, options);
        const emailMatch = formData.email === formData.ConfirmerEmail;
        const passwordMatch = formData.mot_de_passe === formData.ConfirmerMot_dePasse;
        setEmailMatchError(!emailMatch);
        setPasswordMatchError(!passwordMatch);
        return formData.email && emailMatch && formData.mot_de_passe && passwordMatch && isPasswordValid;
      default:
        return false;
    }
  };

  const handleInscription = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL_API}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 409) {
        alert("Cette adresse e-mail existe déjà, veuillez sélectionner une autre.");
        return;
      }

      if (!response.ok) {
        throw new Error('Une erreur est survenue lors de la requête au serveur.');
      }

      const data = await response.json();
      alert('Inscription réussie !');
      window.location.href = '/Connexion';
    } catch (error) {
      alert(error.message);
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      alert('Veuillez remplir tous les champs requis avant de passer à l\'étape suivante.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      handleInscription();
    } else {
      alert('Veuillez remplir tous les champs requis avant de soumettre.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <section >
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="nom" className="form-control bg-secondary text-white fw-bold mb-2">Nom</FormLabel>
              <FormControl
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="prenom" className="form-control bg-secondary text-white fw-bold mb-2">Prénom</FormLabel>
              <FormControl
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="pseudo" className="form-control bg-secondary text-white fw-bold mb-2">Pseudo</FormLabel>
              <FormControl
                type="text"
                name="pseudo"
                value={formData.pseudo}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="telephone" className="form-control bg-secondary text-white fw-bold mb-2">Téléphone</FormLabel>
              <FormControl
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="biographie" className="form-control bg-secondary mx-auto text-white fw-bold mb-2">
                Biographie : dites-nous quelques mots sur vous !
              </FormLabel>
              <FormControl
                className="form-control mb-2 mx-auto"
                type="text"
                name="biographie"
                value={formData.biographie}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup className="col-md-6 mx-auto ">
              <FormLabel htmlFor="role_id" className="form-control bg-secondary mx-auto text-white fw-bold mb-2">
                Rôle
              </FormLabel>
              <FormControl
                as="select"
                className="form-select mb-2 mx-auto"
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="administrateur">Administrateur</option>
                <option value="Portfolio">Portfolio</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Visiteur">Visiteur</option>
                <option value="Client">Client</option>
              </FormControl>
            </FormGroup>
          </section>
        );
      case 2:
        return (
          <>
            <FormGroup className="col-md-6 mx-auto">
            </FormGroup>
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="rue" className="form-control bg-secondary text-white fw-bold mb-2">Rue</FormLabel>
              <FormControl
                type="text"
                name="rue"
                value={formData.rue}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="ville" className="form-control bg-secondary text-white fw-bold mb-2">Ville</FormLabel>
              <FormControl
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="code_postal" className="form-control bg-secondary text-white fw-bold mb-2">Code Postal</FormLabel>
              <FormControl
                type="text"
                name="code_postal"
                value={formData.code_postal}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </>
        );
      case 3:
        return (
          <>
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="email" className="form-control bg-secondary text-white fw-bold mb-2">Adresse Email</FormLabel>
              <FormControl
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="ConfirmerEmail" className="form-control bg-secondary text-white fw-bold mb-2">Confirmer Email</FormLabel>
              <FormControl
                type="email"
                name="ConfirmerEmail"
                value={formData.ConfirmerEmail}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            {emailMatchError && (
              <p className="col-md-12 fs-4 fw-bold text-dark mb-2">Les emails ne correspondent pas.</p>
            )}
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="mot_de_passe" className="form-control bg-secondary text-white fw-bold mb-2">Mot de Passe</FormLabel>
              <FormControl
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup className="col-md-6 mx-auto">
              <FormLabel htmlFor="ConfirmerMot_dePasse" className="form-control bg-secondary text-white fw-bold mb-2">Confirmer Mot de Passe</FormLabel>
              <FormControl
                type="password"
                name="ConfirmerMot_dePasse"
                value={formData.ConfirmerMot_dePasse}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            {passwordMatchError && (
              <p className="col-md-12 fs-4 fw-bold text-dark mb-2">Les mots de passe ne correspondent pas.</p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Form className="graylogo col-md-9 mx-auto mt-5 p-1 " onSubmit={handleSubmit}>
      <h2 className="col-md-12 fs-3 fw-bold text-dark text-center rounded p-2 "><BackButton/> Compte Particulier</h2>
      <ProgressBar className='m-4' now={(step / 3) * 100} label={`Étape ${step} sur 3`} />
      {renderStep()}
      <div className="col-md-12 d-flex justify-content-between mt-3">
        {step > 1 && <Button variant="secondary" className='m-2' onClick={() => setStep(step - 1)}>Précédent</Button>}
        {step < 3 && <Button variant="primary" className='m-2' onClick={handleNextStep}>Suivant</Button>}
        {step === 3 && <Button variant="success" type="submit">S'inscrire</Button>}
      </div>
    </Form>
  );
};

export default InscriptionUser;
