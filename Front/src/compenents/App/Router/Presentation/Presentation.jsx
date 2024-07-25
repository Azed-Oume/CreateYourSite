import React from "react"
import ContactMe from "../../ContactForm/Inscription/ContactMe";

const Presentation = ()=> {

    return(
        <>
        <section className="container mt-5 mb-2 p-1 rounded bg-light text-dark">
            <section className="p-2 fw-bold rounded mb-2" style={{ background: 'linear-gradient(to right, #808080, #8c8c8c, #999999, #a6a6a6, #b3b3b3, #bfbfbf, #cccccc, #d9d9d9, #e5e5e5, #f2f2f2)', border: 'gray solid 10px' }}>
                <article className="p-4 border rounded mb-4" >
                    <h1 className="text-center mb-4">Bienvenue sur mon site : Présentation générale !</h1>
                    <p className="text-center ">
                    Je suis ravi de vous accueillir sur mon site, conçu spécialement pour vous présenter un aperçu de mes compétences en tant que développeur freelance.<br/> Ce site est votre porte d'entrée pour découvrir ce que nous pouvons accomplir ensemble.<br/> En matière de développement web, les possibilités sont presque infinies, La seule limite est celle que l'esprit humain s'impose.<br/> Laissez libre cours à votre imagination, rêvez grand, projetez vos idées les plus audacieuses, et je les concrétiserai pour vous.
                    </p>
                </article>
            </section>
            <p className="text-p fw-bold mb-4 mt-4 p-2 ">Pour une expérience complète et personnalisée, n'hésitez pas à créer votre compte dès maintenant pour profitez de toutes les fonctionnalités et explorez notre site en toute liberté.</p>
            <h2 className="text-center mb-4">Mon site se divise en deux sections principales :</h2>
            <section className="p-2 fw-bold rounded mb-2" style={{ background: 'linear-gradient(to right, #f2f2f2, #e5e5e5, #d9d9d9, #cccccc, #bfbfbf, #b3b3b3, #a6a6a6, #999999, #8c8c8c, #808080)', border: 'gray solid 10px' }}>
                <h3 className="text-center">Section pour les clients</h3>
                <article className="p-4 border rounded mb-4" >
                <h4>Navigation optimisée pour vos clients</h4>
                <p >
                    Dans cette première section, intégrée à la barre de navigation supérieure, vous découvrirez :
                </p>
                <h4>Acceuil, Prestation :</h4>
                <p>Ici vous trouverez plus d'informations sur ma méthodologie de travail</p>
                <h4>Profil :</h4>
                <p>
                    Consultez et modifiez toutes les informations utilisateur, y compris les devis, commandes et factures, centralisés pour une gestion simplifiée.
                </p>
                <h4>Blog :</h4>
                <p>
                    Explorez des articles diversifiés répartis en sept catégories : Bio, Business, Cuisine, Mode, Politique, Technologie et Voyages, pour rester informé et inspiré.
                </p>
                <h4>Portfolio :</h4>
                <p>
                    Découvrez mes projets professionnels, dont celui développé pour un vendeur de gâteaux et glaces, démontrant mes compétences et offrant une visibilité accrue en ligne pour ses activités.
                </p>
                <h4>Boutique, Devis, Commande :</h4>
                <p>
                    Plongez dans une expérience e-commerce complète avec navigation produit, gestion de panier, paiement sécurisé, création et gestion de devis et transformation en factures.
                </p>
                <h4>Contact :</h4>
                <p>
                    Utilisez cette section pour me contacter directement et discuter de vos besoins spécifiques.
                </p>
                </article>
                <ContactMe />
            </section>
            
            <section className="p-2 fw-bold rounded" style={{ background: 'linear-gradient(to right, #808080, #8c8c8c, #999999, #a6a6a6, #b3b3b3, #bfbfbf, #cccccc, #d9d9d9, #e5e5e5, #f2f2f2)', border: 'gray solid 10px' }}>
                <h3 className="text-center">Section pour les administrateurs</h3>
                <article className="p-4 border rounded mb-4">
                <h4>Gestion du site pour les administrateurs</h4>
                <p>
                    La barre de navigation inférieure est dédiée à la gestion du contenu et des utilisateurs pour les administrateurs. Voici les principales fonctionnalités :
                </p>
                <h4>Ajouter une photo :</h4>
                <p>
                    Mettez à jour votre portfolio en ajoutant, modifiant ou supprimant des photos directement depuis l'onglet portfolio avec les permissions d'administrateur.
                </p>
                <h4>Gestion de la boutique :</h4>
                <p>
                    Ajoutez, modifiez ou supprimez des catégories et produits, gérez les stocks et approuvez les produits en attente de publication pour maintenir une boutique en ligne dynamique.
                </p>
                <h4>Gestion des utilisateurs :</h4>
                <p>
                    Gérez les comptes utilisateurs, ajustez les permissions et assurez une expérience utilisateur personnalisée et sécurisée.
                </p>
                </article>
                <ContactMe />
            </section>
        </section>
      </>
    )
}

export default Presentation;