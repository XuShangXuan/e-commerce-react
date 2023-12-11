import React, { Component } from 'react';
import axios from "axios";

const apiUrl = 'http://192.168.0.18:8085/E-Commerce-SpringBoot/BackEndController/queryGoodsSales';

const goodsReportSalesList = [{ orderID: '', orderDate: '', customerID: '', customerName: '', goodsName: '', goodsBuyPrice: '', buyQuantity: '', buyAmount: '' }];
const genericPageable = {
    currentPage: 1,
    pageTotalCount: '',
    startPage: '',
    endPage: '',
    pageRange: [],
    showPageSize: '',
    showDataCount: '',
    dataTotalCount: ''
}

class SalesReportLifecycle extends Component {

    // 初始化階段不打後端api
    constructor(props) {
        super(props);

        console.log("1.constructor 建構函式(Mounting:掛載)");

        this.state = {
            startDate: '2023-11-04',
            endDate: '2023-11-04',
            GoodsSalesReportInfo: {
                goodsReportSalesList: goodsReportSalesList,
                genericPageable: genericPageable
            }
        };

    }

    // 掛載階段適合打後端api
    // 使用者進入SalesReport時，預先查好部分資料
    componentDidMount() {
        console.log("3.componentDidMount 組件掛載(Mounting:掛載)");

        // 在掛載階段去預查第1頁
        this.searchSalesReport(1);
    }

    // 使用者一點選新日期就打後端api
    onChangeStartDate = (e) => {

        const { GoodsSalesReportInfo } = this.state;
        const updatedGenericPageable = { ...GoodsSalesReportInfo.genericPageable };

        // 更換日期後一律查第一頁
        updatedGenericPageable.currentPage = 1;

        this.setState({
            startDate: e.target.value,
            GoodsSalesReportInfo: {
                ...GoodsSalesReportInfo,
                genericPageable: updatedGenericPageable
            }
        })
    }

    onChangeEndDate = (e) => {

        const { GoodsSalesReportInfo } = this.state;
        const updatedGenericPageable = { ...GoodsSalesReportInfo.genericPageable };

        // 更換日期後一律查第一頁
        updatedGenericPageable.currentPage = 1;

        this.setState({
            endDate: e.target.value,
            GoodsSalesReportInfo: {
                ...GoodsSalesReportInfo,
                genericPageable: updatedGenericPageable
            }
        })
    }

    onClickPage = (e) => {

        const pageValue = e.currentTarget.value;

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

    searchSalesReport = async (currentPage) => {

        const { startDate, endDate } = this.state

        const params = { "currentPage":currentPage, "showDataCount": 5, "showPageSize": 3, "startDate": startDate, "endDate": endDate };
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

        console.log("prevState:", prevState);
        console.log("state:", this.state);

        // 如果查詢的起訖日期沒有變化，或是頁碼沒有變化就不打api，避免造成後端程式負擔
        if ((prevState.startDate !== this.state.startDate || prevState.endDate !== this.state.endDate) || 
        prevState.GoodsSalesReportInfo.genericPageable.currentPage !== this.state.GoodsSalesReportInfo.genericPageable.currentPage) {
            this.searchSalesReport(this.state.GoodsSalesReportInfo.genericPageable.currentPage);
        }

    }

    render() {
        console.log("2.render 渲染函式(Mounting:掛載、Updating:更新)");

        const { startDate, endDate, GoodsSalesReportInfo } = this.state
        const { goodsReportSalesList, genericPageable } = GoodsSalesReportInfo;

        return (
            <div>
                <h3>生命週期第一版 沒有查詢按鈕</h3>
                <label>查詢日期起：</label> <input type='date' defaultValue={startDate} onChange={this.onChangeStartDate} />
                <label style={{ marginLeft: '20px' }} />
                <label>查詢日期迄：</label> <input type='date' defaultValue={endDate} onChange={this.onChangeEndDate} />
                <label style={{ marginLeft: '20px' }} />
                <hr />

                <table border={'2'}>
                    <thead>
                        <tr>
                            <th>訂單編號</th>
                            <th>購買日期</th>
                            <th>顧客姓名</th>
                            <th>顧客編號</th>
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
                </table>
                <hr />
                {goodsReportSalesList.length > 0 &&
                    <div>
                        <button value={1} onClick={this.onClickPage} disabled={genericPageable.currentPage == 1}>{'<<'}</button>
                        <button value={genericPageable.currentPage - 1} onClick={this.onClickPage} disabled={genericPageable.currentPage == 1}>{'<'}</button>
                        {genericPageable.pageRange.map((p, index) => (
                            p == genericPageable.currentPage ? (
                                <button key={index} value={p} onClick={this.onClickPage}><u><b>{p}</b></u></button>
                            ) : (
                                <button key={index} value={p} onClick={this.onClickPage}>{p}</button>
                            )
                        )
                        )}
                        <button value={genericPageable.currentPage + 1} onClick={this.onClickPage} disabled={genericPageable.pageTotalCount == genericPageable.currentPage}>{'>'}</button>
                        <button value={genericPageable.pageTotalCount} onClick={this.onClickPage} disabled={genericPageable.pageTotalCount == genericPageable.currentPage}>{'>>'}</button>
                    </div>
                }

            </div>
        );
    }

}

export default SalesReportLifecycle;