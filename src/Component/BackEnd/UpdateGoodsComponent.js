import React, { Component } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import BackEndHeader from './BackEndHeader';

const queryAllGoodsApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/BackEndController/queryAllGoods';
const queryGoodsByIDApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/BackEndController/queryGoodsByID';
const updateGoodsApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/BackEndController/updateGoods';

const goodsDatas = [
    {
        goodsID: '',
        goodsName: '',
        description: '',
        price: '',
        quantity: '',
        file: '',
        imageName: '',
        status: ''
    }
]

const defGoodsInfo = {
    goodsID: '',
    goodsName: '',
    description: '',
    price: 0,
    quantity: 0,
    file: '',
    imageName: '',
    status: '1'
}

class UpdateGoodsComponent extends Component {

    // 初始化階段不打後端api
    constructor(props) {
        super(props);

        console.log("1.constructor 建構函式(Mounting:掛載)");

        this.state = {
            goodsDatas: goodsDatas,
            goodsInfo: defGoodsInfo,
            isSuccessful: false,
            validated: false
        };

    }

    // 掛載階段適合打後端api
    // 使用者進入updateGoods時，預先查好選單中的Goods
    componentDidMount() {
        console.log("3.componentDidMount 組件掛載(Mounting:掛載)");

        // 在掛載階段去預先查好選單中的Goods
        this.queryAllGoods();
    }

