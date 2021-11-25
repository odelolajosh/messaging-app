import { Switch, Route, Redirect } from "react-router";
import Chat from "../components/chat/Chat";
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";
import NotFound from "../pages/notfound/NotFound";
import Login from "../pages/sign/Login";
import Logout from "../pages/sign/Logout";
import Signup from "../pages/sign/Signup";


const Routing: React.FC = () => (
    <Switch>
        {/* Main Routing */}
        <Route exact path="/">
            <Redirect to="/in" />
        </Route>
        <PrivateRoute exact path="/in" component={Chat} redirectPath="/login" />
        <PrivateRoute path="/in/:recipientId" component={Chat} redirectPath="/login" />

        {/* Protected and Public Routing */}
        <PublicRoute path="/login" component={Login} redirectPath="/in" />
        <PublicRoute path="/signup" component={Signup} redirectPath="/in" />
        <PrivateRoute path="/logout" component={Logout} redirectPath="/login" />
        
        {/* Catch Unsupported routing */}
        <Route path="/404" component={NotFound} />
        <Route path="*">
            <Redirect to="/404" />
        </Route>
    </Switch>
);

export default Routing;