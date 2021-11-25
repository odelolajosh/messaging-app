import { ThemeValue } from "../../helpers/ThemeMap";
import "./logo.css";

export type LogoProps = {
    animated?: boolean,
    size: number | string;
    hoverAnimate?: boolean;
    theme?: string
}

/**
 * Logo
 * official logo component for the app
 * @returns React.FC
 */
const Logo: React.FC<LogoProps> = ({ animated=false, size=50, hoverAnimate=false, theme=ThemeValue.Night }) => {
    const fSize = typeof size === "number" ? `${size}px` : size;
    return (
        <div 
            className={`uchat ${theme} ${animated ? 'animated' : ''} ${hoverAnimate ? 'hoveranimate' : ''}`} 
            style={{ height: fSize, width: fSize }}>
            <div>
                <div></div>
                <div></div>
            </div>
            <div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default Logo;