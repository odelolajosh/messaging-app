import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { ThemeProvider } from 'styled-components'
import theme, { ThemeState } from '../style/theme'

export type ThemeContextValueType = {
  state: string
  toggleTheme?: () => void
}
export const ThemeContext: React.Context<ThemeContextValueType> =
  React.createContext({
    state: ThemeState.Night + '',
  })

export const USER_THEME_PREFERENCE = 'USER_THEME_PREFERENCE'
export type ThemeStateType = { theme: ThemeState }

export class ThemeContextProvider extends Component {
  state: ThemeStateType = {
    theme: ThemeState.Night,
  }

  static get propTypes() {
    return {
      children: PropTypes.any,
    }
  }

  static getDerivedStateFromProps = () => {
    let state = window.localStorage.getItem(USER_THEME_PREFERENCE)
    if (!state) {
      state = ThemeState.Night
      window.localStorage.setItem(USER_THEME_PREFERENCE, state)
    }
    const body = document.body
    body.style.setProperty('background-color', theme[state as ThemeState].body)
    body.style.setProperty('color', theme[state as ThemeState].text)
    return { theme: state }
  }

  toggleTheme = (): void => {
    this.setState((prevState: ThemeStateType) => {
      const newThemeState =
        prevState.theme === ThemeState.Day ? ThemeState.Night : ThemeState.Day
      const body = document.body
      body.style.setProperty(
        'background-color',
        theme[newThemeState as ThemeState].body
      )
      window.localStorage.setItem(USER_THEME_PREFERENCE, newThemeState)
      return { newThemeState }
    })
  }

  render() {
    return (
      <ThemeContext.Provider
        value={{
          state: this.state.theme,
          toggleTheme: this.toggleTheme,
        }}
      >
        <ThemeProvider theme={theme[this.state.theme]}>
          {this.props.children}
        </ThemeProvider>
      </ThemeContext.Provider>
    )
  }
}
