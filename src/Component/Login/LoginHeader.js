import React, { useState } from 'react'
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const LoginHeader = () => {

    const [dropdownTitle, setDropdownTitle] = useState("購物網-前台");

    const handleDropdownSelect = (eventKey) => {
        // 根據選擇的 eventKey 更新標題文字
        if (eventKey === "consumer") {
            setDropdownTitle("購物網-前台");
        } else if (eventKey === "admin") {
            setDropdownTitle("購物網-後台");
        }
    };

    return (
        <Navbar sticky="top" bg="dark" variant={"dark"} expand="lg">
            <Navbar.Brand as={Link} to="/">E-Commerce</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav className="mr-auto">
                    {/* to 路徑對應 Route path */}
                    <NavDropdown title={dropdownTitle} id="collasible-nav-dropdown" onSelect={handleDropdownSelect}>
                        <NavDropdown.Item as={Link} to="/FrontEndLoginPage" eventKey="consumer">購物網-前台</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/BackEndLoginPage" eventKey="admin">購物網-後台</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default LoginHeader
