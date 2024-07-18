import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";

const ReserveForAdmin = () => {

    return(
            <nav>
                <h1 className="p-2 rounded mb-4 text-center">Section résérver a l'Administrateur</h1>
                <section className='p-2 m-5'>
                    <h1 className='text-center p-2 rounded'>Connectez-vous ou créez un compte Administrateur</h1>
                    <div className="d-flex justify-content-around">
                        <Button className='text-white fw-bold' as={Link} to="/Connexion" aria-label='Connexion' variant="success">Connexion</Button>
                        <Button className='text-white fw-bold' as={Link} to="/ChoixDuCompte" aria-label="Pour s'inscrire" variant="success">Inscription </Button>
                        <BackButton />
                    </div>
                </section>
            </nav>
    )
};
export default ReserveForAdmin;