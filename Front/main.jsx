
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';

// import des Fichiers bootstrap et des fichier reset 
import '../Front/src/styles/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.min.js'; // Corrected here
import "../Front/src/styles/monStyle.css";

import './src/compenents/App/Animated/animated.css'; 
import Header from "./src/compenents/App/Header/Header.jsx";
import PrivateRoute from "./src/compenents/PrivateRoute/PrivateRoute.jsx";
import Inscription from "./src/compenents/App/ContactForm/Inscription/Inscription.jsx";
import Connexion from "./src/compenents/App/ContactForm/Inscription/Connexion.jsx";
import ConditionGeneralUtilisation from './src/compenents/App/Router/ConditionGeneralUtilisation/ConditionGeneralUtilisation.jsx';
import Acceuil from './src/compenents/App/Router/Acceuil/Acceuil.jsx';
import Blog from './src/compenents/App/Router/Blog/Blog.jsx';
import Article from './src/compenents/App/Article/Addarticle.jsx';
import ReadArticles from './src/compenents/App/Article/ReadArticle.jsx';
import Prestations from './src/compenents/App/Router/Prestation/Prestations.jsx';
import Boutique from './src/compenents/App/DashboarClientBoutique/Boutique.jsx';
import Profil from "./src/compenents/App/Profil/Profil.jsx";
import AjouterAvatar from './src/compenents/App/Profil/AjouterAvatar.jsx';
import Contact from "./src/compenents/App/ContactForm/Inscription/Contact.jsx";
import Ajouterproduit from './src/compenents/App/DashboardAdmin/AjouterProduits/AjouterProduit.jsx';
import AjouterCategorie from './src/compenents/App/DashboardAdmin/AjouterCategorie/AjouterCategorie.jsx';
import MesProduits from './src/compenents/App/DashboardAdmin/MesProduits/MesProduits.jsx';
import ModiffierProduit from './src/compenents/App/DashboardAdmin/MesProduits/GestionProduit/ModiffierProduit.jsx';
import AjouterPhoto from './src/compenents/App/DashboardAdmin/MesProduits/GestionProduit/AjouterPhoto.jsx';
import ScrollToTopButton from "./src/compenents/App/ScrollToTopButton/ScrollToTopButton.jsx";
import WhatsAppButton from "./src/compenents/AuthSecure/WatsAppButton.jsx";
import Footer from "./src/compenents/App/Footer/Footer.jsx";
import AddImageArticle from './src/compenents/App/Article/AddImageArticle.jsx';
import Star from './src/compenents/App/Animated/Star.jsx';
import MesProduitsEnAttente from './src/compenents/App/DashboardAdmin/MesProduits/MesProduitsEnAttente.jsx';
import Devis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/Devis.jsx';
import AfficherDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/AfficherDevis.jsx';
import VoirMesDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/VoirMesDevis.jsx';
import OuvrirLeDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/OuvrirLeDevis.jsx';
import Facture from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Facture/FactureDevis.jsx';
import ModifierDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/ModifierDevis.jsx';
import Commande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/commande/Commande.jsx';
import Portfolio from './src/compenents/Portfolio/Portfolio.jsx';
import FetchPortfolio from './src/compenents/Portfolio/FetchPortfolio.jsx';
import AjouterImagePortfolio from './src/compenents/Portfolio/AjouterImagePortfolio.jsx';
import VoirMesCommande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/commande/VoirMesCommande.jsx';
import MotDePassePerdu from './src/compenents/App/ContactForm/Inscription/MotDePassePerdu.jsx';
import NouveauMotDePasse from './src/compenents/App/ContactForm/Inscription/NouveauMotDePasse.jsx';
import ModifierCommande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/commande/ModifierCommande.jsx';
import OuvrirLeCommande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/commande/OuvrirCommande.jsx';
import OuvrirCommande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/commande/OuvrirCommande.jsx';
import FactureDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Facture/FactureDevis.jsx';
import FactureCommande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Facture/factureCommande.jsx';
import AmonSujet from './src/compenents/Portfolio/AmonSujet.jsx';

function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  return userLang.startsWith('fr') ? 'fr' : 'en';
}
const detectedLang = detectLanguage();

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/Inscription" element={<Inscription />} />
      <Route path="/Connexion" element={<Connexion />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/" element={  <Acceuil /> } />
      <Route path="/Profil" element={<Profil />} />
      <Route path="/Ajouter/Avatar" element={<AjouterAvatar />} />
      <Route path="/Boutique" element={<Boutique />} />
      <Route path="/devis" element={<Devis />} />
      <Route path="/VoirMesDevis" element={<VoirMesDevis />} />
      <Route path="/AfficherDevis" element={<AfficherDevis />} />
      <Route path="/AjouterProduit" element={<Ajouterproduit />} />
      <Route path="/AjouterCategorie" element={<AjouterCategorie />} />
      <Route path="/VoirMesProduits" element={<MesProduits />} />
      <Route path="/ProduitsEnAttente" element={<MesProduitsEnAttente />} />
      <Route path="/ModiffierProduit/:produitId" element={<ModiffierProduit />} />
      <Route path="/AjouterPhoto/:produitId" element={<AjouterPhoto />} />
      <Route path="/Blog" element={<Blog />} />
      <Route path="/Cgu" element={<ConditionGeneralUtilisation />} />
      <Route path="/Prestations" element={<Prestations />} />
      <Route path="/Article" element={<Article />} />
      <Route path="/AddImageArticle/:articleId" element={<AddImageArticle />} />
      <Route path="/ReadArticles" element={<ReadArticles />} />
      <Route path="/ouvrirDevis/:devisId" element={<OuvrirLeDevis />} />
      <Route path="/ouvrirCommande/:commandeId" element={<OuvrirCommande />} />
      <Route path="/factureDevis" element={<FactureDevis />} />
      <Route path="/factureCommande" element={<FactureCommande />} />
      <Route path="/modifierDevis" element={<ModifierDevis />} />
      <Route path="/modifierCommande" element={<ModifierCommande />} />
      <Route path="/commande" element={<Commande />} />
      <Route path="/VoirMesCommande" element={<VoirMesCommande />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/ajouterImagesPortfolio" element={<AjouterImagePortfolio />} />
      <Route path="/motDePassePerdu" element={<MotDePassePerdu />} />
      <Route path="/api/reset-password/:token" element={<NouveauMotDePasse />} />
      <Route path="/aMonSujet" element={<AmonSujet />} />
    </Routes>
    <ScrollToTopButton />
    <WhatsAppButton phoneNumber="+33768221452" />
    <Footer />
  </BrowserRouter>
);
