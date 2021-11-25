import { Link } from "react-router-dom";
import Logo from "../../components/logo/Logo";
import "./notfound.css";

/**
 * NotFound 
 * is the page that contains post for all both authenticated and unauthenticated users
 * @returns React.FC
 */
const NotFound: React.FC = () => {
    return (
        <main id="notfound">
            <div className="logo">
                <Logo animated={true} size="100%" />
            </div>
            <h1>404</h1>
            <p>
                Nothing here! You can check out latest posts right <Link to="/in">here</Link>
            </p>
        </main>
    )
}

export default NotFound;