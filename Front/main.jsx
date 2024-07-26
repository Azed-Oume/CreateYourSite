
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
// Import de Stripe et React-Stripe  
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CookiesProvider } from 'react-cookie';

// Import des fichiers bootstrap et des fichiers reset 
import '../Front/src/styles/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.min.js'; 
import "../Front/src/styles/monStyle.css";

// Composants dynamiques
const AjouterImagePortfolio = lazy(() => import('./src/compenents/Portfolio/AjouterImagePortfolio.jsx'));
const AjouterProduit = lazy(() => import('./src/compenents/App/DashboardAdmin/AjouterProduits/AjouterProduit.jsx'));
const AjouterCategorie = lazy(() => import('./src/compenents/App/DashboardAdmin/AjouterCategorie/AjouterCategorie.jsx'));
const VoirMesProduits = lazy(() => import('./src/compenents/App/DashboardAdmin/MesProduits/VoirMesProduits.jsx'));
const MesProduitsEnAttente = lazy(() => import('./src/compenents/App/DashboardAdmin/MesProduits/MesProduitsEnAttente.jsx'));
const RoleUtilisateurs = lazy(() => import('./src/compenents/App/RoleUtilisateurs/RoleUtilisateurs.jsx'));

// Import des autres composants
import Header from "./src/compenents/App/Header/Header.jsx";
import PrivateRoute from "./src/compenents/PrivateRoute/PrivateRoute.jsx";
import InscriptionPro from "./src/compenents/App/ContactForm/Inscription/InscriptionPro.jsx";
import ChoixDuCompte from './src/compenents/App/ContactForm/Inscription/ChoixDuCompte.jsx';
import InscriptionUser from './src/compenents/App/ContactForm/Inscription/InscriptionUser.jsx';
import Connexion from "./src/compenents/App/ContactForm/Inscription/Connexion.jsx";
import ConditionGeneralUtilisation from './src/compenents/App/Router/ConditionGeneralUtilisation/ConditionGeneralUtilisation.jsx';
import Acceuil from './src/compenents/App/Router/Acceuil/Acceuil.jsx';
import Blog from './src/compenents/App/Router/Blog/Blog.jsx';
import Article from './src/compenents/App/Article/Addarticle.jsx';
import ReadArticles from './src/compenents/App/Article/ReadArticle.jsx';
import AjouterImageArticle from './src/compenents/App/Article/AjouterImageArticle.jsx';
import Prestations from './src/compenents/App/Router/Prestation/Prestations.jsx';
import Boutique from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Boutique/Boutique.jsx';
import Profil from "./src/compenents/App/Profil/Profil.jsx";
import AjouterAvatar from './src/compenents/App/Profil/AjouterAvatar.jsx';
import Contact from "./src/compenents/App/ContactForm/Inscription/Contact.jsx";
import ModiffierProduit from './src/compenents/App/DashboardAdmin/MesProduits/GestionProduit/ModiffierProduit.jsx';
import AjouterPhoto from './src/compenents/App/DashboardAdmin/MesProduits/GestionProduit/AjouterPhoto.jsx';
import ScrollToTopButton from "./src/compenents/App/ScrollToTopButton/ScrollToTopButton.jsx";
import WhatsAppButton from "./src/compenents/AuthSecure/WatsAppButton.jsx";
import Footer from "./src/compenents/App/Footer/Footer.jsx";
import Devis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/Devis.jsx';
import AfficherDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/AfficherDevis.jsx';
import VoirMesDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/VoirMesDevis.jsx';
import OuvrirLeDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/OuvrirLeDevis.jsx';
import ModifierDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/ModifierDevis.jsx';
import Commande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/commande/Commande.jsx';
import Portfolio from './src/compenents/Portfolio/Portfollio.jsx';
import VoirMesCommande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/commande/VoirMesCommande.jsx';
import MotDePassePerdu from './src/compenents/App/ContactForm/Inscription/MotDePassePerdu.jsx';
import NouveauMotDePasse from './src/compenents/App/ContactForm/Inscription/NouveauMotDePasse.jsx';
import ModifierCommande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/commande/ModifierCommande.jsx';
import OuvrirCommande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/commande/OuvrirCommande.jsx';
import AmonSujet from './src/compenents/Portfolio/AmonSujet.jsx';
import ReserveForUser from './src/compenents/AuthSecure/ReservForUser.jsx';
import Facture from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Facture/facture.jsx';
import VoirMesFactures from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Facture/VoirMesFactures.jsx';
import OuvrirFacture from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Facture/OuvrirFacture.jsx';
import FactureBoutique from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Facture/FactureBoutique.jsx';
import AjouterDescription from './src/compenents/Portfolio/AjouterDescription.jsx';
import Presentation from './src/compenents/App/Router/Presentation/Presentation.jsx';
import PaymentForm from './src/compenents/SecurePayment/PaymentForm.jsx';
import CookieConsentComponent from './Cookies/CookieConsentComponent.jsx';
import CookiePolitiqueDeConfidentialite from './Cookies/CookiePolitiqueDeConfidentialite.jsx';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  return userLang.startsWith('fr') ? 'fr' : 'en';
}

