import { useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';
import { ThemeContext } from "../../contexts/Theme";
import { NavLinks } from "../../helpers/nav";
import Logo from "../logo/Logo";
import withTheme, { ThemeComponentType } from "../../helpers/session/withTheme";


export type NavbarProps = RouteComponentProps & ThemeComponentType;

/**
 * Navbar
 * An adaptive navbar to support variant devices sizes
 * @returns React.FC
 */
const Navbar: React.FC<NavbarProps> = (props) => {
    return <SideNavbar {...props} />
}

const Aside = styled.div`
    height: 100%;
    width: 100px;
    padding: 1rem;
`

const BrandSection = styled.div`
    width: 100%;
    margin-block: 1rem;
    display: grid;
    place-items: center;
    margin-bottom: 2.3rem;
`

const Nav = styled.div`
    display: flex;
    flex-flow: column nowrap;
    box-shadow: 2px 0 18px #DEDEDE89;
    border-radius: 8px;
    padding: 1rem 0;
`

const NavItem = styled(Link)<ThemeComponentType>`
    width: 100%;
    margin-block: 1.3rem;
    display: grid;
    place-items: center;
    text-decoration: none;
    color: ${props => props.colors?.icon};
`

const SideNavbar: React.FC<NavbarProps> = ({ colors }) => {
    const { state } = useContext(ThemeContext);
    return (
        <Aside>
            <BrandSection>
                <Logo size="40px" hoverAnimate={true} theme={state} />
            </BrandSection>
            <Nav>
                {
                    Object.values(NavLinks).map((link, index) => (
                        <NavItem key={`nav-item-${index}`} to={link.url} colors={colors}>
                            <FeatherIcon icon={link.icon} size={20} />
                        </NavItem>
                    ))
                }
            </Nav>
        </Aside>
    )
}

export default withTheme(withRouter(Navbar))
