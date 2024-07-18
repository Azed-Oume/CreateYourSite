import React from "react"
import ContactMe from "../../ContactForm/Inscription/ContactMe";

const Presentation = ()=> {

    return(
        <>
        <section className="container mt-5 mb-2 p-1 rounded bg-light text-dark">
            <section className="p-2 fw-bold rounded mb-2" style={{ background: 'linear-gradient(to right, #808080, #8c8c8c, #999999, #a6a6a6, #b3b3b3, #bfbfbf, #cccccc, #d9d9d9, #e5e5e5, #f2f2f2)', border: 'gray solid 10px' }}>
                <article className="p-4 border rounded mb-4" >
                    <h1 className="text-center mb-4">Bienvenue sur mon site : Présentation générale !</h1>
                    <p >
                        Je suis ravi de vous accueillir sur mon site, conçu spécialement pour vous présenter mes compétences en tant que développeur freelance. Ce site est votre porte d'entrée pour découvrir ce que je peux vous offrir en matière de développement web.
                    </p>

                    <h2 className="text-center mb-4">Mon site se divise en deux sections principales :</h2>
                </article>
            </section>

            <section className="p-2 fw-bold rounded mb-2" style={{ background: 'linear-gradient(to right, #f2f2f2, #e5e5e5, #d9d9d9, #cccccc, #bfbfbf, #b3b3b3, #a6a6a6, #999999, #8c8c8c, #808080)', border: 'gray solid 10px' }}>
                <h3>Section pour les clients</h3>
                <article className="p-4 border rounded mb-4" >
                <h3 className="text-center">Navigation optimisée pour vos clients</h3>
                <p >
                    Dans cette première section, intégrée à la barre de navigation principale, vous découvrirez :
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

            {/* Deuxième section */}
            <section className="p-2 fw-bold rounded" style={{ background: 'linear-gradient(to right, #808080, #8c8c8c, #999999, #a6a6a6, #b3b3b3, #bfbfbf, #cccccc, #d9d9d9, #e5e5e5, #f2f2f2)', border: 'gray solid 10px' }}>
                <h3>Section pour les administrateurs</h3>
                <article className="p-4 border rounded mb-4">
                <h2 className="text-center">Gestion du site pour les administrateurs</h2>
                <p>
                    La barre de navigation inférieure est dédiée à la gestion du contenu et des utilisateurs pour les administrateurs. Voici les principales fonctionnalités :
                </p>
                <h3>Ajouter une photo :</h3>
                <p>
                    Mettez à jour votre portfolio en ajoutant, modifiant ou supprimant des photos directement depuis l'onglet portfolio avec les permissions d'administrateur.
                </p>
                <h3>Gestion de la boutique :</h3>
                <p>
                    Ajoutez, modifiez ou supprimez des catégories et produits, gérez les stocks et approuvez les produits en attente de publication pour maintenir une boutique en ligne dynamique.
                </p>
                <h3>Gestion des utilisateurs :</h3>
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