import { Link, useNavigate } from 'react-router-dom';
import { gsap } from "gsap";
import { useState, useEffect, Suspense } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Nav, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';

import logo from "../../images/logo.png";
import logout from "../../images/logout.png";

const Header = () => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const [selectedButton, setSelectedButton] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(false);
    const [headerClientVisible, setHeaderClientVisible] = useState(false);

    useEffect(() => {
        gsap.to(".box", {
            rotation: 360,
            duration: 1,
            scale: 1
        });

        const elementsBounce = document.getElementsByClassName("bounce");
        Array.from(elementsBounce).forEach((element, index) => {
            gsap.to(element, {
                duration: 0.4,
                y: -30,
                x: -30,
                yoyo: true,
                repeat: 0,
                delay: index * 0.2,
                ease: 'power5.out',
            });
        });
    }, []);

    useEffect(() => {
        const role = parseInt(localStorage.getItem("role"), 10);
        if (isVisible) {
            setHeaderVisible(false);
            setHeaderClientVisible(false);
        }

        if (role) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }

        if (role === 2 || role === 3) {
            setHeaderVisible(true);
            setHeaderClientVisible(false);
        }
        if (role === 1) {
            setHeaderVisible(true);
            setHeaderClientVisible(true);
        }
    }, [localStorage.getItem("role"), localStorage.getItem("statut")]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        localStorage.removeItem("statut");

        window.location.reload();

        setTimeout(() => {
            navigate("/Connexion");
        }, 100);
    };

    const closeMenu = () => {
        setExpanded(false);
    };

    return (
        <>
            <header style={{ height: "100px" }}>
                <Navbar
                    fixed='top'
                    bg="black"
                    variant="dark"
                    expand="lg"
                    expanded={expanded}
                    className='border p-2'
                    role="navigation"
                    aria-label="Main navigation"
                >
                    <Navbar.Brand as={Link} to="/" className='pl-4'>
                        <img src={logo} alt="Mon Logo" className="logo-img rounded-circle rotation-negative box" style={{ width: "6rem" }} />
                    </Navbar.Brand>
                    <Navbar.Toggle
                        onClick={() => setExpanded(!expanded)}
                        aria-controls="navbarNav"
                        aria-expanded={expanded}
                        aria-label="Toggle navigation"
                    />
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="d-flex flex-wrap mx-auto fw-bold p-2" onClick={closeMenu} role="menu">
                            <div className='d-flex flex-wrap gap-3 fs- col-md-12 mx-auto m-2 border-bottom' style={{ fontSize: "10px" }}>
                                {/* {headerVisible && ( */}
                                    <>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-accueil">Présentation</Tooltip>}>
                                            <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/" aria-label="Aller à l'accueil">Présentation</Nav.Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-accueil">Aller à l'accueil</Tooltip>}>
                                            <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/acceuil" aria-label="Aller à l'accueil">Accueil</Nav.Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-prestations">Voir mes prestations</Tooltip>}>
                                            <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/Prestations" aria-label="Voir mes prestations">Prestations</Nav.Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-profil">Accéder à mon profil</Tooltip>}>
                                            <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/Profil" aria-label="Accéder à mon profil">Profil</Nav.Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-blog">Page du blog</Tooltip>}>
                                            <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/Blog" aria-label="Page du blog">Blog</Nav.Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-portfolio">Afficher les photos du Portfolio</Tooltip>}>
                                            <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/portfolio" aria-label="Afficher les photos du Portfolio">Portfolio</Nav.Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-boutique">Accéder à la boutique</Tooltip>}>
                                            <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/Boutique" aria-label="Accéder à la boutique">Boutique</Nav.Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-devis">Faire un devis en 2 minutes</Tooltip>}>
                                            <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/devis" aria-label="Faire un devis en 2 minutes">Devis</Nav.Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-commande">Faire une commande en 2 minutes</Tooltip>}>
                                            <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/commande" aria-label="Faire une commande en 2 minutes">Commande</Nav.Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-contact">Page pour contacter le responsable du site</Tooltip>}>
                                            <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/Contact" aria-label="Page pour contacter le responsable du site">Contact</Nav.Link>
                                        </OverlayTrigger>
                                    </>
                                {/* )} */}
                                </div>
                                <div className='d-flex flex-wrap gap-3 fs- col-md-12 mx-auto m-2 border-bottom' style={{ fontSize: "10px" }}>
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <>
                                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-ajout-photo">Ajouter photo au Portfolio</Tooltip>}>
                                                <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/ajouterImagesPortfolio" aria-label="Ajouter photo au Portfolio">Ajouter Photo</Nav.Link>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-ajout-produit">Ajouter un Produit</Tooltip>}>
                                                <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/AjouterProduit" aria-label="Ajouter un Produit">Ajout Produit</Nav.Link>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-ajout-categorie">Ajouter une Catégorie</Tooltip>}>
                                                <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/AjouterCategorie" aria-label="Ajouter une Catégorie">Ajout Catégorie</Nav.Link>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-produits">Voir Mes Produits</Tooltip>}>
                                                <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/VoirMesProduits" aria-label="Voir Mes Produits">Produits</Nav.Link>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-reserve">Produits en attente de mise en vente</Tooltip>}>
                                                <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/MesProduitsEnAttente" aria-label="Produits en attente de mise en vente">Réserve</Nav.Link>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-utilisateurs">Gestion des Utilisateurs</Tooltip>}>
                                                <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/Utilisateurs" aria-label="Gestion des Utilisateurs">Utilisateurs</Nav.Link>
                                            </OverlayTrigger>
                                        </>
                                    </Suspense>
                                </div>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar.Collapse id="navbarNav">
                        <Nav className="mx-auto fw-bold text-center" onClick={closeMenu} style={{ fontSize: "10px" }}>
                            {isVisible ? (
                                <>
                                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-inscription">Pour s'inscrire</Tooltip>}>
                                        <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/ChoixDuCompte" aria-label="Pour s'inscrire">Inscription</Nav.Link>
                                    </OverlayTrigger>
                                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-connexion">Connexion</Tooltip>}>
                                        <Nav.Link role="menuitem" className='text-white fw-bold' as={Link} to="/Connexion" aria-label="Connexion">Connexion</Nav.Link>
                                    </OverlayTrigger>
                                </>
                            ) : (
                                <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-deconnexion">Déconnexion</Tooltip>}>
                                    <Button
                                        variant=""
                                        className={`text-white fw-bold ${selectedButton === "Déconnexion" ? "active" : ""}`}
                                        block="true"
                                        aria-label="Déconnexion"
                                        onClick={handleLogout}
                                        aria-current={selectedButton === "Déconnexion" ? "page" : null}
                                    >
                                        <img src={logout} alt="Déconnexion" className="logo-img rounded-circle rotation-negative box" style={{ width: "3rem" }} />
                                    </Button>
                                </OverlayTrigger>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        </>
    );
}

export default Header;
