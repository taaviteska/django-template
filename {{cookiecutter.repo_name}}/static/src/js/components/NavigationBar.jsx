/* global DJ_CONST gettext */

import React from 'react';
import ReactDOM from 'react-dom';
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';


class NavigationBar extends React.Component {
    static renderItemsLeft() {
        return [
            <NavItem href={DJ_CONST.reverse.home()} key="home">{gettext('Home')}</NavItem>,
        ];
    }

    static renderItemsRight() {
        const user = DJ_CONST.USER;
        if (user) {
            return (
                <NavDropdown title={user.full_name || user.username} id="nav-auth-dropdown">
                    <MenuItem href="#TODO-menu-item-1">{gettext('Settings')}</MenuItem>
                    <MenuItem divider />
                    <MenuItem href="#TODO-menu-item-2">{gettext('Log out')}</MenuItem>
                </NavDropdown>
            );
        }

        return null;
    }

    render() {
        return (
            <Navbar staticTop>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href={DJ_CONST.reverse.home()}>{{ cookiecutter.project_title }}</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        {NavigationBar.renderItemsLeft()}
                    </Nav>
                    <Nav pullRight>
                        {NavigationBar.renderItemsRight()}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

const renderNavigationBar = (containerID) => {
    const container = document.getElementById(containerID);

    if (container) {
        ReactDOM.render(<NavigationBar />, container);
    }
};

export default renderNavigationBar;
export { NavigationBar };
