import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from 'react-bootstrap';
import BackButton from "../AuthSecure/BackButton";

const AmonSujet = () => {
    const [societe, setSociete] = useState("");

    
    const fetchSociete = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/getSociete/2');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des informations de la société');
            }
            const data = await response.json();
            setSociete(data);
            console.log(data, " en ligne 16 XXXXXXXXXXXXXXXXXX");
        } catch (error) {
            console.error(error);
        }
    }; 
    useEffect(() => {
        fetchSociete()
},[]);

    return(
        <>
        <section className="bg-white mt-5">
            <article className="">
                <h1 className="text-center mt-2"> A propos de moi</h1>
                {/* Informations sur la société */}
                        <div className="mx-auto border border-secondary col-md-6 p-2 rounded mb-3">
                                        
                                        <div className='fw-bold'>
                                            <div className='d-flex justify-content-between p-2'>
                                                <img src ={societe && societe.avatar} style={{width: "100px", height: "100px", borderRadius: "50%"}} />
                                            </div>
                                            <div className="mb-3">
                                                <span>{societe && societe.societe}</span>
                                            </div>
                                            <div className="mb-3 ">
                                                <span>{societe && societe.rue}</span>
                                            </div>
                                            <div className="mb-3 ">
                                                <span>{societe && societe.ville}</span>
                                            </div>
                                            <div className="mb-3 ">
                                                <span>{societe && societe.code_postal}</span>
                                            </div>
                                            <div className="mb-3 ">
                                                <span>{societe && societe.telephone}</span>
                                            </div>
                                            <div className="mb-3 ">
                                                <span>Contact  : MR  {societe && societe.pseudo}</span>
                                            </div>
                                            <div className="mb-3 ">
                                                <span>Déscription :  {societe && societe.biographie}</span>
                                            </div>
                                        </div>
                        </div>
                <div className="">
                <h2 className="text-center">Mon expérience professionnelle</h2>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <h2 className="text-center">Ils me fonts confiance</h2>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                <p>du contenus</p>
                </div>
            </article>
        </section>
        <div>
        <BackButton />
        <a href="mailto:azed92390@hotmail.fr" className="btn btn-primary m-2" aria-label="Envoyer un mail">
              ENVOYEZ UN MAIL
            </a>
            </div>
        </>
    )
};

export default AmonSujet;