    // 取得所有商品資料
    queryAllGoods = async () => {

        const allGoods = await axios.get(queryAllGoodsApiUrl, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        this.setState({
            goodsDatas: allGoods
        }, () => {
            // 在setState的回調函數中執行console.log以確保狀態更新後再輸出
            console.log("打api後AllGoods:", this.state);
        });

    };

    // 取得下拉式選單的商品ID
    handleOptionClick = (e) => {

        const goodsID = e.target.value;

        if (goodsID != "") {
            this.setState({
                goodsInfo: {
                    goodsID: goodsID
                }
            }, () => {
                this.queryGoodsInfo()
            });
        } else {
            this.setState({
                goodsInfo: defGoodsInfo
            })
        }

    }

    // 取得單一商品資料
    queryGoodsInfo = async () => {

        const { goodsInfo } = this.state

        const params = { "goodsID": goodsInfo.goodsID }

        const goodsData = await axios.get(queryGoodsByIDApiUrl, { params }, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        this.setState({
            goodsInfo: goodsData
        }, () => {
            // 在setState的回調函數中執行console.log以確保狀態更新後再輸出
            console.log("打api後GoodsInfo:", this.state);
        });

    };

    // 輸入框改變時的事件處理
    inputChange = (e) => {

        // 取得使用者輸入的是哪一個輸入框
        // 也可取<input id='status 1 or 2' name='status'>的name，因為name可以重複命名
        const { id, value } = e.target;
        console.log('inputID:', id);
        console.log('inputValue:', value);

        this.setState(state => ({
            goodsInfo: { ...state.goodsInfo, [id]: value }
        }), () => {
            console.log('goodsInfo:', this.state.goodsInfo);
        });


    }

    // 只取得檔名
    onChangeImg = (e) => {

        const changFile = e.target.files;

        // 取得檔案，預設上傳檔案是會上傳「多個檔案」，因此預設為array
        const changFileName = changFile[0].name;

        this.setState(state => ({
            goodsInfo: { ...state.goodsInfo, imageName: changFileName }
        }), () => {
            console.log('goodsInfo:', this.state.goodsInfo);
        })

    };

    // 修改商品資訊
    handleSubmit = async (event) => {

        event.preventDefault(); // 防止瀏灠器預設submit跳頁  

        // 開啟BootStrap表單驗證
        this.setState(state => ({ validated: true }))

        const { goodsInfo } = this.state

        // 取得一整個form表單
        const form = event.currentTarget;

        console.log("表單驗證是否開啟:", form.checkValidity());

        if (form.checkValidity()) {

            console.log("寫進formData:", goodsInfo);

            /*
                multipart/form-data 最大的用處在於使用者可以把複數個資料格式一次傳送（一個請求）出去，
                主要用在 HTML 的表單裡頭，或是在實作檔案上傳功能時使用到。
            */
            // 後端要接收multipart的格式，用new FormData()包數個資料格式可傳送此格式;
            const formData = new FormData();

            // 運用Object.keys走訪State物件中所有的欄位名、欄位值,並且append至FormData裡面
            Object.keys(goodsInfo).map(key => {
                const value = goodsInfo[key];
                formData.append(key, value);
            })

            // 取得檔案，預設上傳檔案是會上傳「多個檔案」，因此預設為array
            const uploadFile = form.uploadFile.files[0];

            if (uploadFile != null) {

                // 取得檔案的名稱
                // const uploadImgName = uploadFile.name;

                console.log("上傳的檔案:", uploadFile);

                // state沒辦法存檔案，所以要另外處理
                formData.append('file', uploadFile);

                console.log("準備要送去後端的參數:", formData);
            }

            // call 後端API上傳檔案
            const updateData = await axios.put(updateGoodsApiUrl, formData, { timeout: 3000 })
                .then(rs => rs.data)
                .catch(error => { console.log(error); });

            this.setState({
                isSuccessful: true,
                goodsInfo: updateData
            }, () => {
                // 在setState的回調函數中執行console.log以確保狀態更新後再輸出
                console.log("打api後State:", this.state);
            });
        }

    }

    render() {

        const { goodsDatas, goodsInfo, isSuccessful, validated } = this.state

        return (
            <div>
                <BackEndHeader />
                <Container>
                    <br />
                    <h2>商品維護作業</h2>
                    <br />
                    {isSuccessful &&
                        <p className="text-primary">{`商品編號:${goodsInfo.goodsID} 修改成功!`}</p>
                    }
                    {/* noValidate 關閉瀏灠器預設驗証 */}
                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} xs={4} controlId="goodsID">
                                <Form.Label>商品列表</Form.Label>
                                <Form.Control required as="select" onChange={this.handleOptionClick}>
                                    <option value="">請選擇...</option>
                                    {goodsDatas.map(
                                        (goods) =>
                                            <option key={goods.goodsID} value={goods.goodsID}>{`編號:${goods.goodsID} ${goods.goodsName}`}</option>
                                    )}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">未選擇商品!</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} xs={3} controlId="goodsName">
                                <Form.Label>商品名稱</Form.Label>
                                <Form.Control required type="text" value={goodsInfo.goodsName} onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">商品名稱必填!</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} xs={4} controlId="description">
                                <Form.Label>商品描述(選填)</Form.Label>
                                <Form.Control style={{ height: '150px' }} as="textarea" value={goodsInfo.description} onChange={this.inputChange} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} xs={3} controlId="price">
                                <Form.Label>商品價格</Form.Label>
                                <Form.Control required type="number" value={goodsInfo.price} min="0" max="1000" onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">商品價格必填!</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} xs={3} controlId="quantity">
                                <Form.Label>商品數量</Form.Label>
                                <Form.Control required type="number" value={goodsInfo.quantity} min="0" max="1000" onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">商品數量必填!</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <p id="imageName">{goodsInfo.imageName}</p>
                        <Form.Row>
                            <Form.Group as={Col} xs={6}>
                                <Form.File id="formcheck-api-custom" custom>
                                    <Form.File.Input name="uploadFile" onChange={this.onChangeImg} />
                                    <Form.File.Label data-browse="瀏覽檔案">
                                        {/* {goodsInfo.imageName ? goodsInfo.imageName : '選擇要上傳的檔案...'} */}
                                        選擇要上傳的檔案
                                    </Form.File.Label>
                                </Form.File>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="status">
                            <Form.Label>商品狀態</Form.Label>
                            <br />
                            <Form.Check inline required name="status" type="radio" label="上架"
                                onChange={this.inputChange} value="1" checked={goodsInfo.status == '1'} />
                            <Form.Check inline required name="status" type="radio" label="下架"
                                onChange={this.inputChange} value="0" checked={goodsInfo.status == '0'} />
                        </Form.Group>
                        <Form.Row>
                            <Button type="submit">送出</Button>
                        </Form.Row>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default UpdateGoodsComponent;