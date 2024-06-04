
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

    const [detailProjet, setDetailProjet] = useState("");
    const handleChangeDetailProjet = (e) => {
        setDetailProjet(e.target.value);
    };

    useEffect(() => {
        const fetchSociete = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/getSociete/2');
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
                    console.log('Token absent, aucune requête fetch effectuée.');
                    alert("Connectez-vous ou créez un compte pour ajouter un devis !");
                    return;
                  }
                const response = await fetch('http://localhost:3000/api/getUser', {
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
                const numeroDevis = `${annee}${mois}${jour}${minutes}${seconds}/${nomClient}${prenomClient}/${randomDigits}`;
                setNumeroDevis(numeroDevis); // Met à jour la variable d'état avec le numéro de devis généré
            };

            generateNumeroDevis(); // Appel de la fonction pour générer le numéro de devis unique
        }
    }, [client]);



    const validateDevis = "7";
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
        
        pdf.rect(60, 80, 90, 15); // Rectangle pour encadrer les informations sur le client
        pdf.text(`Devis numéro: ${numeroDevis}`, 70 ,90); // Affiche le numéro de devis à la position spécifiée
        
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
            head: [["Contenu du devis", "", "", ""]], // En-tête du tableau
            body: [
                // Les données du panier
                ['Nom', 'Tarif', 'Quantité', 'Total'],
                ...panier.map(produit => [produit.nom, produit.tarif + ' €', produit.quantite, (produit.tarif * produit.quantite).toFixed(2) + ' €'])
            ]
        });

        // Total du devis
        const total = panier.reduce((total, produit) => total + produit.tarif * produit.quantite, 0).toFixed(2); // Calcul du total du devis
        pdf.text(`${validateDevis} : ${total} €`, 140, pdf.autoTable.previous.finalY + 10); // Affichage du total du devis

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
        let marginTop = 220;
         // Réduire la taille de la police uniquement pour les mentions légales
        pdf.setFontSize(8); // Taille de police réduite pour les mentions légales

    
         // Affichage des mentions légales
             // Affichage des mentions légales
            mentionsLegales.forEach((mention, index) => {
                const splitMention = pdf.splitTextToSize(mention, 170); // Divise le texte en lignes de 170 de large
                const lines = pdf.splitTextToSize(mention, 170);
                const textHeight = pdf.getTextDimensions(lines).h;
                pdf.text(lines, 20, marginTop);
                marginTop += textHeight + 2; // Ajuste la position verticale pour la prochaine mention légale
            });
    
        // Télécharge le PDF avec le nom 'devis.pdf'
        pdf.save(`devis${numeroDevis}.pdf`);
        
        await envoyerDevis(numeroDevis, panier);
    };
    


   // Fonction pour envoyer le devis en base de données
