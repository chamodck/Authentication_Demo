import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from "../../services/auth.service";

const PublicRoute = ({component: Component, restricted, ...rest}) => {
    return (
        <Route {...rest} render={props => (
            AuthService.isLoggedIn() && restricted ?
                <Redirect to="/home" />
            : <Component {...props} />
        )} />
    );
};

export default PublicRoute;