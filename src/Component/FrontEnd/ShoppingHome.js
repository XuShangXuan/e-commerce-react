import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Image from 'react-bootstrap/Image';
import CustomPagination from '../widgets/CustomPagination';
import addGoodsImg from './img/success-icon-23194.png';
// import addGoodsImg from './img/checked.png';

const queryGoodsDataApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/FrontEndController/queryGoodsData';
const addCartGoodsApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/MemberController/addCartGoods';

const defGoodsDataInfo = [
    {
        goodsID: '',
        goodsName: '',
        description: '',
        price: '',
        quantity: '',
        imageName: '',
        status: ''
    }
]

const defGenericPageable = {
    currentPage: 1,
    pageTotalCount: '',
    startPage: '',
    endPage: '',
    pageRange: [],
    showPageSize: '',
    showDataCount: '',
    dataTotalCount: ''
}

const ShoppingHome = ({ FrontLoginData, shoppingCartInfo, FrontLogoutData }) => {

    const { memberInfo } = FrontLoginData;
    const { shoppingCart, setShoppingCart, queryCartGoods, clearShoppingCart } = shoppingCartInfo;
    const { clickLogout } = FrontLogoutData;

    const navigate = useNavigate();

    const [tempFilter, setTempFilter] = useState({
        keyword: ''
    });

    const [filter, setFilter] = useState({
        keyword: ''
    });

    const [goodsDataInfo, setGoodsDataInfo] = useState(defGoodsDataInfo);

    const [genericPageable, setGenericPageable] = useState(defGenericPageable);

    //------------------------------------------------------------------------------------------

    // 如果頁數或是商品關鍵字有變化就查詢商品
    useEffect(() => {

        console.log("ShoppingHome 查詢關鍵字:", filter.keyword);
        console.log("ShoppingHome 當下頁數:", genericPageable.currentPage);

        callQueryGoodsDataApi();


    }, [filter.keyword, genericPageable.currentPage]);

    // 後端查詢商品及計算分頁
    const callQueryGoodsDataApi = async () => {

        const params = {
            "searchKeyword": filter.keyword, "currentPage": genericPageable.currentPage,
            "showDataCount": 6, "showPageSize": 3
        };

        const GoodsDataInfoVo = await axios.get(queryGoodsDataApiUrl, { params }, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        setGoodsDataInfo(GoodsDataInfoVo.goodsDatas);
        setGenericPageable(GoodsDataInfoVo.genericPageable);

    }

    //------------------------------------------------------------------------------------------

    // 印出後端查回來的商品及計算分頁(可不寫)
    useEffect(() => {

        console.log("ShoppingHome 印出後端查回來的商品及計算分頁(可不寫)");
        console.log("ShoppingHome 商品清單:", goodsDataInfo);
        console.log("ShoppingHome 分頁資訊:", genericPageable);

    }, [goodsDataInfo]);

    //------------------------------------------------------------------------------------------

    // 換頁
    const onClickPage = (pageValue) => {
        setGenericPageable(genericPageable => ({ ...genericPageable, currentPage: pageValue }));
    }

    // 暫存使用者輸入的商品關鍵字
    const inputChange = (e) => {

        // 取得id是為了取使用者輸入的是哪一個輸入框
        const { id, value } = e.target;

        console.log('inputID:', id);
        console.log('inputValue:', value);

        setTempFilter(tempFilter => ({ ...tempFilter, [id]: value }));
    };

    // 查詢商品
    const searchKeyword = () => {

        console.log('ShoppingHome 查詢商品按鈕被點擊');
        console.log('ShoppingHome 暫存:', tempFilter);

        setGenericPageable(genericPageable => ({ ...genericPageable, currentPage: 1 }));
        setFilter(filter => ({ ...filter, keyword: tempFilter.keyword }));
    }

    //------------------------------------------------------------------------------------------

    // 進入購物車
    const showShoppingCart = () => {
        navigate("/ShoppingCart");
    }

    //------------------------------------------------------------------------------------------

    // 預查購物車(要取得商品的數量)

    useEffect(() => {

        console.log('ShoppingHome 查詢購物車數量')
        queryCartGoods();

    }, []);

    //------------------------------------------------------------------------------------------

    // 加入購物車
    const addShoppingCart = async (event, goodsID) => {

        event.preventDefault(); // 防止瀏灠器預設submit跳頁

        console.log('ShoppingHome 加入購物車');

        const quantity = event.target.buyQuantity.value; // 獲取購買數量

        console.log('ShoppingHome 購買數量:', quantity);

        if (quantity != null && quantity > 0) {

            handleCartMsgShow();

            const params = {
                "goodsID": goodsID,
                "quantity": quantity
            };

            const cartGoods = await axios.post(addCartGoodsApiUrl, params, { withCredentials: true }, { timeout: 10000 })
                .then(rs => rs.data)
                .catch(error => { console.log(error); });

            setShoppingCart(cartGoods);
        }

    }

    //------------------------------------------------------------------------------------------

    // 按登出按鈕
    const onClickLogout = () => {

        clickLogout();
        navigate("/FrontEndLoginPage");

    }

    //------------------------------------------------------------------------------------------

    /*
        將goodsDatas每三個元素分為一組，groupedGoods會變成2維陣列
        Ex: goodsDataInfo = [1,2,3,4,5] 會變成 groupedGoods[[1,2,3],[4,5]]

        goodsDatas.slice(起,迄(不包含)) 回傳一個array，而groupedGoods.push(接收一個陣列)
        goodsDataInfo.slice(1,4); 就會是1,2,3變成一組陣列，傳入groupedGoods
    */
    const groupedGoods = [];
    for (let i = 0; i < goodsDataInfo.length; i += 3) {
        groupedGoods.push(goodsDataInfo.slice(i, i + 3));
    }

    //------------------------------------------------------------------------------------------

    const [cartMsg, setCartMsg] = useState(false);
    const handleCartMsgClose = () => setCartMsg(false);
    const handleCartMsgShow = () => setCartMsg(true);

    //------------------------------------------------------------------------------------------

    const [cartList, setCartList] = useState(false);
    const handleCartListClose = () => setCartList(false);
    const handleCartListShow = () => {
        setCartList(true)
        queryCartGoods();
    };

    return (
        <div>
            <Modal show={cartMsg} onHide={handleCartMsgClose}>
                <Modal.Header closeButton>
                    <Modal.Title>購物車訊息</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    <Image src={addGoodsImg} roundedCircle style={{ width: '120px', height: '120px' }} />
                    <br /><br />
                    <h4 style={{ fontWeight: 'bold' }}>商品加入成功!!</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCartMsgClose}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={cartList} onHide={handleCartListClose}>
                <Modal.Header closeButton>
                    <Modal.Title>購物車清單</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {shoppingCart.length > 0 ? (
                        <Table responsive="sm">
                            <thead>
                                <tr>
                                    <th>編號</th>
                                    <th>商品圖</th>
                                    <th>商品名稱</th>
                                    <th>數量</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shoppingCart.map(goods => (
                                    <tr key={goods.goodsID}>
                                        <td width="80"><b>{goods.goodsID}</b></td>
                                        <td width="100"><b><img src={`http://localhost:8085/E-Commerce-SpringBoot/goodsImg/${goods.imageName}`} width="100" height="100" /></b></td>
                                        <td width="150"><b>{goods.goodsName}</b></td>
                                        <td width="80"><b>{goods.quantity}</b></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <span>尚未選購任何商品</span>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={clearShoppingCart}>
                        清空購物車
                    </Button>
                    <Button variant="success" onClick={showShoppingCart}>結帳</Button>
                </Modal.Footer>
            </Modal>
            <Navbar sticky="top" bg="dark" variant={"dark"} expand="lg">
                <Navbar.Brand as={Link} to="/ShoppingHome">{`E-Commerce(${memberInfo.cusName})`}</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="mr-auto">
                        <Button variant="outline-light" onClick={handleCartListShow}>購物車({shoppingCart.length})</Button>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" id="keyword" onChange={inputChange} placeholder="搜尋商品" className="mr-sm-2" />
                        <Button variant="outline-info" onClick={searchKeyword}>搜尋</Button>
                    </Form>
                    &nbsp;&nbsp;
                    <Button variant="outline-secondary" onClick={onClickLogout}>登出</Button>
                </Navbar.Collapse>
            </Navbar>
            <Container>
                <Carousel fade>
                    <Carousel.Item interval={2000}>
                        <img
                            className="d-block w-100"
                            src="http://localhost:8085/E-Commerce-SpringBoot/goodsImg/220937.png"
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item interval={2000}>
                        <img
                            className="d-block w-100"
                            src="http://localhost:8085/E-Commerce-SpringBoot/goodsImg/225541.png"
                            alt="Second slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item interval={2000}>
                        <img
                            className="d-block w-100"
                            src="http://localhost:8085/E-Commerce-SpringBoot/goodsImg/230014.png"
                            alt="Third slide"
                        />
                    </Carousel.Item>
                </Carousel>
                <br />
                {goodsDataInfo.length > 0 ? (
                    <div>
                        {groupedGoods.map((group, groupIndex) => (
                            <div key={groupIndex}>
                                <CardDeck>
                                    {group.map(goods => (
                                        <Card key={goods.goodsID}>
                                            <Card.Img variant="top"
                                                src={`http://localhost:8085/E-Commerce-SpringBoot/goodsImg/${goods.imageName}`}
                                            />
                                            <Card.Body>
                                                <Card.Title>{goods.goodsName}</Card.Title>
                                                <Card.Title style={{ fontWeight: 'bold' }}>
                                                    {`$${goods.price}`}
                                                </Card.Title>
                                                <Card.Text>
                                                    {goods.description}
                                                </Card.Text>
                                                <Card.Text>
                                                    {goods.quantity > 0 ?
                                                    `剩餘數量/${goods.quantity}` : <span className="text-danger">待補貨</span>}
                                                </Card.Text>
                                            </Card.Body>
                                            <Form onSubmit={event => addShoppingCart(event, goods.goodsID)}>
                                                <Card.Footer>
                                                    <Row>
                                                        <Col>
                                                            <Form.Control type="number" name="buyQuantity" placeholder="購買數量" min="0" max={goods.quantity} />
                                                        </Col>
                                                        <Col align="right">
                                                            <Button type='submit' variant="outline-success">加入購物車</Button>
                                                        </Col>
                                                    </Row>
                                                </Card.Footer>
                                            </Form>
                                        </Card>
                                    ))}

                                    {/* 補足不足三個的情況 */}
                                    {group.length < 3 && (
                                        Array.from({ length: 3 - group.length }).map((blank, blankIndex) => (
                                            <Card key={blankIndex} style={{ visibility: 'hidden' }}>
                                                {/* 空的區塊，設定 visibility: 'hidden' 來隱藏 */}
                                            </Card>
                                        ))
                                    )}
                                </CardDeck>
                                <br />
                            </div>
                        ))}
                        <Row>
                            <Col xs={8}>{`共${genericPageable.dataTotalCount}件商品`}</Col>
                            <Col>
                                <div className="d-flex justify-content-end">
                                    <CustomPagination genericPageable={genericPageable} onClickPage={onClickPage} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <span>查無商品</span>
                )}
            </Container>
        </div>
    )
}

export default ShoppingHome
