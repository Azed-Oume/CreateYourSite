// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "react-bootstrap";
// import BackButton from "./BackButton";
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';


// const NavCommande = ({commandeData, societe, client}) => {
    
// const navigate = useNavigate();

//     const handleValiderCommande = () => {
//         navigate("/factureCommande", { state: {commandeData, societe, client } });
//     };
//     const handleModifierCommande = () => {
//         navigate("/modifierCommande", { state: {commandeData, societe, client } });
//     };
//     const handleDownloadPDF = async () => { // Fonction pour générer un pdf
//         if (!societe || !client) return;
    
//         const pdf = new jsPDF();
    
//         // Définit la taille du papier au format A4
//         pdf.setFontSize(12);
    
//         // Encadré pour les informations sur la société
//         pdf.rect(20, 15, 80, 60); // Rectangle pour encadrer les informations sur la société
//         pdf.text(`${societe.societe || ""}`, 25, 20);
//         pdf.text(`${societe.rue || ""}`, 25, 30);
//         pdf.text(`${societe.ville || ""}`, 25, 40);
//         pdf.text(`${societe.code_postal || ""}`, 25, 50);
//         pdf.text(`${societe.nom || ""}`, 25, 60);
    
//         // Encadré pour les informations sur le client
//         pdf.rect(110, 15, 80, 60); // Rectangle pour encadrer les informations sur le client
//         pdf.text(`${client.nom || ""}`, 115, 20);
//         pdf.text(`${client.prenom || ""}`, 115, 30);
//         pdf.text(`${client.rue || ""}`, 115, 40);
//         pdf.text(`${client.ville || ""}`, 115, 50);
//         pdf.text(`${client.code_postal || ""}`, 115, 60);

//         pdf.rect(60, 80, 90, 15); // Rectangle pour encadrer les informations sur le client
//         pdf.text(`Numéro Commande : ${commandeData.commande.numero_commande || ""}`, 70, 90);
    
//         // Tableau des produits
//         let y = 100;
//         pdf.autoTable({
//             startY: y,
//             head: [["Nom", "Tarif", "Quantité", "Total"]],
//             body: commandeData.commande.Produits.map(produit => [
//                 produit.nom,
//                 produit.tarif + " €",
//                 commandeData.quantites.find(q => q.produit_id === produit.produit_id)?.quantite || 0,
//                 (produit.tarif * (commandeData.quantites.find(q => q.produit_id === produit.produit_id)?.quantite || 0)).toFixed(2) + " €"
//             ])
//         });
    
//         // Total de la commande
//         const totalCommande = commandeData.commande.Produits.reduce((total, produit) => {
//             const quantiteProduit = commandeData.quantites.find(q => q.produit_id === produit.produit_id);
//             return total + produit.tarif * (quantiteProduit ? quantiteProduit.quantite : 0);
//         }, 0).toFixed(2);
//         pdf.text(`Total de la commande : ${totalCommande} €`, 150, pdf.autoTable.previous.finalY + 10);
    
//         // Télécharge le PDF avec le nom 'commande.pdf'
//         pdf.save(`Commande${commandeData.commande.numero_commande}.pdf`);
//     };

//     return(
//         <nav className='d-flex justify-content-center gap-3 m-5 flex-wrap'>
//                                     <Button 
//                                         className='fw-bold'
//                                         aria-label='Valider la Commande et Passer en facture'
//                                         onClick={handleValiderCommande} >
//                                             Valider la Commande et Passer en facture
//                                     </Button>
//                                     <BackButton />
//                                     <Button 
//                                         className='fw-bold'
//                                         aria-label='Modiffier la Commande'
//                                         onClick={handleModifierCommande} >
//                                             Modiffier la Commande
//                                     </Button>
//                                     <Button 
//                                         className='fw-bold'
//                                         aria-label='Télécharger a nouveau le pdf'
//                                         onClick={handleDownloadPDF}>
//                                         télécharger a nouveau "PDF"
//                                     </Button>
//                                 </nav>
//     )
// };
// export default NavCommande;