import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import ScrollToTop from "./components/ScrollToTop";
import { clearLoginUserInfo, getLoginUserInfo } from './features/userInfoSlice';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));

// * thunk 이용해서 비동기 처리 수정 필요
// const loginUserInfo = async () => {
//   const user = localStorage.getItem('user');
//   if (!user) return;

//   store.dispatch(getLoginUserInfo(JSON.parse(user)));

//   // const result = await axios.get(`https://port-0-finalprojectserver-1efqtf2dlrehr9d7.sel5.cloudtype.app/user/login`, {withCredentials: true});
//   // const result = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/user/login`, { withCredentials: true });
//   const result = await axios.get(`http://localhost:3000/user/login`, { withCredentials: true });
//   if (!result.data.flag) {
//     store.dispatch(clearLoginUserInfo());
//     localStorage.removeItem('user');
//   }
// }
// loginUserInfo();

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
