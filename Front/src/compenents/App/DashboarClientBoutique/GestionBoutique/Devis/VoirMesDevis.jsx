import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import "../../../../../styles/monStyle.css";
import BackButton from '../../../../AuthSecure/BackButton';

const VoirMesDevis = () => {
    const [devisData, setDevisData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [componentIsVisible, setComponentIsVisible] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const handleClick = () => {
        setComponentIsVisible(!componentIsVisible);
        setIsVisible(!isVisible);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ajoute un 0 devant si nécessaire
        const day = ('0' + date.getDate()).slice(-2); // Ajoute un 0 devant si nécessaire
        return `${year}-${month}-${day}`;
    };

    // Fonction pour ouvrir la modal
    const handleShowModal = () => setShowModal(true);

    // Fonction pour fermer la modal
    const handleCloseModal = () => setShowModal(false);

    const fetchDevis = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/get/devis/utilisateur', {
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
            setDevisData(data.devis);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevis();
    }, []);

    const supprimerDevis = async (devisId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/delete/devis/${devisId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }

            const data = await response.json();
            console.log('Devis supprimé avec succès:', data.message);
            fetchDevis();
        } catch (error) {
            console.error('Erreur lors de la suppression du devis:', error);
        }
    };

    const handleDeleteDevis = (devisId) => {
        supprimerDevis(devisId);
        handleCloseModal();
    };

    if (loading) {
        return <div className='col-md-6 mx-auto text-center ' style={{ marginTop: "140px" }}>Chargement en cours...</div>;
    }

    if (error) {
        return <div className='col-md-6 mx-auto text-center ' style={{ marginTop: "140px" }}>Erreur lors du chargement des devis : {error}</div>;
    }

    if (!devisData || devisData.length === 0) {
        return(
        <section className='graylogo p-3 rounded col-md-9 mx-auto' style={{marginTop:"50px"}}>
         <h1 className='col-md-6 mx-auto rounded text-center '>Aucun devis trouvé.</h1>
         <BackButton />
         </section>
        )
    }

    return (
        <div className='graylogo col-lg-10 p-2 mx-auto mt-5'>
            <div className='col-lg-10 m-3 mx-auto bg-white text-center'>
                <BackButton />
                <Button
                    variant='primary'
                    className='m-3 fw-bold'
                    onClick={handleClick}
                    aria-expanded={componentIsVisible ? 'true' : 'false'}
                    aria-controls="devisTable"
                >
                    {componentIsVisible ? "Réduire la liste" : "Voir Ma Liste de Devis"}
                </Button>
            </div>
            {componentIsVisible && (
                <div className='mx-auto col-lg-10 col-md-8 overflow-auto'>
                    <table
                        className='table'
                        id="devisTable"
                        aria-hidden={!componentIsVisible ? 'true' : 'false'}
                    >
                        <thead>
                            <tr>
                                <th scope='col' className='bg-secondary text-white'>Ouvrir</th>
                                <th scope="col" className='bg-secondary text-white'>Numéro de devis</th>
                                <th scope="col" className='bg-secondary text-white'>Date du devis</th>
                                <th scope="col" className='bg-secondary text-white'>Validité du devis</th>
                                <th scope="col" className='bg-secondary text-white'>Détails du projet</th>
                                <th scope="col" className='bg-secondary text-white'>Statut du devis</th>
                                <th scope="col" className='bg-secondary text-white'>Validité du devis</th>
                                <th scope='col' className='bg-secondary text-white'>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devisData.map((devis, index) => (
                                <tr
                                    key={devis.devis_id}
                                    className={index % 2 === 0 ? "table-primary" : "table-secondary"}
                                >
                                    <td>
                                        <Link to={`/ouvrirDevis/${devis.devis_id}`}>
                                            <Button
                                                className='fw-bold' 
                                                aria-label='Ouvrir le devis' >
                                                Ouvrir
                                            </Button>
                                        </Link>
                                    </td>
                                    <td className='text-black'>{devis.numero_devis}</td>
                                    <td>{formatDate(devis.date_devis)}</td>
                                    <td>{devis.validite_devis}</td>
                                    <td>{devis.detail_projet}</td>
                                    <td>{devis.statut_devis === 1 ? 'En cours' : 'Terminé'}</td>
                                    <td>{devis.validite_devis} </td>
                                    <td>
                                        {/* Bouton pour ouvrir la modal */}
                                        <Button className='m-2' variant="danger" onClick={handleShowModal}>Supprimer</Button>

                                        {/* Modal de confirmation */}
                                        <Modal show={showModal} onHide={handleCloseModal}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Confirmation de Suppression du devis</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseModal}>Annuler</Button>
                                                <Button variant="danger" onClick={() => handleDeleteDevis(devis.devis_id)}>Confirmer la Suppression</Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            { !isVisible && (
            <div className='col-lg-10 m-3 mx-auto bg-white text-center'>
                <BackButton />
                <Button
                    variant='primary'
                    className='m-3 fw-bold'
                    onClick={handleClick}
                    aria-expanded={componentIsVisible ? 'true' : 'false'}
                    aria-controls="devisTable"
                >
                    {componentIsVisible ? "Réduire la liste" : "Voir Ma Liste de Devis"}
                </Button>
            </div>
            )}
        </div>
    );
};

export default VoirMesDevis;
