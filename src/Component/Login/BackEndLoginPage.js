import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';

const managerLoginApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/ManagerController/login';

const BackEndLoginPage = ({ BackEndLoginData }) => {

    const { managerInfo, setManagerInfo } = BackEndLoginData;

    // 建立參照
    const inputIDRef = useRef();

    const navigate = useNavigate();

    const [login, setLogin] = useState({
        id: '',
        password: ''
    });

    //------------------------------------------------------------------------------------------

    const [loginMsg, setLoginMsg] = useState(false);
    const handleLoginMsgClose = () => setLoginMsg(false);
    const handleLoginMsgShow = () => setLoginMsg(true);


    //------------------------------------------------------------------------------------------

    // 預先選到輸入框
    useEffect(() => {
        inputIDRef.current.focus();
    }, []);

    const inputChange = (e) => {

        // 取得id是為了取使用者輸入的是哪一個輸入框
        const { id, value } = e.target;

        console.log('inputID:', id);
        console.log('inputValue:', value);

        setLogin(login => ({ ...login, [id]: value }));
    };

    const onClickLogin = () => {

        inputIDRef.current.focus();

        callManagerLoginApi();

        if (managerInfo.loginMessage != null && managerInfo.loginMessage != "") {
            handleLoginMsgShow();
        }

    }

    const callManagerLoginApi = async () => {

        const params = {
            "identificationNo": login.id, "cusPassword": login.password
        };

        const loginData = await axios.post(managerLoginApiUrl, params, { withCredentials: true }, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        console.log('管理者登入資訊:', loginData);

        setManagerInfo(loginData);

        // window.location = "/ShoppingHome"; // 會有整頁刷新的動作
        navigate("/GoodsList"); // 只變化不同的部分
    }

    const [error, setError] = useState(null);

    return (
        <Container>
            <br /><br /><br /><br /><br /><br />
            <Modal show={loginMsg} onHide={handleLoginMsgClose}>
                <Modal.Header closeButton>
                    <Modal.Title>E-Commerce系統訊息</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {managerInfo.loginMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleLoginMsgClose}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={4}>
                    <Form>
                        <h2 className="text-center mb-4">Login</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group controlId="id">
                            <Form.Label>ID:</Form.Label>
                            <Form.Control
                                type="text"
                                ref={inputIDRef}
                                name="id"
                                value={login.id}
                                onChange={inputChange}
                                placeholder="Enter your ID"
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={login.password}
                                onChange={inputChange}
                                placeholder="Enter your password"
                            />
                        </Form.Group>
                        <Button variant="primary" type="button" onClick={onClickLogin} block>
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        // <div>
        //     <Modal show={loginMsg} onHide={handleLoginMsgClose}>
        //         <Modal.Header closeButton>
        //             <Modal.Title>E-Commerce系統訊息</Modal.Title>
        //         </Modal.Header>
        //         <Modal.Body>
        //             {managerInfo.loginMessage}
        //         </Modal.Body>
        //         <Modal.Footer>
        //             <Button variant="primary" onClick={handleLoginMsgClose}>Close</Button>
        //         </Modal.Footer>
        //     </Modal>
        //     <h3>管理者登入頁面</h3>
        //     <h4>F452378621</h4>
        //     <h4>G744565634</h4>
        //     ID:<input type="text" id='id' name="id" ref={inputIDRef} onChange={inputChange} />
        //     <br /><br />
        //     PWD:<input type="password" id='password' name="pwd" onChange={inputChange} />
        //     <br /><br />
        //     <button onClick={onClickLogin}>提交</button>
        //     <br />
        // </div >
    )
};

export default BackEndLoginPage;
