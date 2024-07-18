
import React, { useState, useEffect, useRef } from "react";
import '../../styles/monStyle.css'; // Assurez-vous d'importer votre fichier CSS
import AjouterDescription from "./AjouterDescription";
import Masonry from "react-masonry-css";
import { FaRegCommentDots, FaSpinner } from 'react-icons/fa';
import { Button } from "react-bootstrap";
import NavPortfolio from "./NavPortfolio";

const symbols = ['♥', '♦', '♣', '♠']; // Liste des symboles de cartes

const Portfolio = () => {
    const [image, setImage] = useState([]);
    const [animatedIndices, setAnimatedIndices] = useState([]);
    const [randomSymbols, setRandomSymbols] = useState([]); // Tableau pour stocker les symboles aléatoires
    const cardRefs = useRef([]); // Références aux éléments de carte
    const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
    const [hoveredImageUrl, setHoveredImageUrl] = useState('');
    const [checked, setChecked] = useState([]);
    const role = localStorage.getItem('role'); // Récupérer le rôle depuis localStorage

    const handleCheckboxChange = (index) => {
        setChecked(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    const handleClick = (index, url) => {
        if (hoveredImageIndex === index) {
            setHoveredImageIndex(null);
            setHoveredImageUrl('');
        } else {
            setHoveredImageIndex(index);
            setHoveredImageUrl(url);
        }
    };

    const breakpointColumnsObj = {
        default: 4,
        1100: 2,
        700: 1
    };

    // Fonction pour faire défiler jusqu'à la carte
    const scrollToCard = (index) => {
        if (cardRefs.current[index]) {
            cardRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    // Fonction pour récupérer toutes les images
    const getAllImages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/images`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setImage(data.images);

            // Générer des symboles aléatoires pour chaque image
            const generatedSymbols = data.images.map(() => getRandomSymbol());
            setRandomSymbols(generatedSymbols);

            // Appliquer les animations une par une
            for (let i = 0; i < data.images.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 600)); // Délai de 600ms entre chaque carte
                setAnimatedIndices(prev => [...prev, i]);  // Ajouter l'indice actuel à la liste des indices animés
                scrollToCard(i); // Faire défiler jusqu'à la carte
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    // Fonction pour obtenir un symbole aléatoire
    const getRandomSymbol = () => {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        return symbols[randomIndex];
    };

    // Fonction pour obtenir la couleur d'un symbole
    const getSymbolColor = (symbol) => {
        return ['♥', '♦'].includes(symbol) ? 'red' : 'black';
    };

    // Appeler la fonction pour récupérer toutes les images
    useEffect(() => {
        getAllImages();
    }, []);

    return (
        <>
            <section className="m-3 p-3 mx-auto">
                {role !== "1" ? (
                    <h1 className="p-2 mt-3 rounded mb-4 text-center">Portfolio</h1>
                ) : (
                    <h1 className="p-2 mt-3 rounded mb-4 text-center">Ajouter des Descriptions ou les Modifier</h1>
                )}
                {image && image.length === "0" ? (
                    <h1 className="p-2 mt-3 rounded mb-4 text-center ">
                        Téléchargement en cours...  
                        <FaSpinner className="ml-2 spinner" />
                    </h1>
                ) : (
                    <>
                        <NavPortfolio />
                        <section className="bg-black m-4 p-2 mx-auto">
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid col-md-3"
                                columnClassName="my-masonry-grid_column"
                            >
                                {image.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`card-container-beta bg-white ${animatedIndices.includes(index) ? 'animate' : ''}`}
                                        role="complementary"
                                        aria-labelledby={`image-${index}-title`}
                                        style={{ position: 'relative' }} // Ajout de la position relative ici
                                    >
                                        <figure
                                            className={`card-container-beta ${animatedIndices.includes(index) ? 'animate' : ''}`}
                                        >
                                                <Button
                                                    variant=""
                                                    className={`card-container-beta ${animatedIndices.includes(index) ? 'animate' : ''}`}
                                                    onClick={() => handleCheckboxChange(index)}
                                                    style={{ 
                                                        cursor: 'pointer', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        position: 'absolute', 
                                                        top: '5px', 
                                                        right: '20px', 
                                                    }}
                                                >
                                                    <FaRegCommentDots />
                                                </Button>

                                            <img
                                                src={image.url}
                                                className={`img-portfolio-hover ${hoveredImageIndex === index ? 'hovered' : ''} card-image border border-secondary img-portfolio-hover`}
                                                alt={`Image de ${image.description}`}
                                                style={{ width: "100%", height: "auto" }}
                                                id={`image-${index}-title`}
                                                onClick={() => handleClick(index, image.url)}
                                            />
                                            <span className="symbol top-left" role="img" aria-label={randomSymbols[index]} style={{ color: getSymbolColor(randomSymbols[index]) }}>{randomSymbols[index]}</span>
                                            <span className="symbol top-right" role="img" aria-label={randomSymbols[index]} style={{ color: getSymbolColor(randomSymbols[index]) }}>{randomSymbols[index]}</span>
                                            <span className="symbol bottom-left" role="img" aria-label={randomSymbols[index]} style={{ color: getSymbolColor(randomSymbols[index]) }}>{randomSymbols[index]}</span>
                                            <span className="symbol bottom-right" role="img" aria-label={randomSymbols[index]} style={{ color: getSymbolColor(randomSymbols[index]) }}>{randomSymbols[index]}</span>
                                        </figure>
                                        {checked.includes(index) && (
                                            <div className={`card card-container mx-auto ${animatedIndices.includes(index) ? 'animate' : ''}`} style={{ width: "100%", height: "auto" }}>
                                                {role !== '1' && image.description ? (
                                                    <p className="text-center fw-bold" aria-label={image.description}>{image.description}</p>
                                                ) : role === '1' ? (
                                                    <>
                                                        {image.description ? (
                                                            <>
                                                                <p className="text-center" aria-label={image.description}>{image.description}</p>
                                                                <AjouterDescription id={image.id} initialDescription={image.description} getAllImages={getAllImages} />
                                                            </>
                                                        ) : (
                                                            <AjouterDescription id={image.id} initialDescription={image.description} getAllImages={getAllImages} />
                                                        )}
                                                    </>
                                                ) : (
                                                    <p className="text-center">Pas de description</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {hoveredImageIndex !== null && (
                                    <div className="hovered-image-container" style={{ translate:"-50% -50%" }}>
                                        <button className="close-button" onClick={() => setHoveredImageIndex(null)}>
                                            X
                                        </button>
                                        <img src={hoveredImageUrl} className="hovered-image" alt={`Hovered image ${hoveredImageIndex}`} />
                                    </div>
                                )}
                            </Masonry>
                        </section>
                    </>
                )}
            </section>
        </>
    );
};

export default Portfolio;
