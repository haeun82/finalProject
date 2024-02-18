import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getLoginUser } from '../../../features/userInfoSlice';

const CommunityInsertWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  /* background-color: #ccc; */
  .a {
    background-color: #f0f0f0;
    height: 30px;
  }
  .b {
    display: flex;
    flex-flow: column;
    padding: 30px 10px;
    input, textarea {
      padding: 5px 0 ;
      margin: 10px 0;
    }
    .title-label,
    .content-label {
      display: flex;
      flex-direction: column;
      font-weight: bold;
      color: #68A6FE;
      font-size: 20px;
        .title,
        .content {
        width: 100%;
        outline: none;
        border: none;
        box-sizing: border-box;
        border-bottom: 2px solid transparent;
        transition: 0.3s;
        }
        .content {
          resize: none;
        }
        .title:focus,
        .content:focus {
          border-bottom: 2px solid #68A6FE;
          transition: 0.3s;
        }
      }
    }
    .imgUrl-label {
      display: flex;
      flex-direction: column;
      font-weight: bold;
      font-size: 20px;
        input[type=file]::file-selector-button {
          width: 150px;
          height: 30px;
          background: #fff;
          border: 1px solid rgb(77,77,77);
          border-radius: 10px;
          cursor: pointer;
          transition: 0.3s;
          &:hover {
          background-color: #777;
          color: #fff;
          border: 1px solid #777;
        }
      }
    }
    button.btn {
      /* border: 2px solid #68A6FE; */
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      background-color: #68A6FE;
    }
`;

function CommunityInsert(props) {

  const [insertTitle, setInsertTitle] = useState();
  const [insertContent, setInsertContent] = useState();
  const navigate = useNavigate();

  const { insertPage } = useParams();
  const 로그인중 = useSelector(getLoginUser) // 현재 로그인중 유저 정보

  const changeTitle = (e) => {
    setInsertTitle(e.target.value)
  }
  const changeContent = (e) => {
    setInsertContent(e.target.value)
  }

  const formDataList = async () => {
    try {
      const formData = new FormData();
      formData.append('title', insertTitle);
      formData.append('content', insertContent);
      const img = (document.querySelector('#imgUrl').files[0]);
      formData.append('imgUrl', img);

      // const result = await axios.post(`${process.env.REACT_APP_SERVER_DOMAIN}/community/${insertPage}/insert`, formData, 로그인중);
      const result = await axios.post(`http://localhost:3000/community/${insertPage}/insert`, formData, 로그인중);
      console.log(result.data);
      if (!result.data.flag) {
        return alert(result.data.message);
      }
    } catch (err) {
      console.error(err);
    }
    navigate('/community/Toktok');
  }

  return (
    <CommunityInsertWrapper>
      <label className='b'>
        <label htmlFor='title' className='title-label'>
          제목
          <input
            className='title'
            spellCheck="false"
            type='text'
            id='title'
            name='title'
            value={insertTitle}
            onChange={changeTitle}
            placeholder='제목 입력' />
        </label>

        <label htmlFor='content' className='content-label' >
          내용
          <textarea
            className='content'
            spellCheck="false"
            rows="6"
            type='text'
            id='content'
            name='content'
            value={insertContent}
            onChange={changeContent}
            placeholder='내용 입력' />
        </label>
        <label htmlFor='imgUrl' className='imgUrl-label'>
          사진 첨부
          <input
            className='imgUrl'
            type='file'
            accept='image/*'
            id='imgUrl'
            name='imgUrl'
          />
        </label>
        <button
          className='btn'
          onClick={() => {
            formDataList();
          }}
        >글 등록하기</button>
      </label>
    </CommunityInsertWrapper>
  );
}

export default CommunityInsert;