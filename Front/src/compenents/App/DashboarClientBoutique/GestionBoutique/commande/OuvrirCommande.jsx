
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import NavDocument from '../../../../AuthSecure/NavDocument.jsx';

const OuvrirCommande = ({ panier}) => {
    const [societe, setSociete] = useState("");
    const [client, setClient] = useState("");
    const [commandeData, setCommandeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {commandeId} = useParams();
    const navigate = useNavigate();

  const handleValiderCommande = () => {
    navigate("/facture", { state: { commandeData, societe, client } });
};
const handleModifierCommande = () => {
    navigate("/modifierCommande", { state: { commandeData, societe, client } });
};

    useEffect(() => {
        const fetchSociete = async () => {
            try { // pérmet de récuperer le profil de la société du site !
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
            try { // pérmet de récuperer le profil de l'utilisateu connécter
                const token = localStorage.getItem('token');
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

        const fetchCommande = async () => {
            try { // permet de récupèrer une commande (par son Id), d'un utilisateur connécter !
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/commande/utilisateur/${commandeId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }); 

                if (!response.ok) {
                    throw new Error('Une erreur est survenue lors de la récupération des commandes');
                }

                const data = await response.json();
                setCommandeData(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchSociete();
        fetchClient();
        fetchCommande();
    }, [commandeId]);    

    if (loading) {
        return <h2 className='p-3 col-md-9 mx-auto' style={{marginTop: "140px"}}>Chargement en cours...</h2>;
    }

    if (error) {
        return <h2 className='p-3 col-md-9 mx-auto' style={{marginTop: "140px"}}>Erreur lors du chargement des Commandes : {error}</h2>;
    }

    if (!commandeData || commandeData.length === 0) {
        return <h2 className='p-3 col-md-9 mx-auto' style={{marginTop: "140px"}}>Aucune commande trouvé.</h2>;
    }

    let totalCommande = 0;

    return (
        <>
            <NavDocument data={commandeData} societe={societe} client={client} type="commande" />

            <section id="commande" className="col-md-11  mx-auto graylogo rounded p-3 mt-5">
            <article>
                <header>
                    <h3 className='p-3 text-center rounded'>Commande numéro :{commandeData.commande.numero_commande} </h3>
                </header>
                <Form className=''>
                    <Row>
                        {/* Informations sur la société */}
                        <Col md={12} lg={6} className="border border-secondary p-2 rounded mb-3">
                            <article>
                                <figure className='d-flex justify-content-between p-2'>
                                    <img src ={societe && societe.avatar} style={{width: "100px", height: "100px", borderRadius: "50%"}} alt="Avatar de la société"/>
                                </figure>
                                <address className="text-white fw-bold fs-6">
                                    <p>{societe && societe.societe}</p>
                                    <p>{societe && societe.rue}</p>
                                    <p>{societe && societe.ville}</p>
                                    <p>{societe && societe.code_postal}</p>
                                    <p>Contact  : MR  {societe && societe.pseudo}</p>
                                </address>
                            </article>
                        </Col>
                        {/* Informations sur le client */}
                        <Col md={12} lg={6} className="border border-secondary p-2 rounded mb-3">
                            <article>
                                <figure className='d-flex justify-content-between p-2'>
                                    <img src ={client && client.avatar} style={{width: "100px", height: "100px", borderRadius: "50%"}} alt="Avatar du client"  />
                                    <figcaption className='text-white fw-bold'>{client && client.pseudo} </figcaption>
                                </figure>
                                    <address className="text-white fw-bold fs-6">
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
                                            {Array.isArray(commandeData.commande.Produits) && commandeData.commande.Produits.map((produit, index) => {
                                                // Trouver la quantité correspondante à ce produit
                                                const quantiteProduit = commandeData.quantites.find(q => q.produit_id === produit.produit_id);
                                                // Calculer le total pour ce produit
                                                const totalProduit = produit.tarif * (quantiteProduit ? quantiteProduit.quantite : 0);
                                                // Ajouter le total de ce produit au total général
                                                totalCommande += totalProduit;

                                                return (
                                                    <tr key={index} data-name={produit.nom} data-tarif={produit.tarif} data-quantite={quantiteProduit ? quantiteProduit.quantite : 0} data-total={totalProduit.toFixed(2)}>
                                                        <td>{produit.nom}</td>
                                                        <td>{produit.tarif} €</td>
                                                        <td>{quantiteProduit ? quantiteProduit.quantite : 0}</td>
                                                        <td>{(produit.tarif * .2).toFixed(2)}</td>
                                                        <td>{(totalProduit * 1.2).toFixed(2)} €</td>
                                                    </tr>
                                                );
                                            })}

                                            <tr>
                                                <td colSpan="4" className="fw-bold text-end">Total de la commande :</td>
                                                <td className="fw-bold">{(totalCommande * 1.2).toFixed(2)} €</td>
                                            </tr>
                                        </tbody>
                                    </table>
                </Form>
            </article>
            
        </section>
                            <NavDocument data={commandeData} societe={societe} client={client} type="commande" />
    </>
    );
};

export default OuvrirCommande;
