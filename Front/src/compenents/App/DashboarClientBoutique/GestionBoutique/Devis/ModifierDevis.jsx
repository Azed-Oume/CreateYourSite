
import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import BackButton from '../../../../AuthSecure/BackButton';

const ModifierDevis = () => {
    const [panier, setPanier] = useState([]);
    
    const location = useLocation();
    const [numeroDevis, setNumeroDevis] = useState('En attente de génération...'); // Variable d'état pour stocker le numéro de devis
    const { data, societe, client } = location.state || {}; // Accéder aux données passées via l'état de la navigation

    const [detailProjet, setDetailProjet] = useState("");
    const handleChangeDetailProjet = (e) => {
        setDetailProjet(e.target.value);
    };


    useEffect(() => {
      if (data && data.devis && data.devis.Produits && data.quantites) {
        const nouveauPanier = data.devis.Produits.map(produit => {
          const quantiteProduit = data.quantites.find(q => q.produit_id === produit.produit_id);
          return { 
            produit_id: produit.produit_id, 
            nom: produit.nom, 
            tarif: produit.tarif, 
            quantite: quantiteProduit ? quantiteProduit.quantite : 0 
          };
        });
        setPanier(nouveauPanier);
      }
    }, [data]);
    
  

    if (!data || !societe || !client) {
        return <h2 className='p-3 col-md-9 mx-auto' style={{marginTop: "140px"}}>Aucune donnée disponible pour afficher le devis.</h2>;
    }

    let totalDevis = 0;
    const quantiteProduits = [];
    const totalProduits = [];

     // Fonction pour ajuster la quantité d'un produit dans le panier
     const ajusterQuantite = (produit_id, delta) => {
      const nouveauPanier = panier.map(item => {
          if (item.produit_id === produit_id) {
              const nouvelleQuantite = item.quantite + delta;
              // Empêcher les quantités négatives
              return { ...item, quantite: Math.max(0, nouvelleQuantite) };
          }
          return item;
      });
      setPanier(nouveauPanier);
  };

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
    pdf.text(`Devis numéro: ${data.devis.numero_devis}`, 70 ,90); // Affiche le numéro de devis à la position spécifiée

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

    // pdf.autoTable({
    //     startY: y, // Position verticale de départ du tableau
    //     head: [["Contenu du devis", "", "", ""]], // En-tête du tableau
    //     body: [
    //         // Les données du panier
    //         ['Nom', 'Tarif', 'Quantité', 'Total'],
    //         ...panier.map(produit => [produit.nom, produit.tarif + ' €', produit.quantite, (produit.tarif * produit.quantite).toFixed(2) + ' €'])
    //     ]
    // });

    pdf.autoTable({
      startY: y,
      head: [["Nom", "Tarif", "Quantité", "Total"]],
      body: panier.map(produit => [
        produit.nom, 
        produit.tarif ? produit.tarif + ' €' : '0 €', 
        produit.quantite, 
        produit.tarif ? (produit.tarif * produit.quantite).toFixed(2) + ' €' : '0 €'
      ])
    });
    // Total du devis
    const total = panier.reduce((total, produit) => total + produit.tarif * produit.quantite, 0).toFixed(2); // Calcul du total du devis
    pdf.text(`Total: ${total} €`, 140, pdf.autoTable.previous.finalY + 10); // Affichage du total du devis

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
    pdf.save(`Devis${data.devis.numero_devis}.pdf`);
    
    await envoyerDevis(data.devis.numero_devis, data.devis.devis_id, panier);
};




  // Fonction pour envoyer, supprimer puis regénérer le devis en base de données
