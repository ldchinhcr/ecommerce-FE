import React from 'react';
import {Route} from 'react-router-dom';
import Navbar from './Navbar';

export default function RouteNavOps1({component: Component, mainPage: Main, ... props}) {
    return <Route {...props} render={() => {
        return (
        <div>
        <Navbar/>
        <Component {...props} component={Main}/>
        </div>
        )
    }}/>
}
