import "./reset.css"
import "./form.css"
import "./layout.css"
import styled from "styled-components"
import withTheme, { ThemeComponentType } from "../helpers/session/withTheme"

const LayoutWrapper = withTheme(styled.main<ThemeComponentType>`
    width: 100vw;
    height: 100vh;
    overflow: auto;
    position: relative;
    scroll-behavior: smooth;
    color: ${props => props.colors?.text}
`)

const Layout: React.FC = (props) => {
    return (
        <LayoutWrapper>
            { props.children }
        </LayoutWrapper>
    )
}

export default Layout;