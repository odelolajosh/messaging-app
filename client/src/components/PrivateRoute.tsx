import { Redirect, RouteProps } from 'react-router-dom';
import { Route } from 'react-router';
import AuthProvider from '../helpers/AuthProvider';


interface PrivateRouterProps extends RouteProps {
    component: React.FC | any;
    redirectPath: string;
}

/**
 * Renders component depending on the authenticated state, and
 * redirect the user to a specified route if the condition is not met
 * @returns React.FC
 */
const PrivateRoute: React.FC<PrivateRouterProps> = ({ component: Component, redirectPath, ...rest }) => {
    return (
        <Route // return the Route component
            {...rest}
            render={(props) => AuthProvider.isAuthenticated() === true // check authentication
                ? <Component {...props} /> // return component
                : <Redirect to={{ pathname: redirectPath, state: { from: props.location } }} /> // redirect back
            }
        />
    );
};

export default PrivateRoute;