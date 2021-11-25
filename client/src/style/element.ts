import styled from "styled-components"

const mapSizes = (array: number[], size?: "xl" | "lg" | "md" | "sm" | "xs") => {
    if (!size) return array[1] | 56
    const map: { [Key: string]: number } = { "xs": 0, "sm": 1, "md": 2, "lg": 3, "xl": 4 }
    return array[map[size]]
}

export type ElementPropType = {
    size?: "xl" | "lg" | "md" | "sm" | "xs",
    width?: string,
    height?: string
}

export const Header = styled.h1<ElementPropType>`
    font-size: ${({ size }) => mapSizes([16, 24, 28, 32, 36], size) + "px"};
`

export const Text = styled.p<ElementPropType>`
    font-size: ${({ size }) => mapSizes([16, 24, 28, 32, 36], size) + "px"};
`

export const Input = styled.input`
    width: ${props => props.width || "auto"};
    height: ${props => props.height || "auto"};
    border: none;
    background: ${props => props.theme.input};
    color: ${props => props.theme.text};
    padding-left: 35px;
    border-radius: 2pt;
    &:hover, &:focus {
        outline: none;
    }
`