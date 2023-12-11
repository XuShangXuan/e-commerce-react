import React, { Component } from 'react';
import axios from "axios";

const apiUrl = 'http://192.168.0.18:8085/E-Commerce-SpringBoot/BackEndController/queryGoodsSales';

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

class SalesReportComponent3 extends Component {

    state = {
        startDate: '',
        endDate: '',
        GoodsSalesReportInfo: {
            goodsReportSalesList: goodsReportSalesList,
            genericPageable: genericPageable
        }
    };

    onChangeStartDate = (e) => {

        const pageValue = e.target.value

        const { GoodsSalesReportInfo } = this.state;
        const updatedGenericPageable = { ...GoodsSalesReportInfo.genericPageable };

        //查詢新日期時，一定是查第1頁
        updatedGenericPageable.currentPage = 1;

        this.setState({
            startDate: pageValue,
            GoodsSalesReportInfo: {
                ...GoodsSalesReportInfo,
                genericPageable: updatedGenericPageable
            }
        }, () => {
            console.log('start:', this.state);

            /*
                注意! 這裡的startDate和endDate不能在上面做解構，會造成setState結束卻沒有更新到解構的startDate和endDate，這樣會造成判斷式為false
                因此這裡一定要使用this.state.XXX
            */
            if (this.state.startDate != '' && this.state.endDate != '') {
                this.onClickSearch(1);
            }

        });

    }

    onChangeEndDate = (e) => {

        const pageValue = e.target.value

        const { GoodsSalesReportInfo } = this.state;
        const updatedGenericPageable = { ...GoodsSalesReportInfo.genericPageable };

        //查詢新日期時，一定是查第1頁
        updatedGenericPageable.currentPage = 1;

        this.setState({
            endDate: pageValue,
            GoodsSalesReportInfo: {
                ...GoodsSalesReportInfo,
                genericPageable: updatedGenericPageable
            }
        }, () => {
            console.log('end:', this.state);
            /*
                注意! 這裡的startDate和endDate不能在上面做解構，會造成setState結束卻沒有更新到解構的startDate和endDate，這樣會造成判斷式為false
                因此這裡一定要使用this.state.XXX
            */
            if (this.state.startDate != '' && this.state.endDate != '') {
                this.onClickSearch(1);
            }
        });

    }

    onClickSearch = async (pageValue) => {

        const { startDate, endDate } = this.state

        const params = { "currentPage": pageValue, "showDataCount": 5, "showPageSize": 3, "startDate": startDate, "endDate": endDate };
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
                <h3>Component第三版 沒有查詢按鈕</h3>
                <label>查詢日期起：</label> <input type='date' onChange={this.onChangeStartDate} />
                <label style={{ marginLeft: '20px' }} />
                <label>查詢日期迄：</label> <input type='date' onChange={this.onChangeEndDate} />
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
                {genericPageable.pageRange.length > 0 &&
                    <div>
                        <button onClick={() => this.onClickSearch(1)} disabled={genericPageable.currentPage == 1}>{'<<'}</button>
                        <button onClick={() => this.onClickSearch(genericPageable.currentPage - 1)} disabled={genericPageable.currentPage == 1}>{'<'}</button>
                        {genericPageable.pageRange.map((p, index) => (
                            p == genericPageable.currentPage ? (
                                <button key={index} onClick={() => this.onClickSearch(p)}><u><b>{p}</b></u></button>
                            ) : (
                                <button key={index} onClick={() => this.onClickSearch(p)}>{p}</button>
                            )
                        )
                        )}
                        <button onClick={() => this.onClickSearch(genericPageable.currentPage + 1)} disabled={genericPageable.pageTotalCount == genericPageable.currentPage}>{'>'}</button>
                        <button onClick={() => this.onClickSearch(genericPageable.pageTotalCount)} disabled={genericPageable.pageTotalCount == genericPageable.currentPage}>{'>>'}</button>
                    </div>
                }

            </div>
        );
    }
}

export default SalesReportComponent3;