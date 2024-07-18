
import React, { useState, useEffect } from 'react';

const FiltreProduit = ({ produits, setCategorie, setFilteredProduits }) => {
  const [categorie, setLocalCategorie] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    filterProduits();
  }, [categorie, searchTerm, produits]);

  const handleCategoryChange = (event) => {
    const newCategorie = event.target.value;
    setLocalCategorie(newCategorie);
    setCategorie(newCategorie); // Mettre à jour la catégorie dans le composant parent
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterProduits = () => {
    const filtered = produits.filter(produit => 
      (categorie === '' || produit.categorie === categorie) &&
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProduits(filtered); // Mettre à jour les produits filtrés dans le composant parent
  };

  return (
    <>
    <nav className='row mx-auto text-white fw-bold border mt-3 mb-3'>
        <div className="col-md-6 mb-3">
            <label htmlFor="category" className=" col-form-label text-md-end">Filtrer par catégorie :</label>
            <div className="">
            <select id="category" className="form-select" value={categorie} onChange={handleCategoryChange}>
                <option value="">Toutes</option>
                {Array.from(new Set(produits.map((produit) => produit.categorie))).map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
                ))}
            </select>
            </div>
        </div>
        <div className="col-md-6 mb-3">
            <label htmlFor="search" className=" col-form-label text-md-end">Rechercher un produit :</label>
            <div className="">
            <input 
                type="text" 
                id="search" 
                value={searchTerm} 
                onChange={handleSearchChange} 
                className="form-control" 
                placeholder="Rechercher par nom..." 
            />
            </div>
        </div>
  </nav>
</>

  );
};

export default FiltreProduit;
