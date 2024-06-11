import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import BackButton from "../../../../AuthSecure/BackButton.jsx";
import Paiement from "../Boutique/Paiement.jsx";

const FactureDevis = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data, societe, client } = location.state;
    const [showModal, setShowModal] = useState(false);

    const calculateTVA = (tarifHT) => {
        return tarifHT * 0.2;
    };

    const calculateTotalTTC = (tarifHT, quantite) => {
        return (tarifHT * quantite) * 1.2;
    };

    const produitsAvecCalculs = data.devis.Produits.map(produit => {
        const quantite = data.quantites.find(q => q.produit_id === produit.produit_id)?.quantite || 0;
        const tarifHT = parseFloat(produit.tarif).toFixed(2) || 0;
        const tva = calculateTVA(tarifHT);
        const totalTTC = calculateTotalTTC(tarifHT, quantite);
        console.log(tarifHT, " en ligne 176 XXXXXXXXXXXXXX");
        
        return {
            ...produit,
            quantite,
            tva,
            totalTTC
        };
    });

    const totalGeneral = produitsAvecCalculs.reduce((total, produit) => {
        return total + produit.totalTTC;
    }, 0);

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

        pdf.rect(55, 83, 105, 10);
        pdf.text(`Facture numero : FAC/${data.devis.numero_devis || ""}`, 60, 90);

        let y = 100;
        pdf.autoTable({
            startY: y,
            head: [["Nom", "Tarif HT", "Quantité", "TVA 20%", "Total TTC"]],
            body: produitsAvecCalculs.map(produit => [
                produit.nom,
                produit.tarif + " €",
                produit.quantite,
                (produit.tarif * .2).toFixed(2),
                ((produit.tarif * produit.quantite)* 1.2).toFixed(2) + " €"
            ])
        });

        pdf.text(`Total a régler : ${totalGeneral.toFixed(2)} €`, 150, pdf.autoTable.previous.finalY + 10);

        pdf.save(`Facture numero : FAC/${data.devis.numero_devis}.pdf`);
    };

    const handlePayClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <section className="container rounded mt-5 graylogo p-2">
            <h1 className="text-center">Facture-Devis</h1>
            <section className="bg-white p-2 rounded">
                <h2 className="text-center">Facture numero : FAC/{data.devis.numero_devis}</h2>
                <div className="d-flex justify-content-between">
                    <div>
                        <h3>Société</h3>
                        <p>{societe.societe}</p>
                        <p>{societe.rue}</p>
                        <p>{societe.ville}, {societe.code_postal}</p>
                        <p>{societe.nom}</p>
                    </div>
                    <div>
                        <h3>Client</h3>
                        <p>{client.nom} {client.prenom}</p>
                        <p>{client.rue}</p>
                        <p>{client.ville}, {client.code_postal}</p>
                    </div>
                </div>
                <h4>Produits</h4>
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
                        {produitsAvecCalculs.map(produit => (
                            <tr key={produit.produit_id}>
                                <td>{produit.nom}</td>
                                <td>{produit.tarif} €</td>
                                <td>{produit.quantite}</td>
                                <td>{produit.tva.toFixed(2)} €</td>
                                <td>{produit.totalTTC.toFixed(2)} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h4>Total: {totalGeneral.toFixed(2)} €</h4>
                <div className="d-flex justify-content-between p-2">
                    <BackButton />
                    <Button onClick={handlePayClick}>Payer</Button>
                    <Button onClick={handleDownloadPDF}>Télécharger PDF</Button>
                </div>
            </section>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Paiement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Paiement 
                        total={totalGeneral}
                        codePromotionnel={false}
                        finaliserAchats={() => {
                            // Code pour finaliser les achats
                            handleCloseModal();
                        }}
                    />
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default FactureDevis;
