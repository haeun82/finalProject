import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { getLoginUser, getLoginUserInfo, pushUserInfo, selectUserList } from '../../features/userInfoSlice';
import axios from 'axios';
import logo from '../../image/logo_01.png'

const Test = styled.div`
@import url('https://fonts.googleapis.com/css?family=Raleway:400,700');
*,*:before,*:after{box-sizing:border-box}
body{
  min-height:100vh;
  font-family: 'Raleway', sans-serif;
}
.container{
  position:absolute;
  left: 0;
  right: 0;
  width:100%;
  height:100%;
  max-width: 100%;
  overflow:hidden;
  &:hover,&:active{
    .top, .bottom{
      &:before, &:after{
        margin-left: 200px;
        transform-origin: -200px 50%;
        transition-delay:0s;
      }
    }
    .center{
      opacity:1;
      transition-delay:0.2s;
    }
  }
}
.top, .bottom{
  &:before, &:after{
    content:'';
    display:block;
    position:absolute;
    width:200vmax;
    height:200vmax;
    top:50%;left:50%;
    margin-top:-100vmax;
    transform-origin: 0 50%;
    transition:all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
    z-index:10;
    opacity:0.65;
    transition-delay:0.2s;
  }
}
.top{
  &:before{transform:rotate(45deg);background:#e46569;}
  &:after{transform:rotate(135deg);background:#ecaf81;}
}
.bottom{
  &:before{transform:rotate(-45deg);background:#60b8d4;}
  &:after{transform:rotate(-135deg);background:#3745b5;}
}
.center{
  position:absolute;
  width:400px;
  height:400px;
  top:50%;left:50%;
  margin-left:-200px;
  margin-top:-200px;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding:30px;
  opacity:0;
  transition:all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
  transition-delay:0s;
  color:#333;
  input{
    width:100%;
    padding:15px;
    margin:5px;
    border-radius:1px;
    border:1px solid #ccc;
    font-family:inherit;
  }
  button {
    width: 100px;
    height: 33px;
    margin-top: 10px;
    border: none;
    background: #68a6fe;
    color: #fff;
  }
}
  #logo {
    cursor: pointer;
    margin-bottom: 20px;
  }
`

function Login(props) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const 로그인중 = useSelector(getLoginUser);
  sessionStorage.setItem('userttt', JSON.stringify(로그인중));

  const { state } = useLocation();

  // useEffect(() => {
  //   const userInfo = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:3000/user/login`, { withCredentials: true })
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   userInfo();
  // }, []);

  const changeId = (e) => { setId(e.target.value) }
  const changePw = (e) => { setPw(e.target.value) }

  const handleLogin = async () => {
    try {
      if (!id) {
        alert('아이디를 입력하세요.');
      } else if (!pw) {
        alert('비밀번호를 입력하세요.');
      }
      const result = await axios.post(`http://localhost:3000/user/login`, { userId: id, passwd: pw }, { withCredentials: true });
      console.log(result.data);

      dispatch(getLoginUserInfo(result.data.user));
      // console.log(result.data.user);
      localStorage.setItem('user', JSON.stringify(result.data.user)); // 로그인 상태를 유지하기 위해 로컬 스토리지 사용
      if (await result?.data === '가입되지 않은 회원입니다.') {
        alert('아이디 또는 비밀번호가 틀림');
      } else {
        alert(`환영합니다! ${result.data.user.signUserNicname} 님!`);
        dispatch(getLoginUserInfo(result.data.user));
      }


      if (result.data.user.userId && state) {
        navigate(`${state.from.pathname}`);
      } else {
        navigate('/personaldog');
      }
    } catch (error) {
      console.error(error);
    }
    // } else if (localStorageInfoStr?.signId !== id) {
    //   alert('아이디 또는 비밀번호가 틀림');
    // } else if (localStorageInfoStr?.signPw !== pw) {
    //   alert('비밀번호가 틀림');
    // } else {
    // alert('환영합니다' + localStorageInfoStr.signUserNicname + '님');
    // }
  };



  return (
    <Test>
      <div class="container">
        <div class="top"></div>
        <div class="bottom"></div>
        <div class="center">
          <a onClick={() => navigate('/')}><img src={logo} alt='logo' id='logo' /></a>
          <label htmlFor='id' />
          <input
            id='id'
            name='id'
            type="text"
            placeholder="id"
            value={id}
            onChange={changeId}
          />
          <label htmlFor='pw' />
          <input
            id='pw'
            name='pw'
            type="password"
            placeholder="password"
            value={pw}
            onChange={changePw}
          />
          <button onClick={() => handleLogin()}>로그인</button>
          <button onClick={() => navigate('/signup')}>회원가입</button>
          <h2>&nbsp;</h2>
        </div>
      </div>
    </Test>
  );
}

export default Login;