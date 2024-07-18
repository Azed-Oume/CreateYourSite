import { Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";
import BackButton from "../../../AuthSecure/BackButton";

const ChoixDuCompte = () => {
    return (
        <section className="container graylogo mt-5 p-3">
            <h1 className="text-center p-3 mb-5">Choisissez votre compte</h1>
            <nav aria-label="Choix du type de compte">
                <ul className="d-flex justify-content-around list-unstyled p-0 m-0">
                    <li>
                        <Button variant="success">
                            <Nav.Link
                                role="menuitem"
                                className="text-white fw-bold"
                                as={Link}
                                to="/CompteProfessionnel"
                                aria-label="S'inscrire en tant que professionnel"
                            >
                                Compte Professionnel
                            </Nav.Link>
                        </Button>
                    </li>
                    <BackButton />
                    <li>
                        <Button variant="success">
                            <Nav.Link
                                role="menuitem"
                                className="text-white fw-bold"
                                as={Link}
                                to="/CompteParticulier"
                                aria-label="S'inscrire en tant que particulier"
                            >
                                Compte Particulier
                            </Nav.Link>
                        </Button>
                    </li>
                </ul>
            </nav>
        </section>
    );
};

export default ChoixDuCompte;
