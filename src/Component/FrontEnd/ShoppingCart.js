import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'

const checkoutGoodsApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/FrontEndController/checkoutGoods';

const ShoppingCart = ({ FrontLoginData, shoppingCartInfo, FrontLogoutData }) => {

    const { memberInfo } = FrontLoginData;
    const { shoppingCart, setShoppingCart, queryCartGoods, clearShoppingCart } = shoppingCartInfo;
    const { clickLogout } = FrontLogoutData;

    const [orderCustomer, setOrderCustomer] = useState({
        cusName: '',
        telNo: '',
        phoneNo: '',
        recipientAdd: ''
    });

    useEffect(() => {

        console.log("ShoppingCart 預查購物車");

        queryCartGoods();

    }, []);

    // 計算總金額
    const totalAmount = shoppingCart.reduce((accumulator, goods) => {

        // 單一商品的單價*數量
        const itemTotal = goods.quantity * goods.price;

        // 從0開始相加所有商品
        return accumulator + itemTotal;

    }, 0);

    //-----------------------------------------------------------------------------------------

    const inputRecipient = (e) => {

        // 取得id是為了取使用者輸入的是哪一個輸入框
        const { id, value } = e.target;

        console.log('inputID:', id);
        console.log('inputValue:', value);

        setOrderCustomer({ ...orderCustomer, [id]: value });

    }

    // 建立參照
    const cardSecondRef = useRef();
    const cardThirdRef = useRef();
    const cardFourthRef = useRef();

    const inputCardInfo = (e) => {

        const { id, value } = e.target;

        console.log('inputID:', id);
        console.log('inputValue:', value);

        // 輸入4碼就自動換下一個輸入框
        if (value.length == 4) {
            switch (id) {
                case 'cardFirst':

                    // 如果沒做延遲，當下輸入框的第四碼也會輸入進下一個輸入框中
                    setTimeout(() => {
                        cardSecondRef.current.focus();
                    }, 0);

                    break;
                case 'cardSecond':

                    setTimeout(() => {
                        cardThirdRef.current.focus();
                    }, 0);

                    break;
                case 'cardThird':

                    setTimeout(() => {
                        cardFourthRef.current.focus();
                    }, 0);

                    break;
            }
        }
    }

    //-----------------------------------------------------------------------------------------

    // 按登出按鈕
    const onClickLogout = () => {

        clickLogout();
        navigate("/FrontEndLoginPage");

    }

    //-----------------------------------------------------------------------------------------

    const continueShopping = () => {
        navigate("/ShoppingHome");
    }

    //-----------------------------------------------------------------------------------------

    const [validated, setValidated] = useState(false);

    const handleSubmit = (e) => {

        e.preventDefault(); // 避免表單送出預設跳頁行為

        // 開啟BootStrap表單驗證
        setValidated(true);

        // 取得一整個form表單
        const form = e.currentTarget;

        console.log("表單驗證是否開啟:", form.checkValidity());

        if (form.checkValidity()) {
            checkoutGoods();
        }

    }

    const navigate = useNavigate();

    // 結帳
    const checkoutGoods = async () => {

        console.log("ShoppingCart 結帳中");

        const params = {
            "cusName": orderCustomer.cusName, "telNo": orderCustomer.telNo,
            "phoneNo": orderCustomer.phoneNo, "recipientAdd": orderCustomer.recipientAdd
        };

        const checkoutCompleteInfo = await axios.post(checkoutGoodsApiUrl, params, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        console.log("ShoppingCart 購買明細", checkoutCompleteInfo);

        clearShoppingCart();
        navigate("/CheckoutComplete", { state: checkoutCompleteInfo });

    };

    return (
        <div>
            <Navbar sticky="top" bg="dark" variant={"dark"} expand="lg">
                <Navbar.Brand as={Link} to="/ShoppingHome">{`E-Commerce(${memberInfo.cusName})`}</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="mr-auto">
                        <Button variant="outline-light" onClick={continueShopping}>繼續購物</Button>
                        &nbsp;&nbsp;
                        <Button variant="outline-light" onClick={clearShoppingCart}>清除購物車</Button>
                    </Nav>
                    <Button variant="outline-secondary" onClick={onClickLogout}>登出</Button>
                </Navbar.Collapse>
            </Navbar>
            <Container>
                <br />
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            購物車商品清單
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {shoppingCart.length > 0 ? (
                                    <Table responsive="sm">
                                        <thead>
                                            <tr height="50">
                                                <td width="150"><b>商品編號</b></td>
                                                <td width="150"><b>商品圖</b></td>
                                                <td width="100"><b>商品名稱</b></td>
                                                <td width="100"><b>數量</b></td>
                                                <td width="100"><b>單價</b></td>
                                                <td width="100"><b>價格</b></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shoppingCart.map(goods => (
                                                <tr key={goods.goodsID} height="50">
                                                    <td width="150"><b>{goods.goodsID}</b></td>
                                                    <td width="100"><b><img src={`http://localhost:8085/E-Commerce-SpringBoot/goodsImg/${goods.imageName}`} width="100" height="100" /></b></td>
                                                    <td width="150"><b>{goods.goodsName}</b></td>
                                                    <td width="100"><b>{goods.quantity}</b></td>
                                                    <td width="100"><b>{`$${goods.price}`}</b></td>
                                                    <td width="100"><b>{`$${goods.quantity * goods.price}`}</b></td>
                                                </tr>
                                            ))}
                                            <tr height="50">
                                                <td width="150"><b></b></td>
                                                <td width="100"><b></b></td>
                                                <td width="150"><b></b></td>
                                                <td width="100"><b></b></td>
                                                <td width="100"><b>結帳總金額:</b></td>
                                                <td width="100"><b>{`$${totalAmount}`}</b></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                ) : (
                                    <span>尚未選購任何商品</span>
                                )}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                {shoppingCart.length > 0 &&
                    <div>
                        <br />
                        <hr />
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <h5>填寫收件人資料</h5>
                            <Form.Row>
                                <Form.Group as={Col} xs={6} controlId="cusName">
                                    <Form.Label>姓名:</Form.Label>
                                    <Form.Control required type="text" placeholder="Enter text" onChange={inputRecipient} />
                                    <Form.Control.Feedback type="invalid">姓名為必填!</Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="telNo">
                                    <Form.Label>聯絡電話:</Form.Label>
                                    <Form.Control required type="number" placeholder="Enter number" onChange={inputRecipient} />
                                    <Form.Control.Feedback type="invalid">聯絡電話為必填!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="phoneNo">
                                    <Form.Label>手機號碼(選填):</Form.Label>
                                    <Form.Control type="number" placeholder="Enter number" onChange={inputRecipient} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} xs={8} controlId="recipientAdd">
                                    <Form.Label>收件地址:</Form.Label>
                                    <Form.Control required type="text" placeholder="Enter text" onChange={inputRecipient} />
                                    <Form.Control.Feedback type="invalid">收件地址為必填!</Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <hr />
                            <h5>填寫信用卡資料</h5>
                            <Form.Row>
                                <Form.Group as={Col} controlId="cardFirst">
                                    <Form.Label>信用卡卡號:</Form.Label>
                                    <Form.Control required type="number" placeholder="Enter number" min="0" max="9999" onChange={inputCardInfo} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="cardSecond" className="d-flex align-items-end">
                                    <Form.Control required type="number" ref={cardSecondRef} placeholder="Enter number" min="0" max="9999" onChange={inputCardInfo} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="cardThird" className="d-flex align-items-end">
                                    <Form.Control required type="number" ref={cardThirdRef} placeholder="Enter number" min="0" max="9999" onChange={inputCardInfo} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="cardFourth" className="d-flex align-items-end">
                                    <Form.Control required type="number" ref={cardFourthRef} placeholder="Enter number" min="0" max="9999" onChange={inputCardInfo} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} xs={3} controlId="expiryDate">
                                    <Form.Label>有效日期:</Form.Label>
                                    <Form.Control required type="month" placeholder="Enter text" onChange={inputCardInfo} />
                                    <Form.Control.Feedback type="invalid">請填寫信用卡有效日期!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} xs={3} controlId="CSC">
                                    <Form.Label>安全碼:</Form.Label>
                                    <Form.Control required type="number" placeholder="Enter text" min="0" max='999' onChange={inputCardInfo} />
                                    <Form.Control.Feedback type="invalid">請填寫信用卡安全碼!</Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Button type='submit'>送出</Button>
                        </Form>
                        <br />
                    </div>
                }

            </Container>
        </div>
    )
}

export default ShoppingCart
