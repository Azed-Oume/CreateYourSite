{/*  OUMESSAOUD Azzedine: oumessaoud@hotmail.fr */ }

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Forbiden from './Forbiden';
import AttenteConfirmation from './AttenteConfirmation';

const PrivateRoute = ({ children, ...rest }) => {
    const token = localStorage.getItem('token');
    const statut = localStorage.getItem('statut');
    const role_id = localStorage.getItem('role');
    console.log("voici le statut: " + statut);
    console.log("voici le Role: " + role_id);

    if (token) {
        if (statut === "3") {
            return children;
        } else {
            return  <AttenteConfirmation />;
            }
    } else {
        return      <Forbiden />;
    }
};

export default PrivateRoute;

