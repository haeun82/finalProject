import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { pushUserInfo } from '../../features/userInfoSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../image/logo_01.png'

const SignupWrapper = styled.div`
@import url('https://fonts.googleapis.com/css?family=Raleway:400,700');
*,*:before,*:after{box-sizing:border-box}
body{
  /* min-height:100vh; */
  font-family: 'Raleway', sans-serif;
}
.container{
  position:absolute;
  left: 0;
  right: 0;
  width:100vw;
  height:100vh;
  max-width: 100%;
  overflow:hidden;
  &:hover,&:active{
    .top, .bottom{
      &:before, &:after{ // 내부 공간 설정
        margin-left: 300px;
        transform-origin: -300px 50%;
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
.dogType {
  height: 400px;
  display: flex;
  border-radius:1px;
  border:1px solid #ccc;

  select {
    width:100%;
    height: 50%;
    padding: 0 15px;
    margin:5px;
    border-radius:1px;
    border:1px solid #ccc;
    font-family:inherit;
  }
  input {
    /* border: 1px solid #fff; */
    border: none;
  }
}
  #logo {
    cursor: pointer;
    max-width: 90px;
    margin-bottom: 10px;
  }

`

function Signup(props) {
  const [signId, setSignId] = useState(); // 아이디
  const [signPw, setSignPw] = useState(); // 비번
  const [signEmail, setSignEmail] = useState(); // 비번
  const [signUserNicname, setSignUserNicname] = useState(); // 유저닉네임
  const [signDogType, setSignDogType] = useState(); // 견종
  const [signDogAge, setSignDogAge] = useState(); // 개나이
  const [signDogWeight, setSignDogWeight] = useState(); // 개몸무게
  const [signDogName, setSignDogName] = useState(); // 개이름

  const [errorMessage, setErrorMessage] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const signUserInfoGet = async () => {
      const response = await axios.get(`http://localhost:3000/user/register`);
      console.log(response);
    }
    signUserInfoGet();
  }, []);

  const changeId = (e) => { setSignId(e.target.value) }
  const changePw = (e) => { setSignPw(e.target.value) }
  const changeEmail = (e) => { setSignEmail(e.target.value) }
  const changeNicname = (e) => { setSignUserNicname(e.target.value) }
  const changeDogType = (e) => { setSignDogType(e.target.value) }
  const changeDogAge = (e) => { setSignDogAge(e.target.value) }
  const changeDogWeigth = (e) => { setSignDogWeight(e.target.value); }
  const changeDogName = (e) => { setSignDogName(e.target.value) }
  const userInput = { userId: signId, passwd: signPw, signEmail, signUserNicname, signDogType, signDogAge, signDogWeight, signDogName }

  const handleSignUp = async () => {
    const userIdRegex = /^[a-zA-Z0-9]{4,10}$/;
    const userpasswd = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    try {
      if (!userIdRegex.test(signId)) {
        alert('ID는 4자 이상 10자 이하 알파벳 대소문자, 숫자로만 구성되어야 합니다.');
      } else if (!userpasswd.test(signPw)) {
        alert('특수문자 / 문자 / 숫자 포함 형태의 8~15자리 이내의 암호를 입력해 주세요.');
      } else if (!regExp.test(signEmail)) {
        alert('이메일을 잘못 입력하셨습니다.')
      } else if (!signId) {
        alert('아이디를 입력해 주세요.');
      } else if (!signPw) {
        alert('비밀번호를 입력해 주세요.')
      } else if (!signEmail) {
        alert('email을 입력해 주세요');
      } else if (!signUserNicname) {
        alert('닉네임을 입력해 주세요.');
      } else if (!signDogType) {
        alert('견종 입력');
      } else if (!signDogAge) {
        alert('반려견의의 나이를 입력해 주세요.');
      } else if (!signDogWeight) {
        alert('반려견의 몸무게를 입력해 주세요.');
      } else if (!signDogName) {
        alert('반려견의 이름을 입력해 주세요.');
      } else {
        const response = await axios.post(`http://localhost:3000/user/register`, userInput);
        console.log(response);

        if (await response?.data.message === "존재하는 ID 입니다") {
          alert('존재하는 ID 입니다.');
        } else if (await response?.data.message === "존재하는 이메일 입니다") {
          alert('존재하는 이메일 입니다.');
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  console.log(errorMessage);

  const spacies = [ '말티즈', '푸들', '치와와', '포메라니안',
  '시츄', '스파니엘', '닥스훈트', '보더콜리', '리트리버', '비글', 
  '진돗개', '웰시코기', '도베르만', '불독', '사모예드', '시바견',
  '퍼그', '셰퍼드', '달마시안'];
  return (
    <SignupWrapper>
      <div class="container" onclick="onclick">
        <div class="top"></div>
        <div class="bottom"></div>
        <div class="center">
          <a onClick={() => navigate('/')}><img src={logo} alt='logo' id='logo' /></a>
          <h2>회원가입 페이지 입니다</h2>
          <label htmlFor='id' /> {/* 아이디 */}
          <input
            id='id'
            type="text"
            placeholder="id"
            value={signId}
            onChange={changeId}
          />
          <label htmlFor='pw' /> {/* 비밀번호 */}
          <input
            id='pw'
            type="password"
            placeholder="password"
            value={signPw}
            onChange={changePw}
          />
          <label htmlFor='email' /> {/* 비밀번호 */}
          <input
            id='email'
            type="email"
            placeholder="email"
            value={signEmail}
            onChange={changeEmail}
          />
          <label htmlFor='userNicname' /> {/* 닉네임 */}
          <input
            id='userNicname'
            type="text"
            placeholder="Nicname"
            value={signUserNicname}
            onChange={changeNicname}
          />
          <div className='dogType'>
            <label htmlFor='signDogType' /> {/* 견종 */}
            <input
              id='signDogType'
              type="text"
              placeholder="DogType"
              readOnly
              value={signDogType}
              onChange={changeDogType}
            />
            <select
              id='signDogType'
              value={signDogType}
              onChange={changeDogType}
            >
              {
                spacies.map((a, index) => {
                  return (<option key={index}>{a}</option>)
                })
              }
            </select>
          </div>
          <label htmlFor='signDogAge' /> {/* 개나이 */}
          <input
            id='signDogAge'
            type="number"
            min={0}
            placeholder="DogAge"
            value={signDogAge}
            onChange={changeDogAge}
          />
          <label htmlFor='signDogWeight' /> {/* 개무게 */}
          <input
            id='signDogWeight'
            type="number"
            min={0}
            placeholder="DogWeight"
            value={signDogWeight}
            onChange={changeDogWeigth}
          />
          <label htmlFor='signDogName' /> {/* 개이름 */}
          <input
            id='signDogName'
            type="text"
            placeholder="DogName"
            value={signDogName}
            onChange={changeDogName}
          />
          <button onClick={handleSignUp}>회원가입</button>
          <h2>&nbsp;</h2>
        </div>
      </div>
    </SignupWrapper>
  );
}

export default Signup;