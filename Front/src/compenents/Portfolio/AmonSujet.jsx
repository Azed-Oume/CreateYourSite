import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from 'react-bootstrap';
import BackButton from "../AuthSecure/BackButton";

const AmonSujet = () => {
    const [societe, setSociete] = useState("");

    
    const fetchSociete = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_API}/api/getSociete/2`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des informations de la société');
            }
            const data = await response.json();
            setSociete(data);
        } catch (error) {
            console.error(error);
        }
    }; 
    useEffect(() => {
        fetchSociete()
},[]);

    return(
        <>
        <section className="container  graylogo p-4 mt-5 rounded-4 mx-auto">
            <article className="">
                <div>
                    <header>
                        <h1 className="p-3 text-center rounded"> A propos de moi</h1>
                    </header>
                    {/* Informations sur la société */}
                        <Col className="border border-secondary p-2 rounded mb-3">
                            <article className="mx-auto text-white border border-secondary col-md-6 p-2 rounded mb-3">
                            <figure className='d-flex justify-content-between p-2'>
                                    <img src={societe && societe.avatar} style={{ width: "100px", height: "100px", borderRadius: "50%" }} alt="Avatar de la société" />
                                    </figure>
                                <address className="mb-3 fw-bold fs-6">
                                    <p>{societe && societe.societe}</p>
                                    <p>{societe && societe.rue}</p>
                                    <p>{societe && societe.ville}</p>
                                    <p>{societe && societe.code_postal}</p>
                                    <p>{societe && societe.telephone}</p>
                                    <p>Contact : MR {societe && societe.pseudo}</p>
                                    <p>Déscription : {societe && societe.biographie}</p>
                                    </address>
                            </article>
                        </Col>
                </div>
                <div className="row">
                    <Col md={6} lg={6} className="border border-secondary p-2 rounded mb-3">
                        <header>
                            <h2 className="p-3 text-center rounded">Mon expérience professionnelle</h2>
                        </header>
                        <article className="mx-auto text-white border border-secondary p-2 rounded mb-3">
                            <address className="mb-3 fw-bold fs-6">
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                            </address>
                        </article>
                    </Col>
                    <Col md={6} lg={6} className="border border-secondary p-2 rounded mb-3">
                        <header>
                            <h2 className="p-3 text-center rounded">Ils me fonts confiance</h2>
                        </header>
                        <article className="mx-auto text-white border border-secondary p-2 rounded mb-3">
                            <address className="mb-3 fw-bold fs-6">
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                                <p>du contenus</p>
                            </address>
                        </article>
                    </Col>
                </div>
            </article>
        </section>
        <nav className="d-flex justify-content-center m-2 gap-5">
            <div >
                <BackButton />
            </div>
            <a href="mailto:azed92390@hotmail.fr" className="btn btn-primary" aria-label="Envoyer un mail">
                  ENVOYEZ UN MAIL
            </a>
        </nav>
        </>
    )
};

export default AmonSujet;