
// Importer dotenv et configurer la charge des variables d'environnement
import dotenv from 'dotenv';
dotenv.config(); // Charge les variables d'environnement du fichier .env

import express from 'express';
import Stripe from 'stripe';
// import path from 'path';
import cors from 'cors';

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors({ origin: 'http://localhost:1234' }));
// app.use(express.static("public"));
app.use(express.json());

// Middleware pour rediriger HTTP vers HTTPS en production
function ensureSecure(req, res, next){
  if (req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }
  res.redirect('https://' + req.hostname + req.url);
}

if (process.env.NODE_ENV === 'production') {
  app.use(ensureSecure);
}


const calculateOrderAmount = (total) => {

    return total ;
  };
  
  app.post("/create-payment-intent", async (req, res) => {
    const { amount } = req.body;
  
    // Créez un PaymentIntent avec le montant et la devise de la commande
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(amount),
        currency: "eur",
        // Dans la dernière version de l'API, la spécification du paramètre `automatic_payment_methods` est facultative car Stripe active cette fonctionnalité par défaut.
        automatic_payment_methods: {
          enabled: true,
        },
      });
  
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Erreur lors de la création du PaymentIntent:", error);

      res.status(500).json({ error: 'Erreur lors de la création du PaymentIntent' });

    }
  });
  
  const PORT = 4242;
  app.listen(PORT, () => {
    console.log(`Serveur Node écoutant sur le port ${PORT}!`);
  });