import React, { useState, useEffect } from 'react';
import { Button, Carousel, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import fishblue from '../../../images/fishblue.png';
import poisson_rouge from '../../../images/poisson_rouge.png';
import my_fish from '../../../images/my_fish.png';
import SupprimerProduit from './GestionProduit/SupprimerProduit.jsx';
import SuspendreProduit from './GestionProduit/SuspendreProduit.jsx';
import ReserveForAdmin from '../../../AuthSecure/ReserveForAdmin.jsx';


const MesProduitsEnAttente = () => {
  const [produits, setProduits] = useState([]);
  const [currentPage, setCurrentPage] = useState([1]);
  const [produitsPerPage, setProduitsPerPage] = useState(25);
  const [loveProduits, setLoveProduits] = useState({});
  const [produitId, setProduitId] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});



  useEffect(() => {
    fetchProduits(); // Ajoutez cet appel ici
  }, [currentPage, produitsPerPage ]);

  const fetchProduits = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Si le token est absent, ne pas faire de fetch
          return;
        }
        // permet de récupérer tout les produits
        const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/product`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            if (response.status === 404) {
                alert("Vous n'avez pas de produits pour le moment.");
            } else {
                throw new Error('Une erreur est survenue lors du FETCH');
            }
        } else {

            const data = await response.json();
            setProduits(data.produits);
        }
    } catch (error) {
        console.error('Error fetching produits:', error);
    }
}



const renderProduitDetails = (produit, index) => {
  const isExpanded = expandedProducts[index];

  // Condition pour déterminer si le bouton est affiché ou non
  const isButtonVisible = produit.detail.length > 20;

  // Classe conditionnelle pour ajuster la hauteur si le bouton n'est pas visible
  const detailsClass = `card-text fs-5 ${!isButtonVisible && !isExpanded ? 'fixed-height' : ''}`;


  return (
    <> 
      {/* Détails du produit avec la classe conditionnelle */}
      <p className={detailsClass}>
        {/* Afficher les détails complets si le produit est étendu, sinon afficher les premiers 20 caractères */}
        {isExpanded ? produit.detail : produit.detail.slice(0, 20) + (isButtonVisible ? "..." : "")}
      </p>

      {/* Bouton pour afficher ou masquer les détails */}
      {isButtonVisible && (
        <Button onClick={() => handleClick(index)}>
          {isExpanded ? "Afficher moins" : "Afficher plus"}
        </Button>
      )}
    </>
  );
};




const handleClick = (index) => {
  setExpandedProducts(prevState => ({
    ...prevState,
    [index]: !prevState[index]
  }));
}


const indexOfLastProduit = currentPage * produitsPerPage;
const indexOfFirstProduit = indexOfLastProduit - produitsPerPage;
const currentProduits = produits.slice(indexOfFirstProduit, indexOfLastProduit);
const paginate = pageNumber => setCurrentPage(pageNumber);

const defaultImages = [
  { url: my_fish},
  { url: poisson_rouge },
  { url: fishblue}
];
 

const thickChevronStyle = {
  fontSize: '5rem', // Taille de l'icône
  color: 'blue',   // Couleur de l'icône
  fontWeight: 'bold', //
};


const userStatut = currentProduits.map(produit => produit.statut);
// Filtrer les produits ayant le statut 1
const filteredProduits = produits.filter(produit => produit.statut === 2);

const role = localStorage.getItem('role');

  return ( 

    <>
    {/* { userStatut === 2 && ( */}
      <section className="container graylogo p-4 mt-5 rounded-4 mx-auto" >
      {role === "1" ? (
                <div>
        <h2 className="text-center mx-auto p-4">Gestion des Stock </h2>
        <div className="row">
        {filteredProduits.map((produit, index) => (
            <div className="col-md-4 col-lg-4" key={index}>
              <div className="card border mb-3">
                <div className="card-body ">
                  <h2 className="card-title fs-5">{produit.nom}</h2>
                  <div className='fixed-height'> {renderProduitDetails(produit, index)} </div>
                  {/* <p className="card-text fs-5">{produit.detail}</p> */}
                  <p className="card-text fs-5">{produit.tarif} €</p>
                  {/* <p className="card-text fs-5">{produit.produit_id} </p> */}
                  {produit.photos && produit.photos.length > 0 ? (
                              <Carousel 
                              nextIcon={<FaChevronRight style={ thickChevronStyle } />} // Utilisation de l'icône de flèche droite avec une taille de 24px et une couleur noire
                              prevIcon={<FaChevronLeft style={ thickChevronStyle } />} // Utilisation de l'icône de flèche gauche avec une taille de 24px et une couleur noire
                                  >
                                {produit.photos.map((photos, photoIndex) => (
                                  <Carousel.Item key={photoIndex}>
                                    <img key={index} src={photos} alt={`photo ${index + 1}`} className='row col-md-9 mx-auto rounded rounded-5' style={{ width: 'auto', height: '300px', margin: '5px' }}
                                    />
                                  </Carousel.Item>
                                ))}
                              </Carousel>
                            ) : (
                              <Carousel  >
                                {defaultImages.map((image, index) => (
                                  <Carousel.Item key={index}>
                                    <p>Pas de photos pour ce produit</p>
                                  </Carousel.Item>
                                ))}
                              </Carousel>
                            )}
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <Link  className='' to={`/AjouterPhoto/${produit.produit_id}`}><Button  className='text-black fw-bold' variant='success'>Ajouter photos</Button></Link>
                  <Link  className='' to={`/ModiffierProduit/${produit.produit_id}`}><Button  className='text-black fw-bold' variant='info'>Modiffier</Button></Link>
                  <SuspendreProduit produitId={produit.produit_id} fetchProduits={fetchProduits} userStatut={produit.statut} />
                  <SupprimerProduit produitId={produit.produit_id} fetchProduits={fetchProduits} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination justify-content-center">
          <Pagination>
            <Pagination.Prev onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)} disabled={currentPage === 1} />
            {Array.from({ length: Math.ceil(produits.length / produitsPerPage) }, (_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage(currentPage === Math.ceil(produits.length / produitsPerPage) ? currentPage : currentPage + 1)} disabled={currentPage === Math.ceil(produits.length / produitsPerPage)} />
          </Pagination>
        </div>
        </div>
            ) : (
                <ReserveForAdmin/>
            )}
      </section>
      </>

    );
    
};
export default MesProduitsEnAttente;























