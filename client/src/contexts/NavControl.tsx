import React, { Component } from "react";

export type NavContextValueType = {
    toggle: boolean;
    switchToggle?: () => void;
    isMobileViewPort: boolean;
    windowWidth: number;
    setSidebarElem: (el: HTMLElement | null) => void;
    setNavToggle: (bool: boolean) => void
}

export const NavContext: React.Context<any> = React.createContext({
    toggle: false,
    isMobileViewPort: false,
    windowWidth: window.innerWidth
});

export type NavState = { 
    toggle: boolean;
    isMobileViewPort: boolean;
    windowWidth: number;
};
export class NavControlProvider extends Component {
    state = {
        toggle: false,
        isMobileViewPort: false,
        windowWidth: 0,
    }

    sidebarElem: HTMLElement | null = null

    componentDidMount() {
        this.handleViewPortResize();
        window.addEventListener('DOMContentLoaded onLoad', this.handleViewPortResize);
        window.addEventListener('resize', this.handleViewPortResize);
        this.setState({ toggleValue: true })
    }

    componentWillUnmount() {
        this.handleViewPortResize();
        window.removeEventListener('DOMContentLoaded', this.handleViewPortResize);
        window.removeEventListener('resize', this.handleViewPortResize);
        window.removeEventListener('click', this.handleCloseSidebar);
    }

    handleViewPortResize = () => {
        const width = window.innerWidth;
        if (this.state.windowWidth !== width) {
            if (width > 800) {
                this.setState({ isMobileViewPort: false })
                window.removeEventListener('click', this.handleCloseSidebar)
            } else {
                this.setState({ isMobileViewPort: true, toggleValue: false })
                window.addEventListener('click', this.handleCloseSidebar)
            }
            this.setState({ windowWidth: width })
        }
    }

    switchToggleValue = () => {
        const newValue = !this.state.toggle;
        this.setState({ toggle: newValue });
        if (newValue) {
            window.setTimeout(
                () => window.addEventListener('click', this.handleCloseSidebar),
                500
            )
        } else {
            // window.removeEventListener('click', (e) => this.handleCloseSidebar)
        }
    }

    handleCloseSidebar = (e: MouseEvent) => {
        if (this.sidebarElem) {
            if (!this.sidebarElem.contains(e.target as Node) && this.state.toggle) {
                this.switchToggleValue();
            }
            window.removeEventListener('click', this.handleCloseSidebar)
        }
    }

    setSidebarElem = (el: HTMLElement | null) => {
        this.sidebarElem = el
    }

    setNavToggle = (bool: boolean): void => {
        this.setState({ toggle: bool })
    }

    render() {
        return <NavContext.Provider value={{
            toggle: this.state.toggle,
            switchToggle: this.switchToggleValue,
            isMobileViewPort: this.state.isMobileViewPort,
            windowWidth: this.state.windowWidth,
            setSidebarElem: this.setSidebarElem,
            setNavToggle: this.setNavToggle
        }}>{ this.props.children }</NavContext.Provider>
    }
}