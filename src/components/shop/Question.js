import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const QuestionContainer = styled.div`
  max-width: 1200px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    margin: 20px 0;
    color: blue;
    font-weight: bold;
    font-size: 40px;
  }
  input {
    display: block;
    width: 70%;
    padding: 10px;
    height: 2.5rem;
    margin-bottom: 20px;
    border: 1px solid #bbb;
    border-radius: 8px;
  }

  textarea {
    width: 70%;
    padding: 10px;
    resize: none;
    height: 15rem;
    font-size: 16px;
    margin-bottom: 20px;
    border: 1px solid #bbb;
    border-radius: 8px;
  }

  button {
    width: 70%;
    height: 2.4rem;
    font-size: 16px;
    background-color: #68a6fe;
    border: 1px solid #bbb;
    border-radius: 8px;
    font-weight: bold;
    color: white;
  }
  p {
    color: #999;
    font-size: 14px;
    margin-bottom: 10px;
  }
  button:hover {
    background-color: #5396f5;
  }
`;


function Question(props) {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [ title, setTitle ] = useState('');
  const [ content, setContent ] = useState('');

  const date = new Date();
  
  const handleSubmit = async (e) => {
    try {
      if (!title) {
        alert('제목을 입력해주세요');
      }
      if (!content) {
        alert('내용을 입력해주세요');
      }
      const result = await axios.post(`http://localhost:3000/shop/qna/${postId}`, { title, content, date }, {withCredentials: true});
      if (result.data) alert('문의가 등록되었습니다!');
      navigate(`/shop/detail/${postId}`);
    } catch (err) {
      console.error(err);
    }
    setTitle('');
    setContent('');
  };

  return (
    <QuestionContainer>
      <h1>문의하기</h1>

      <input className='title' type='text' placeholder='제목을 입력하세요' value={title}
      onChange={(e) => {setTitle(e.target.value)}} />

      <textarea className='content' placeholder='내용을 입력하세요' value={content}
      onChange={(e) => {setContent(e.target.value)}} />

      <p>주민번호, 전화번호, 이메일 등 개인정보를 남기면 타인에 의해 도용될 수 있습니다.
      개인정보는 상품문의에 남기지 말아주세요.</p>
      <button type='button' onClick={handleSubmit} className='cursor-pointer'>문의 등록하기</button>

    </QuestionContainer>
  );
}

export default Question;