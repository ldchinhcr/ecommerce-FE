import React from 'react';
import {useHistory} from 'react-router-dom';

export default function NotFound() {
    const history = useHistory();
    return (
        <div className="not-found" title="Click to back home" onClick={() => history.push('/')} style={{cursor: 'pointer'}}></div>
    )
}
