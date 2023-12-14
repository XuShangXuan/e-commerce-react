import React, { useState } from 'react'
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const LoginHeader = () => {

    return (
        <Navbar sticky="top" bg="dark" variant={"dark"} expand="lg">
            <Navbar.Brand as={Link} to="/">E-Commerce</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav className="mr-auto">
                    {/* to 路徑對應 Route path */}
                    <NavDropdown title="登入模式" id="collasible-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/FrontEndLoginPage">購物網-前台</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/BackEndLoginPage">購物網-後台</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default LoginHeader
