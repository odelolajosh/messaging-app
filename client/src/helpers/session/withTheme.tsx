import React from "react";
import { ThemeContext } from "../../contexts/Theme";
import theme from "../../style/theme";

type ThemeKeys = keyof typeof theme;
export type ThemeComponentType = {
    colors?: typeof theme[ThemeKeys]
}

export type RandomColorType = {
    randomColor?: string
}

// function withTheme<C extends React.FC>(Component: C): C {
//     return (props => {
//         const { state } = useContext(ThemeContext)
//         const colors = theme[state as ThemeKeys]
//         return <Component {...props} colors={colors} />
//     }) as any as C
// }

const colors = [
    "#9B6EF3",
    "#83B2FF",
    "#8BF18B",
    // "#FF555E",
    "#FF8650",
    "#FFE981"
]

const getRandomColor = () => {
    const r = Math.floor(Math.random() * (colors.length - 1));
    return colors[r]
}

export function withRandomColor<P extends object>(Component: React.ComponentType<P>) {
    return ((props: P) => <Component {...props} randomColor={() => getRandomColor()} />)
}

function withTheme<P extends object>(Component: React.ComponentType<P>) {
    return ((props: P) => <ThemeContext.Consumer>
        {(context) => <Component {...props} colors={theme[context.state as ThemeKeys]} /> }
    </ThemeContext.Consumer>)
}

export default withTheme;