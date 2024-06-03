import React, { useState} from "react";
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BackButton from "../../AuthSecure/BackButton";

const NavBoutique = () => {
    
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
        className="border mt-2 mb-2 rounded col-md-9 mx-auto"
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
            <Nav.Link as={Link} to="/VoirMesDevis" aria-label="Voir mes devis">
              <Button variant="link" className="text-white fw-bold m-2">Voir mes devis</Button>
            </Nav.Link>
            <Nav.Link as={Link} to="/VoirMesCommande" aria-label="Suivre mes commandes">
              <Button variant="link" className="text-white fw-bold m-2">Voir mes commandes</Button>
            </Nav.Link>
            <Nav.Link as={Link} to="/facture" aria-label="Suivre mes factures">
              <Button variant="link" className="text-white fw-bold m-2">Voir mes factures</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};
export default NavBoutique;