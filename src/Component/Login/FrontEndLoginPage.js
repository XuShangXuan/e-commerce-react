import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import { Container, Row, Col, Form } from 'react-bootstrap';

const loginApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/MemberController/login';

const FrontEndLoginPage = ({ FrontLoginData }) => {

    const { memberInfo, setMemberInfo } = FrontLoginData;

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

        callLoginApi();

    }

    // 後端檢查帳密是否正確
    const callLoginApi = async () => {

        const params = {
            "identificationNo": login.id, "cusPassword": login.password
        };

        const loginData = await axios.post(loginApiUrl, params, { withCredentials: true }, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        console.log('使用者登入資訊:', loginData);

        setMemberInfo(loginData);

        if (loginData.isLogin) {
            // window.location = "/ShoppingHome"; // 會有整頁刷新的動作
            navigate("/ShoppingHome"); // 只變化不同的部分
        }

        if (loginData.loginMessage != null && loginData.loginMessage != "") {
            handleLoginMsgShow();
        }

    }

    return (
        <Container>
            <br /><br /><br /><br /><br /><br />
            <Modal show={loginMsg} onHide={handleLoginMsgClose}>
                <Modal.Header closeButton>
                    <Modal.Title>E-Commerce系統訊息</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {memberInfo.loginMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleLoginMsgClose}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={4}>
                    <Form>
                        <h2 className="text-center mb-4">使用者登入</h2>
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
            {/* <h3>使用者登入頁面</h3>
            ID:<input type="text" id='id' name="id" ref={inputIDRef} onChange={inputChange} />
            <br /><br />
            PWD:<input type="password" id='password' name="pwd" onChange={inputChange} />
            <br /><br />
            <button onClick={onClickLogin}>提交</button>
            <br /> */}
        </Container >
    )
};

export default FrontEndLoginPage;
