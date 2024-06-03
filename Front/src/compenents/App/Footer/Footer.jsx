import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logofondnoir from "../../images/logofondnoir.png";
import { useState } from 'react';
import "../../../styles/monStyle.css";

const Footer = () => {
    const [isContentLong, setIsContentLong] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const closeMenu = () => {
        setExpanded(false);
    };

    

    return (
        
        <footer className="bg-black border " style={{width:"100%",marginTop: "140px", position: "absolute"}}>
            <Navbar className='navbar bg-black' expand="lg" expanded={expanded}>
                <div className="container">
                    <Navbar.Brand as={Link} to="/">
                        <img src={logofondnoir} alt="Mon Logo" className="logo-img" style={{ width: "5rem" }} />
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={() => setExpanded(!expanded)} aria-controls="navbarNav" />
                    <Navbar.Collapse id="navbarNav">
                        <Nav className="mx-auto fw-bold" onClick={closeMenu}>
                            <Nav.Link as={Link} to="/Cgu" className="text-right text-white" aria-label="Page des Conditions générales d'utilisation">C-G-U</Nav.Link>
                            <Nav.Link href="https://www.facebook.com" className="text-right text-white" rel="noopener noreferrer" target="_blank" aria-label="Page Facebook officielle">Facebook</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <p className="text-center text-white">© Oumessaoud 2024. Tous droits réservés.</p>
                </div>
            </Navbar>
        </footer>
    );
}

export default Footer;

