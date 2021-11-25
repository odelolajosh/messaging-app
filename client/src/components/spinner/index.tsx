import Logo from '../logo/Logo';
import Spinner from './Spinner';
import './spinner.css';

type SpinnerFullPageProps = {
    useLogo?: boolean,
    text?: string
}
const SpinnerFullPage = ({ useLogo }: SpinnerFullPageProps) => {
    return (
        <div className="spinner-page">
            {
                useLogo ? <Logo size={150} animated /> : <Spinner></Spinner>
            }
        </div>
    )
}

export { Spinner, SpinnerFullPage }