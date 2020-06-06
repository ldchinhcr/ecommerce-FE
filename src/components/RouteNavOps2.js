import React from 'react';
import {Route} from 'react-router-dom';
import NavbarWhite from './NavbarWhite';

export default function RouteNavOps1({component: Component, mainPage: Main, ... props}) {
    return <Route {...props} render={() => {
        return (
        <div>
        <NavbarWhite/>
        <Component {...props} component={Main}/>
        </div>
        )
    }}/>
}
