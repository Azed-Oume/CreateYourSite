import React, { useState } from 'react';
import { Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';



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

const NouveauMotDePasse = () => {
    const { token }  = useParams();
    console.log(token, "en ligne 31 de NouveauMotDePasse");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    // const query = useQuery();
    // const token = query.get('token');
    const navigate = useNavigate();
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const options = { minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'password') {
            setPassword(value);
        } else if (name === 'confirmPassword') {
            setConfirmPassword(value);
        }

        if (password !== confirmPassword) {
            setPasswordMatchError(true);
        } else {
            setPasswordMatchError(false);
        }
    };

    const validateStep = () => {
        const isPasswordValid = validatePassword(password, options);
        const passwordMatch = password === confirmPassword;
        setPasswordMatchError(!passwordMatch);
        return password && passwordMatch && isPasswordValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) {
            setMessage('Les mots de passe ne correspondent pas ou ne sont pas assez forts.');
            return;
        }

        try {
            
            // const token = localStorage.getItem('token'); // A vériffier!
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // a vériffier!
                },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await response.json();
            setMessage(data.message);

            if (response.status === 200) {
                navigate("/Connexion"); // Rediriger vers la page de connexion après le succès
                alert(" Votre mot de passe a était regénérer avec succes !")
            }
        } catch (error) {
            setMessage('Une erreur s\'est produite. Veuillez réessayer plus tard.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container graylogo col-md-10 p-4 rounded-4" style={{ marginTop: "140px" }}>
            <h2 className="h2 text-center text-white fw-bold rounded p-2 mb-3">Réinitialiser le mot de passe</h2>
            <Form className="row mx-auto mb-5" onSubmit={handleSubmit}>
                <FormGroup className='mb-3 col-md-6'>
                    <FormLabel className="form-control bg-secondary text-white fw-bold mb-3" htmlFor="password">
                        Nouveau mot de passe
                    </FormLabel>
                    <FormControl
                        className="form-control mx-auto mb-3"
                        autoComplete="new-password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        required
                    />
                </FormGroup>
                <FormGroup className='mb-3 col-md-6'>
                    <FormLabel className="form-control bg-secondary text-white fw-bold mb-3" htmlFor="confirmPassword">
                        Confirmer le nouveau mot de passe
                    </FormLabel>
                    <FormControl
                        className="form-control mx-auto mb-3"
                        autoComplete="new-password"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                </FormGroup>
                {passwordMatchError && (
                    <p className="col-md-12 fs-4 fw-bold text-dark mb-2">Les mots de passe ne correspondent pas.</p>
                )}
                <div className="mb-3 d-flex">
                    <Button variant="success" className="mx-auto" type="submit">Réinitialiser le mot de passe</Button>
                </div>
            </Form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default NouveauMotDePasse;
