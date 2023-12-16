import React from 'react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

const CheckoutComplete = ({ FrontLoginData, FrontLogoutData }) => {

    const { memberInfo } = FrontLoginData;
    const { clickLogout } = FrontLogoutData;
    const navigate = useNavigate();

    const location = useLocation();
    const checkoutCompleteInfo = location.state;
    // const { customer, cartGoodsList } = checkoutCompleteInfo != null && checkoutCompleteInfo
    const customer = checkoutCompleteInfo.customer != null && checkoutCompleteInfo.customer;
    const cartGoodsList = checkoutCompleteInfo.cartGoodsList != null && checkoutCompleteInfo.cartGoodsList;

    let totalAmount = 0;

    if (cartGoodsList != null) {
        // 計算總金額
        totalAmount = cartGoodsList.reduce((total, goods) => {

            // 單一商品的單價*數量
            const singleGoodsTotalAmount = goods.quantity * goods.price;

            // 從0開始相加所有商品
            return total + singleGoodsTotalAmount;

        }, 0);
    }

    const shopping = () => {
        navigate("/ShoppingHome");
    }

    //-------------------------------------------------------------------

    // 按登出按鈕
    const onClickLogout = () => {

        clickLogout();
        navigate("/FrontEndLoginPage");

    }

    return (
        <div>
            <Navbar sticky="top" bg="dark" variant={"dark"} expand="lg">
                <Navbar.Brand as={Link} to="/ShoppingHome">{`E-Commerce(${memberInfo.cusName})`}</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="mr-auto">
                        <Button variant="outline-light" onClick={shopping}>繼續購物</Button>
                    </Nav>
                    <Button variant="outline-secondary" onClick={onClickLogout}>登出</Button>
                </Navbar.Collapse>
            </Navbar>
            <Container>
                <br />
                <h4>訂單完成確認</h4>
                <p className="text-info">{`收件人姓名: ${customer.cusName}`}</p>
                <p className="text-info">{`手機號碼: ${customer.phoneNo}`}</p>
                <p className="text-info">{`聯絡電話: ${customer.telNo}`}</p>
                <p className="text-info">{`收件地址: ${customer.recipientAdd}`}</p>
                <Button variant="outline-dark" onClick={shopping}>繼續購物</Button>
                <br /><br />
                <Table responsive="sm">
                    <thead>
                        <tr>
                            <td width="150"><b>商品編號</b></td>
                            <td width="150"><b>商品圖</b></td>
                            <td width="100"><b>商品名稱</b></td>
                            <td width="100"><b>數量</b></td>
                            <td width="100"><b>單價</b></td>
                            <td width="100"><b>價格</b></td>
                        </tr>
                    </thead>
                    <tbody>
                        {cartGoodsList.map(goods => (
                            <tr key={goods.goodsID}>
                                <td width="150"><b>{goods.goodsID}</b></td>
                                <td width="100"><b><img src={`http://localhost:8085/E-Commerce-SpringBoot/goodsImg/${goods.imageName}`} width="100" height="100" /></b></td>
                                <td width="150"><b>{goods.goodsName}</b></td>
                                <td width="100"><b>{goods.quantity}</b></td>
                                <td width="100"><b>{`$${goods.price}`}</b></td>
                                <td width="100"><b>{`$${goods.quantity * goods.price}`}</b></td>
                            </tr>
                        ))}
                        <tr>
                            <td width="150"><b></b></td>
                            <td width="100"><b></b></td>
                            <td width="150"><b></b></td>
                            <td width="100"><b></b></td>
                            <td width="100"><b>結帳總金額:</b></td>
                            <td width="100"><b>{`$${totalAmount}`}</b></td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}

export default CheckoutComplete
