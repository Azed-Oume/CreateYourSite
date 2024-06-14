import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import BackButton from "./BackButton";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const NavDocument = ({ data, societe, client, type }) => {
    const [isVisible, setIsVisible] = useState(type !== 'facture');
    useEffect(() => {
    const controleType = () => {
        if ( type === 'facture') {
            setIsVisible(false);
        }else {
            setIsVisible(true);
        }
    }; controleType();
    }, [type]);

    const navigate = useNavigate();

    const handleValidate = () => {
        const path = type === "commande" ? "/factureCommande" : "/factureDevis";
        navigate(path, { state: { data, societe, client } });
    };

    const handleModify = () => {
        const path = type === "commande" ? "/modifierCommande" : "/modifierDevis";
        navigate(path, { state: { data, societe, client } });
    };

    const handleDownloadPDF = async () => {
        if (!societe || !client) return;

        const pdf = new jsPDF();
        pdf.setFontSize(12);

        pdf.rect(20, 15, 80, 60);
        pdf.text(`${societe.societe || ""}`, 25, 20);
        pdf.text(`${societe.rue || ""}`, 25, 30);
        pdf.text(`${societe.ville || ""}`, 25, 40);
        pdf.text(`${societe.code_postal || ""}`, 25, 50);
        pdf.text(`${societe.nom || ""}`, 25, 60);

        pdf.rect(110, 15, 80, 60);
        pdf.text(`${client.nom || ""}`, 115, 20);
        pdf.text(`${client.prenom || ""}`, 115, 30);
        pdf.text(`${client.rue || ""}`, 115, 40);
        pdf.text(`${client.ville || ""}`, 115, 50);
        pdf.text(`${client.code_postal || ""}`, 115, 60);

        // const numText = type === "commande" ? `Numéro Commande : ${data.commande.numero_commande || ""}` : `Numéro devis : ${data.devis.numero_devis || ""}` : `Numéro Facture : ${data.facture.numero_facture || ""}`;
        const numText = type === "commande" ? `Numéro Commande : ${data.commande.numero_commande || ""}` : type === "devis" ? `Numéro devis : ${data.devis.numero_devis || ""}` : `Numéro Facture : ${data.facture.numero_facture || ""}`;

        pdf.rect(55, 83, 105, 10);
        pdf.text(numText, 60, 90);

        let y = 100;
        pdf.autoTable({
            startY: y,
            head: [["Nom", "Tarif HT", "Quantité", "TVA 20%", "Total TTC"]],
            body: data[type].Produits.map(produit => [
                produit.nom,
                produit.tarif + " €",
                data.quantites.find(q => q.produit_id === produit.produit_id)?.quantite || 0,
                (produit.tarif * .2).toFixed(2),
                ((produit.tarif * (data.quantites.find(q => q.produit_id === produit.produit_id)?.quantite || 0)) * 1.2).toFixed(2) + " €"
            ])
        });

        const total = data[type].Produits.reduce((total, produit) => {
            const quantiteProduit = data.quantites.find(q => q.produit_id === produit.produit_id);
            return total + produit.tarif * (quantiteProduit ? quantiteProduit.quantite : 0);
        }, 0).toFixed(2);
        pdf.text(`Total : ${total * 1.2} €`, 150, pdf.autoTable.previous.finalY + 10);

        const fileName = type === "commande" ? `Numéro Commande : ${data.commande.numero_commande || ""}.pdf` : type === "devis" ? `Numéro devis : ${data.devis.numero_devis || ""}.pdf` : `Numéro Facture  : ${data.facture.numero_facture || ""}.pdf`;
        pdf.save(fileName);
    };

    return(
        <nav className='d-flex justify-content-center gap-3 m-5 flex-wrap'>
            {isVisible && (
            <Button 
                className='fw-bold'
                aria-label={`Valider le ${type} et Passer en facture`}
                onClick={handleValidate} >
                    Valider {type} et Passer en facture
            </Button>
            )}

            <BackButton />
            {isVisible && (
            <Button 
                className='fw-bold'
                aria-label={`Modifier le ${type}`}
                onClick={handleModify} >
                    Modifier le {type}
            </Button>
            )}
            <Button 
                className='fw-bold'
                aria-label='Télécharger à nouveau le pdf'
                onClick={handleDownloadPDF}>
                    Télécharger un duplicata "PDF"
            </Button>
        </nav>
    );
};

export default NavDocument;
