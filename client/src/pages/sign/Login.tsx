import { FormEvent, useState } from "react";
import { Link, Redirect, RouteComponentProps } from "react-router-dom";
import logo from "../../assets/logo.svg";
import "../../style/form.css";
import { Spinner } from "../../components/spinner";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "../../store/type";
import { login, selectAuthValue } from "../../store/auth";
import AuthProvider from "../../helpers/AuthProvider";

type LoginProps = RouteComponentProps<
    object,
    any,
    { from: { pathname: string } }
>;

/**
 * Login 
 * is the page that authenticate a user into the features of the app
 * @returns React.FC
 */
const Login: React.FC<LoginProps> = (props) => {
    const [ name, setName ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const dispatch = useDispatch<Dispatch>();
    const { id, token, pending, error } = useSelector(selectAuthValue);

    const onSubmit = (event: FormEvent) =>  {
        event.preventDefault();
        dispatch(login({ username: name, password }));
    }
    
    const { from } = props.location.state || { from: {pathname: '/'} }
    if (token) {
        AuthProvider.authenticate(id, token);
        return <Redirect to={from.pathname} />
    }

    return (
        <main className={`form-page`}>
            <form onSubmit={onSubmit}>
                <h2> <img src={logo} alt="logo" /> YouChat </h2>
                <h3>{ props.location.state ? "Yeah! You have to login" : "Welcome Back!" } <span role="img" aria-label="cool">😎</span></h3>
                <input placeholder="Your Username" value={name} type="name" onChange={(e) => setName(e.target.value)} />
                <input placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                { false ? <div className="error">{ error }</div> : '' }
                <div>
                    <button type="submit" disabled={!(password.trim().length > 0 && name.trim().length > 0)}>
                        Login
                        { pending ? <Spinner /> : '' }
                    </button>
                </div>
                <div className="redirect">You don't have an account?<Link to="/signup">Sign Up</Link></div>
            </form>
        </main>
    )
}

export default Login;