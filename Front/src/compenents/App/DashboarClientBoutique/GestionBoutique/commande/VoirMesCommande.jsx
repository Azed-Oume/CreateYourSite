
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import BackButton from '../../../../AuthSecure/BackButton';

const VoirMesCommande = () => {
    const [commandeData, setCommandeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [componentIsVisible, setComponentIsVisible] = useState(true);
    const [modals, setModals] = useState({});

    const handleClick = () => {
        setComponentIsVisible(!componentIsVisible);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ajoute un 0 devant si nécessaire
        const day = ('0' + date.getDate()).slice(-2); // Ajoute un 0 devant si nécessaire
        return `${year}-${month}-${day}`;
    };

    const fetchCommande = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/commande/utilisateur`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Une erreur est survenue lors de la récupération des Commandes');
            }

            const data = await response.json();
            setCommandeData(data.commande);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommande();
    }, []);

    const supprimerCommande = async (commandeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/delete/commande/${commandeId}`, {
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
            fetchCommande();
        } catch (error) {
            console.error('Erreur lors de la suppression de la Commande :', error);
        }
    };

    const handleToggleModal = (commandeId) => {
        setModals(prevModals => ({
            ...prevModals,
            [commandeId]: !prevModals[commandeId]
        }));
    };

    if (loading) {
        return (
            <section className='graylogo text-white container p-2 mt-5'>
                <p>Chargement en cours...</p>
                <BackButton />
            </section>
        );
    }

    if (error) {
        return (
            <section className='graylogo text-white container p-2 mt-5'>
                <p> Erreur lors du chargement des commandes : {error}</p>
                <BackButton />
            </section>
        );
    }

    if (!commandeData || commandeData.length === 0) {
        return (
            <section className='graylogo container p-2 mt-5'>
                <h1 className='col-md-6 mx-auto rounded text-center '>Aucune Commande trouvée.</h1>
                <BackButton />
            </section>
        );
    }

    return (
        <section className='graylogo container p-2 mt-5'>
            <nav className='col-lg-10 m-3 mx-auto bg-white text-center'>
                <BackButton />
                <Button
                    variant='primary'
                    className='m-3 fw-bold'
                    onClick={handleClick}
                    aria-expanded={componentIsVisible ? 'true' : 'false'}
                    aria-controls="commandeTable"
                >
                    {componentIsVisible ? "Réduire la liste" : "Voir mes Commandes"}
                </Button>
            </nav>
            {componentIsVisible && (
                <form className='mx-auto overflow-auto'>
                    <table className='table' id="commandeTable">
                        <thead>
                            <tr>
                                <th scope='col' className='bg-secondary text-white'>Ouvrir</th>
                                <th scope="col" className='bg-secondary text-white'>Numéro de commande</th>
                                <th scope="col" className='bg-secondary text-white'>Date de commande</th>
                                <th scope="col" className='bg-secondary text-white'>Validité de la commande</th>
                                <th scope="col" className='bg-secondary text-white'>Détails du projet</th>
                                <th scope="col" className='bg-secondary text-white'>Statut de la commande</th>
                                <th scope='col' className='bg-secondary text-white'>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandeData.map((commande, index) => (
                                <tr key={commande.commande_id} className={index % 2 === 0 ? "table-primary" : "table-secondary"}>
                                    <td>
                                        <Link to={`/ouvrirCommande/${commande.commande_id}`}>
                                            <Button className='fw-bold' aria-label='Ouvrir la Commande'>Ouvrir</Button>
                                        </Link>
                                    </td>
                                    <td className='text-black'>{commande.numero_commande}</td>
                                    <td>{formatDate(commande.date_commande)}</td>
                                    <td>{commande.validite_commande}</td>
                                    <td>{commande.detail_projet}</td>
                                    <td>{commande.statut_commande === 1 ? 'En cours' : 'Terminé'}</td>
                                    <td>
                                        <Button className='m-2' variant="danger" onClick={() => handleToggleModal(commande.commande_id)}>Supprimer</Button>
                                        {/* Modal de confirmation */}
                                        <Modal show={modals[commande.commande_id]} onHide={() => handleToggleModal(commande.commande_id)}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Confirmation de Suppression de la Commande</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                Êtes-vous sûr de vouloir supprimer cette Commande {commande.numero_commande} ? Cette action est irréversible.
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => handleToggleModal(commande.commande_id)}>Annuler</Button>
                                                <Button variant="danger" onClick={() => {
                                                    supprimerCommande(commande.commande_id);
                                                    handleToggleModal(commande.commande_id);
                                                }}>Confirmer la Suppression</Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
            )}
        </section>
    );
};

export default VoirMesCommande;
