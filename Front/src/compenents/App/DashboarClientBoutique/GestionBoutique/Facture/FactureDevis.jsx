
import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import FactureIsVisible from './FactureIsVisible';
import BackButton from '../../../../AuthSecure/BackButton';

const FactureDevis = () => {
    const [panier, setPanier] = useState([]);
    const location = useLocation();
    const { data, societe, client } = location.state || {}; // Accéder aux données passées via l'état de la navigation

    if (!data || !societe || !client) {
        return <h2 className='p-3 col-md-9 mx-auto text-center' style={{marginTop: "140px"}}>Vous n'avez aucunne facture.</h2>;
    }
    const Facture = "F/";

    let totalDevis = 0;
    const quantiteProduits = [];
    const totalProduits = [];

    return (
        <>
        <div className='mt-5'>
        <Form className='graylogo col-md-10 mx-auto  p-4 gap-2'>
        <h3 className='p-3 text-center rounded'> {` Facture numéro : ${Facture}${data.devis.numero_devis} `} </h3>
                <Row>
                    {/* Informations sur la société */}
                    <Col md={12} lg={6} className="border border-secondary p-4 rounded ">
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
                                                <span>Contact  : MR  {societe && societe.pseudo}</span>
                                            </div>
                        </div>
                    </Col>
                    {/* Informations sur le client */}
                    <Col md={12} lg={6} className="border border-secondary p-4 rounded ">
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
                
                                <table className="table mt-4">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Tarif</th>
                                            <th>Quantité</th>
                                            <th>Total</th>
                                            <th>TVA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(data.devis.Produits) && data.devis.Produits.map((produit, index) => {
                                            // Trouver la quantité correspondante à ce produit
                                            const quantiteProduit = data.quantites.find(q => q.produit_id === produit.produit_id);
                                            // Calculer le total pour ce produit
                                            const totalProduit = produit.tarif * (quantiteProduit ? quantiteProduit.quantite : 0);
                                            // Ajouter le total de ce produit au total général
                                            totalDevis += totalProduit;

                                            // Ajouter les valeurs aux tableaux
                                            quantiteProduits.push(quantiteProduit ? quantiteProduit.quantite : 0);
                                            totalProduits.push(totalProduit);

                                            return (
                                                <tr key={index} data-name={produit.nom} data-tarif={produit.tarif} data-quantite={quantiteProduit ? quantiteProduit.quantite : 0} data-total={totalProduit.toFixed(2)}>
                                                    <td>{produit.nom}</td>
                                                    <td>{produit.tarif} €</td>
                                                    <td>{quantiteProduit ? quantiteProduit.quantite : 0}</td>
                                                    <td>{totalProduit.toFixed(2)} €</td>
                                                    <td>{((totalProduit)*.2).toFixed(2)} €</td>
                                                </tr>
                                            );
                                        })}

                                        <tr>
                                            <td colSpan="4" className="fw-bold text-end">Total ttc :</td>
                                            <td className="fw-bold">{totalDevis.toFixed(2)} €</td>
                                        </tr>
                                    </tbody>
                                </table>
                               
            </Form>
            <div className='text-center m-3'>
                <BackButton />
            </div>
        </div>
      <FactureIsVisible panier={panier} totalFacture={totalDevis} quantiteProduits={quantiteProduits} totalProduits={totalProduits} />
        </>
    );
};

export default FactureDevis;
