import { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { ThemeContext } from "../../contexts/Theme";
import "../../style/form.css";
import {  SpinnerFullPage } from "../../components/spinner";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "../../store/type";
import { logout, selectAuthValue } from "../../store/auth";


/**
 * Logout 
 * is the page that authenticate a user into the features of the app
 * @returns React.FC
 */
const Logout: React.FC = () => {
    const dispatch = useDispatch<Dispatch>();
    const { pending, error } = useSelector(selectAuthValue);

    useEffect(() => {
        dispatch(logout())
    }, [dispatch])

    return (
        <main className={`form-page`}>
            {
                pending ? <SpinnerFullPage /> : error ? <div>Error Occured</div> : <Redirect to="/" />
            }
        </main>
    )
}

export default Logout;