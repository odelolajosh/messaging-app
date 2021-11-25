import { createGlobalStyle } from "styled-components";
import { ThemeComponentType } from "../helpers/session/withTheme"


const GlobalStyle = createGlobalStyle<ThemeComponentType>`
    body {
        background: ${props => props.colors?.body}
    }
`

export default GlobalStyle;