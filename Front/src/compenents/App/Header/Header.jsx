import { Link, useNavigate } from 'react-router-dom';
import { gsap } from "gsap";
import Navbar from 'react-bootstrap/Navbar';
import its_me from "../../images/its_me.jpg";
import { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import logout from "../../images/logout.png";

/* 
Administrateur = role 1 !
Portfolio = role 2 !
E-commerce = role 3 !
Visiteur = role 4 !
*/

const Header = () => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const [selectedButton, setSelectedButton] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(false);
    const [headerClientVisible, setHeaderClientVisible] = useState(false);

    // Animation GSAP dans useEffect
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

    // Vérifiez le rôle et le statut de l'utilisateur
    useEffect(() => {
        const role = parseInt(localStorage.getItem("role"), 10);
        if (isVisible) {
            setHeaderVisible(false);
            setHeaderClientVisible(false);
        }
        
        if (role ) {
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

        setTimeout( () => {
            navigate("/Connexion");
        },  100);
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
                    className='border p-2' >
                    <Navbar.Brand as={Link} to="/" className='pl-4'>
                        <img src={its_me} alt="Mon Logo" className="logo-img rounded-circle rotation-negative box " style={{ width: "6rem" }} />
                    </Navbar.Brand>
                    <Navbar.Toggle
                        onClick={() => setExpanded(!expanded)}
                        aria-controls="navbarNav"
                    />
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="mx-auto fw-bold p-2" onClick={closeMenu}>
                            <div className=''>
                            {/* {headerVisible && ( */}
                                    <div className='d-flex flex-wrap gap-3 col-md-12 mx-auto m-2 border-bottom'>
                                        <Nav.Link className='text-white fw-bold ' as={Link} to="/">Accueil</Nav.Link>
                                        <Nav.Link className='text-white fw-bold ' as={Link} to="/Prestations" aria-label='Voir mes préstations' >Prestations</Nav.Link>
                                        <Nav.Link className='text-white fw-bold  ' as={Link} to="/Profil" aria-label="Accéder a mon profil" >Profil</Nav.Link>
                                        <Nav.Link className="text-white fw-bold " as={Link} to="/Blog" aria-label="Page du blog">Blog</Nav.Link>
                                        <Nav.Link className="text-white fw-bold " as={Link} to="/portfolio" aria-label="Afficher les photos du Portfolio">Portfolio</Nav.Link>
                                        <Nav.Link className='text-white fw-bold  ' as={Link} to="/Boutique" aria-label='Accéder a la boutique' >Boutique</Nav.Link>
                                        <Nav.Link className='text-white fw-bold  ' as={Link} to="/devis" aria-label='faire un devis en 2 minutes'> Devis </Nav.Link>
                                        <Nav.Link className='text-white fw-bold  ' as={Link} to="/commande" aria-label='faire une commande en 2 minutes'> Commande </Nav.Link>
                                        <Nav.Link as={Link} to="/Contact" className="text-white fw-bold rotation-negative " aria-label="Page pour contacter le responsable du site.">Contact</Nav.Link>
                                    </div>
                            {/* )} */}
                            
                            {/* {headerClientVisible && ( */}
                                <div className='d-flex flex-wrap gap-3 col-md-12 mx-auto m-2 border-bottom'>
                                    <Nav.Link className="text-white fw-bold " as={Link} to="/ajouterImagesPortfolio" aria-label="Ajouter photo au Portfolio">Ajouter Photo</Nav.Link>
                                    <Nav.Link className="text-white fw-bold " as={Link} to="/portfolio" aria-label="Afficher les photos du Portfolio">Portfolio</Nav.Link>
                                    <Nav.Link className="text-white fw-bold  " as={Link} to="/AjouterProduit" aria-label="Ajouter un Produit.">Ajout Produit</Nav.Link>
                                    <Nav.Link className="text-white fw-bold  " as={Link} to="/AjouterCategorie" aria-label="Ajouter une Catégorie.">Ajout Catégorie</Nav.Link>
                                    <Nav.Link className="text-white fw-bold  " as={Link} to="/VoirMesProduits" aria-label="Voir Mes Produits.">Produits</Nav.Link>
                                    <Nav.Link className="text-white fw-bold  " as={Link} to="/ProduitsEnAttente" aria-label="Produits en attente de mise en vente.">Réserve</Nav.Link>
                                </div>
                                {/* )} */}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                    
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="mx-auto fw-bold text-center" onClick={closeMenu}>
                            {isVisible ? (
                                <>
                                    <Nav.Link className='text-white fw-bold' as={Link} to="/Inscription" aria-label="Pour s'inscrire">Inscription</Nav.Link>
                                    <Nav.Link className='text-white fw-bold' as={Link} to="/Connexion" aria-label='Connexion' >Connexion</Nav.Link>
                                </>
                            ) : (
                            <Button
                                variant=""
                                className={` text-white fw-bold ${selectedButton === "Déconnexion" ? "active" : ""}`}
                                block="true"
                                aria-label="Déconnexion"
                                onClick={handleLogout}
                                aria-current={selectedButton === "Déconnexion" ? "page" : null}
                            >
                                <img src={logout} alt="Mon Logo" className="logo-img rounded-circle rotation-negative box " style={{ width: "3rem" }} />
                            </Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        </>
    );
}

export default Header;
