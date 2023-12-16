import React, { Component, createRef } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import BackEndHeader from './BackEndHeader';

const apiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/BackEndController/createGoods';

const defGoods = {
    goodsID: 0,
    goodsName: '',
    description: '',
    price: '',
    quantity: '',
    file: '',
    imageName: '',
    status: '1'
}

class CreateGoodsComponent extends Component {

    // 初始化階段不打後端api
    constructor(props) {
        super(props);

        console.log("1.constructor 建構函式(Mounting:掛載)");

        // 創建一個 ref 來存儲商品名稱的 input 元素
        this.goodsNameInputRef = createRef();

        this.state = {
            uploadGoods: defGoods,
            uploadSuccessful: defGoods,
            isSuccessful: false,
            validated: false
        };

    }

    componentDidMount() {
        // 在畫面載入後將焦點設定在商品名稱輸入框上
        this.goodsNameInputRef.current.focus();
    }

    // 輸入框改變時的事件處理
    inputChange = (e) => {

        // 取得使用者輸入的是哪一個輸入框
        // 也可取<input id='status 1 or 2' name='status'>的name，因為name可以重複命名
        const { id, value } = e.target;
        console.log('inputID:', id);
        console.log('inputValue:', value);


        this.setState(state => ({
            uploadGoods: { ...state.uploadGoods, [id]: value }
        }), () => {
            console.log('uploadGoods:', this.state.uploadGoods);
        });

    }

    // 只取得檔名
    onChangeImg = (e) => {

        const changFile = e.target.files;

        // 取得檔案，預設上傳檔案是會上傳「多個檔案」，因此預設為array
        const changFileName = changFile[0].name;

        this.setState({
            uploadGoods: { ...this.state.uploadGoods, imageName: changFileName }
        }, () => {

            console.log('uploadGoods:', this.state.uploadGoods);

        });
    };


    handleSubmit = async (event) => {

        event.preventDefault(); // 防止瀏灠器預設submit跳頁

        // 開啟BootStrap表單驗證
        this.setState({ validated: true })

        const { uploadGoods } = this.state

        // 取得一整個form表單
        const form = event.currentTarget;

        console.log("表單驗證是否開啟:", form.checkValidity());

        if (form.checkValidity()) {

            // 取得檔案，預設上傳檔案是會上傳「多個檔案」，因此預設為array
            const uploadFile = form.uploadFile.files[0];

            console.log("上傳的檔案:", uploadFile);

            /*
                multipart/form-data 最大的用處在於使用者可以把複數個資料格式一次傳送（一個請求）出去，
                主要用在 HTML 的表單裡頭，或是在實作檔案上傳功能時使用到。
            */
            // 後端要接收multipart的格式，用new FormData()包數個資料格式可傳送此格式;
            const formData = new FormData();

            // 運用Object.keys走訪State物件中所有的欄位名、欄位值,並且append至FormData裡面
            Object.keys(uploadGoods).map(key => {
                const value = uploadGoods[key];
                formData.append(key, value);
            })

            // state沒辦法存檔案，所以要另外處理
            formData.append('file', uploadFile);

            // formData.append('goodsName', uploadGoods.goodsName);
            // formData.append('description', uploadGoods.description);
            // formData.append('price', uploadGoods.price);
            // formData.append('quantity', uploadGoods.quantity);
            // formData.append('file', uploadFile);
            // formData.append('imageName', uploadGoods.imageName);
            // formData.append('status', uploadGoods.status);

            console.log("準備要送去後端的參數:", formData);

            // call 後端API上傳檔案
            const uploadData = await axios.post(apiUrl, formData, { timeout: 3000 })
                .then(rs => rs.data)
                .catch(error => { console.log(error); });

            this.setState({
                isSuccessful: true,
                uploadSuccessful: uploadData
            }, () => {
                // 在setState的回調函數中執行console.log以確保狀態更新後再輸出
                console.log("打api後State:", this.state);
            });
        }
    }

    /*
    // 上傳成功後清空所有選項
    onClickClear = () => {
        this.setState({
            uploadGoods: defGoods
        });
    }
    */

    render() {

        const { uploadGoods, uploadSuccessful, isSuccessful, validated } = this.state

        return (
            <div>
                <BackEndHeader />
                <Container>
                    <br />
                    <h2>商品新增作業</h2>
                    <br />
                    {isSuccessful &&
                        <p className="text-primary">商品編號:{uploadSuccessful.goodsID} 建立成功!</p>
                    }
                    <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} xs={4} controlId="goodsName">
                                <Form.Label>商品名稱</Form.Label>
                                <Form.Control required ref={this.goodsNameInputRef} type="text" onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">商品名稱必填!</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} xs={4} controlId="description">
                                <Form.Label>商品描述(選填)</Form.Label>
                                <Form.Control style={{ height: '150px' }} as="textarea" onChange={this.inputChange} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} xs={3} controlId="price">
                                <Form.Label>商品價格</Form.Label>
                                <Form.Control required type="number" min="0" max="1000" onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">商品價格必填!</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} xs={3} controlId="quantity">
                                <Form.Label>商品數量</Form.Label>
                                <Form.Control required type="number" min="0" max="1000" onChange={this.inputChange} />
                                <Form.Control.Feedback type="invalid">商品數量必填!</Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <p id="imageName">{uploadGoods.imageName}</p>
                        <Form.Row>
                            <Form.Group as={Col} xs={6}>
                                <Form.File id="formcheck-api-custom" custom>
                                    <Form.File.Input required name="uploadFile" onChange={this.onChangeImg} />
                                    <Form.File.Label data-browse="瀏覽檔案">
                                        {/* {goodsInfo.imageName ? goodsInfo.imageName : '選擇要上傳的檔案...'} */}
                                        選擇要上傳的檔案
                                    </Form.File.Label>
                                    <Form.Control.Feedback type="valid">已選擇檔案!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">未選擇檔案!</Form.Control.Feedback>
                                </Form.File>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="status">
                            <Form.Label>商品狀態</Form.Label>
                            <br />
                            <Form.Check inline required type="radio" label="上架" onChange={this.inputChange} value="1" checked={uploadGoods.status == '1'} />
                            <Form.Check inline required type="radio" label="下架" onChange={this.inputChange} value="0" checked={uploadGoods.status == '0'} />
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

export default CreateGoodsComponent;