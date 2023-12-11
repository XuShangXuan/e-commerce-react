import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';

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

        if (memberInfo.loginMessage != null && memberInfo.loginMessage != "") {
            handleLoginMsgShow();
        }

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

        // window.location = "/ShoppingHome"; // 會有整頁刷新的動作
        navigate("/ShoppingHome"); // 只變化不同的部分

    }

    return (
        <div>
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
            <h3>使用者登入頁面</h3>
            ID:<input type="text" id='id' name="id" ref={inputIDRef} onChange={inputChange} />
            <br /><br />
            PWD:<input type="password" id='password' name="pwd" onChange={inputChange} />
            <br /><br />
            <button onClick={onClickLogin}>提交</button>
            <br />
        </div >
    )
};

export default FrontEndLoginPage;
