
import React, { useState, useEffect } from 'react';
import { Button, Carousel, Pagination } from 'react-bootstrap';
import fishblue from '../../../../images/fishblue.png';
import poisson_rouge from '../../../../images/poisson_rouge.png';
import my_fish from '../../../../images/my_fish.png';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PanierIsVisible from './PanierIsVisible.jsx';
import FiltreProduit from './FiltreProduit.jsx';

const Boutique = () => {
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [panier, setPanier] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [produitsPerPage, setProduitsPerPage] = useState(25);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [categorie, setCategorie] = useState('');

  const defaultImages = [
    { url: my_fish },
    { url: poisson_rouge },
    { url: fishblue }
  ];

  const thickChevronStyle = {
    fontSize: '5rem',
    color: 'green',
    fontWeight: 'bold',
  };

  useEffect(() => {
    fetchProduits();
  }, [currentPage, produitsPerPage]);

  const fetchProduits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_URL_API}/api/get/product`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status === 404) {
          alert("Pas de produits pour le moment.");
        } else {
          throw new Error('Une erreur est survenue lors du FETCH');
        }
      } else {
        const data = await response.json();
        setProduits(data.produits);
        setFilteredProduits(data.produits);
      }
    } catch (error) {
      console.error('Error fetching produits:', error);
    }
  };

  const ajouterAuPanier = (produit) => {
    const produitExistantIndex = panier.findIndex(item => item.produit_id === produit.produit_id);
    if (produitExistantIndex !== -1) {
      const nouveauPanier = [...panier];
      nouveauPanier[produitExistantIndex].quantite += 1;
      setPanier(nouveauPanier);
    } else {
      setPanier([...panier, { ...produit, quantite: 1 }]);
    }
  };

  const retirerDuPanier = (produit_id) => {
    const produitExistantIndex = panier.findIndex(item => item.produit_id === produit_id);
    if (produitExistantIndex !== -1) {
      if (panier[produitExistantIndex].quantite > 1) {
        const nouveauPanier = [...panier];
        nouveauPanier[produitExistantIndex].quantite -= 1;
        setPanier(nouveauPanier);
      } else {
        const nouveauPanier = panier.filter(item => item.produit_id !== produit_id);
        setPanier(nouveauPanier);
      }
    }
  };

  const renderProduitDetails = (produit, index) => {
    const isExpanded = expandedProducts[index];
    const isButtonVisible = produit.detail.length > 20;
    const detailsClass = `card-text fs-5 ${!isButtonVisible && !isExpanded ? 'fixed-height' : ''}`;

    return (
      <>
        <p className={detailsClass}>
          {isExpanded ? produit.detail : produit.detail.slice(0, 20) + (isButtonVisible ? "..." : "")}
        </p>
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
  };

  const indexOfLastProduit = currentPage * produitsPerPage;
  const indexOfFirstProduit = indexOfLastProduit - produitsPerPage;
  const currentProduits = filteredProduits.slice(indexOfFirstProduit, indexOfLastProduit);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <>
      <section className="container graylogo p-4 mt-5 rounded-4 mx-auto">
        <h2 className="text-center mx-auto rounded-3 p-3">Bienvenue dans ma Boutique :</h2>
        <FiltreProduit produits={produits} setCategorie={setCategorie} setFilteredProduits={setFilteredProduits} />
        <article className="row">
          {currentProduits.map((produit, produit_id) => (
            <div className="col-md-6 col-lg-4" key={produit_id}>
              <div className="card border mb-3">
                <div className="card-body ">
                  <h2 className="card-title fs-5 p-2 rounded text-center">{produit.nom}</h2>
                  <div className='fixed-height'> {renderProduitDetails(produit, produit_id)} </div>
                  <p className="card-text mt-5 fs-5">{produit.tarif} €</p>
                  {produit.photos && produit.photos.length > 0 ? (
                    <Carousel 
                      nextIcon={<FaChevronRight style={thickChevronStyle} />} 
                      prevIcon={<FaChevronLeft style={thickChevronStyle} />}>
                      {produit.photos.map((photos, image_id) => (
                        <Carousel.Item key={image_id}>
                          <img key={image_id} src={photos} alt={`photo ${image_id + 1}`} className='row col-md-9 mx-auto rounded rounded-5' style={{ width: 'auto', height: '300px', margin: '5px' }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <Carousel>
                      {defaultImages.map((image, index) => (
                        <Carousel.Item key={index}>
                          <p>Pas de photos pour ce produit</p>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  )}
                     <Button onClick={() => ajouterAuPanier(produit)} className='d-flex gap-3 mx-auto '>
                                <span className='rounded' onClick={(e) => {e.stopPropagation(); retirerDuPanier(produit.produit_id)}} style={{ fontSize: "24px", backgroundColor: "black", padding: "3px" }} >&#8681; - </span>
                                {panier.filter(item => item.produit_id === produit.produit_id).length > 0 ? 
                                    `Quantité: ${panier.find(item => item.produit_id === produit.produit_id).quantite}` : 
                                    "Ajouter au Panier"
                                }
                                <span className='rounded' onClick={(e) => {e.stopPropagation(); ajouterAuPanier(produit)}} style={{ fontSize: "24px",  backgroundColor: "black", padding: "3px" }}>&#8679; + </span>
                            </Button>
                  </div>
                </div>
              </div>
          ))}
        </article>
        <div className="pagination justify-content-center">
          <Pagination>
            <Pagination.Prev onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)} disabled={currentPage === 1} />
            {Array.from({ length: Math.ceil(filteredProduits.length / produitsPerPage) }, (_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage(currentPage === Math.ceil(filteredProduits.length / produitsPerPage) ? currentPage : currentPage + 1)} disabled={currentPage === Math.ceil(filteredProduits.length / produitsPerPage)} />
          </Pagination>
        </div>
      </section>
      <PanierIsVisible panier={panier} />
    </>
  );
};

export default Boutique;

