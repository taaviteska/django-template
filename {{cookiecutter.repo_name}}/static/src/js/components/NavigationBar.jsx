/* global DJ_CONST gettext */

import React from 'react';
import ReactDOM from 'react-dom';
import {
    Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,
    Dropdown, DropdownToggle,
} from 'reactstrap';


class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            isDropdownOpen: false,
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    toggleDropdown() {
        this.setState({
            isDropdownOpen: !this.state.isDropdownOpen
        });
    }

    renderItemsLeft() {
        return [
            <NavItem key="home"><NavLink href={DJ_CONST.reverse.home()}>{gettext('Home')}</NavLink></NavItem>,
        ];
    }

    renderItemsRight() {
        const user = DJ_CONST.USER;
        if (user) {
            return (
                <Dropdown nav isOpen={this.state.isDropdownOpen} toggle={() => this.toggleDropdown()}>
                    <DropdownToggle nav caret>
                        {user.name || user.username}
                    </DropdownToggle>
                    {/* reactstrap's DropdownMenu does not work for our usecase yet */}
                    <div className={"dropdown-menu dropdown-menu-right" + (this.state.isDropdownOpen ? " show" : "")}>
                        <a href="#TODO-menu-item-1" className="dropdown-item">{gettext('TODO')}</a>
                        <div class="dropdown-divider"></div>
                        <a href={DJ_CONST.reverse.logout()} className="dropdown-item">{gettext('Log out')}</a>
                    </div>
                </Dropdown>
            );
        }

        return [
            <NavItem key="login"><NavLink href={DJ_CONST.reverse.login()}>{gettext('Log in')}</NavLink></NavItem>,
        ];
    }

    render() {
        return (
            <Navbar dark color="dark" expand="md" className="mb-4">
                <div className="container">
                    <NavbarBrand href={DJ_CONST.reverse.home()}>{{ cookiecutter.project_title }}</NavbarBrand>
                    <NavbarToggler onClick={() => this.toggle()} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            {this.renderItemsLeft()}
                        </Nav>
                        <Nav navbar>
                            {this.renderItemsRight()}
                        </Nav>
                    </Collapse>
                </div>
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
