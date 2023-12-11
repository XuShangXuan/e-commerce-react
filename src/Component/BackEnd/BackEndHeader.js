import React, { useContext } from 'react'
import BackEndContext from './BackEndContext';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

const managerLogoutApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/ManagerController/logout';

const BackEndHeader = () => {

    const { managerInfo, setManagerInfo } = useContext(BackEndContext);

    const navigate = useNavigate();

    // 管理者登出api
    const backEndLogout = async () => {

        const logoutData = await axios.get(managerLogoutApiUrl, { withCredentials: true }, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        console.log('BackEndHeader 管理者登出資訊:', logoutData)

        setManagerInfo(logoutData);

    }

    // 按下登出按鈕
    const onClickLogout = () => {

        console.log('BackEndHeader 管理者登出中')

        navigate("/BackEndLoginPage");
        backEndLogout();

    }

    return (
        <Navbar sticky="top" bg="dark" variant={"dark"} expand="lg">
            <Navbar.Brand as={Link} to="/GoodsList">{`E-Commerce(${managerInfo.cusName})`}</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
                <Nav className="mr-auto">
                    {/* to 路徑對應 Route path */}
                    <Nav.Link as={Link} to="/GoodsList">商品列表</Nav.Link>
                    <Nav.Link as={Link} to="/UpdateGoods">商品維護作業</Nav.Link>
                    <Nav.Link as={Link} to="/CreateGoods">商品新增作業</Nav.Link>
                    <Nav.Link as={Link} to="/SalesReport">銷售報表</Nav.Link>
                </Nav>
                <Button variant="outline-secondary" onClick={onClickLogout}>登出</Button>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default BackEndHeader
