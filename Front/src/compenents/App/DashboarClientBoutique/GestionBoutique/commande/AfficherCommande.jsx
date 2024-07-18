
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logofondblanc from "../../../../images/logofondblanc.png";

const AfficherCommande = ({ panier }) => {
    const [panierCommande, setPanierCommande] = useState({panier});
    const [societe, setSociete] = useState("");
    const [client, setClient] = useState("");
    const [numeroCommande, setNumeroCommande] = useState('En attente de génération...'); // Variable d'état pour stocker le numéro de devis
    const [isVisible, setIsVisible] = useState(false);
    const [detailProjet, setDetailProjet] = useState("");
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
                    alert("Connectez-vous ou créez un compte pour ajouter une commande !");
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
            // Génération du numéro de commande unique
            const generateNumeroCommande = () => {
                const date = new Date();
                const annee = date.getFullYear().toString().substr(-2);
                const mois = ('0' + (date.getMonth() + 1)).slice(-2);
                const jour = ('0' + date.getDate()).slice(-2);
                const minutes = ('0' + date.getMinutes()).slice(-2);
                const seconds = ('0' + date.getSeconds()).slice(-2);
                const nomClient = client.nom.slice(0, 2).toUpperCase();
                const prenomClient = client.prenom.slice(0, 2).toUpperCase();
                const randomDigits = Math.floor(100 + Math.random() * 900);
                const numeroCommande = `CMD${annee}${mois}${jour}${minutes}${seconds}/${nomClient}${prenomClient}/${randomDigits}`;
                setNumeroCommande(numeroCommande); // Met à jour la variable d'état avec le numéro de commande généré
            };

            generateNumeroCommande(); // Appel de la fonction pour générer le numéro de commande unique
        }
    }, [client]);
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    const validateCommande = "Aprés réglement";
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX    
    // Fonction pour générer le PDF
    const handleDownloadPDF = async () => {
        if (!societe || !client || !numeroCommande) return;
    
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
        
        pdf.rect(55, 83, 110, 10); // Rectangle pour encadrer les informations sur le client
        pdf.text(`Commande numéro: ${numeroCommande}`, 60 ,90); // Affiche le numéro de Commande à la position spécifiée
        
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
            head: [["Contenu de la Commande", "", "", "",""]], // En-tête du tableau
            body: [
                // Les données du panier
                // ['Nom', 'Tarif', 'Quantité', 'Total'],
                ["Nom", "Tarif HT", "Quantité", "TVA 20%", "Total TTC"],
                ...panier.map(produit => [produit.nom, produit.tarif + ' €', produit.quantite, (produit.tarif *.2).toFixed(2), (produit.tarif * produit.quantite * 1.2).toFixed(2) + ' €'])
            ]
        });

        // Total de la commande
        const total = panier.reduce((total, produit) => total + produit.tarif * produit.quantite, 0).toFixed(2); // Calcul du total de la commande
        pdf.text(`Total a régler : ${(total * 1.2).toFixed(2)} €`, 140, pdf.autoTable.previous.finalY + 10); // Affichage du total de la commande

        pdf.text(`Commande à régler ! `, 140, pdf.autoTable.previous.finalY + 20); 
    
        // Mentions légales
        const mentionsLegales = [
            "Mentions légales :",
            `${societe && societe.societe} : ${societe && `${societe.rue}, ${societe.code_postal} ${societe.ville}`} : ${societe && societe.telephone} `,
            `Contact : ${societe && societe.email} : SIRET : ${societe && societe.siret} : Numéro de TVA : ${societe && societe.numero_tva} `,
            `Conditions de paiement : ${conditionsPaiement} : Validité de la Commande : ${validateCommande} `,
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
    
        // Télécharge le PDF avec le nom 'devis.pdf'
        pdf.save(`Commande${numeroCommande}.pdf`);
        
        await envoyerCommande(numeroCommande, panier);
    };
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   // Fonction pour envoyer la commande en base de données
const envoyerCommande = async (numeroCommande, panierCommande) => {
    
    if (!panierCommande.length) {
        throw new Error('Le panier est vide');
    };
    
    try {
        
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_URL_API}/api/create/commande`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                numeroCommande,
                validateCommande,
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
            throw new Error('Une erreur est survenue lors de la création de la commande');
        }

        // Récupérer les données de la réponse
        const data = await response.json();
        
        window.location.href = "/commande";

    } catch (error) {
        // Gérer les erreurs
        console.error(error);
        alert('Une erreur est survenue lors de la création de la commande');
    }
};
const conditionsPaiement = "A la commande "
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    return (
            <>
            {isVisible && (
                <section id="devis" className="container  graylogo p-4 mt-5 rounded-4 mx-auto">
                    <header>
                        <h3 className='p-3 text-center rounded'>Commande numéro : {numeroCommande} </h3>
                    </header>
                    <Form>
                        <Row>
                            {/* Informations sur la société */}
                            <Col md={12} lg={6} className="border border-secondary p-2 rounded mb-3">
                                <article>
                                    <figure className='d-flex justify-content-between p-2'>
                                        <img src={societe && societe.avatar} style={{ width: "100px", height: "100px", borderRadius: "50%" }} alt="Avatar de la société" />
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
                                <article>
                                    <figure className='d-flex justify-content-between p-2'>
                                        <img src={client && client.avatar} style={{ width: "100px", height: "100px", borderRadius: "50%" }} alt="Avatar du client" />
                                        <figcaption className='p-3 text-center text-white rounded fw-bold'>{client && client.pseudo}</figcaption>
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
                                {panier && panier.map((produit, index) => (
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
                                        <td>{(produit.tarif * .2).toFixed(2)}</td>
                                        <td>{(produit.tarif * produit.quantite * 1.2).toFixed(2)} €</td>
                                  </tr>
                                ))}
                                {/* Total de la commande */}
                                <tr>
                                    <td colSpan="4" className="fw-bold text-end">Total de la commande :</td>
                                    <td className="fw-bold">
                                        <span name="total" value={panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0).toFixed(2)}>{panier.reduce((total, produit) => total + produit.tarif * produit.quantite * 1.2, 0).toFixed(2)} €</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <section className='bg-white '>
                            <p className='text-center p-2'>Validité de la commande : {validateCommande}</p>
                        </section>
                        <section className='bg-white text-center p-2'>
                            <label>Informations complémentaires pour la livraison :</label>
                            <textarea 
                                className='m-1' 
                                value={detailProjet} 
                                onChange={handleChangeDetailProjet} 
                                required>
                                </textarea>
                        </section>
                    </Form>
                    <div className="text-center mt-3">
                        <Button variant="primary" onClick={handleDownloadPDF}>
                        Sauvegarder et télécharger le bon de commande.PDF
                        </Button>
                    </div>
                    <section className="mt-4">
                        <footer style={{ fontSize: '10px' }} className='bg-white p-2'>
                            <article >
                                <h4 className='text-center rounded p-2'>
                                    <strong>Mentions légales :</strong>
                                </h4>
                                    <address className="d-flex flex-wrap col-md-12 mb-1">
                                        <p className='mb-1'><strong> Société :</strong> {societe && societe.societe} - </p>
                                        <p className='mb-1'><strong>Adresse :</strong> {societe && `${societe.rue}, ${societe.code_postal} ${societe.ville}`} - </p>
                                        <p className='mb-1'><strong>Téléphone :</strong> {societe && societe.telephone} - </p>
                                        <p className='mb-1'><strong>Mail :</strong> {societe && societe.email} - </p>
                                        <p className='mb-1'><strong>Siret :</strong> {societe && societe.siret} - </p>
                                        <p className='mb-1'><strong>tva :</strong> {societe && societe.numero_tva} - </p>
                                        <p className='mb-1'><strong>Conditions de paiement :</strong> {conditionsPaiement} - </p>
                                        <p className='mb-1'><strong>Validité de la commande :</strong> {validateCommande} - </p> 
                                        {/* <p style={{ fontSize: '15px' }}>Date d'émission : {date_commande}</p><br />  */}
                                    </address>
                            </article>
                            <article>
                                <p className='mb-1'>
                                    <strong>Important :</strong> En passant cette commande, vous reconnaissez avoir pris connaissance et accepter nos conditions générales de vente. Conformément à l'article 1583 du Code civil, la vente est parfaite entre les parties dès qu'elles sont convenues de la chose et du prix, même si la chose n'a pas encore été livrée ni le prix payé.
                                </p>
                                <p className='mb-1'>
                                    <strong>Engagement de paiement :</strong> Cette commande est ferme et vous engage à régler la somme due. Toute commande validée est due et doit être payée selon les conditions de paiement convenues.
                                </p>
                                <p className='mb-1'>
                                    <strong>Retard de paiement :</strong> Conformément à l'article L441-10 du Code de commerce, tout retard de paiement entraîne, de plein droit et sans formalité préalable, l'application de pénalités de retard calculées sur la base du taux d'intérêt légal majoré de 10 points. Une indemnité forfaitaire pour frais de recouvrement de 40 euros sera également due (article D441-5 du Code de commerce).
                                </p>
                                <p className='mb-1'>
                                    <strong>Rétractation :</strong> Pour les consommateurs (au sens de l'article liminaire du Code de la consommation), vous bénéficiez d'un droit de rétractation de 14 jours à compter de la conclusion du contrat, conformément à l'article L221-18 du Code de la consommation. Ce droit ne s'applique pas aux prestations de services pleinement exécutées avant la fin du délai de rétractation avec votre accord préalable exprès et renoncement exprès à votre droit de rétractation.
                                </p>
                                <p className='mb-1'>
                                    <strong>Protection des données :</strong> Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et au règlement général sur la protection des données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant. Pour exercer ce droit, vous pouvez nous contacter à l'adresse email suivante : {societe && societe.email}. Vos données ne seront utilisées que dans le cadre de votre commande et ne seront en aucun cas partagées avec des tiers sans votre consentement explicite.
                                </p>
                                <p className='mb-1'>
                                    <strong>Force majeure :</strong> La société ne pourra être tenue pour responsable de l'inexécution de l'une de ses obligations en cas de force majeure telle que définie par la jurisprudence française, notamment en cas de catastrophe naturelle, incendie, grève, etc.
                                </p>
                                <p className='mb-1'>
                                    <strong>Litiges :</strong> En cas de litige, les parties s'efforceront de résoudre leur différend à l'amiable. À défaut, les tribunaux compétents seront ceux du siège social de la société, sauf disposition légale contraire. Pour les consommateurs, tout litige peut également être soumis au médiateur de la consommation.
                                </p>
                                <p className='mb-1'>
                                    <strong>Acceptation :</strong> L'acceptation du devis par voie électronique vaut acceptation expresse du client. Conformément à l'article 1369-2 du Code civil, ce devis, validé par voie électronique, constitue un écrit électronique et a, entre les parties, la même valeur probante qu'un document papier.
                                </p>
                            </article>
                        </footer>
                    </section>
                </section>
                )}
            </>


    );
};

export default AfficherCommande;
