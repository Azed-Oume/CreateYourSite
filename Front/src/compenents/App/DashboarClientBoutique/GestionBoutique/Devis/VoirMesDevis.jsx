import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import BackButton from '../../../../AuthSecure/BackButton';

const VoirMesDevis = () => {
    const [devisData, setDevisData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [componentIsVisible, setComponentIsVisible] = useState(true);
    const [modals, setModals] = useState({});

    useEffect(() => {
        fetchDevis();
    }, []);

    const fetchDevis = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/devis/utilisateur`, {
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ajoute un 0 devant si nécessaire
        const day = ('0' + date.getDate()).slice(-2); // Ajoute un 0 devant si nécessaire
        return `${year}-${month}-${day}`;
    };

    const handleToggleModal = (devisId) => {
        setModals(prevModals => ({
            ...prevModals,
            [devisId]: !prevModals[devisId]
        }));
    };

    const supprimerDevis = async (devisId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/delete/devis/${devisId}`, {
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
            fetchDevis();
        } catch (error) {
            console.error('Erreur lors de la suppression du devis:', error);
        }
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
                <p> Erreur lors du chargement des devis : {error}</p>
                <BackButton />
            </section>
        );
    }

    if (!devisData || devisData.length === 0) {
        return (
            <section className='graylogo container p-2 mt-5'>
                <h1 className='col-md-6 mx-auto rounded text-center '>Aucun devis trouvé.</h1>
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
                    onClick={() => setComponentIsVisible(!componentIsVisible)}
                    aria-expanded={componentIsVisible ? 'true' : 'false'}
                    aria-controls="devisTable"
                >
                    {componentIsVisible ? "Réduire la liste" : "Voir mes Devis"}
                </Button>
            </nav>
            {componentIsVisible && (
                <form className='mx-auto overflow-auto'>
                    <table className='table' id="devisTable">
                        <thead>
                            <tr>
                                <th scope='col' className='bg-secondary text-white'>Ouvrir</th>
                                <th scope="col" className='bg-secondary text-white'>Numéro de devis</th>
                                <th scope="col" className='bg-secondary text-white'>Date du devis</th>
                                <th scope="col" className='bg-secondary text-white'>Validité du devis</th>
                                <th scope="col" className='bg-secondary text-white'>Détails du projet</th>
                                <th scope="col" className='bg-secondary text-white'>Statut du devis</th>
                                <th scope='col' className='bg-secondary text-white'>Supprimer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devisData.map((devis, index) => (
                                <tr key={devis.devis_id} className={index % 2 === 0 ? "table-primary" : "table-secondary"}>
                                    <td>
                                        <Link to={`/ouvrirDevis/${devis.devis_id}`}>
                                            <Button className='fw-bold' aria-label='Ouvrir le devis'>Ouvrir {devis.devis_id}</Button>
                                        </Link>
                                    </td>
                                    <td className='text-black'>{devis.numero_devis}</td>
                                    <td>{formatDate(devis.date_devis)}</td>
                                    <td>{devis.validite_devis}</td>
                                    <td>{devis.detail_projet}</td>
                                    <td>{devis.statut_devis === 1 ? 'En cours' : 'Terminé'}</td>
                                    <td>
                                        <Button className='m-2' variant="danger" onClick={() => handleToggleModal(devis.devis_id)}>Supprimer</Button>
                                        {/* Modal de confirmation */}
                                        <Modal show={modals[devis.devis_id]} onHide={() => handleToggleModal(devis.devis_id)}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Confirmation de Suppression du devis</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                Êtes-vous sûr de vouloir supprimer ce devis {devis.numero_devis} ? Cette action est irréversible.
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => handleToggleModal(devis.devis_id)}>Annuler</Button>
                                                <Button variant="danger" onClick={() => {
                                                    supprimerDevis(devis.devis_id);
                                                    handleToggleModal(devis.devis_id);
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

export default VoirMesDevis;
