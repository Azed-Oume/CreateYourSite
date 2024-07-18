import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carrousel from './Caroussel/Carrousel.jsx';
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GeneratedLogos from '../logos/GeneratedLogos.jsx';
import AnimatedAcceuil from './AnimatedAcceuil.jsx';
import ContactMe from '../../ContactForm/Inscription/ContactMe.jsx';

gsap.registerPlugin(ScrollTrigger);

const Acceuil = () => {
  const [isVisible, setIsVisible] = useState(false);

  
  useEffect(() => {
    // Vérifier si l'écran est petit (inférieur ou égal à 768px de large)
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;

    // Si ce n'est pas un petit écran
    if (!isSmallScreen) {
      // Sélectionner tous les éléments avec la classe .slide-article et les stocker dans un tableau
      const articles = gsap.utils.toArray(".slide-article");
      
      // Pour chaque article, appliquer une animation d'apparition
      articles.forEach((article, index) => {
        gsap.from(article, {
          opacity: 0, // Commencer avec une opacité de 0 pour l'effet de fondu
          x: index === 0 ? 0 : '90%', // Animer depuis la gauche pour le premier article, sinon, garder en place
          duration: 0.5, // Durée de l'animation
          delay: 0.1 * index, // Décalage pour chaque article pour un effet d'escalier
          scrollTrigger: {
            trigger: article,
            toggleActions: 'play none none none', // Activer l'animation une fois et la désactiver ensuite
            start: 'top 90%', // Déclencher l'animation lorsque l'article est à 90% du haut de la fenêtre
            once: true, // Ne déclencher l'animation qu'une seule fois
          },
        });
      });
    }
  }, []);

  return (
    <>
    { isVisible ? (
      <AnimatedAcceuil />
    ) : (
      <>
      <Carrousel />
      <section className="container slide-article row  mx-auto graylogo mt-2  rounded overflow-hidden">
        <article className="border-bottom mb-4 " >
          <h1 className="slide-article h1 text-center mx-auto rounded hover-effect mt-2 p-4">
            Bienvenue sur mon site de Développeur Full-Stack Indépendant
          </h1>

          <aside className="row mb-3 fs-5 m-3">
            <p className="slide-article col-12 col-md-5 m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Je m'appelle Azzedine, je suis spécialisé dans les technologies web les plus demandées sur le marché.
            </p>
            <p className="slide-article col-12 col-md-5 m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Vous souhaitez augmenter vos ventes en développant un site web performant, moderne et à votre image ?
            </p>
          </aside>
        </article>
        <article className="border-bottom mb-4 ">
          <h3 className="slide-article h3 text-center mx-auto no-hover hover-effect m-1 p-4">Un service complet pour concrétiser votre projet :</h3>
          <aside className="d-flex flex-wrap mb-3 fs-5 gap-3">
            <p className="col-md-10 slide-article m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Assistance au design : création d'une pré-maquette pour définir l'apparence générale de votre projet.
            </p>
            <p className="col-md-10 slide-article m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Développement en "Post-Production" : réalisation professionnelle de votre projet en suivant les meilleures pratiques de l'industrie.
            </p>
            <p className="col-md-10 slide-article m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Intégration de vos modifications : prise en compte de vos retours et ajustements tout au long du processus de développement.
            </p>
            <p className="col-md-10 slide-article m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Déploiement et maintenance : lancement du projet avec suivi et assistance pour toute maintenance future ou évolution nécessaire.
            </p>
          </aside>
        </article>
        <article className="border-bottom mb-4 ">
          <h3 className="slide-article h3 text-center mx-auto no-hover hover-effect m-1 p-4">Mais ce n’est pas tout! J'apporte également mon expertise dans les domaines suivants</h3>
          <aside className="d-flex flex-wrap mb-3 fs-5">
            <p className="slide-article col-md-5 m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Optimisation du référencement naturel (SEO) pour une meilleure visibilité sur les moteurs de recherche.
            </p>
            <p className="slide-article col-md-5 m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Conseils personnalisés sur les mots-clés, les balises, les liens, etc., avec des rapports de performance pour suivre l’évolution du trafic.
            </p>
          </aside>
        </article>
        <ContactMe />

        <article className="border-bottom mb-4 ">
          <h3 className="slide-article h3 text-center mx-auto no-hover hover-effect m-1 p-4">Mes compétences techniques :</h3>
          <aside className="d-flex flex-wrap mb-3 fs-5">
            <p className="col-md-10 slide-article m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Front-end : création de sites web dynamiques et réactifs avec JavaScript, React.js et Bootstrap, gsap...
            </p>
            <p className="col-md-10 slide-article m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Back-end : développement de la partie serveur avec Node.js et MySQL pour gérer les données, l’authentification, la sécurité, etc.
            </p>
            <p className="col-md-10 slide-article m-1 p-3 text-center mx-auto no-hover-bg hover-effect">
              Déploiement : mise en ligne sur la plateforme d’hébergement O2switch pour des services de qualité, de sécurité et de performance.
            </p>
          </aside>
          <section className="rounded col-md-9 mx-auto">
            <GeneratedLogos />
          </section>
        </article>

        <article className="border-bottom mb-4 ">
          <h4 className="slide-article h3 text-center mx-auto no-hover hover-effect m-1 p-4">Mes atouts professionnels :</h4>
          <aside className="d-flex flex-wrap fs-5">
            <p className="slide-article col-md-5 text-center mx-auto m-1 p-3 no-hover-bg hover-effect">
              Indépendance : je travaille en tant qu’indépendant, ce qui me permet de gérer mon temps et mes clients avec flexibilité et écoute.
            </p>
            <p className="slide-article col-md-5 text-center mx-auto m-1 p-3 no-hover-bg hover-effect">
              Qualité : Un travail respectant les normes et les bonnes pratiques du développement web, pour des produits fonctionnels, fiables et faciles à maintenir.
            </p>
          </aside>
        </article>

        <article className="">
          <h4 className="slide-article h3 text-center mx-auto no-hover hover-effect m-1 p-4"> Une question :</h4>
          <aside className="d-flex flex-wrap mb-3 fs-5">
            <p className='col-md-10 slide-article m-1 p-3 text-center mx-auto no-hover-bg hover-effect'>
              N’hésitez pas à me contacter. Je vous répondrai dans les plus brefs délais pour discuter de votre projet, de vos besoins, de votre budget et de vos délais. Vous pouvez me joindre par e-mail ou via le formulaire de contact.
            </p>
            <ContactMe />
            <p className='col-md-10 slide-article m-1 p-3 text-center mx-auto no-hover-bg hover-effect'>
              Avec mon expertise, vous pouvez être sûr d'obtenir un service de qualité, adapté à vos besoins et vos objectifs. Contactez-moi dès aujourd'hui pour discuter de votre projet !
            </p>
          </aside>
        </article>
      </section>
      </>
      )}
    </>
  );
}

export default Acceuil;
