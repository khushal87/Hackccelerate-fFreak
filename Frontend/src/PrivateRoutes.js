import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useClientContext } from './context/clientContext';

function PrivateRoute({ component: Component, ...rest }, props) {
    const { token } = useClientContext();

    useEffect(() => {
        if(token)
            console.log(typeof token);
    }, [token]);

    return (
        <Route {...rest}
            render={(props) =>
                token !== "null" ?
                    (
                        <Component {...rest} {...props} />
                    ) :
                    (
                        <Redirect to={{ pathname: "/", state: { referer: props.location } }} />
                    )
            }
        />
    )
}

export default PrivateRoute;