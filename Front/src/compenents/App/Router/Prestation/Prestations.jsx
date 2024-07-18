import React, {useRef, useEffect} from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

import logo from "../../../images/logosf1.png";
import design2 from "../../../images/design2.jpg";
import responsive from "../../../images/responsive.png";
import seo from "../../../images/seo.jpg";
import accessibility from "../../../images/accessibility.png";
import coffre_pirate from "../../../images/coffre_cle.jpg";
import environment from "../../../images/environment.jpg";
import ContactMe from "../../ContactForm/Inscription/ContactMe";


const Prestations = () => {


     // Référence à l'image
     const imageRefs = useRef([]);
     // Fonction pour l'effet de grossissement
     const handleHover = (index) => {
         gsap.to(imageRefs.current[index], {
             scale: 1.05, // Grossissement de 10%
             duration: 0.3, // Durée de l'animation
         });
     };
     // Fonction pour réinitialiser l'échelle lorsqu'on arrête de survoler
     const handleHoverEnd = (index) => {
         gsap.to(imageRefs.current[index], {
             scale: 1, // Réinitialisation à l'échelle normale
             duration: 0.3, // Durée de l'animation
         });
        };
        // Effet de montage pour attacher les événements de survol
        useEffect(() => {
            const handleMouseEnter = (index) => handleHover(index);
            const handleMouseLeave = (index) => handleHoverEnd(index);
            // Vérifier si la taille de l'écran est petite
            const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
                if (!isSmallScreen) {
            imageRefs.current.forEach((image, index) => {
                if (image) {
                image.addEventListener('mouseenter', () => handleMouseEnter(index));
                image.addEventListener('mouseleave', () => handleMouseLeave(index));
                }
            });

        // Nettoyage des écouteurs d'événements lors du démontage du composant
        return () => {
            imageRefs.current.forEach((image, index) => {
                
            if (image) {
                image.removeEventListener('mouseenter', () => handleMouseEnter(index));
                image.removeEventListener('mouseleave', () => handleMouseLeave(index));
            }
            
            });
        };
        }}, []);
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    
    useEffect(() => {
        const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
        
        if (!isSmallScreen) {
          // Déterminer la valeur de départ en fonction de l'écran
          const startX = window.innerWidth > 768 ? -3000 : 3000;
          
          gsap.utils.toArray('.slide-article').forEach((article, index) => {
            gsap.from(article, {
              scrollTrigger: {
                trigger: article,
                toggleActions: 'restart none none none',
                start: 'top 80%', // Démarrer l'animation lorsque l'élément est à 80% de la hauteur de la fenêtre
                once: true // Déclencher une seule fois
              },
              opacity: 0, // Cacher initialement l'élément
              x: index % 2 === 0 ? startX : -startX, // Glissement vers la gauche pour les éléments pairs et vers la droite pour les impairs
              duration: 1,
              delay: 0 * index, // Laps de temps entre chaque élément
              onComplete: () => {
                article.style.opacity = 1; // Rendre l'élément visible une fois l'animation terminée
              }
            });
          });
        }
      }, []);
      
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/
    /*XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*/

    return(
    <section className="container col-md-9 mt-5 overflow-hidden">
            <h1 className="slide-article text-center text-decoration-underline p-4 rounded">
                Améliorez votre présence en ligne en créant des expériences numériques uniques et à votre image.
            </h1>

            <article className="slide-article p-2 mb-4 rounded" style={{ background: 'linear-gradient(to right, #f2f2f2, #e5e5e5, #d9d9d9, #cccccc, #bfbfbf, #b3b3b3, #a6a6a6, #999999, #8c8c8c, #808080)', border: 'gray solid 10px' }}>
                <p className="p-2 mb-0 fs-4">
                    <img ref={el => imageRefs.current[0] = el} src={logo} alt="Logo de l'auteur" className="rounded img-fluid" style={{ float: 'right', clear: 'both', minwidth: '50%' }} />
                    Bienvenue sur notre site dédié aux E.solutions. nôtre passion pour la conception de sites Web et Web Mobile, tout en favorisant l'accessibilité, est nôtre priorité absolue.
                    Nôtre objectif est de vous offrir des solutions numériques sur mesure, adaptées à votre entreprise, quelle que soit sa taille, et conçues pour exceller dans un monde numérique. L'innovation et la créativité sont au cœur de nôtre démarche,  chaque projet est une opportunité de repousser les limites de ce qui est possible.
                 Dans un monde en constante évolution, être présent sur le Web ne suffit pas, Il est essentiel d'être visible et de se démarquer pour attirer l'attention de votre public cible.
                 C'est pourquoi nous nous engageons à ne jamais déployer un site qui ne soit pas à votre image, et qui ne répond pas à nos principes fondamentaux.
                </p>
            </article>

            <section>
                <h2 className="fw-bold mx-auto text-center text-decoration-underline rounded p-4">Notre approche repose sur quatre principes fondamentaux :</h2>
                <article className="container-fluid d-flex justify-content-between flex-wrap gap-2">
                    <aside className="slide-article col-md-6 row border rounded p-2 mb-4" style={{ background: 'linear-gradient(to top right, rgb(144,238,144), rgb(0, 128, 0))' }}>
                        <div className="col-md-12 fs-3 fs-md-4 fs-sm-5">
                            <h3 className="fw-bold text-decoration-underline p-2 border rounded text-center">Un design fluide et percutant </h3>
                            <p>
                                <img ref={el => imageRefs.current[1] = el} src={design2} alt="Image d'ordinateur et de logo de web design fluide et percutant." className="rounded-4 img-fluid p-2" style={{ float: 'left', clear: 'both', width: '50%' }} />
                                Nous croyons en l'importance d'un design qui capte l'attention et communique efficacement votre message. Chaque élément visuel est soigneusement pensé pour créer une expérience utilisateur immersive et mémorable.
                            </p>
                        </div>
                    </aside>

                    <aside className="slide-article col-md-6 row border rounded p-2 mb-4" style={{ background: 'linear-gradient(to top left, rgb(144,238,144), rgb(0, 128, 0))' }}>
                        <div className="col-md-12 fs-4">
                            <h3 className="fw-bold text-decoration-underline p-2 border rounded text-center">Référencement naturel puissant</h3>
                            <p>
                                <img ref={el => imageRefs.current[2] = el} src={seo} alt="Image d'engrenage qui symbolise la stratégie de référencement naturel et puissant" className="rounded-4 img-fluid p-2" style={{ float: 'right', clear: 'both', width: '50%' }} />
                                Nous mettons en œuvre des stratégies avancées de référencement pour garantir que votre site soit bien positionné dans les résultats de recherche. Notre objectif est de vous aider à augmenter votre visibilité en ligne et à attirer un trafic qualifié sur votre site.
                            </p>
                        </div>
                    </aside>
                </article>

                <article className="container-fluid d-flex justify-content-between flex-wrap">
                    <aside className="slide-article col-md-6 row border rounded p-2" style={{ background: 'linear-gradient(to right, rgb(192, 192, 192), rgb(144, 238, 144))' }}>
                        <div className="col-md-12 fs-4">
                            <h3 className="fw-bold text-decoration-underline p-2 border rounded text-center">Site adaptatif et évolutif</h3>
                            <p>
                                <img ref={el => imageRefs.current[3] = el} src={responsive} alt="Image de plusieurs vue smartphone, tablette et ordinateur qui symbolise un site adaptatif et évolutif" className="rounded-4 img-fluid p-2" style={{ float: 'right', clear: 'both', width: '50%' }} />
                                Nous concevons des sites Web qui s'adaptent à tous les appareils et offrent une expérience utilisateur optimale, quel que soit le dispositif utilisé.<span className=" fw-bold"> " De plus, nous veillons à ce que votre site soit évolutif "</span>, capable de répondre à vos besoins futurs et de s'adapter aux évolutions technologiques.
                            </p>
                        </div>
                    </aside>

                    <aside className="slide-article col-md-6 row border rounded p-2" style={{ background: 'linear-gradient(to right, rgb(144, 238, 144), rgb(255, 255, 153))' }}>
                        <div className="col-md-12 fs-4">
                            <h3 className="fw-bold text-decoration-underline p-2 border rounded text-center">Accessibilité pour tous</h3>
                            <p>
                                <img ref={el => imageRefs.current[4] = el} src={accessibility} alt="Image d'une clé qui symbolise l'accés au site pour tous" className="rounded-4 img-fluid p-2" style={{ float: 'left', clear: 'both', width: '50%' }} />
                                Nous nous engageons à rendre votre site accessible aux maximum d'utilisateurs, y compris ceux ayant des besoins spécifiques. Nous suivons les meilleures pratiques en matière d'accessibilité pour garantir que chacun puisse accéder à votre contenu et utiliser votre site de manière efficace.
                            </p>
                        </div>
                    </aside>
                </article>
            </section>

            <section className="container-fluid m-5 mx-auto">
                <article className="slide-article col-md-12 row border border-black rounded p-2 mx-auto mb-4">
                    <h2 className="fw-bold mx-auto text-center text-decoration-underline rounded p-4 mt-4">Des solutions éco-responsables pour votre projet :</h2>
                    <aside className="col-md-12 row rounded p-2 mx-auto mb-4" style={{ background: 'linear-gradient(to right, #808080, #8c8c8c, #999999, #a6a6a6, #b3b3b3, #bfbfbf, #cccccc, #d9d9d9, #e5e5e5, #f2f2f2)', border: 'gray solid 10px' }}>
                        <div className="col-md-12 fs-4">
                            <h3 className="fw-bold text-decoration-underline p-2 border rounded text-center">Développement durable :</h3>
                            <p>
                                <img ref={el => imageRefs.current[5] = el} src={environment} alt="Image d'un 8 allonger avec des arbres, des nuages, une maison  un chien des fleurs, qui symbolise une mouvement pérpétuel de la natue qui ce recycle en pérmanence" className="rounded-4  img-fluid p-2" style={{ float: 'left', clear: 'both', width: '50%' }} />
                                Nous sommes engagés dans une approche de développement durable. Notre équipe utilise des technologies respectueuses de l'environnement pour réduire l'empreinte carbone de votre site tout en garantissant des performances optimales.
                                En choisissant nos services, vous contribuez également à préserver notre planète pour les générations futures.
                            </p>
                        </div>
                    </aside>
                </article>

                <article className="slide-article col-md-12 row border border-black rounded p-2 mx-auto mb-4">
                    <h2 className="fw-bold mx-auto text-center text-decoration-underline rounded p-4 mt-4">Accédez à un site web professionnel sans dépenser une fortune :</h2>
                    <aside className="col-md-12 row rounded p-2 mb-4 mx-auto" style={{ background: 'linear-gradient(to right, #f2f2f2, #e5e5e5, #d9d9d9, #cccccc, #bfbfbf, #b3b3b3, #a6a6a6, #999999, #8c8c8c, #808080)', border: 'gray solid 10px' }}>
                        <div className="col-md-12 fs-4">
                            <h3 className="fw-bold text-decoration-underline p-2 border rounded text-center">Services Web de Qualité et Accessibles à Tous:</h3>
                            <p>
                                <img ref={el => imageRefs.current[6] = el} src={coffre_pirate} alt="Image d'un petit coffre avec sa clé et des euros autour qui symbolise le pas cher pour l'achats d'un site" className="rounded-4 img-fluid p-2" style={{ float: 'right', clear: 'both', width: '50%' }} />
                                Nous proposons des services web de qualité à des prix imbattables. Notre mission est de rendre le développement web accessible à tous, sans vous ruiner. Avec notre équipe de professionnels expérimentés, bénéficiez d'une expertise de haut niveau à des tarifs abordables. Nous sommes là pour vous, proches de chez vous, pour répondre à tous vos besoins en matière de développement web.
                            </p>
                        </div>
                    </aside>
                </article>
            </section>

            <section className="slide-article col-md-12 row border border-black rounded p-2 mx-auto mb-4">
                <h2 className="fw-bold mx-auto text-center text-decoration-underline rounded p-4 m-1">Pourquoi nous choisir :</h2>
                <p className="col-md-12 row  rounded p-2 mx-auto" style={{ background: 'linear-gradient(to right, #808080, #8c8c8c, #999999, #a6a6a6, #b3b3b3, #bfbfbf, #cccccc, #d9d9d9, #e5e5e5, #f2f2f2)', border: 'gray solid 10px' }}>
                    Que vous soyez une startup cherchant à établir votre identité de marque ou une entreprise chevronnée cherchant à améliorer l'expérience utilisateur, nous avons ce qu'il vous faut. Des designs élégants et modernes aux fonctionnalités robustes et à la navigation transparente, nous sommes fiers de proposer des sites Web qui non seulement sont superbes, mais qui fonctionnent également parfaitement sur tous les appareils. Associez-vous dès aujourd'hui à nos solutions et laissez-nous vous aider à libérer tout le potentiel de votre présence en ligne. Contactez-nous pour discuter de votre projet et faire le premier pas vers la réussite numérique !
                </p>
            </section>

            <section className="slide-article col-md-12 row border border-black rounded p-2 mx-auto mb-4">
                <h2 className="fw-bold mx-auto text-center text-decoration-underline rounded p-4 m-1">Notre équipe :</h2>
                <p className="col-md-12 row  rounded p-2 mx-auto" style={{ background: 'linear-gradient(to right, #f2f2f2, #e5e5e5, #d9d9d9, #cccccc, #bfbfbf, #b3b3b3, #a6a6a6, #999999, #8c8c8c, #808080)', border: 'gray solid 10px' }}>
                    Chez nous, chaque projet est une aventure collaborative, nous nous appuyons sur le savoir-faire et l'expertise de notre vaste réseau de développeurs solidaires. Chaque membre de réseau apporte sa propre contribution unique, ce qui nous permet de proposer des solutions innovantes et adaptées à vos besoins spécifiques. En travaillant ensemble, nous visons à créer des sites Web qui se démarquent dans un paysage numérique en constante évolution. Que vous ayez besoin d'un Portfolio, d'un blog, d'un site Web vitrine ou d'un site e-commerce, nous sommes là pour vous accompagner à chaque étape de votre parcours numérique.
                </p>
            </section>
            <ContactMe />
    </section>

    )
}

export default Prestations;