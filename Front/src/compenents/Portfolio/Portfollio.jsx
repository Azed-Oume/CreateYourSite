import React, { useState, useEffect } from "react";
import AjouterDescription from "./AjouterDescription.jsx";
import Masonry from "react-masonry-css";
import { FaRegCommentDots, FaSpinner } from 'react-icons/fa';
import { Button } from "react-bootstrap";
import NavPortfolio from "./NavPortfolio.jsx";
import SupprimerPhotoPortfollio from "./SupprimerPhotoPortfollio.jsx";
import ButtonColor from "../AuthSecure/ButtonColor.jsx";
import '../../styles/monStyle.css'; // Assurez-vous d'importer votre fichier CSS

const Portfolio = () => {
    const [image, setImage] = useState([]);
    const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
    const [hoveredImageUrl, setHoveredImageUrl] = useState('');
    const [checked, setChecked] = useState([]);
    const [sectionClass, setSectionClass] = useState('bg-black'); // État pour gérer la classe de la section
    const role = localStorage.getItem('role'); // Récupérer le rôle depuis localStorage

    const handleCheckboxChange = (index) => {
        setChecked(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handleClick = (index, url) => {
        setHoveredImageIndex(hoveredImageIndex === index ? null : index);
        setHoveredImageUrl(hoveredImageIndex === index ? '' : url);
    };

    const handleButtonSuccessClick = () => {
        setSectionClass('bg-success'); // Mettre à jour la classe de la section
    };
    const handleButtonDangerClick = () => {
        setSectionClass('bg-danger'); // Mettre à jour la classe de la section
    };
    const handleButtonWarningClick = () => {
        setSectionClass('bg-warning'); // Mettre à jour la classe de la section
    };

    const breakpointColumnsObj = {
        default: 7,
        1600: 6,
        1400: 5,
        1200: 4,
        1000: 3,
        800: 2,
        600: 1
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

        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    useEffect(() => {
        getAllImages();
    }, []);

    return (
        <section className="m-3 p-3 mx-auto">
            <h1 className="p-2 mt-3 rounded mb-4 text-center">
                {role !== "1" ? "Portfolio" : "Ajouter des Descriptions ou les Modifier"}
                <ButtonColor 
                  onSuccessClick={handleButtonSuccessClick} 
                  onDangerClick={handleButtonDangerClick} 
                  onWarningClick={handleButtonWarningClick} 
                /> {/* Passer les fonctions au composant ButtonColor */}
            </h1>
            {image && image.length === 0 ? (
                <h1 className="p-2 mt-3 rounded mb-4 text-center">
                    Téléchargement en cours...
                    <FaSpinner className="ml-2 spinner" />
                </h1>
            ) : (
                <>
                    <NavPortfolio />
                    <section className={`${sectionClass} m-4 p-2 mx-auto`}> {/* Utiliser la classe de l'état */}
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {image.map((image, index) => (
                                <div
                                    key={index}
                                    className="card-container-beta bg-white"
                                    role="complementary"
                                    aria-labelledby={`image-${index}-title`}
                                    style={{ position: 'relative' }}
                                >
                                    <figure className={`${sectionClass} card-container-beta`}>
                                        <Button
                                            variant=""
                                            className="card-container-beta"
                                            onClick={() => handleCheckboxChange(index)}
                                            style={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                position: 'absolute',
                                                top: '5px',
                                                right: '20px',
                                                border: '1px solid white',
                                            }}
                                        >
                                            <FaRegCommentDots />
                                        </Button>
                                        <img
                                            src={image.url}
                                            className={`img-portfolio-hover rounded-3 ${hoveredImageIndex === index ? 'hovered' : ''} card-image border border-secondary`}
                                            alt={`Image de ${image.description}`}
                                            style={{ width: "100%", height: "auto" }}
                                            id={`image-${index}-title`}
                                            onClick={() => handleClick(index, image.url)}
                                        />
                                    </figure>
                                    {checked.includes(index) && (
                                        <div className="card card-container mx-auto mb-3" style={{ width: "100%", height: "auto" }}>
                                            {role !== '1' && image.description ? (
                                                <p className="text-center fw-bold" aria-label={image.description}>{image.description}</p>
                                            ) : role === '1' ? (
                                                <nav className=" ">
                                                    <p className="text-center" aria-label={image.description}>{image.description}</p>
                                                    <AjouterDescription id={image.id} initialDescription={image.description} getAllImages={getAllImages} />
                                                    <SupprimerPhotoPortfollio id={image.id} getAllImages={getAllImages} />
                                                </nav>
                                            ) : (
                                                <p className="text-center">Pas de description</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {hoveredImageIndex !== null && (
                                <div className="hovered-image-container" style={{ translate: "-50% -50%" }}>
                                    <img src={hoveredImageUrl} className="hovered-image" alt={`Hovered image ${hoveredImageIndex}`} />
                                </div>
                            )}
                        </Masonry>
                    </section>
                </>
            )}
        </section>
    );
};

export default Portfolio;
