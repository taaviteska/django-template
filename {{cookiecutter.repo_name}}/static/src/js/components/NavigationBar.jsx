/* global DJ_CONST gettext */

import React from 'react';
import ReactDOM from 'react-dom';
import {
    Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,
    Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
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
                <Dropdown isOpen={this.state.isDropdownOpen} toggle={() => this.toggleDropdown()}>
                    <DropdownToggle nav caret>
                        {user.name || user.username}
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem href="#TODO-menu-item-1">{gettext('Settings')}</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem href={DJ_CONST.reverse.logout()}>{gettext('Log out')}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            );
        }

        return null;
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
