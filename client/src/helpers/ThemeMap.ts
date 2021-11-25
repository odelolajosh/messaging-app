export enum ThemeValue {
    Day = "day",
    Night = "night"
}

export const denotiveColor = {
    errorColor: "var(--base-red)",
    warningColor: "var(--base-orange)"
}

export const dayColor = {
    backgroundColor: "var(--light-background)",
    contrastColor: "var(--light-contrast-neutral)",
    contrastColorMid: "var(--base-light-contrast-mid)",
    contrastColorFade: "var(--base-light-contrast-fade)",
    contrastColorFall: "var(--base-light-contrast-fall)",
    textColor: "var(--text-black)",
    textContrastColor: "var(--text-black-contrast)"
}

export const nightColor = {
    backgroundColor: "var(--dark-background)",
    contrastColor: "var(--dark-contrast-neutral)",
    contrastColorMid: "var(--base-dark-contrast-mid)",
    contrastColorFade: "var(--base-dark-contrast-fade)",
    contrastColorFall: "var(--base-dark-contrast-fall)",
    textColor: "var(--text-white)",
    textContrastColor: "var(--text-white-contrast)"
}

export type ThemeMapType = {
    backgroundColor: string;
    contrastColor: string;
    contrastColorMid: string;
    contrastColorFade: string;
    contrastColorFall: string;
    textColor: string;
    textContrastColor: string;
    errorColor: string;
    warningColor: string;
    primaryColor: string;
    secondaryColor: string;
}