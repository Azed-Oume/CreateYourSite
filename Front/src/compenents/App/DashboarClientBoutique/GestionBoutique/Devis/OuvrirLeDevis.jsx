
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import NavDocument from '../../../../AuthSecure/NavDocument.jsx';

const OuvrirLeDevis = ({ panier}) => {
    const [societe, setSociete] = useState("");
    const [client, setClient] = useState("");
    const [devisData, setDevisData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {devisId} = useParams();
    const navigate = useNavigate();

  const handleValiderDevis = () => {
    navigate("/facture", { state: { devisData, societe, client } });
};
const handleModifierDevis = () => {
    navigate("/modifierDevis", { state: { devisData, societe, client } });
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

        const fetchDevis = async () => {
            try { // permet de récupèrer un devis (par son Id), d'un utilisateur connécter !
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/devis/utilisateur/${devisId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });    // console.log(devisId, "en ligne 123 de OuvrirLeDevis XXXXXXXXXXXX");

                if (!response.ok) {
                    throw new Error('Une erreur est survenue lors de la récupération du devis');
                }

                const data = await response.json();
                setDevisData(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchSociete();
        fetchClient();
        fetchDevis();
    }, [devisId]);    

    if (loading) {
        return <h2 className='p-3 col-md-9 mx-auto' style={{marginTop: "140px"}}>Chargement en cours...</h2>;
    }

    if (error) {
        return <h2 className='p-3 col-md-9 mx-auto' style={{marginTop: "140px"}}>Erreur lors du chargement des devis : {error}</h2>;
    }

    if (!devisData || devisData.length === 0) {
        return <h2 className='p-3 col-md-9 mx-auto' style={{marginTop: "140px"}}>Aucun devis trouvé.</h2>;
    }

    let totalDevis = 0;

    return (
        <>
            <NavDocument data={devisData} societe={societe} client={client} type="devis" />

                <section id="devis" className="col-md-11 mx-auto graylogo rounded p-3 mt-5">
                    <article>
                    <header>
                        <h3 className='p-3 text-center rounded'>Devis numéro : {devisData.devis.numero_devis}</h3>
                    </header>
                    <Form>
                        <Row>
                        {/* Informations sur la société */}
                        <Col md={12} lg={6} className="border border-secondary p-2 rounded mb-3">
                            <article>
                            <figure className='d-flex justify-content-between p-2'>
                                <img src={societe && societe.avatar} style={{ width: "100px", height: "100px", borderRadius: "50%" }} alt="Avatar de la société" />
                            </figure>
                            <address className="text-white fw-bold fs-6">
                                <p>{societe && societe.societe}</p>
                                <p>{societe && societe.rue}</p>
                                <p>{societe && societe.ville}</p>
                                <p>{societe && societe.code_postal}</p>
                                <p>Contact : MR {societe && societe.pseudo}</p>
                            </address>
                            </article>
                        </Col>
                        {/* Informations sur le client */}
                        <Col md={12} lg={6} className="border border-secondary p-2 rounded mb-3">
                            <article>
                            <figure className='d-flex justify-content-between p-2'>
                                <img src={client && client.avatar} style={{ width: "100px", height: "100px", borderRadius: "50%" }} alt="Avatar du client" />
                                <figcaption className='text-white fw-bold'>{client && client.pseudo}</figcaption>
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
                                            {Array.isArray(devisData.devis.Produits) && devisData.devis.Produits.map((produit, index) => {
                                            // Trouver la quantité correspondante à ce produit
                                            const quantiteProduit = devisData.quantites.find(q => q.produit_id === produit.produit_id);
                                            // Calculer le total pour ce produit
                                            const totalProduit = produit.tarif * (quantiteProduit ? quantiteProduit.quantite : 0);
                                            // Ajouter le total de ce produit au total général
                                            totalDevis += totalProduit;

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
                                            <td colSpan="4" className="fw-bold text-end">Total du devis :</td>
                                            <td className="fw-bold">{(totalDevis * 1.2).toFixed(2)} €</td>
                                            </tr>
                                        </tbody>
                                </table>
                    </Form>
                    </article>
                </section>
            <NavDocument data={devisData} societe={societe} client={client} type="devis"  />
            </>

    );
};

export default OuvrirLeDevis;
