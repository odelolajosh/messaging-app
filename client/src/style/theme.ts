
export enum ThemeState {
    Day = "day",
    Night = "night"
}

export const denotiveColor = {
    error: "var(--base-red)",
    warning: "var(--base-orange)"
}

const primary = "#938af3"
const theme =  {
    'day': {
        primary,
        secondary: "",
        body: "#FFF",
        text: "#000000",
        icon: "#000000",
        input: "#f3f3f3",
        stroke: "#dedede",
        card: "#efefef22",
        ...denotiveColor
    },
    'night': {
        primary,
        secondary: "",
        body: "#292929",
        text: "#FFFFFF",
        icon: "#898989",
        input: "#ffffff07",
        stroke: "#dedede",
        card: "#31313122",
        ...denotiveColor
    }
}

export default theme