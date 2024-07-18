import React, { useState, useEffect } from 'react';
import {Button, Carousel, Pagination } from 'react-bootstrap';
import fishblue from '../../../../images/fishblue.png';
import poisson_rouge from '../../../../images/poisson_rouge.png';
import my_fish from '../../../../images/my_fish.png';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import PanierIsVisible from '../Boutique/PanierIsVisible.jsx';
import AfficherCommande from './AfficherCommande.jsx';
import ReserveForUser from '../../../../AuthSecure/ReservForUser.jsx';


const Commande = ({produit, index}) => {

  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);
  const [currentPage, setCurrentPage] = useState([1]);
  const [produitsPerPage, setProduitsPerPage] = useState(25);
  const [produitId, setProduitId] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [codePromotionnel, setCodePromotionnel] = useState('');
  const [isCodePromotionnelValide, setIsCodePromotionnelValide] = useState(false);
  const [compenentIsVisible, setCompenentIsVisible] = useState(false);
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const token = localStorage.getItem('token');
useEffect(() => {
  if (token) {
        setCompenentIsVisible(!compenentIsVisible);
  }
  }, [token]); 
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const defaultImages = [
  { url: my_fish},
  { url: poisson_rouge },
  { url: fishblue}
];
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const thickChevronStyle = {
  fontSize: '5rem', // Taille de l'icône
  color: 'green',   // Couleur de l'icône
  fontWeight: 'bold', //
};
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  useEffect(() => {
    fetchProduits(); // Ajoutez cet appel ici
  }, [currentPage, produitsPerPage ]);

  const fetchProduits = async () => {
    try {
        const token = localStorage.getItem('token');
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
                alert("Vous n'avez pas de commande pour le moment.");
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
};
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const addCommand = (produit) => {
  const produitExistantIndex = panier.findIndex(item => item.produit_id === produit.produit_id);
  if (produitExistantIndex !== -1) {
      // Le produit est déjà présent dans le panier, alors augmenter la quantité
      const nouveauPanier = [...panier];
      nouveauPanier[produitExistantIndex].quantite += 1;
      setPanier(nouveauPanier);
  } else {
      // Le produit n'est pas présent dans le panier, alors l'ajouter avec une quantité de 1
      setPanier([...panier, { ...produit, quantite: 1 }]);
  }
};

const removeInCommand = (produit_id) => {
  const produitExistantIndex = panier.findIndex(item => item.produit_id === produit_id);
  if (produitExistantIndex !== -1) {
      // Vérifier si la quantité est supérieure à 1, alors décrémenter la quantité
      if (panier[produitExistantIndex].quantite > 1) {
          const nouveauPanier = [...panier];
          nouveauPanier[produitExistantIndex].quantite -= 1;
          setPanier(nouveauPanier);
      } else {
          // Si la quantité est de 1, retirer complètement le produit du panier
          const nouveauPanier = panier.filter(item => item.produit_id !== produit_id);
          setPanier(nouveauPanier);
      }
  }
};


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const renderProduitDetails = (produit, index) => {
  const isExpanded = expandedProducts[index];
  // Condition pour déterminer si le bouton est affiché ou non
  const isButtonVisible = produit.detail.length > 20;
  // Classe conditionnelle pour ajuster la hauteur si le bouton n'est pas visible
  const detailsClass = `card-text fs-5 ${!isButtonVisible && !isExpanded ? 'fixed-height' : ''}`;

  return (
    <> 
      {/* Détails du produit avec la classe conditionnelle */}
      <p className={detailsClass} >
        {/* Afficher les détails complets si le produit est étendu, sinon afficher les premiers 20 caractères */}
        {isExpanded ? produit.detail : produit.detail.slice(0, 20) +  (isButtonVisible ? "..." : "")}
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
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const handleClick = (index) => {
  setExpandedProducts(prevState => ({
    ...prevState,
    [index]: !prevState[index]
  }));
};
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const indexOfLastProduit = currentPage * produitsPerPage;
const indexOfFirstProduit = indexOfLastProduit - produitsPerPage;
const currentProduits = produits.slice(indexOfFirstProduit, indexOfLastProduit);
const paginate = pageNumber => setCurrentPage(pageNumber);
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const userStatut = currentProduits.map(produit => produit.statut);
// Filtrer les produits ayant le statut 1
const filteredProduits = produits.filter(produit => produit.statut === 1);
  return ( 
    <>
    {compenentIsVisible ? (
    <section className="container  graylogo p-4 mt-5 rounded-4 mx-auto" style={{ marginBottom:"" }}>
        <h2 className="text-center mx-auto rounded-3 p-3">Vous souhaitez passez une commande :</h2>
        <h3 className="text-center mx-auto rounded-3 p-3">Commencez par selectionnez un produit, </h3>
    
              {/* <NavBoutique /> */}
      
        <article className="row">
        {filteredProduits.map((produit, produit_id) => (
            <div className="col-md-6 col-lg-4" key={produit_id}>
              <div className="card border mb-3">
                <div className="card-body ">
                  <h2 className="card-title fs-5 p-2 rounded text-center">{produit.nom}</h2>
                  <div className='fixed-height'> {renderProduitDetails(produit, produit_id)} </div>
                  {/* <p className="card-text fs-5">{produit.detail}</p> */}
                  <p className="card-text mt-5 fs-5">{produit.tarif} €</p>
                  {/* <p className="card-text fs-5">{produit.produit_id} </p> */}
                  {produit.photos && produit.photos.length > 0 ? (
                              <Carousel 
                              nextIcon={<FaChevronRight style={ thickChevronStyle } />} // Utilisation de l'icône de flèche droite avec une taille de 24px et une couleur BLEUE
                              prevIcon={<FaChevronLeft style={ thickChevronStyle } />} // Utilisation de l'icône de flèche gauche avec une taille de 24px et une couleur BLEUE 
                                  >
                                {produit.photos.map((photos, image_id) => (
                                  <Carousel.Item key={image_id}>
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

                        <Button onClick={() => addCommand(produit)} className='d-flex gap-3 mx-auto '>
                            <span onClick={(e) => {e.stopPropagation(); removeInCommand(produit.produit_id)}} style={{ fontSize: "24px", backgroundColor: "black", padding: "3px" }} >&#8681;</span>
                            {panier.filter(item => item.produit_id === produit.produit_id).length > 0 ? 
                                `Quantité: ${panier.find(item => item.produit_id === produit.produit_id).quantite}` : 
                                "Ajouter a la commande"
                            }
                            <span onClick={(e) => {e.stopPropagation(); addCommand(produit)}} style={{ fontSize: "24px",  backgroundColor: "black", padding: "3px" }}>&#8679;</span>
                        </Button>

                </div>
              </div>
            </div>
          ))}
        </article>
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
      </section>
      ) : (
          <ReserveForUser />
      )}

      <AfficherCommande  panier={panier}  />

          {compenentIsVisible && (
                <PanierIsVisible  panier={panier} />
          )}
    </>
    );
};


export default Commande;