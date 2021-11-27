import { FormEvent, useState } from "react";
import { Link, Redirect, RouteComponentProps } from "react-router-dom";
import logo from "../../assets/logo.svg";
import "../../style/form.css";
import { Spinner } from "../../components/spinner";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "../../store/type";
import { selectAuthValue, signup } from "../../store/auth";
import AuthProvider from "../../helpers/AuthProvider";

type Props = RouteComponentProps<
    object,
    any,
    { from: { pathname: string } }
>;

/**
 * Login 
 * is the page that authenticate a user into the features of the app
 * @returns React.FC
 */
const Login: React.FC<Props> = (props) => {
    const [ name, setName ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ email, setEmail ] = useState<string>("");

    const dispatch = useDispatch<Dispatch>();
    const { id, token, pending, error } = useSelector(selectAuthValue);

    const onSubmit = (event: FormEvent) =>  {
        event.preventDefault();
        dispatch(signup({ username: name, password, email }));
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
                <h3>{ props.location.state ? "Yeah! You have to create an account" : "Let's setup your messaging space" } <span role="img" aria-label="cool">😎</span></h3>
                <input placeholder="Your Username" value={name} type="name" onChange={(e) => setName(e.target.value)} />
                <input placeholder="Your Email" value={email} type="name" onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                { false ? <div className="error">{ error }</div> : '' }
                <div>
                    <button type="submit" disabled={!(password.trim().length > 0 && name.trim().length > 0)}>
                        Create Account
                        { pending ? <Spinner /> : '' }
                    </button>
                </div>
                <div className="redirect">Already have an account?<Link to="/login">Login</Link></div>
            </form>
        </main>
    )
}

export default Login;