const envoyerDevis = async (numeroDevis, panierDuDevis) => {
    console.log(panierDuDevis, "en ligne 155 XXXXXXXXX");
    if (!panierDuDevis.length) {
        throw new Error('Le panier est vide');
    };
    // if (telechargementClic) return;
    console.log(numeroDevis, " en ligne 158 XXXXXXXXXXXXXXXXXXXXX");
    console.log(panierDuDevis, "en ligne 159 XXXXXXXXXXXXXXXXXX");
    try {
        console.log(panierDuDevis, "en ligne 161 XXXXXXXXX");
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/create/devis', {
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
        console.log(data);
        window.location.href = "/Boutique";

    } catch (error) {
        // Gérer les erreurs
        console.error(error);
        alert('Une erreur est survenue lors de la création du devis');
    }
};
const conditionsPaiement = "A la confirmation du devis"


    return (
        <div id="devis" className="col-md-11 mx-auto graylogo rounded p-3">
            <section>
                <div>
                    <h3 className='p-3 text-center rounded'>Devis numéro : {numeroDevis} </h3>
                </div>
                <Form className=''>
                    <Row>
                        {/* Informations sur la société */}
                        <Col md={12} lg={6} className="border border-secondary p-2 rounded mb-3">
                                        
                                        <div className=''>
                                            <div className='d-flex justify-content-between p-2'>
                                                <img src ={societe && societe.avatar} style={{width: "100px", height: "100px", borderRadius: "50%"}} />
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>{societe && societe.societe}</span>
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>{societe && societe.rue}</span>
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>{societe && societe.ville}</span>
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>{societe && societe.code_postal}</span>
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>{societe && societe.telephone}</span>
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>Contact  : MR  {societe && societe.pseudo}</span>
                                            </div>
                                        </div>
                        </Col>
                        {/* Informations sur le client */}
                        <Col md={12} lg={6} className="border border-secondary p-2 rounded mb-3">
                                        <div className=''>

                                            <div className='d-flex justify-content-between p-2'>
                                                <img src ={client && client.avatar} style={{width: "100px", height: "100px", borderRadius: "50%"}} />
                                                <h5 className='p-3 text-center rounded fw-bold'>{client && client.pseudo} </h5>
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>{client && client.nom}</span>
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>{client && client.prenom}</span>
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>{client && client.rue}</span>
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>{client && client.ville}</span>
                                            </div>
                                            <div className="mb-3 text-white fw-bold fs-6">
                                                <span>{client && client.code_postal}</span>
                                            </div>
                                        </div>
                        </Col>
                    </Row>
                    <table className="table">
                        <thead >
                            <tr>
                                <th>Nom</th>
                                <th>Tarif</th>
                                <th>Quantité</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {panier && panier.map((produit, index) => (
                                <tr key={index} data-name={produit.nom} data-tarif={produit.tarif} data-quantite={produit.quantite} data-total={(produit.tarif * produit.quantite).toFixed(2)}>
                                    <td>{produit.nom}</td>
                                    <td>{produit.tarif} €</td>
                                    <td>{produit.quantite}</td>
                                    <td>{(produit.tarif * produit.quantite).toFixed(2)} €</td>
                                </tr>
                            ))}
                            {/* Total du devis */}
                            <tr>
                                <td colSpan="3" className="fw-bold text-end">Total du devis :</td>
                                <td className="fw-bold">
                                    <span name="total" value={panier.reduce((total, produit) => total + produit.tarif * produit.quantite, 0).toFixed(2)}>{panier.reduce((total, produit) => total + produit.tarif * produit.quantite, 0).toFixed(2)} €</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div className='bg-white '>
                        <p className='text-center p-2'>
                                    validité du devis : {validateDevis} Jours
                        </p>
                    </div>
                    <label className='bg-white text-center p-2'>
                        Détail de votre projet en quelques mots :
                            <textarea
                                className='m-1'
                                value={detailProjet}
                                onChange={handleChangeDetailProjet}
                                required>
                            </textarea>
                    </label>
                </Form>
                <div className="text-center">
                    <Button variant="primary" onClick={handleDownloadPDF}>
                       Sauvegarder et télécharger le devis PDF
                    </Button>
                </div>
                <section className="mt-4">
                    <article className="border-top pt-3">
                        <p className='bg-white text-center p-2'>
                            <strong>Mentions légales :</strong>
                        </p>
                        <form className="d-flex justify-content-between flex-wrap bg-white text-center p-2">
                            <div className="text-center col-md-12">
                            <span>Société : {societe && societe.societe}</span>
                            <span>Adresse : {societe && `${societe.rue}, ${societe.code_postal} ${societe.ville}`}</span>
                            <span>Téléphone : {societe && societe.telephone}</span>
                            <span>Email : {societe && societe.email}</span>
                            <span>SIRET : {societe && societe.siret}</span>
                            <span>Numéro de TVA : {societe && societe.numero_tva}</span>
                            <span>Conditions de paiement : {conditionsPaiement}</span>
                            <span>Validité du devis : {validateDevis} jours</span>
                            {/* <span>Date d'émission : {date_devis}</span><br /> */}
                            </div>
                        </form>
                    </article>
                    <div>
                        <p className='bg-white text-center p-2'>
                            <strong>Important :</strong> En acceptant ce devis, vous reconnaissez avoir pris connaissance et accepter nos conditions générales de vente. Conformément à l'article 1583 du Code civil, la vente est parfaite entre les parties dès qu'elles sont convenues de la chose et du prix, même si la chose n'a pas encore été livrée ni le prix payé.
                        </p>
                        <p className='bg-white text-center p-2'>
                            <strong>Engagement de paiement :</strong> L'acceptation du devis vaut commande ferme et engage le client à régler la somme due. Toute commande validée est due et doit être payée selon les conditions de paiement convenues.
                        </p>
                        <p className='bg-white text-center p-2'>
                            <strong>Retard de paiement :</strong> Conformément à l'article L441-10 du Code de commerce, tout retard de paiement entraîne, de plein droit et sans formalité préalable, l'application de pénalités de retard calculées sur la base du taux d'intérêt légal majoré de 10 points. Une indemnité forfaitaire pour frais de recouvrement de 40 euros sera également due (article D441-5 du Code de commerce).
                        </p>
                        <p className='bg-white text-center p-2'>
                            <strong>Rétractation :</strong> Pour les consommateurs (au sens de l'article liminaire du Code de la consommation), vous bénéficiez d'un droit de rétractation de 14 jours à compter de la conclusion du contrat, conformément à l'article L221-18 du Code de la consommation. Ce droit ne s'applique pas aux prestations de services pleinement exécutées avant la fin du délai de rétractation avec votre accord préalable exprès et renoncement exprès à votre droit de rétractation.
                        </p>
                        <p className='bg-white text-center p-2'>
                            <strong>Protection des données :</strong> Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et au règlement général sur la protection des données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant. Pour exercer ce droit, vous pouvez nous contacter à l'adresse email suivante : {societe && societe.email}. Vos données ne seront utilisées que dans le cadre de votre commande et ne seront en aucun cas partagées avec des tiers sans votre consentement explicite.
                        </p>
                        <p className='bg-white text-center p-2'>
                            <strong>Force majeure :</strong> La société ne pourra être tenue pour responsable de l'inexécution de l'une de ses obligations en cas de force majeure telle que définie par la jurisprudence française, notamment en cas de catastrophe naturelle, incendie, grève, etc.
                        </p>
                        <p className='bg-white text-center p-2'>
                            <strong>Litiges :</strong> En cas de litige, les parties s'efforceront de résoudre leur différend à l'amiable. À défaut, les tribunaux compétents seront ceux du siège social de la société, sauf disposition légale contraire. Pour les consommateurs, tout litige peut également être soumis au médiateur de la consommation.
                        </p>
                        <p className='bg-white text-center p-2'>
                            <strong>Acceptation :</strong> L'acceptation du devis par voie électronique vaut acceptation expresse du client. Conformément à l'article 1369-2 du Code civil, ce devis, validé par voie électronique, constitue un écrit électronique et a, entre les parties, la même valeur probante qu'un document papier.
                        </p>
                    </div>
                </section>
            </section>
        </div>
    );
};

export default AfficherDevis;
