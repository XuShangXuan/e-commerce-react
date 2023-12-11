import React, { Component } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row'
import BackEndHeader from './BackEndHeader';
import DataCountSelector from '../widgets/DataCountSelector';
import CustomPagination from '../widgets/CustomPagination';

const apiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/BackEndController/queryGoodsSales';

const goodsReportSalesList = [{ orderID: '', orderDate: '', customerID: '', customerName: '', goodsName: '', goodsBuyPrice: '', buyQuantity: '', buyAmount: '' }];
const genericPageable = {
    currentPage: 1,
    pageTotalCount: '',
    startPage: '',
    endPage: '',
    pageRange: [],
    showPageSize: 3,
    showDataCount: 10,
    dataTotalCount: ''
}

class SalesReprot extends Component {
    // 初始化階段不打後端api
    constructor(props) {
        super(props);

        console.log("1.constructor 建構函式(Mounting:掛載)");

        // 取得當天日期
        const date = new Date();

        // 月從0開始是1月，所以要+1
        const month = date.getMonth() + 1;

        const day = date.getDate();

        /*
            type="date"的value格是要為'yyyy-mm-dd'
            因此月跟日如果為單數(小於10)，前面要補0
        */
        const dateMonth = month < 10 ? `0${month}` : month;
        const dateDay = day < 10 ? `0${day}` : day;

        // 組成'yyyy-mm-dd'
        const todayDate = `${date.getFullYear()}-${dateMonth}-${dateDay}`;

        this.state = {
            tempStartDate: todayDate,
            tempEndDate: todayDate,
            startDate: todayDate,
            endDate: todayDate,
            GoodsSalesReportInfo: {
                goodsReportSalesList: goodsReportSalesList,
                genericPageable: genericPageable
            },
            validated: false
        };

    }

    // 掛載階段適合打後端api
    // 使用者進入SalesReport時，預先查好部分資料
    componentDidMount() {
        console.log("3.componentDidMount 組件掛載(Mounting:掛載)");

        // 在掛載階段去預查第1頁
        this.searchSalesReport(1);
    }

    handleSubmit = (e) => {

        e.preventDefault(); // 避免表單送出預設跳頁行為

        // 開啟BootStrap表單驗證
        this.setState({ validated: true })

        // 取得一整個form表單
        const form = e.currentTarget;

        console.log("表單驗證是否開啟:", form.checkValidity());

        if (form.checkValidity()) {
            const { GoodsSalesReportInfo } = this.state;
            const updatedGenericPageable = { ...GoodsSalesReportInfo.genericPageable };

            //查詢新日期時，一定是查第1頁
            updatedGenericPageable.currentPage = 1;

            // 只有按查詢按紐才去更新真正的日期
            this.setState({
                startDate: this.state.tempStartDate,
                endDate: this.state.tempEndDate,
                GoodsSalesReportInfo: {
                    ...GoodsSalesReportInfo,
                    genericPageable: updatedGenericPageable
                }
            });
        }

    };

    /*
        使用暫時的日期有兩個目的:
        1.避免使用者換新日期就馬上打後端api
        2.避免使用者換日期後，不按「查詢」按鈕，而是去按「分頁」按鈕，導致查到新日期的新分頁
          ex:原結束日期為11/01的第一頁，換新日期11/31但不按查詢 而是按第二頁，而查到11/31的第二頁
    */
    onChangeStartDate = (e) => {

        this.setState({
            tempStartDate: e.target.value
        })

    }

    onChangeEndDate = (e) => {

        this.setState({
            tempEndDate: e.target.value
        })

    }

    onChangeDataCount = (e) => {

        const { GoodsSalesReportInfo } = this.state
        const updatedGenericPageable = { ...GoodsSalesReportInfo.genericPageable };

        updatedGenericPageable.showDataCount = e.target.value;
        updatedGenericPageable.currentPage = 1;

        this.setState({
            GoodsSalesReportInfo: {
                ...GoodsSalesReportInfo,
                genericPageable: updatedGenericPageable
            }
        })

    }

    onClickPage = (pageValue) => {

        const { GoodsSalesReportInfo } = this.state;
        const updatedGenericPageable = { ...GoodsSalesReportInfo.genericPageable };

        updatedGenericPageable.currentPage = pageValue;

        this.setState({
            GoodsSalesReportInfo: {
                ...GoodsSalesReportInfo,
                genericPageable: updatedGenericPageable
            }
        })

    }

