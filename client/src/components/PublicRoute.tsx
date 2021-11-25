import { Redirect, RouteProps } from 'react-router-dom';
import { Route } from 'react-router';
import AuthProvider from '../helpers/AuthProvider';


interface PublicRouterProps extends RouteProps {
    component: React.FC | any;
    redirectPath: any;
}

/**
 * Renders component depending on the authenticated state, and
 * redirect the user to a specified route if the condition is not met
 * @returns React.FC
 */
const PublicRoute: React.FC<PublicRouterProps> = ({ component: Component, redirectPath, ...rest }) => {
    return (
        <Route // return the Route component
            {...rest}
            render={(props) => AuthProvider.isAuthenticated() === false // check authentication
                ? <Component {...props} /> // return component
                : <Redirect to={redirectPath} /> // redirect back
            }
        />
    );
};

export default PublicRoute;