import React, { useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

const PaymentForm = ({ total, finaliserAchats, onPaymentResponse }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
      setError('Element de carte non trouvé.');
      return;
    }

    const { error: createPaymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: event.target.cardholderName.value,
        email: event.target.email.value,
      },
    });

    if (createPaymentMethodError) {
      setError(createPaymentMethodError.message);
      return;
    }

    const response = await fetch('http://localhost:4242/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: total * 100 }),
    });

    const paymentIntentResponse = await response.json();

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(paymentIntentResponse.clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      setError(confirmError.message);
    } else if (paymentIntent.status === 'succeeded') {
      setSuccess(true);
      onPaymentResponse('Paiement accepté');
      finaliserAchats();
    }
  };

  const handleCheckboxChange = (event) => {
    setShowPhoneInput(event.target.checked);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2 className="m-2">Payer par carte</h2>

      {/* Email */}
      <div className="m-2">
        <label htmlFor="email" className="form-label">E-mail</label>
        <input type="email" className="form-control p-2 border border-black" id="email" name="email" required />
      </div>

      {/* Informations de la carte */}
      <h3 className="m-2">Informations de la carte</h3>
      <div>
        <label htmlFor="cardNumber" className="form-label m-2">Numéro de carte</label>
        <div className='p-2 border border-black m-2 rounded' style={{ display: 'flex', alignItems: 'center' }}>
          <CardNumberElement className="form-control" id="cardNumber" />
          <FontAwesomeIcon icon={faCcVisa} className="fa-2x ms-2" />
          <FontAwesomeIcon icon={faCcMastercard} className="fa-2x ms-2" />
        </div>
      </div>
      <div className='p-3 border border-black m-2 rounded'>
        <CardExpiryElement />
      </div>
      <div className='p-3 border border-black m-2 rounded'>
        <CardCvcElement />
      </div>

      {/* Nom du titulaire de la carte */}
      <div className="m-2">
        <label htmlFor="cardholderName" className="form-label">Nom du titulaire de la carte</label>
        <input type="text" className="form-control border border-black" id="cardholderName" name="cardholderName" required />
      </div>

      {/* Pays ou région */}
      <div className="m-2">
        <label htmlFor="country" className="form-label">Pays ou région</label>
        <input type="text" className="form-control border border-black" id="country" name="country" required />
      </div>

      {/* Téléphone (conditionnel) */}
      <div className="m-1 p-1 rounded border border-black">
        <div className="form-check">
          <input type="checkbox" className="form-check-input" id="termsCheckbox" onChange={handleCheckboxChange} />
          <label className="form-check-label" htmlFor="termsCheckbox">
            En enregistrant mes informations, j'accepte les Conditions d'utilisation et la Politique de confidentialité de Link.
          </label>
        </div>
        {showPhoneInput && (
          <div className="mt-3">
            <label htmlFor="phone" className="form-label">Téléphone</label>
            <input type="tel" className="form-control" id="phone" name="phone" pattern="[0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{2}" title="Entrez un numéro de téléphone valide au format 06 12 34 56 78" required />
          </div>
        )}
      </div>

      {/* Bouton de paiement */}
      <div className='row mx-auto m-2 p-2'>
        <button className="btn btn-primary" type="submit" disabled={!stripe}>
          {success ? 'Traitement...' : `Payer`} : {total} €
        </button>
      </div>

      {/* Messages d'erreur et de succès */}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">Paiement réussi!</div>}
      <p style={{ fontSize: "15px" }} className='fw-bold text-center'>Propulsé par dwaccess.com</p>
      <div className="d-flex justify-content-around">
        <Link to="https://stripe.com/fr/legal/consumer">Condition d'utilisation</Link>
        <Link to="https://stripe.com/fr/privacy">Confidentialité</Link>
      </div>
    </form>
  );
};

export default PaymentForm;
