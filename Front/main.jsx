
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';

// import des Fichiers bootstrap et des fichier reset 
import '../Front/src/styles/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.min.js'; 
import "../Front/src/styles/monStyle.css";

// import './src/compenents/App/Animated/animated.css'; 
import Header from "./src/compenents/App/Header/Header.jsx";
import PrivateRoute from "./src/compenents/PrivateRoute/PrivateRoute.jsx";
import Inscription from "./src/compenents/App/ContactForm/Inscription/Inscription.jsx";
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
import Ajouterproduit from './src/compenents/App/DashboardAdmin/AjouterProduits/AjouterProduit.jsx';
import AjouterCategorie from './src/compenents/App/DashboardAdmin/AjouterCategorie/AjouterCategorie.jsx';
import VoirMesProduits from './src/compenents/App/DashboardAdmin/MesProduits/VoirMesProduits.jsx';
import ModiffierProduit from './src/compenents/App/DashboardAdmin/MesProduits/GestionProduit/ModiffierProduit.jsx';
import AjouterPhoto from './src/compenents/App/DashboardAdmin/MesProduits/GestionProduit/AjouterPhoto.jsx';
import ScrollToTopButton from "./src/compenents/App/ScrollToTopButton/ScrollToTopButton.jsx";
import WhatsAppButton from "./src/compenents/AuthSecure/WatsAppButton.jsx";
import Footer from "./src/compenents/App/Footer/Footer.jsx";
import MesProduitsEnAttente from './src/compenents/App/DashboardAdmin/MesProduits/MesProduitsEnAttente.jsx';
import Devis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/Devis.jsx';
import AfficherDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/AfficherDevis.jsx';
import VoirMesDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/VoirMesDevis.jsx';
import OuvrirLeDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/OuvrirLeDevis.jsx';
import ModifierDevis from './src/compenents/App/DashboarClientBoutique/GestionBoutique/Devis/ModifierDevis.jsx';
import Commande from './src/compenents/App/DashboarClientBoutique/GestionBoutique/commande/Commande.jsx';
import Portfolio from './src/compenents/Portfolio/Portfolio.jsx';
// import FetchPortfolio from './src/compenents/Portfolio/FetchPortfolio.jsx';
import AjouterImagePortfolio from './src/compenents/Portfolio/AjouterImagePortfolio.jsx';
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
import RoleUtilisateurs from './src/compenents/App/RoleUtilisateurs/RoleUtilisateurs.jsx';

function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  return userLang.startsWith('fr') ? 'fr' : 'en';
}
const detectedLang = detectLanguage();

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
    <Routes>
        <Route index element={<PrivateRoute> <Acceuil /> </PrivateRoute>} />
        <Route path="Inscription" element={<Inscription />} />
        <Route path="Connexion" element={ <Connexion />} />
        <Route path="Contact" element={<Contact />} />
        <Route path="Profil" element={<PrivateRoute> <Profil /> </PrivateRoute>} />
        <Route path="Ajouter/Avatar" element={<PrivateRoute> <AjouterAvatar /> </PrivateRoute>} />
        <Route path="Boutique" element={<PrivateRoute> <Boutique /> </PrivateRoute>} />
        <Route path="devis" element={<PrivateRoute> <Devis /> </PrivateRoute>} />
        <Route path="VoirMesDevis" element={<PrivateRoute> <VoirMesDevis /> </PrivateRoute>} />
        <Route path="AfficherDevis" element={<PrivateRoute> <AfficherDevis /> </PrivateRoute>} />
        <Route path="AjouterProduit" element={<PrivateRoute> <Ajouterproduit /> </PrivateRoute>} />
        <Route path="AjouterCategorie" element={<PrivateRoute> <AjouterCategorie /> </PrivateRoute>} />
        <Route path="VoirMesProduits" element={<PrivateRoute> <VoirMesProduits /> </PrivateRoute>} />
        <Route path="MesProduitsEnAttente" element={<PrivateRoute> <MesProduitsEnAttente /> </PrivateRoute>} />
        <Route path="Utilisateurs" element={<PrivateRoute> <RoleUtilisateurs /> </PrivateRoute>} />
        <Route path="ModiffierProduit/:produitId" element={<PrivateRoute> <ModiffierProduit /> </PrivateRoute>} />
        <Route path="AjouterPhoto/:produitId" element={<PrivateRoute> <AjouterPhoto /> </PrivateRoute>} />
        <Route path="Blog" element={<PrivateRoute> <Blog /> </PrivateRoute>} />
        <Route path="Cgu" element={<PrivateRoute> <ConditionGeneralUtilisation /> </PrivateRoute>} />
        <Route path="Prestations" element={<PrivateRoute> <Prestations /> </PrivateRoute>} />
        <Route path="Article" element={<PrivateRoute> <Article /> </PrivateRoute>} />
        <Route path="/AjouterImageArticle/:articleId" element={<PrivateRoute> <AjouterImageArticle /> </PrivateRoute>} />
        <Route path="AjouterImageArticle" element={<PrivateRoute> <AjouterImageArticle /> </PrivateRoute>} />
        <Route path="ReadArticles" element={<PrivateRoute> <ReadArticles /> </PrivateRoute>} />
        <Route path="ouvrirDevis/:devisId" element={<PrivateRoute> <OuvrirLeDevis /> </PrivateRoute>} />
        <Route path="ouvrirCommande/:commandeId" element={<PrivateRoute> <OuvrirCommande /> </PrivateRoute>} />
        <Route path="facture" element={<PrivateRoute> <VoirMesFactures /> </PrivateRoute>} />
        <Route path="factureCommande" element={<PrivateRoute> <Facture type="commande" /> </PrivateRoute>} />
        <Route path="factureDevis" element={<PrivateRoute> <Facture type="devis" /> </PrivateRoute>} />
        <Route path="ouvrirFacture/:factureId" element={<PrivateRoute> <OuvrirFacture /> </PrivateRoute>} />
        <Route path="modifierDevis" element={<PrivateRoute> <ModifierDevis /> </PrivateRoute>} />
        <Route path="modifierCommande" element={<PrivateRoute> <ModifierCommande /> </PrivateRoute>} />
        <Route path="commande" element={<PrivateRoute> <Commande /> </PrivateRoute>} />
        <Route path="VoirMesCommande" element={<PrivateRoute> <VoirMesCommande /> </PrivateRoute>} />
        <Route path="portfolio" element={<PrivateRoute> <Portfolio /> </PrivateRoute>} />
        <Route path="ajouterImagesPortfolio" element={<PrivateRoute> <AjouterImagePortfolio /> </PrivateRoute>} />
        <Route path="motDePassePerdu" element={<MotDePassePerdu />} />
        <Route path="api/reset-password/:token" element={<NouveauMotDePasse />} />
        <Route path="aMonSujet" element={<PrivateRoute> <AmonSujet /> </PrivateRoute>} />
        <Route path="reserver-pour-utilisateur" element={<ReserveForUser/>} />
        <Route path="/facture-Boutique" element={<PrivateRoute> <FactureBoutique /> </PrivateRoute>} />
        {/* <Route path="factureCommande" element={<FactureCommande/>} />
        <Route path="factureDevis" element={<FactureDevis/>} /> */}
    </Routes>
    </main>
    <ScrollToTopButton />
    <WhatsAppButton phoneNumber="+33768221452" />
    <Footer />
    </div>
  </BrowserRouter>
);
