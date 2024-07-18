{/*  OUMESSAOUD Azzedine: oumessaoud@hotmail.fr */ }

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Forbiden from './Forbiden';
import AttenteConfirmation from './AttenteConfirmation';

const PrivateRoute = ({ children, ...rest }) => {
    const token = localStorage.getItem('token');
    const role_id = parseInt(localStorage.getItem('role'));
    const statut = parseInt(localStorage.getItem('statut'));
    if (token) {
        if (statut === 3) {
            return children;
        } else {
            return  <AttenteConfirmation />;
            }
    } else {
        return      <Forbiden />;
    }
};

export default PrivateRoute;

