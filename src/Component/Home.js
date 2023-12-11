import React, { useState, useEffect, useRef } from 'react';
import BackEndContext from './BackEnd/BackEndContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import LoginHeader from './Login/LoginHeader';
import FrontEndLoginPage from './Login/FrontEndLoginPage';
import BackEndLoginPage from './Login/BackEndLoginPage';
import ShoppingHome from './FrontEnd/ShoppingHome';
import ShoppingCart from './FrontEnd/ShoppingCart';
import CheckoutComplete from './FrontEnd/CheckoutComplete';
import GoodsListComponent from './BackEnd/GoodsListComponent';
import UpdateGoodsComponent from './BackEnd/UpdateGoodsComponent';
import CreateGoodsComponent from './BackEnd/CreateGoodsComponent';
import SalesReprot from './BackEnd/SalesReprot';


const checkLoginUrl = 'http://localhost:8085/E-Commerce-SpringBoot/MemberController/checkLogin';
const queryCartGoodsApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/MemberController/queryCartGoods';
const clearCartGoodsApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/MemberController/clearCartGoods';
const logoutApiUrl = 'http://localhost:8085/E-Commerce-SpringBoot/MemberController/logout';

const checkManagerLoginUrl = 'http://localhost:8085/E-Commerce-SpringBoot/ManagerController/checkLogin';

const Home = () => {

    const [memberInfo, setMemberInfo] = useState({});

    useEffect(() => {
        callCheckLoginApi();
    }, []);

    const callCheckLoginApi = async () => {

        console.log('Home 檢查使用者登入');

        const loginData = await axios.get(checkLoginUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        setMemberInfo(loginData);

    };

    // 傳給子元件做使用
    const FrontLoginData = { memberInfo, setMemberInfo };

    //----------------------------------------------------------------------------

    // 登出api
    const logout = async () => {

        const logoutData = await axios.get(logoutApiUrl, { withCredentials: true }, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        console.log('Home 使用者登出資訊:', logoutData)

        setMemberInfo(logoutData);

    }

    // 使用者登出
    const clickLogout = async () => {

        console.log('Home 使用者登出中')

        clearShoppingCart();
        logout();

    }

    // 傳給子元件做使用
    const FrontLogoutData = { clickLogout };

    //----------------------------------------------------------------------------

    // 查詢購物車
    const [shoppingCart, setShoppingCart] = useState([]);

    const queryCartGoods = async () => {

        const cartGoods = await axios.get(queryCartGoodsApiUrl, { withCredentials: true }, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        setShoppingCart(cartGoods);

    }

    // 清除購物車
    const clearShoppingCart = async () => {

        const cartGoods = await axios.delete(clearCartGoodsApiUrl, { withCredentials: true }, { timeout: 10000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        setShoppingCart(cartGoods);

    }

    // 傳給子元件做使用
    const shoppingCartInfo = { shoppingCart, setShoppingCart, queryCartGoods, clearShoppingCart }

    //--------------------------------管理者登入--------------------------------

    const [managerInfo, setManagerInfo] = useState({});

    useEffect(() => {
        callCheckMangerLoginApi();
    }, []);

    const callCheckMangerLoginApi = async () => {

        console.log('Home 檢查管理者登入');

        const loginData = await axios.get(checkManagerLoginUrl, { withCredentials: true }, { timeout: 3000 })
            .then(rs => rs.data)
            .catch(error => { console.log(error); });

        setManagerInfo(loginData);

    };

    // 傳給子元件做使用
    const BackEndLoginData = { managerInfo, setManagerInfo };

    return (
        <BrowserRouter>
            {/* 這邊會的元素會在全部的畫面上顯示 */}
            {(!memberInfo.isLogin && !managerInfo.isLogin) && <LoginHeader />}
            <Routes>
                <Route path="/" element={<FrontEndLoginPage FrontLoginData={FrontLoginData} />} />
                <Route path="/FrontEndLoginPage" element={<FrontEndLoginPage FrontLoginData={FrontLoginData} />} />
                <Route path="/ShoppingHome" element={memberInfo.isLogin ? <ShoppingHome FrontLoginData={FrontLoginData} shoppingCartInfo={shoppingCartInfo} FrontLogoutData={FrontLogoutData} /> : <FrontEndLoginPage FrontLoginData={FrontLoginData} />} />
                <Route path="/ShoppingCart" element={memberInfo.isLogin ? <ShoppingCart FrontLoginData={FrontLoginData} shoppingCartInfo={shoppingCartInfo} FrontLogoutData={FrontLogoutData} /> : <FrontEndLoginPage FrontLoginData={FrontLoginData} />} />
                <Route path="/CheckoutComplete" element={memberInfo.isLogin ? <CheckoutComplete FrontLoginData={FrontLoginData} FrontLogoutData={FrontLogoutData} /> : <FrontEndLoginPage FrontLoginData={FrontLoginData} />} />
                <Route path="/BackEndLoginPage" element={<BackEndLoginPage BackEndLoginData={BackEndLoginData} />} />
                <Route path="/GoodsList" element={managerInfo.isLogin ? (
                    <BackEndContext.Provider value={BackEndLoginData}>
                        <GoodsListComponent />
                    </BackEndContext.Provider>
                ) : (
                    <BackEndLoginPage BackEndLoginData={BackEndLoginData} />
                )} />
                <Route path="/UpdateGoods" element={managerInfo.isLogin ? (
                    <BackEndContext.Provider value={BackEndLoginData}>
                        <UpdateGoodsComponent />
                    </BackEndContext.Provider>
                ) : (<BackEndLoginPage BackEndLoginData={BackEndLoginData} />
                )} />
                <Route path="/CreateGoods" element={managerInfo.isLogin ? (
                    <BackEndContext.Provider value={BackEndLoginData}>
                        <CreateGoodsComponent />
                    </BackEndContext.Provider>
                ) : (
                    <BackEndLoginPage BackEndLoginData={BackEndLoginData} />
                )} />
                <Route path="/SalesReport" element={managerInfo.isLogin ? (
                    <BackEndContext.Provider value={BackEndLoginData}>
                        <SalesReprot />
                    </BackEndContext.Provider>
                ) : (
                    <BackEndLoginPage BackEndLoginData={BackEndLoginData} />
                )} />
                <Route path="*" element={<p>404</p>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Home;
