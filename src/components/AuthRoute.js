import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AuthRoute({component: Component, ... props}) {
    const user = useSelector(state => state.user);
    return !user ?
    <Route {...props} render={() => <Component {...props} />}/>
    : <Redirect to={'/'}/>
}
