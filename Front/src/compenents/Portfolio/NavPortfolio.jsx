import React, { useState } from "react";
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BackButton from "../AuthSecure/BackButton";

const NavPortfolio = () => {
  const [expanded, setExpanded] = useState(false);

  const closeMenu = () => {
    setExpanded(false);
  };

  return (
    <>
      <Navbar
        bg="secondary"
        variant="dark"
        expand="lg"
        expanded={expanded}
        className="border mt-2 mb-2 rounded mx-auto"
      >
        <Navbar.Toggle
          onClick={() => setExpanded(!expanded)}
          aria-controls="navbarNav"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          className="m-2"
        />
        <Navbar.Collapse id="navbarNav">
          <BackButton />
          <Nav className="mx-auto d-flex fw-bold" onClick={closeMenu}>
            <Nav.Link as={Link} to="/aMonSujet" className="text-white fw-bold m-2" aria-label="Accéder à mon profil">
              A mon sujet
            </Nav.Link>
            <Nav.Link as={Link} to="/Contact" className="text-white fw-bold m-2" aria-label="Page pour contacter le responsable du site.">
              Contact
            </Nav.Link>
            <a href="mailto:azed92390@hotmail.fr" className="btn btn-primary m-2" aria-label="Envoyer un mail">
              ENVOYEZ UN MAIL
            </a>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default NavPortfolio;
