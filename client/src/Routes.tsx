import React from 'react';
import { Route } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Home from './Home';

function Routes() {
    return <div>
        <Route path={'/'} component={Home}/>
    </div>
}

export default withRouter(Routes);
