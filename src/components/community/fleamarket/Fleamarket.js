import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import FleamarketItem from './FleamarketItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GrRefresh } from "react-icons/gr";

const FleamarketContainer = styled.div`
  max-width: 1200px;
  min-height: 800px;
  margin: 70px auto;
  padding: 0 20px;


  h1 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  button {
    padding: 6px 8px;
    border: none;
    background: #68a6fe;
    color: #fff;
  }
  
  .reset-btn {
    margin-left: 6px;
    border-radius: 20px;
  }

  .info {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
      .post-btn {
        border: none;
        padding: 10px 15px;
        border-radius: 10px;
        background-color: #68A6FE;
        color: #fff;
        font-weight: bold;
        transition: 0.3s;
      }
      .post-btn:hover {
        background-color: #3286fc;
      }
  }

  .category-box {
    margin-top: 20px;
    padding: 0 12px;

    select {
      cursor: pointer;
      margin: 0 6px;
      border: none;
      color: #222;
      font-weight: bold;
      font-size: 15px;
      opacity: 0.7;
      outline: none;

      &:focus, &:active {
        border-color: #4CAF50; 
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.7);
      }

      option {
        font-size: 14px;
      }
    }
  }
`;

const FleamarketItemContainer = styled(Container)`
  margin-top: 20px;
`;

function Fleamarket(props) {
  const navigate = useNavigate();
  const [ data, setData ] = useState([]);
  const [ select, setSelect ] = useState({
    dogType: '',
    category: '',
    area: '',
    price: '',
    view: ''
  });

  const { dogType, category, area, price, view } = select;

  // canva
  useEffect(() => {
    const fleamarketData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/vintage`, { params: { select } });
        setData(response.data.posts);
      } catch (err) {
        console.error(err);
      }
    }
    fleamarketData();
  }, [dogType, category, area, price, view ])

  const onSelectChange = (e) => {
    const { name, value } = e.target;

    setSelect(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectReset = () => {
    const resetSelect = Object.fromEntries(Object.keys(select).map(key => [key, '']))
    setSelect(resetSelect);
  }

  return (
    <FleamarketContainer>
      <h1>중고거래</h1>
      <div className='info'>
        <p>반려견의 물품을 거래해요!</p>
        <button className='post-btn' onClick={() => navigate('/community/fleamarket/write')}>판매하기</button>
      </div>
      <div className='category-box'>
        <select value={dogType} name='dogType' onChange={onSelectChange}>
          <option value=''>견종</option>
          <option value='허스키'>허스키</option>
          <option value='푸들'>푸들</option>
          <option value='리트리버'>리트리버</option>
          <option value='포메라니안'>포메라니안</option>
          <option value='스피츠'>스피츠</option>
        </select>
        <select value={category} name='category' onChange={onSelectChange}>
          <option value=''>카테고리</option>
          <option value='feed'>사료</option>
          <option value='snackNutritional'>간식/영양제</option>
          <option value='bowelHygiene'>배변/위생</option>
          <option value='walkPlay'>산책/놀이</option>
        </select>
        <select value={area} name='area' onChange={onSelectChange}>
          <option value=''>지역</option>
          <option value='seoul'>서울</option>
          <option value='gyeonggi'>경기</option>
          <option value='incheon'>인천</option>
          <option value='daejeon'>대전</option>
          <option value='daegu'>대구</option>
          <option value='gwangju'>광주</option>
          <option value='busan'>부산</option>
          <option value='gangwon'>강원</option>
          <option value='ulsan'>울산</option>
          <option value='jeju'>제주</option>
        </select>
        <select value={price} name='price' onChange={onSelectChange}>
          <option value=''>가격</option>
          <option value='min'>낮은순</option>
          <option value='max'>높은순</option>
        </select>
        <select value={view} name='view' onChange={onSelectChange}>
          <option value=''>조회</option>
          <option value='min'>낮은순</option>
          <option value='max'>높은순</option>
        </select>
        <button className='reset-btn' onClick={handleSelectReset}><GrRefresh /></button>
      </div>
      <FleamarketItemContainer>
        <Row>
          {data && data.map((item, index) => <FleamarketItem key={index} item={item} id={index} />)}
        </Row>
      </FleamarketItemContainer>
    </FleamarketContainer>

  );
}

export default Fleamarket;