const envoyerDevis = async (numeroDevis, devisId, panierDuDevis) => {
  // Vérifiez que panierDuDevis est défini et est un tableau
  if (!Array.isArray(panierDuDevis)) {
    console.error('Le panier du devis n\'est pas défini ou n\'est pas un tableau');
    return;
  }
  
  // Vérifiez que le panier n'est pas vide
  if (panierDuDevis.length === 0) {
    throw new Error('Le panier est vide');
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_URL_API}/api/update/devis/${devisId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        numeroDevis,
        validateDevis,
        detailProjet,
        panier: panierDuDevis.map(produit => ({
          nom: produit.nom,
          tarif: produit.tarif,
          quantite: produit.quantite,
          total: (produit.tarif * produit.quantite).toFixed(2),
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
    window.location.href = "/VoirMesDevis";

  } catch (error) {
    // Gérer les erreurs
    console.error('Erreur dans envoyerDevis:', error);
    alert('Une erreur est survenue lors de la création du devis');
  }
};


const conditionsPaiement = "A la confirmation du devis"

    return (
        <>
            <section className='mt-5'>
                <Form className='graylogo col-md-10 mx-auto p-4 gap-2'>
                <h3 className='p-3 text-center rounded'>{`Devis numéro : ${data.devis.numero_devis}`}</h3>
                <Row>
                    {/* Informations sur la société */}
                    <Col md={12} lg={6} className="border border-secondary p-4 rounded">
                    <article>
                        <figure className='d-flex justify-content-between p-2'>
                        <img src={societe && societe.avatar} style={{ width: "100px", height: "100px", borderRadius: "50%" }} alt="Avatar de la société" />
                        </figure>
                        <address className="mb-3 text-white fw-bold fs-6">
                        <p>{societe && societe.societe}</p>
                        <p>{societe && societe.rue}</p>
                        <p>{societe && societe.ville}</p>
                        <p>{societe && societe.code_postal}</p>
                        <p>Contact : MR {societe && societe.pseudo}</p>
                        </address>
                    </article>
                    </Col>
                    {/* Informations sur le client */}
                    <Col md={12} lg={6} className="border border-secondary p-4 rounded">
                    <article>
                        <figure className='d-flex justify-content-between p-2'>
                        <img src={client && client.avatar} style={{ width: "100px", height: "100px", borderRadius: "50%" }} alt="Avatar du client" />
                        <figcaption className='text-white fw-bold'>{client && client.pseudo}</figcaption>
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
                <table className="table mt-4">
                    <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Tarif</th>
                        <th>Quantité</th>
                        <th>Total</th>
                        <th>Dont tva</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(data.devis.Produits) && data.devis.Produits.map((produit, index) => {
                        // Trouver la quantité correspondante à ce produit
                        const quantiteProduit = panier.find(q => q.produit_id === produit.produit_id);
                        // Calculer le total pour ce produit
                        const totalProduit = produit.tarif * (quantiteProduit ? quantiteProduit.quantite : 0);
                        // Ajouter le total de ce produit au total général
                        totalDevis += totalProduit;

                        // Ajouter les valeurs aux tableaux
                        quantiteProduits.push(quantiteProduit ? quantiteProduit.quantite : 0);
                        totalProduits.push(totalProduit);

                        return (
                        <tr key={index}>
                            <td>{produit.nom}</td>
                            <td>{produit.tarif} €</td>
                            <td>
                            {/* Boutons pour augmenter/diminuer la quantité */}
                            <Button onClick={() => ajusterQuantite(produit.produit_id, -1)}> - </Button>
                            {quantiteProduit ? quantiteProduit.quantite : 0}
                            <Button onClick={() => ajusterQuantite(produit.produit_id, 1)}>+</Button>
                            </td>
                            <td>{totalProduit.toFixed(2)} €</td>
                            <td>{((totalProduit) * .2).toFixed(2)} €</td>
                        </tr>
                        );
                    })}
                    <tr>
                        <td colSpan="3" className="fw-bold text-end">Total TTC :</td>
                        <td className="fw-bold">{totalDevis.toFixed(2)} €</td>
                    </tr>
                  </tbody>
                </table>
                <section className='bg-white'>
                    <p className='text-center p-2'>
                    Validité du devis : {validateDevis} Jours
                    </p>
                </section>
                <section className='bg-white'>
                    <label className='text-center p-2'>
                    Détail de votre projet en quelques mots :
                    <textarea
                        className='m-1'
                        value={detailProjet}
                        onChange={handleChangeDetailProjet}
                        required>
                    </textarea>
                    </label>
                </section>

                <nav className='d-flex justify-content-between'>
                    <BackButton />
                    <Button
                    className='fw-bold'
                    variant='primary'
                    aria-label='Enregistrer les modifications'
                    onClick={() => {
                        handleDownloadPDF();
                        // envoyerDevis(devisData.devis.numero_devis, devisData.devis.devis_id, panier);
                    }}>
                    Enregistrer les modifications
                    </Button>
                </nav>
                </Form>
            </section>
        </>

    );
};

export default ModifierDevis;

      

