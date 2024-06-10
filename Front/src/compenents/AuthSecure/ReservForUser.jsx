import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";

const ReserveForUser = () => {

    

    return(
        <section className="container graylogo p-4 rounded-4 mx-auto mt-5" >
            <div className="">
                <h1 className="p-2 rounded mb-4 text-center">Connexion requise</h1>
                <section className='p-2 m-5'>
                    <h1 className='text-center p-2 rounded'>Connectez-vous ou créez un compte Portfolio, E-commerce, Visiteur ou Client.</h1>
                    <div className="d-flex justify-content-center gap-5">
                    <Button className='text-white fw-bold' as={Link} to="/Connexion" aria-label='Connexion' >Connexion</Button>
                    <Button className='text-white fw-bold' as={Link} to="/Inscription" aria-label="Pour s'inscrire">Inscription </Button>
                    <BackButton />
                    </div>
                </section>
            </div>
        </section>
    )
};
export default ReserveForUser;