const detectedLang = detectLanguage();

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
    <CookiesProvider>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/politique-de-confidentialite" element={<CookiePolitiqueDeConfidentialite />} />

              <Route path='/paiement' element={<PaymentForm/>} />

              <Route index element={ <Presentation /> } />
              <Route path="/acceuil" element={ <Acceuil /> } />
              <Route path="/Prestations" element={ <Prestations /> } />
              <Route path="/Profil" element={ <Profil /> } />
              <Route path="/Blog" element={ <Blog /> } />
              <Route path="/portfolio" element={ <Portfolio /> } />
              <Route path="/Boutique" element={ <Boutique /> } />
              <Route path="/devis" element={ <Devis /> } />
              <Route path="/commande" element={ <Commande /> } />
              <Route path="/Contact" element={<Contact />} />

              <Route path="/ChoixDuCompte" element={<ChoixDuCompte />} />
              <Route path="/CompteProfessionnel" element={<InscriptionPro />} />
              <Route path="/CompteParticulier" element={<InscriptionUser />} />
              <Route path="/Connexion" element={ <Connexion />} />
              
              <Route path="/resetpassword/:token" element={<NouveauMotDePasse />} />
              <Route path="/motDePassePerdu" element={<MotDePassePerdu />} />

              <Route path="/Ajouter/Avatar" element={<PrivateRoute> <AjouterAvatar /> </PrivateRoute>} />

              <Route path="/VoirMesDevis" element={<PrivateRoute> <VoirMesDevis /> </PrivateRoute>} />
              <Route path="/modifierDevis" element={<PrivateRoute> <ModifierDevis /> </PrivateRoute>} />
              <Route path="/ouvrirDevis/:devisId" element={<PrivateRoute> <OuvrirLeDevis /> </PrivateRoute>} />
              
              <Route path="/VoirMesCommande" element={<PrivateRoute> <VoirMesCommande /> </PrivateRoute>} />
              <Route path="/modifierCommande" element={<PrivateRoute> <ModifierCommande /> </PrivateRoute>} />
              <Route path="/ouvrirCommande/:commandeId" element={<PrivateRoute> <OuvrirCommande /> </PrivateRoute>} />

              <Route path="/VoirMesProduits" element={<PrivateRoute> <VoirMesProduits /> </PrivateRoute>} />
              <Route path="/MesProduitsEnAttente" element={<PrivateRoute> <MesProduitsEnAttente /> </PrivateRoute>} />
              <Route path="/ModiffierProduit/:produitId" element={<PrivateRoute> <ModiffierProduit /> </PrivateRoute>} />
              <Route path="/AjouterProduit" element={<PrivateRoute> <AjouterProduit /> </PrivateRoute>} />
              <Route path="/AjouterPhoto/:produitId" element={<PrivateRoute> <AjouterPhoto /> </PrivateRoute>} />

              <Route path="/AjouterCategorie" element={<PrivateRoute> <AjouterCategorie /> </PrivateRoute>} />
              
              <Route path="/facture" element={<PrivateRoute> <VoirMesFactures /> </PrivateRoute>} />
              <Route path="/facture-Boutique" element={<PrivateRoute> <FactureBoutique /> </PrivateRoute>} />
              <Route path="/factureCommande" element={<PrivateRoute> <Facture type="commande" /> </PrivateRoute>} />
              <Route path="/factureDevis" element={<PrivateRoute> <Facture type="devis" /> </PrivateRoute>} />
              <Route path="/ouvrirFacture/:factureId" element={<PrivateRoute> <OuvrirFacture /> </PrivateRoute>} />
              
              <Route path="/ReadArticles" element={<PrivateRoute> <ReadArticles /> </PrivateRoute>} />
              <Route path="/Article" element={<PrivateRoute> <Article /> </PrivateRoute>} />
              <Route path="/AjouterImageArticle/:articleId" element={<PrivateRoute> <AjouterImageArticle /> </PrivateRoute>} />

              <Route index element={ <Presentation /> } />
              <Route path="/acceuil" element={ <Acceuil /> } />
              <Route path="/Prestations" element={ <Prestations /> } />
              <Route path="/Profil" element={ <Profil /> } />
              <Route path="/Blog" element={ <Blog /> } />
              <Route path="/portfolio" element={ <Portfolio /> } />
              <Route path="/Boutique" element={ <Boutique /> } />
              <Route path="/devis" element={ <Devis /> } />
              <Route path="/commande" element={ <Commande /> } />
              <Route path="/Contact" element={<Contact />} />

              <Route path="/ChoixDuCompte" element={<ChoixDuCompte />} />
              <Route path="/CompteProfessionnel" element={<InscriptionPro />} />
              <Route path="/CompteParticulier" element={<InscriptionUser />} />
              <Route path="/Connexion" element={ <Connexion />} />
              
              <Route path="/resetpassword/:token" element={<NouveauMotDePasse />} />
              <Route path="/motDePassePerdu" element={<MotDePassePerdu />} />

              <Route path="/Ajouter/Avatar" element={<PrivateRoute> <AjouterAvatar /> </PrivateRoute>} />

              <Route path="/VoirMesDevis" element={<PrivateRoute> <VoirMesDevis /> </PrivateRoute>} />
              <Route path="/modifierDevis" element={<PrivateRoute> <ModifierDevis /> </PrivateRoute>} />
              <Route path="/ouvrirDevis/:devisId" element={<PrivateRoute> <OuvrirLeDevis /> </PrivateRoute>} />
              
              <Route path="/VoirMesCommande" element={<PrivateRoute> <VoirMesCommande /> </PrivateRoute>} />
              <Route path="/modifierCommande" element={<PrivateRoute> <ModifierCommande /> </PrivateRoute>} />
              <Route path="/ouvrirCommande/:commandeId" element={<PrivateRoute> <OuvrirCommande /> </PrivateRoute>} />

              <Route path="/VoirMesProduits" element={<PrivateRoute> <VoirMesProduits /> </PrivateRoute>} />
              <Route path="/MesProduitsEnAttente" element={<PrivateRoute> <MesProduitsEnAttente /> </PrivateRoute>} />
              <Route path="/ModiffierProduit/:produitId" element={<PrivateRoute> <ModiffierProduit /> </PrivateRoute>} />
              <Route path="/AjouterProduit" element={<PrivateRoute> <AjouterProduit /> </PrivateRoute>} />
              <Route path="/AjouterPhoto/:produitId" element={<PrivateRoute> <AjouterPhoto /> </PrivateRoute>} />

              <Route path="/AjouterCategorie" element={<PrivateRoute> <AjouterCategorie /> </PrivateRoute>} />
              
              <Route path="/facture" element={<PrivateRoute> <VoirMesFactures /> </PrivateRoute>} />
              <Route path="/facture-Boutique" element={<PrivateRoute> <FactureBoutique /> </PrivateRoute>} />
              <Route path="/factureCommande" element={<PrivateRoute> <Facture type="commande" /> </PrivateRoute>} />
              <Route path="/factureDevis" element={<PrivateRoute> <Facture type="devis" /> </PrivateRoute>} />
              <Route path="/ouvrirFacture/:factureId" element={<PrivateRoute> <OuvrirFacture /> </PrivateRoute>} />
              
              <Route path="/ReadArticles" element={<PrivateRoute> <ReadArticles /> </PrivateRoute>} />
              <Route path="/Article" element={<PrivateRoute> <Article /> </PrivateRoute>} />
              <Route path="/AjouterImageArticle/:articleId" element={<PrivateRoute> <AjouterImageArticle /> </PrivateRoute>} />

              <Route path="/Utilisateurs" element={<PrivateRoute> <RoleUtilisateurs /> </PrivateRoute>} />
              <Route path="/reserver-pour-utilisateur" element={<ReserveForUser />} />
              <Route path="/ajouterImagesPortfolio" element={<PrivateRoute> <AjouterImagePortfolio /> </PrivateRoute>} />
              <Route path="/ajouterDescription" element={<PrivateRoute> <AjouterDescription /> </PrivateRoute>} />
              
              <Route path="/aMonSujet" element={<PrivateRoute> <AmonSujet /> </PrivateRoute>} />
              <Route path="/Cgu" element={ <ConditionGeneralUtilisation /> } />
              
            </Routes>
          </Suspense>
        </main>
        <ScrollToTopButton />
        <WhatsAppButton phoneNumber="+33768221452" />
        <Footer />
        <CookieConsentComponent />
      </div>
      </CookiesProvider>
    </Elements>
  </BrowserRouter>
);
