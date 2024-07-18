import React from "react";
import { Link } from "react-router-dom";

const ContactMe = () =>{

    return(
            <p className='col-md-10 slide-article m-1 p-3 text-center mx-auto no-hover-bg hover-effect'>
              <a href="mailto:azed92390@hotmail.fr" className='btn btn-primary m-2' aria-label="Envoyer un mail">ENVOYEZ UN MAIL</a>
              <Link to="/Contact" className='btn btn-success m-2' aria-label="Accéder au formulaire de contact">REMPLIR UN FORMULAIRE</Link>
            </p>
    )
};
export default ContactMe;