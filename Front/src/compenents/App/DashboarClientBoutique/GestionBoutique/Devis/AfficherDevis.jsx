
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logofondblanc from "../../../../images/logofondblanc.png";

const AfficherDevis = ({ panier }) => {
    const [panierDuDevis, setPanierDuDevis] = useState({panier});
    const [societe, setSociete] = useState("");
    const [client, setClient] = useState("");
    const [numeroDevis, setNumeroDevis] = useState('En attente de génération...'); // Variable d'état pour stocker le numéro de devis
    const [isVisible, setIsVisible] = useState(false);
    const [detailProjet, setDetailProjet] = useState("");
    const validateDevis = "7";
    const conditionsPaiement = "A la confirmation du devis"

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    const handleChangeDetailProjet = (e) => {
        setDetailProjet(e.target.value);
    };

    useEffect(() => {
        if (panier && panier.length > 0) {
            setIsVisible(true); // Mettre à jour isVisible si le panier n'est pas vide
        } else {
            setIsVisible(false); // Sinon, masquer le devis
        }
    }, [panier]); // Surveiller les changements dans le panier pour mettre à jour la visibilité

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX    
    useEffect(() => {
        const fetchSociete = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/getSociete/2`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des informations de la société');
                }
                const data = await response.json();
                setSociete(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchClient = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    // Si le token est absent, ne pas faire de fetch
                    alert("Connectez-vous ou créez un compte pour ajouter un devis !");
                    return;
                  }
                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/getUser`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des informations du client');
                }
                const data = await response.json();
                setClient(data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchSociete();
        fetchClient();
    }, []);

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX    
    useEffect(() => {
        if (client) {
            // Génération du numéro de devis unique
            const generateNumeroDevis = () => {
                const date = new Date();
                const annee = date.getFullYear().toString().substr(-2);
                const mois = ('0' + (date.getMonth() + 1)).slice(-2);
                const jour = ('0' + date.getDate()).slice(-2);
                const minutes = ('0' + date.getMinutes()).slice(-2);
                const seconds = ('0' + date.getSeconds()).slice(-2);
                const nomClient = client.nom.slice(0, 2).toUpperCase();
                const prenomClient = client.prenom.slice(0, 2).toUpperCase();
                const randomDigits = Math.floor(100 + Math.random() * 900);
                const numeroDevis = `DEV${annee}${mois}${jour}${minutes}${seconds}/${nomClient}${prenomClient}/${randomDigits}`;
                setNumeroDevis(numeroDevis); // Met à jour la variable d'état avec le numéro de devis généré
            };
            generateNumeroDevis(); // Appel de la fonction pour générer le numéro de devis unique
        }
    }, [client]);

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // Fonction pour générer le PDF
    const handleDownloadPDF = async () => {
        if (!societe || !client || !numeroDevis) return;
    
        const pdf = new jsPDF();
    
        // Définit la taille du papier au format A4
        pdf.setFontSize(12);
        
        // Encadré pour les informations sur la société
        pdf.rect(20, 15, 80, 60); // Rectangle pour encadrer les informations sur la société
        pdf.text(`${societe.societe || ""}`, 25, 20);
        pdf.text(`${societe.rue || ""}`, 25, 30);
        pdf.text(`${societe.ville || ""}`, 25, 40);
        pdf.text(`${societe.code_postal || ""}`, 25, 50);
        pdf.text(`${societe.nom || ""}`, 25, 60);
        // Génération du numéro de devis unique
        
        pdf.rect(55, 83, 105, 10); // Rectangle pour encadrer les informations sur le client
        pdf.text(`Devis numéro: ${numeroDevis}`, 60 ,90); // Affiche le numéro de devis à la position spécifiée
        
        // Encadré pour les informations sur le client
        pdf.rect(110, 15, 80, 60); // Rectangle pour encadrer les informations sur le client
        pdf.text(`${client.nom || ""}`, 115, 20);
        pdf.text(`${client.prenom || ""}`, 115, 30);
        pdf.text(`${client.rue || ""}`, 115, 40);
        pdf.text(`${client.ville || ""}`, 115, 50);
        pdf.text(`${client.code_postal || ""}`, 115, 60);

        // Contenu du devis
        let y = 100; // Position verticale de départ du contenu du devis dans le document PDF
        y += 10; // Ajustement de la position verticale

        pdf.autoTable({
            startY: y, // Position verticale de départ du tableau
            head: [["Contenu du devis", "", "", "", ""]], // En-tête du tableau
            body: [
                // Les données du panier
                ["Nom", "Tarif HT", "Quantité", "TVA 20%", "Total TTC"],
                ...panier.map(produit => [produit.nom, produit.tarif + ' €', produit.quantite, (produit.tarif *.2).toFixed(2), (produit.tarif * produit.quantite * 1.2).toFixed(2) + ' €'])
            ]
        });

        // Total du devis
        const total = panier.reduce((total, produit) => total + produit.tarif * produit.quantite, 0).toFixed(2); // Calcul du total du devis
        pdf.text(`Total a régler : ${(total * 1.2).toFixed(2)} €`, 140, pdf.autoTable.previous.finalY + 10); // Affichage du total du devis

        pdf.text(`Devis valable 7 Jours`, 140, pdf.autoTable.previous.finalY + 20); // Affichage de la validité du devis
    
        // Mentions légales
        const mentionsLegales = [
            "Mentions légales :",
            `${societe && societe.societe} : ${societe && `${societe.rue}, ${societe.code_postal} ${societe.ville}`} : ${societe && societe.telephone} `,
            `Contact : ${societe && societe.email} : SIRET : ${societe && societe.siret} : Numéro de TVA : ${societe && societe.numero_tva} `,
            `Conditions de paiement : ${conditionsPaiement} : Validité du devis : ${validateDevis} jours`,
            "Important : En acceptant ce devis, vous reconnaissez avoir pris connaissance et accepter nos conditions générales de vente.",
            "Engagement de paiement : L'acceptation du devis vaut commande ferme et engage le client à régler la somme due.",
            "Retard de paiement : Conformément à l'article L441-10 du Code de commerce, tout retard de paiement entraîne, de plein droit et sans formalité préalable, l'application de pénalités de retard calculées sur la base du taux d'intérêt légal majoré de 10 points.",
            "Rétractation : Vous bénéficiez d'un droit de rétractation de 14 jours à compter de la conclusion du contrat, conformément à l'article L221-18 du Code de la consommation.",
            "Protection des données : Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.",
            "Force majeure : La société ne pourra être tenue pour responsable de l'inexécution de l'une de ses obligations en cas de force majeure.",
            "Litiges : En cas de litige, les parties s'efforceront de résoudre leur différend à l'amiable. À défaut, les tribunaux compétents seront ceux du siège social de la société.",
            "Acceptation : L'acceptation du devis par voie électronique vaut acceptation expresse du client."
        ];
    
        // Position verticale de départ des mentions légales
        let marginTop = 230;
         // Réduire la taille de la police uniquement pour les mentions légales
        pdf.setFontSize(8); // Taille de police réduite pour les mentions légales

    
         // Affichage des mentions légales
             // Affichage des mentions légales
            mentionsLegales.forEach((mention, index) => {
                const splitMention = pdf.splitTextToSize(mention, 170); // Divise le texte en lignes de 170 de large
                const lines = pdf.splitTextToSize(mention, 170);
                const textHeight = pdf.getTextDimensions(lines).h;
                pdf.text(lines, 20, marginTop);
                marginTop += textHeight + 1; // Ajuste la position verticale pour la prochaine mention légale
            });
    
        // Télécharge le PDF avec le nom 'devis.pdf'
        pdf.save(`devis${numeroDevis}.pdf`);
        
        await envoyerDevis(numeroDevis, panier);
    };

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  
   // Fonction pour envoyer le devis en base de données
const envoyerDevis = async (numeroDevis, panierDuDevis) => {
    
    if (!panierDuDevis.length) {
        throw new Error('Le panier est vide');
    };
    
    try {
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_URL_API}/api/create/devis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                numeroDevis,
                validateDevis,
                detailProjet,
                panier: panier.map(produit => ({
                    nom: produit.nom,
                    tarif: produit.tarif,
                    quantite: produit.quantite,
                    total: produit.total,
                    produit_id: produit.produit_id
                }))
            })
        });

        // Vérifier si la requête a réussi
        if (!response.ok) {
            // Gérer les erreurs de requête
            throw new Error('Une erreur est survenue lors de la création du devis');
        }

        // Récupérer les données de la réponse
        const data = await response.json();
        
        window.location.href = "/devis";

    } catch (error) {
        // Gérer les erreurs
        console.error(error);
        alert('Une erreur est survenue lors de la création du devis');
    }
};

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    return (
        <>
  {isVisible && (
    <section id="devis" className="container graylogo p-4 mt-5 rounded-4 mx-auto">
      <header>
        <h3 className="p-3 text-center rounded">Devis numéro : {numeroDevis}</h3>
      </header>
      <Form>
        <Row>
          {/* Informations sur la société */}
          <Col md={12} lg={6} className="border border-secondary p-2 rounded mb-3">
            <article aria-labelledby="societe-header">
              <header id="societe-header">
                <h4 className="visually-hidden">Informations sur la société</h4>
              </header>
              <figure className="d-flex justify-content-between p-2">
                <img
                  src={societe?.avatar}
                  style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                  alt="Avatar de la société"
                />
              </figure>
              <address className="mb-3 text-white fw-bold fs-6">
                <p>{societe && societe.societe}</p>
                <p>{societe && societe.rue}</p>
                <p>{societe && societe.ville}</p>
                <p>{societe && societe.code_postal}</p>
                <p>{societe && societe.telephone}</p>
                <p>Contact : MR {societe && societe.pseudo}</p>
              </address>
            </article>
          </Col>
          {/* Informations sur le client */}
          <Col md={12} lg={6} className="border border-secondary p-2 rounded mb-3">
            <article aria-labelledby="client-header">
              <header id="client-header">
                <h4 className="visually-hidden">Informations sur le client</h4>
              </header>
              <figure className="d-flex justify-content-between p-2">
                <img
                  src={client?.avatar}
                  style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                  alt="Avatar du client"
                />
                <figcaption className="p-3 text-center text-white rounded fw-bold">
                  {client?.pseudo}
                </figcaption>
              </figure>
              <address className="mb-3 text-white fw-bold fs-6">
                <p>{client && client.nom}</p>
                <p>{client && client.prenom}</p>
                <p>{client && client.rue}</p>
                <p>{client && client.ville}</p>
                <p>{client && client.code_postal}</p>
              </address>
            </article>
          </Col>
        </Row>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Tarif HT</th>
                            <th>Quantité</th>
                            <th>TVA 20%</th>
                            <th>Total TTC</th>
                        </tr>
                    </thead>
                  <tbody>
            {panier?.map((produit, index) => (
              <tr
                key={index}
                data-name={produit.nom}
                data-tarif={produit.tarif}
                data-quantite={produit.quantite}
                data-tva={(produit.tarif * .2).toFixed(2)}
                data-total={(produit.tarif * produit.quantite * 1.2).toFixed(2)}
              >
                <td>{produit.nom}</td>
                <td>{produit.tarif} €</td>
                <td>{produit.quantite}</td>
                <td>{produit.tarif * .2}</td>
                <td>{(produit.tarif * produit.quantite * 1.2).toFixed(2)} €</td>
              </tr>
            ))}
            {/* Total du devis */}
            <tr>
              <td colSpan="4" className="fw-bold text-end">
                Total du devis :
              </td>
              <td className="fw-bold">
                <span name="total" value={panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0).toFixed(2)}>
                  {panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0).toFixed(2)} €
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <section className="bg-white">
          <p className="text-center p-2">Validité du devis : {validateDevis} jours</p>
        </section>
        <section className="bg-white text-center p-2">
          <label htmlFor="detailProjet">Détail de votre projet en quelques mots :</label>
          <textarea
            id="detailProjet"
            className="m-1"
            value={detailProjet}
            onChange={handleChangeDetailProjet}
            required>
          </textarea>
        </section>
      </Form>
      <div className="text-center mt-3">
        <Button variant="primary" onClick={handleDownloadPDF}>
          Sauvegarder et télécharger le devis.PDF
        </Button>
      </div>
      <section className="mt-4">
        <footer style={{ fontSize: "10px" }} className="bg-white p-2">
          <article>
            <h4 className="text-center p-2">
              <strong>Mentions légales :</strong>
            </h4>
            <address className="d-flex flex-wrap col-md-12 mb-1">
              <p className='mb-1'>
                <strong>Société :</strong> {societe?.societe} -
              </p>
              <p className='mb-1'>
                <strong>Adresse :</strong> {societe && `${societe.rue}, ${societe.code_postal} ${societe.ville}`} -
              </p>
              <p className='mb-1'>
                <strong>Téléphone :</strong> {societe?.telephone} -
              </p>
              <p className='mb-1'>
                <strong>Mail :</strong> {societe?.email} -
              </p>
              <p className='mb-1'>
                <strong>Siret :</strong> {societe?.siret} -
              </p>
              <p className='mb-1'>
                <strong>TVA :</strong> {societe?.numero_tva} -
              </p>
              <p className='mb-1'>
                <strong>Conditions de paiement :</strong> {conditionsPaiement} -
              </p>
              <p className='mb-1'>
                <strong>Validité de la commande :</strong> {validateDevis} -
              </p>
            </address>
          </article>
          <article>
            <p className='mb-1'>
              <strong>Important :</strong> En acceptant ce devis, vous reconnaissez avoir pris connaissance et accepter
              nos conditions générales de vente...
            </p>
            <p className='mb-1'>
              <strong>Engagement de paiement :</strong> L'acceptation du devis vaut commande ferme et engage le client à
              régler la somme due...
            </p>
            <p className='mb-1'>
              <strong>Retard de paiement :</strong> Conformément à l'article L441-10 du Code de commerce...
            </p>
            <p className='mb-1'>
              <strong>Rétractation :</strong> Pour les consommateurs (au sens de l'article liminaire du Code de la
              consommation)...
            </p>
            <p className='mb-1'>
              <strong>Protection des données :</strong> Conformément à la loi Informatique et Libertés...
            </p>
            <p className='mb-1'>
              <strong>Force majeure :</strong> La société ne pourra être tenue pour responsable de l'inexécution de
              l'une de ses obligations...
            </p>
            <p className='mb-1'>
              <strong>Litiges :</strong> En cas de litige, les parties s'efforceront de résoudre leur différend à
              l'amiable...
            </p>
            <p className='mb-1'>
              <strong>Acceptation :</strong> L'acceptation du devis par voie électronique vaut acceptation expresse du
              client...
            </p>
          </article>
        </footer>
      </section>
    </section>
  )}
</>


    );
};

export default AfficherDevis;
