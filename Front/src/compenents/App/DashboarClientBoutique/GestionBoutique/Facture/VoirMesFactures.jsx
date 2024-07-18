
import React, {useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import BackButton from '../../../../AuthSecure/BackButton';
import ReserveForUser from '../../../../AuthSecure/ReservForUser';

const VoirMesFactures = () => {
    const [panier, setPanier] = useState([]);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [compenentIsVisible, setCompenentIsVisible] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [societe, setSociete] = useState("");
    const [client, setClient] = useState("");
    const [factureData, setFactureData] = useState([]);
    const [compenentIsVisibleWithToken, setCompenentIsVisibleWithToken] = useState(false);
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    const token = localStorage.getItem('token');
    useEffect(() => {
      if (token) {
            setCompenentIsVisibleWithToken(!compenentIsVisibleWithToken);
      }
      }, [token]); 
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // const { data, societe, client } = location.state || {}; // Accéder aux données passées via l'état de la navigation

    const handleClick = () => {
        setCompenentIsVisible(!compenentIsVisible);
        setIsVisible(!isVisible);
    };
    
    // if (!data || !societe || !client) {
    //     return <h2 className='p-3 col-md-9 mt-5 mx-auto text-center'>Vous n'avez aucunne facture.</h2>;
    // }
    const Facture = "F/";

    let totalCommande = 0;
    const quantiteProduits = [];
    const totalProduits = [];
    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX    
useEffect(() => {
    const fetchSociete = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_API}3000/api/getSociete/2`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
                alert("Connectez-vous ou créez un compte pour ajouter une facture !");
                return;
              }
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/getUser`, {
                method: 'GET',
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
const fetchFacture = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/facture/utilisateur`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Une erreur est survenue lors de la récupération des devis');
        }

        const data = await response.json();
        setFactureData(data.facture);
        setLoading(false);
    } catch (error) {
        setError(error.message);
        setLoading(false);
    }
};

useEffect(() => {
    fetchFacture();
}, []);
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const formatDate = (dateString) => {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options).replace(',', ' -');
};
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

if (loading) {
    return <section className='graylogo text-white container p-2 mt-5'>
                <p>Chargement en cours...</p>
                <BackButton />
            </section>;
}

if (error) {
    return <section className='graylogo text-white container p-2 mt-5'>
                <p> Erreur lors du chargement des factures : {error}</p>
                <BackButton/>
            </section>;
    
}

if (!factureData || factureData.length === 0) {
    return(
    <section className='graylogo container p-2 mt-5'>
     <h1 className='col-md-6 mx-auto rounded text-center '>Aucune facture trouvé.</h1>
     <BackButton />
     </section>
    )
}


    return (
        <>
            <section className="graylogo container p-2 mt-5 ">
                <nav className='col-lg-10 m-3 mx-auto bg-white text-center'>
                    <BackButton />
                    <Button
                        variant='primary'
                        className='m-3 fw-bold'
                        onClick={handleClick}
                        aria-expanded={compenentIsVisible ? 'true' : 'false'}
                        aria-controls="factureTable"
                    >
                        {compenentIsVisible ? "Réduire la liste" : "Voir mes factures"}
                    </Button>
                </nav>
                
                                {compenentIsVisible && (
                                    <form className='mx-auto  overflow-auto'>
                                        <table
                                            className='table'
                                            id="factureTable"
                                            aria-hidden={!compenentIsVisible ? 'true' : 'false'}
                                        >
                                            <thead>
                                                <tr>
                                                    <th scope='col' className='bg-secondary text-white'>Ouvrir</th>
                                                    <th scope="col" className='bg-secondary text-white'>Numéro facture</th>
                                                    <th scope="col" className='bg-secondary text-white'>Date facture</th>
                                                    <th scope="col" className='bg-secondary text-white'>Écheance</th>
                                                    <th scope="col" className='bg-secondary text-white'>Projet</th>
                                                    <th scope="col" className='bg-secondary text-white'>Paiement</th>
                                                    <th scope="col" className='bg-secondary text-white'>Info</th>
                                                    <th scope="col" className='bg-secondary text-white'>Statut</th>
                                                    <th scope="col" className='bg-secondary text-white'>Total</th>
                                                    <th scope='col' className='bg-secondary text-white'>Télécharger</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {factureData.map((facture, index) => (
                                                    <tr
                                                        key={facture.facture_id}
                                                        className={index % 2 === 0 ? "table-primary" : "table-secondary"}
                                                    >
                                                        <td>
                                                            <Link to={`/ouvrirFacture/${facture.facture_id}`}>
                                                                <Button
                                                                    className='fw-bold' 
                                                                    aria-label='Ouvrir la facture' >
                                                                    Ouvrir
                                                                </Button>
                                                            </Link>
                                                        </td>
                                                        <td className='text-black'>{facture.numero_facture}</td>
                                                        <td>{formatDate(facture.date_facture)}</td>
                                                        <td>{formatDate(facture.date_echeance)}</td>
                                                        <td>{facture.detail_projet}</td>
                                                        <td>{facture.mode_paiement}</td>
                                                        <td>{facture.information_paiement}</td>
                                                        <td>{facture.statut_facture === 1 ? 'Terminé' : 'En cours'}</td>
                                                        <td>{facture.montant_total} </td>
                                                        <td>
                                                           
                                                        </td>
                                                    </tr>

                                                ))}
                                            </tbody>
                                        </table>
                                    </form>
                                )}
                                { !isVisible && (
                                <nav className='col-lg-10 m-3 mx-auto bg-white text-center'>
                                    <BackButton />
                                    <Button
                                        variant='primary'
                                        className='m-3 fw-bold'
                                        onClick={handleClick}
                                        aria-expanded={compenentIsVisible ? 'true' : 'false'}
                                        aria-controls="factureTable"
                                    >
                                        {compenentIsVisible ? "Réduire la liste" : "Voir mes facture"}
                                    </Button>
                                </nav>
                                )}
                            </section>
        </>
    );
};

export default VoirMesFactures;
