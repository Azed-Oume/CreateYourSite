import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import BackButton from "../../../../AuthSecure/BackButton.jsx";
import PaymentForm from "../../../../SecurePayment/PaymentForm.jsx";

const Facture = ({ type }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data, societe, client } = location.state;
    const [showModal, setShowModal] = useState(false);

    const documentData = type === "devis" ? data.devis : data.commande;
    const numeroDocument = type === "devis" ? documentData.numero_devis : documentData.numero_commande;

    const calculateTVA = (tarifHT) => tarifHT * 0.2;

    const calculateTotalTTC = (tarifHT, quantite) => (tarifHT * quantite) * 1.2;

    const panier = documentData.Produits.map(produit => {
        const quantite = data.quantites.find(q => q.produit_id === produit.produit_id)?.quantite || 0;
        const tarifHT = parseFloat(produit.tarif).toFixed(2) || 0;
        const tva = calculateTVA(tarifHT);
        const totalTTC = calculateTotalTTC(tarifHT, quantite);

        return {
            ...produit,
            quantite,
            tva,
            totalTTC
        };
    });

    // const totalGeneral = panier.reduce((total, produit) => total + produit.totalTTC, 0);

    // const handleDownloadPDF = async () => {
    //     if (!societe || !client) return;

    //     const pdf = new jsPDF();
    //     pdf.setFontSize(12);

    //     pdf.rect(20, 15, 80, 60);
    //     pdf.text(`${societe.societe || ""}`, 25, 20);
    //     pdf.text(`${societe.rue || ""}`, 25, 30);
    //     pdf.text(`${societe.ville || ""}`, 25, 40);
    //     pdf.text(`${societe.code_postal || ""}`, 25, 50);
    //     pdf.text(`${societe.nom || ""}`, 25, 60);

    //     pdf.rect(110, 15, 80, 60);
    //     pdf.text(`${client.nom || ""}`, 115, 20);
    //     pdf.text(`${client.prenom || ""}`, 115, 30);
    //     pdf.text(`${client.rue || ""}`, 115, 40);
    //     pdf.text(`${client.ville || ""}`, 115, 50);
    //     pdf.text(`${client.code_postal || ""}`, 115, 60);

    //     pdf.rect(55, 83, 105, 10);
    //     pdf.text(`Facture numéro : FAC/${numeroDocument || ""}`, 60, 90);

    //     let y = 100;
    //     pdf.autoTable({
    //         startY: y,
    //         head: [["Nom", "Tarif HT", "Quantité", "TVA 20%", "Total TTC"]],
    //         body: panier.map(produit => [
    //             produit.nom,
    //             produit.tarif + " €",
    //             produit.quantite,
    //             (produit.tarif * .2).toFixed(2),
    //             ((produit.tarif * produit.quantite) * 1.2).toFixed(2) + " €"
    //         ])
    //     });

    //     pdf.text(`Total à régler : ${totalGeneral.toFixed(2)} €`, 150, pdf.autoTable.previous.finalY + 10);

    //     pdf.save(`Facture numéro : FAC/${numeroDocument}.pdf`);
    // };

    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX    
    // Fonction pour générer le PDF
    const handleDownloadPDF = async () => {
        if (!societe || !client || !numeroFacture) return;
    
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
        
        pdf.rect(55, 83, 110, 10); // Rectangle pour encadrer les informations sur le client
        pdf.text(`Facture numéro: ${numeroDocument}`, 60 ,90); // Affiche le numéro de Facture à la position spécifiée
        
        // Encadré pour les informations sur le client
        pdf.rect(110, 15, 80, 60); // Rectangle pour encadrer les informations sur le client
        pdf.text(`${client.nom || ""}`, 115, 20);
        pdf.text(`${client.prenom || ""}`, 115, 30);
        pdf.text(`${client.rue || ""}`, 115, 40);
        pdf.text(`${client.ville || ""}`, 115, 50);
        pdf.text(`${client.code_postal || ""}`, 115, 60);

        // Contenu de la Commande
        let y = 100; // Position verticale de départ du contenu de la commande dans le document PDF
        y += 10; // Ajustement de la position verticale

        pdf.autoTable({
            startY: y, // Position verticale de départ du tableau
            head: [["Contenu de la Facture", "", "", "",""]], // En-tête du tableau
            body: [
                // Les données du panier
                // ['Nom', 'Tarif', 'Quantité', 'Total'],
                ["Nom", "Tarif HT", "Quantité", "TVA 20%", "Total TTC"],
                ...panier.map(produit => [
                    produit.nom, 
                    produit.tarif + ' €', 
                    produit.quantite, 
                    (produit.tarif *.2).toFixed(2), 
                    (produit.tarif * produit.quantite * 1.2).toFixed(2) + ' €'
                ])
            ]
        });

        // Total de la commande
        const total = panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0).toFixed(2); // Calcul du total de la commande
        pdf.text(`Total a régler : ${total} €`, 140, pdf.autoTable.previous.finalY + 10); // Affichage du total de la commande
        
        pdf.text(`Facture régler en ${modePaiement} `, 120, pdf.autoTable.previous.finalY + 20); 
    
        // Mentions légales
        const mentionsLegales = [
            "Mentions légales :",
            `${societe && societe.societe} : ${societe && `${societe.rue}, ${societe.code_postal} ${societe.ville}`} : ${societe && societe.telephone} `,
            `Contact : ${societe && societe.email} : SIRET : ${societe && societe.siret} : Numéro de TVA : ${societe && societe.numero_tva} `,
            `Conditions de paiement : ${conditionsPaiement} : Validité de la Commande : ${validateFacture} `,
            "Important : En passant cette Commande, vous reconnaissez avoir pris connaissance et accepter nos conditions générales de vente.",
            "Engagement de paiement : cette commande est ferme et vous engage à régler les somme due.",
            "Retard de paiement : Conformément à l'article L441-10 du Code de commerce, tout retard de paiement entraîne, de plein droit et sans formalité préalable, l'application de pénalités de retard calculées sur la base du taux d'intérêt légal majoré de 10 points.",
            "Rétractation : Vous bénéficiez d'un droit de rétractation de 14 jours à compter de la conclusion du contrat, conformément à l'article L221-18 du Code de la consommation.",
            "Protection des données : Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.",
            "Force majeure : La société ne pourra être tenue pour responsable de l'inexécution de l'une de ses obligations en cas de force majeure.",
            "Litiges : En cas de litige, les parties s'efforceront de résoudre leur différend à l'amiable. À défaut, les tribunaux compétents seront ceux du siège social de la société.",
            "Acceptation : Cette Commande par voie électronique vaut acceptation expresse du client."
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
    
        // Télécharge le PDF avec le nom 'facture.pdf'
        pdf.save(`Facture${numeroDocument}.pdf`);
        
        await envoyerFacture(numeroDocument, panier, total, modePaiement, null, validateFacture, detailProjet);
    };
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const validateFacture = "Aprés réglement";
const conditionsPaiement = "Comptant "
const modePaiement = "Carte Bancaire";
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// Total de la commande
const total = panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0); // Calcul du total de la commande
   // Fonction pour envoyer la commande en base de données
