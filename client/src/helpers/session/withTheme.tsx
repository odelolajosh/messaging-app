import React from "react";
import { ThemeContext } from "../../contexts/Theme";
import theme from "../../style/theme";

type ThemeKeys = keyof typeof theme;
export type ThemeComponentType = {
    colors?: typeof theme[ThemeKeys]
}

function withTheme<P extends object>(Component: any) {
    return ((props: P) => <ThemeContext.Consumer>
        {(context) => <Component {...props} colors={theme[context.state as ThemeKeys]} /> }
    </ThemeContext.Consumer>)
}

export default withTheme;