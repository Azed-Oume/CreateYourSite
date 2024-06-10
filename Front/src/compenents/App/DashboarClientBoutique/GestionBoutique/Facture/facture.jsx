
import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import BackButton from '../../../../AuthSecure/BackButton';

const Facture = () => {
    const [panier, setPanier] = useState([]);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [componentIsVisible, setComponentIsVisible] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [societe, setSociete] = useState("");
    const [client, setClient] = useState("");
    const [factureData, setFactureData] = useState([]);
    // const { data, societe, client } = location.state || {}; // Accéder aux données passées via l'état de la navigation

    const handleClick = () => {
        setComponentIsVisible(!componentIsVisible);
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
            const response = await fetch('http://localhost:3000/api/getSociete/2');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des informations de la société');
            }
            const data = await response.json();
            console.log(data, " en ligne 39 XXXXXXXXXXXXXXXXXXXX");
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
                // alert("Connectez-vous ou créez un compte pour ajouter un devis !");
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
            console.log(data, " en ligne 67 XXXXXXXXXXXXXXXXXXXX");
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
        const response = await fetch('http://localhost:3000/api/get/facture/utilisateur', {
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
        setDevisFacture(data.facutre);
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

// if (loading) {
//     return <div className='col-md-6 mx-auto text-center ' style={{ marginTop: "140px" }}>Chargement en cours...</div>;
// }

// if (error) {
//     return <div className='col-md-6 mx-auto text-center ' style={{ marginTop: "140px" }}>Erreur lors du chargement des devis : {error}</div>;
// }

// if (!factureData || factureData.length === 0) {
//     return(
//     <section className='graylogo p-3 rounded col-md-9 mx-auto' style={{marginTop:"50px"}}>
//      <h1 className='col-md-6 mx-auto rounded text-center '>Aucune facture trouvé.</h1>
//      <BackButton />
//      </section>
//     )
// }


    return (
        <>
            <section className='graylogo col-lg-10 p-2 mx-auto mt-5'>
                <nav className='col-lg-10 m-3 mx-auto bg-white text-center'>
                    <BackButton />
                    <Button
                        variant='primary'
                        className='m-3 fw-bold'
                        onClick={handleClick}
                        aria-expanded={componentIsVisible ? 'true' : 'false'}
                        aria-controls="factureTable"
                    >
                        {componentIsVisible ? "Réduire la liste" : "Voir Ma Liste de mes factures"}
                    </Button>
                </nav>
                <div className='mt-5'>
                <Form className='graylogo col-md-10 mx-auto  p-4 gap-2'>
                {/* <h3 className='p-3 text-center rounded'> {dataFacture.facture.numero_commande} </h3> */}
                        <Row>
                            {/* Informations sur la société */}
                            <Col md={12} lg={6} className="border border-secondary p-4 rounded ">
                                <article aria-labelledby="societe-header">
                                    <header id="societe-header">
                                        <h4 className="visually-hidden">Informations sur la société</h4>
                                    </header>
                                        <figure className='d-flex justify-content-between p-2'>
                                            <img 
                                                src ={societe && societe.avatar} 
                                                style={{width: "100px", height: "100px", borderRadius: "50%"}} 
                                                alt="Avatar de la société!" />
                                        </figure>
                                        <address className="mb-3 text-white fw-bold fs-6">
                                            <p>{societe && societe.societe}</p>
                                            <p>{societe && societe.rue}</p>
                                            <p>{societe && societe.ville}</p>
                                            <p>{societe && societe.code_postal}</p>
                                            <p>Contact  : MR  {societe && societe.pseudo}</p>
                                        </address>
                                </article>
                            </Col>
                            {/* Informations sur le client */}
                            <Col md={12} lg={6} className="border border-secondary p-4 rounded ">
                                <article className='client-header'>
                                        <header id="client-header">
                                            <h4 className="visually-hidden">Informations sur le client</h4>
                                        </header>
                                            <figure className='d-flex justify-content-between p-2'>
                                                <img 
                                                    src ={client && client.avatar} 
                                                    style={{width: "100px", height: "100px", borderRadius: "50%"}} 
                                                    alt="Avatar du client"
                                                    />
                                                <figcaption className="p-3 text-center text-white rounded fw-bold">
                                                    {client?.pseudo}
                                                </figcaption>
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
                                     
                                    
                    </Form>
                </div>
                                {componentIsVisible && (
                                    <form className='mx-auto col-lg-10 col-md-8 overflow-auto'>
                                        <table
                                            className='table'
                                            id="factureTable"
                                            aria-hidden={!componentIsVisible ? 'true' : 'false'}
                                        >
                                            <thead>
                                                <tr>
                                                    <th scope='col' className='bg-secondary text-white'>Ouvrir</th>
                                                    <th scope="col" className='bg-secondary text-white'>Numéro facture</th>
                                                    <th scope="col" className='bg-secondary text-white'>Date facture</th>
                                                    <th scope="col" className='bg-secondary text-white'>Validité devis</th>
                                                    <th scope="col" className='bg-secondary text-white'>Détails projet</th>
                                                    <th scope="col" className='bg-secondary text-white'>Mode paiement</th>
                                                    <th scope="col" className='bg-secondary text-white'>Info paiement</th>
                                                    <th scope="col" className='bg-secondary text-white'>Statut facture</th>
                                                    <th scope="col" className='bg-secondary text-white'>Montant total</th>
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
                                                            <Link to={`/ouvrifacture/${facture.facture_id}`}>
                                                                <Button
                                                                    className='fw-bold' 
                                                                    aria-label='Ouvrir la facture' >
                                                                    Ouvrir
                                                                </Button>
                                                            </Link>
                                                        </td>
                                                        <td className='text-black'>{facture.numero_facture}</td>
                                                        <td>{formatDate(facture.date_facture)}</td>
                                                        <td>{facture.date-echeance}</td>
                                                        <td>{facture.detail_projet}</td>
                                                        <td>{facture.mode_paiement}</td>
                                                        <td>{facture.information_paiement}</td>
                                                        <td>{facture.statut_facture === 1 ? 'En cours' : 'Terminé'}</td>
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
                                        aria-expanded={componentIsVisible ? 'true' : 'false'}
                                        aria-controls="factureTable"
                                    >
                                        {componentIsVisible ? "Réduire la liste" : "Voir Ma Liste de facture"}
                                    </Button>
                                </nav>
                                )}
                            </section>



                        {/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */}
        </>
    );
};

export default Facture;