const envoyerFacture = async (numeroFacture, panierFacture, total, modePaiement, informationPaiement, validateFacture, detailProjet) => {
    
    if (!panierFacture.length) {
        throw new Error('Le panier est vide');
    };
    
    try {
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_URL_API}/api/create/facture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                numeroFacture: numeroFacture,
                detailProjet: detailProjet,
                montantTotal: total,
                modePaiement: modePaiement,
                informationPaiement: informationPaiement,
                panier: panierFacture.map(produit => ({
                    produit_id: produit.produit_id,
                    quantite: produit.quantite
                }))
            })
        });

        // Vérifier si la requête a réussi
        if (!response.ok) {
            // Gérer les erreurs de requête
            throw new Error('Une erreur est survenue lors de la création de la facture');
        }

        // Récupérer les données de la réponse
        const data = await response.json();
        
        window.location.href = "/boutique";

    } catch (error) {
        // Gérer les erreurs
        console.error(error);
        alert('Une erreur est survenue lors de la création de la facture');
    }
};
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



    const handlePayClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// Dans la fonction finaliserAchats, on calcule le total avec remise et on le transmettez au composant Paiement
const finaliserAchats = () => {
    handleCloseModal();
   
  };
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  const handlePaymentResponse = async (responseMessage) => {
    alert(responseMessage);
    setShowModal(false);
  
    if (responseMessage === 'Paiement accepté') {
        navigate("/facture-Boutique", { state: {panier, numeroDocument}}  );
    }
  };
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    return (
        <div className="container rounded mt-5 graylogo p-2">
            <header>
                <h1 className="text-center">Facture-{type.charAt(0).toUpperCase() + type.slice(1)}</h1>
            </header>
            <main className="bg-white p-2 rounded">
                <h2 className="text-center">Facture numéro : FAC/{numeroDocument}</h2>
                <div className="d-flex justify-content-between" role="contentinfo">
                    <section aria-labelledby="societe-details">
                        <h3 id="societe-details">Société</h3>
                        <address>
                            <p>{societe.societe}</p>
                            <p>{societe.rue}</p>
                            <p>{societe.ville}, {societe.code_postal}</p>
                            <p>{societe.nom}</p>
                        </address>
                    </section>
                    <section aria-labelledby="client-details">
                        <h3 id="client-details">Client</h3>
                        <address>
                            <p>{client.nom} {client.prenom}</p>
                            <p>{client.rue}</p>
                            <p>{client.ville}, {client.code_postal}</p>
                        </address>
                    </section>
                </div>
                <h4>Produits</h4>
                <table className="table" role="table">
                    <thead>
                        <tr>
                            <th scope="col">Nom</th>
                            <th scope="col">Tarif HT</th>
                            <th scope="col">Quantité</th>
                            <th scope="col">TVA 20%</th>
                            <th scope="col">Total TTC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {panier.map(produit => (
                            <tr key={produit.produit_id}>
                                <td>{produit.nom}</td>
                                <td>{produit.tarif} €</td>
                                <td>{produit.quantite}</td>
                                <td>{produit.tva.toFixed(2)} €</td>
                                <td>{produit.totalTTC.toFixed(2)} €</td>
                            </tr>
                        ))}
                        <tr>
                                    <td colSpan="4" className="fw-bold text-end" >Total de la facture :</td>
                                    <td className="fw-bold" >
                                        {/* <span name="total" value={panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0).toFixed(2)}>{panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0).toFixed(2)} €</span> */}
                                        <span name="total" value={ total }>{ total } €</span>
                                    </td>
                                </tr>
                    </tbody>
                </table>
                {/* <h4>Total: {totalGeneral.toFixed(2)} €</h4> */}
                <div className="d-flex justify-content-between p-2">
                    <BackButton />
                    <Button onClick={handlePayClick} aria-label="Payer la facture">Payer</Button>
                    {/* <Button onClick={handleDownloadPDF} aria-label="Télécharger la facture en PDF">Télécharger PDF</Button> */}
                </div>
            </main>
            <Modal show={showModal} onHide={handleCloseModal}>
                    <PaymentForm
                        total={total}
                        codePromotionnel={false}
                        
                        finaliserAchats={finaliserAchats}
                        onPaymentResponse={handlePaymentResponse} // Passez le callback au composant enfant
                    />
            </Modal>
        </div>
    );
};

export default Facture;
