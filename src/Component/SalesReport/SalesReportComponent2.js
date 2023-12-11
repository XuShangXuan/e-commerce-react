import React, { Component } from 'react';
import axios from "axios";

const apiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/BackEndController/queryGoodsSales';

const goodsReportSalesList = [{ orderID: '', orderDate: '', customerID: '', customerName: '', goodsName: '', goodsBuyPrice: '', buyQuantity: '', buyAmount: '' }];
const genericPageable = {
    currentPage: '',
    pageTotalCount: '',
    startPage: '',
    endPage: '',
    pageRange: [],
    showPageSize: '',
    showDataCount: '',
    dataTotalCount: ''
}

class SalesReportComponent2 extends Component {

    state = {
        startDate: '',
        endDate: '',
        GoodsSalesReportInfo: {
            goodsReportSalesList: goodsReportSalesList,
            genericPageable: genericPageable
        }
    };

    onChangeStartDate = (e) => {
        this.setState({
            startDate: e.target.value,
        })
    }

    onChangeEndDate = (e) => {
        this.setState({
            endDate: e.target.value
        })
    }

    onClickSearch = async (event) => {

        const { startDate, endDate } = this.state

        const params = { "currentPage": event.currentTarget.value, "showDataCount": 5, "showPageSize": 3, "startDate": startDate, "endDate": endDate };
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

    render() {

        const { GoodsSalesReportInfo } = this.state
        const { goodsReportSalesList, genericPageable } = GoodsSalesReportInfo;

        return (
            <div>
                <h3>Component第二版</h3>
                <label>查詢日期起：</label> <input type='date' onChange={this.onChangeStartDate} />
                <label style={{ marginLeft: '20px' }} />
                <label>查詢日期迄：</label> <input type='date' onChange={this.onChangeEndDate} />
                <label style={{ marginLeft: '20px' }} />
                <button value={1} onClick={this.onClickSearch}>查詢</button>
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
                {genericPageable.pageRange.length > 0 &&
                    <div>
                        <button value={1} onClick={this.onClickSearch} disabled={genericPageable.currentPage == 1}>{'<<'}</button>
                        <button value={genericPageable.currentPage - 1} onClick={this.onClickSearch} disabled={genericPageable.currentPage == 1}>{'<'}</button>
                        {genericPageable.pageRange.map((p, index) => (
                            p == genericPageable.currentPage ? (
                                <button key={index} value={p} onClick={this.onClickSearch}><u><b>{p}</b></u></button>
                            ) : (
                                <button key={index} value={p} onClick={this.onClickSearch}>{p}</button>
                            )
                        )
                        )}
                        <button value={genericPageable.currentPage + 1} onClick={this.onClickSearch} disabled={genericPageable.pageTotalCount == genericPageable.currentPage}>{'>'}</button>
                        <button value={genericPageable.pageTotalCount} onClick={this.onClickSearch} disabled={genericPageable.pageTotalCount == genericPageable.currentPage}>{'>>'}</button>
                    </div>
                }

            </div>
        );
    }
}

export default SalesReportComponent2;