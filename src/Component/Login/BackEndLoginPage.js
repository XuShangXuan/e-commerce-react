import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import './LoginForm.css';
import FailImg from './img/cancel.png';
// import FailImg from './img/close.png';
// import FailImg from './img/remove.png';

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

    const handleSubmit = (e) => {

        e.preventDefault(); // 避免表單送出預設跳頁行為

        inputIDRef.current.focus();

        // 開啟BootStrap表單驗證
        setValidated(true);

        // 取得一整個form表單
        const form = e.currentTarget;

        if (form.checkValidity()) {
            callManagerLoginApi();
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

        if (loginData.isLogin) {
            navigate("/GoodsList"); // 局部更新
        }

        if (loginData.loginMessage != null && loginData.loginMessage != "") {
            handleLoginMsgShow();
        }

    }

    //-----------------------------------------------------------------------------------------

    const [validated, setValidated] = useState(false);

    return (
        <div>
            <Modal show={loginMsg} onHide={handleLoginMsgClose}>
                <Modal.Header closeButton>
                    <Modal.Title>E-Commerce系統訊息</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                <Image src={FailImg} roundedCircle style={{ width: '120px', height: '120px' }} />
                    <br /><br />
                    <h4 style={{ fontWeight: 'bold' }}>{managerInfo.loginMessage}</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleLoginMsgClose}>Close</Button>
                </Modal.Footer>
            </Modal>
            <div className="login-form-container">
                <h2 className="text-center mb-4">管理者登入</h2>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="id">
                            <Form.Label>ID:</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                ref={inputIDRef}
                                name="id"
                                value={login.id}
                                onChange={inputChange}
                                placeholder="Enter your ID"
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="password">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                required
                                type="password"
                                name="password"
                                value={login.password}
                                onChange={inputChange}
                                placeholder="Enter your password"
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Button variant="primary" type='submit' block>
                            Login
                        </Button>
                    </Form.Row>
                </Form>
            </div>
        </div >
    )
};

export default BackEndLoginPage;