    searchSalesReport = async (pageValue) => {

        const { startDate, endDate, GoodsSalesReportInfo } = this.state
        const { genericPageable } = GoodsSalesReportInfo;


        const params = {
            "currentPage": pageValue, "showDataCount": genericPageable.showDataCount,
            "showPageSize": genericPageable.showPageSize, "startDate": startDate, "endDate": endDate
        };

        const reportData = await axios.get(apiUrl, { params }, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        this.setState({
            GoodsSalesReportInfo: {
                goodsReportSalesList: reportData.goodsSalesDatas,
                genericPageable: reportData.genericPageable
            }
        }, () => {
            // 在setState的回調函數中執行console.log以確保狀態更新後再輸出
            console.log("打api後State:", this.state);
        });

    };

    // 有任何的setState，setState結束都會先render，再到componentDidUpdate打後端api查詢新data
    componentDidUpdate(prevProps, prevState) {
        console.log("4.componentDidUpdate 組件更新(Updating:更新)");

        const { GoodsSalesReportInfo } = this.state;
        const { genericPageable } = GoodsSalesReportInfo;

        console.log("prevState:", prevState);
        console.log("state:", this.state);

        // 如果查詢的起訖日期沒有變化就不打api，避免造成後端程式負擔
        if (prevState.startDate != this.state.startDate || prevState.endDate != this.state.endDate) {
            this.searchSalesReport(genericPageable.currentPage);
        }

        // 如果查詢的頁碼沒有變化就不打api，避免造成後端程式負擔
        if (prevState.GoodsSalesReportInfo.genericPageable.currentPage != genericPageable.currentPage) {
            this.searchSalesReport(genericPageable.currentPage);
        }

        // 如果查詢的訂單顯示數量沒有變化就不打api，避免造成後端程式負擔
        if (prevState.GoodsSalesReportInfo.genericPageable.showDataCount != genericPageable.showDataCount) {
            this.searchSalesReport(genericPageable.currentPage);
        }

    }

    render() {
        console.log("2.render 渲染函式(Mounting:掛載、Updating:更新)");

        const { startDate, endDate, GoodsSalesReportInfo, validated } = this.state
        const { goodsReportSalesList, genericPageable } = GoodsSalesReportInfo;

        return (
            <div>
                <BackEndHeader />
                <Container>
                    <br />
                    <h2>銷售報表</h2>
                    <br />
                    <Form onSubmit={this.handleSubmit} noValidate validated={validated}>
                        <Form.Row>
                            <Form.Group as={Col} xs={4}>
                                <Form.Label>查詢日期起：</Form.Label>
                                <Form.Control required type="date" defaultValue={startDate} onChange={this.onChangeStartDate} />
                            </Form.Group>
                            <Form.Group as={Col} xs={4}>
                                <Form.Label>查詢日期迄：</Form.Label>
                                <Form.Control required type="date" defaultValue={endDate} onChange={this.onChangeEndDate} />
                            </Form.Group>
                            <Form.Group as={Col} xs={4} className="d-flex align-items-end">
                                <Form.Control type="submit" value="查詢" />
                            </Form.Group>
                        </Form.Row>
                    </Form>
                    <hr />
                    {goodsReportSalesList.length > 0 ? (
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>訂單編號</th>
                                        <th>購買日期</th>
                                        <th>顧客編號</th>
                                        <th>顧客姓名</th>
                                        <th>商品名稱</th>
                                        <th>購買單價</th>
                                        <th>購買數量</th>
                                        <th>購買金額</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {goodsReportSalesList.map(
                                        (sales) => <tr key={sales.orderID}>
                                            <td>{sales.orderID}</td>
                                            <td>{sales.orderDate}</td>
                                            <td>{sales.customerID}</td>
                                            <td>{sales.customerName}</td>
                                            <td>{sales.goodsName}</td>
                                            <td>{sales.goodsBuyPrice}</td>
                                            <td>{sales.buyQuantity}</td>
                                            <td>{sales.buyAmount}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            <Row>
                                <Col xs={8}>{`共${genericPageable.dataTotalCount}件訂單`}</Col>
                                <Col >
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
                        <span>查無訂單</span>
                    )}

                </Container>
            </div>
        );
    }
}

export default SalesReprot;