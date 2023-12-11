import React, { Component } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row'
import BackEndHeader from './BackEndHeader';
import DataCountSelector from '../widgets/DataCountSelector';
import CustomPagination from '../widgets/CustomPagination';

const apiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/BackEndController/queryGoodsData';

/*
    使用暫時的過濾條件的目的:
    避免使用者輸入條件後，不按「查詢」按鈕，而是去按「分頁」按鈕，導致查到新條件的新分頁
    ex:原結是'ca'關鍵字的第一頁，改成'java'關鍵字但不按查詢 而是按第二頁，而查到'java'的第二頁
*/
const defTempFilter = {
    goodsID: '',
    goodsNameKeyword: '',
    minPrice: '',
    maxPrice: '',
    priceSort: '',
    stock: '',
    status: ''
}

const defFilter = {
    goodsID: '',
    goodsNameKeyword: '',
    minPrice: '',
    maxPrice: '',
    priceSort: '',
    stock: '',
    status: ''
}

const defGoodsDatas = [
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
    showPageSize: 3,
    showDataCount: 5,
    dataTotalCount: ''
}

class GoodsListComponent extends Component {

    state = {
        tempFilter: defTempFilter,
        filter: defFilter,
        goodsDatas: defGoodsDatas,
        genericPageable: defGenericPageable,
        validated: false
    };

    // 掛載階段適合打後端api
    // 使用者進入GoodsList時，預先查好部分資料
    componentDidMount() {

        console.log("3.componentDidMount 組件掛載(Mounting:掛載)");

        // 在掛載階段去預查第1頁
        this.callAPI();

    }

    callAPI = async () => {

        const { filter, genericPageable } = this.state

        const params = {
            ...filter, "currentPage": genericPageable.currentPage,
            "showDataCount": genericPageable.showDataCount, "showPageSize": genericPageable.showPageSize
        };

        const GoodsDataInfo = await axios.get(apiUrl, { params }, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        this.setState({
            goodsDatas: GoodsDataInfo.goodsDatas,
            genericPageable: GoodsDataInfo.genericPageable
        }, () => {
            // 在setState的回調函數中執行console.log以確保狀態更新後再輸出
            console.log("打api後State:", this.state);
        });

    };

    // 輸入框改變時的事件處理
    inputChange = (e) => {

        // 取得id是為了取使用者輸入的是哪一個輸入框
        const { id, value } = e.target;

        console.log('inputID:', id);
        console.log('inputValue:', value);

        this.setState(state => ({
            // 更新該輸入框對應的tempFilter的欄位，並保留其他值
            tempFilter: { ...state.tempFilter, [id]: value }
        }), () => {
            console.log('tempFilter:', this.state.tempFilter);
        });

    }

    // 清空所有選項
    onClickClear = () => {
        this.setState({
            tempFilter: {
                goodsID: '',
                goodsNameKeyword: '',
                minPrice: '',
                maxPrice: '',
                priceSort: '',
                stock: '',
                status: ''
            }
        });
    }

    onClickSearch = () => {

        // 只有點擊查詢按鈕時才將查詢條件送入AIP，並且一定查第一頁
        this.setState({
            filter: this.state.tempFilter,
            genericPageable: { ...this.state.genericPageable, currentPage: 1 },
            validated: true
        }, () => {
            //setState為異步操作，必須要使用callback才能正確更新到欄位值
            this.callAPI();
        })

    }

    onChangeDataCount = (e) => {

        this.setState({
            genericPageable: { ...defGenericPageable, showDataCount: parseInt(e.target.value) }
        }, () => {
            //setState為異步操作，必須要使用callback才能正確更新到欄位值
            this.callAPI();
        })

    }

    onClickPage = (pageValue) => {

        const { genericPageable } = this.state;

        genericPageable.currentPage = pageValue;

        this.setState({
            genericPageable: genericPageable
        }, () => {
            //setState為異步操作，必須要使用callback才能正確更新到欄位值
            this.callAPI();
        })
    }

    render() {

        const { tempFilter, goodsDatas, genericPageable } = this.state

        return (
            <div>
                <BackEndHeader />
                <Container>
                    <br />
                    <h2>商品列表</h2>
                    <br />
                    <Form noValidate validated={false}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="goodsID">
                                <Form.Label>商品編號</Form.Label>
                                <Form.Control type="number" min="1" placeholder="Enter number" value={tempFilter.goodsID} onChange={this.inputChange} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="goodsNameKeyword">
                                <Form.Label>商品名稱</Form.Label>
                                <Form.Control type="text" placeholder="Enter text" value={tempFilter.goodsNameKeyword} onChange={this.inputChange} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="minPrice">
                                <Form.Label>商品名價格最低價</Form.Label>
                                <Form.Control type="number" min="0" placeholder="Enter goods price start" value={tempFilter.minPrice} onChange={this.inputChange} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="maxPrice">
                                <Form.Label>商品名價格最高價</Form.Label>
                                <Form.Control type="number" min="0" placeholder="Enter goods price end" value={tempFilter.maxPrice} onChange={this.inputChange} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="priceSort">
                                <Form.Label>價格排序</Form.Label>
                                <Form.Control as="select" value={tempFilter.priceSort} onChange={this.inputChange}>
                                    <option value={''}>無</option>
                                    <option value={'ASC'}>由低到高</option>
                                    <option value={'DESC'}>由高到低</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="stock">
                                <Form.Label>商品低於庫存量</Form.Label>
                                <Form.Control type="number" min="0" placeholder="Enter goods stock quantity" value={tempFilter.stock} onChange={this.inputChange} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="status">
                                <Form.Label>商品狀態</Form.Label>
                                <Form.Control as="select" value={tempFilter.status} onChange={this.inputChange}>
                                    <option value={''}>ALL</option>
                                    <option value={'1'}>上架</option>
                                    <option value={'0'}>下架</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} className="d-flex align-items-end">
                                <Button variant="outline-secondary" className="w-100" onClick={this.onClickSearch}>查詢</Button>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} className="d-flex align-items-end">
                                <Button variant="outline-danger" onClick={this.onClickClear}>清空所有選項</Button>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                    <br />
                    {goodsDatas.length > 0 ? (
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>商品編號</th>
                                        <th>商品名稱</th>
                                        <th>商品價格</th>
                                        <th>現有庫存</th>
                                        <th>商品狀態</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.goodsDatas.map(
                                        (goods) =>
                                            <tr key={goods.goodsID}>
                                                <td>{goods.goodsID}</td>
                                                <td>{goods.goodsName}</td>
                                                <td>{goods.price}</td>
                                                <td>{goods.quantity}</td>
                                                {goods.status == 1 ?
                                                    <td className="text-primary">上架</td> : <td className="text-danger">下架</td>
                                                }
                                            </tr>
                                    )}
                                </tbody>
                            </Table>
                            <Row>
                                <Col xs={8}>{`共${genericPageable.dataTotalCount}件商品`}</Col>
                                <Col>
                                    <div className="d-flex justify-content-end">
                                        <DataCountSelector
                                            defaultValue={genericPageable.showDataCount}
                                            onChangeDataCount={this.onChangeDataCount}
                                        />
                                        &nbsp;&nbsp;&nbsp;
                                        <CustomPagination genericPageable={genericPageable} onClickPage={this.onClickPage} />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        <span>查無商品</span>
                    )}
                </Container>
            </div>
        );
    }
}

export default GoodsListComponent;