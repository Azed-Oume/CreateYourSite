import React from "react";
import wireframe1 from "../../../../images/Carrousel/wireframe1.png";
import wireframe2 from "../../../../images/Carrousel/wireframe2.png";
import wireframe3 from "../../../../images/Carrousel/wireframe3.png";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Carrousel = () => {
    const images = [
        {
            src: wireframe1,
            text1: "Nous travaillons sur une prémaquette selon vos exigences.",
            text2: "Afin de vous offrir une visualisation complète de votre futur site web.",
            alt: "Image de prémaquette en cours d'élaboration, avec une abeille comme ingénieur, un œil symbolisant les recherches, un garçon qui réfléchit et du matériel de dessin."
        },
        {
            src: wireframe2,
            text1: "Nous intégrons vos modifications et vos souhaits au projet.",
            text2: "Nous restons à votre écoute pour toute autre demande ou ajustement.",
            alt: "Image de prémaquette de site web en cours d'élaboration sur plusieurs vues : smartphone, tablette, ordinateur."
        },
        {
            src: wireframe3,
            text1: "Nous vous soumettons la prémaquette une fois celle-ci terminée.",
            text2: "Vous validez la prémaquette et nous pouvons passer en post-production.",
            alt: "Image de prémaquette de site web en phase terminale sur plusieurs vues : smartphone, tablette, ordinateur."
        },
    ];
    

    const thickChevronStyle = {
        fontSize: '10rem', // Taille de l'icône
        color: 'green',   // Couleur de l'icône
        fontWeight: 'bold', // texte en gras
    };
        
    return (
        <section className="container mt-5 ">
            <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel" aria-label="Carrousel d'images de prémaquettes de site web">
                <div className="carousel-inner">
                    {images.map((image, index) => (
                        <article key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                            <section className="row" style={{ backgroundColor: "blueviolet" }}>
                                <div className="col-md-12 mx-auto text-center">
                                    <h3 className="fs-4 text-black fw-bold col-md-12 p-3 mt-2">{image.text1}</h3>
                                    <figcaption>
                                    <img src={image.src} style={{ width: "auto", maxHeight: "600px", borderRadius: "30px", padding: "5px", paddingBottom: "15px" }} className="d-block w-100 img-fluid" alt={image.alt} />
                                    </figcaption>
                                    <h3 className="fs-4 text-black fw-bold col-md-12 p-3">{image.text2}</h3>
                                </div>
                            </section>
                        </article>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <FaChevronLeft style={ thickChevronStyle} />
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <FaChevronRight style={ thickChevronStyle} />
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </section>
    );
};

export default Carrousel;
