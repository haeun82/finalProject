import React from 'react';
import axios from 'axios';

// 카테고리 이미지 import
import myPet from "../../image/mypet.png";
import all from "../../image/all.png";
import feed from "../../image/feed.png";
import accessory from "../../image/accessory.png";
import snack from "../../image/snack.png";
import beauty from "../../image/beauty.png";
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { getProducts, getSelectedCategory, selectProductList } from '../../features/productSlice';

const StyledCategory = styled.ul`
  display: flex;
  justify-content: space-evenly;
  padding: 100px 0;
  margin: 0 60px ;
  li + li {
    margin-left: 10px;
  };
   img.cate-st {
    /* background-color: #f7f7f7; */
    background-repeat: no-repeat;
    background-position: center;
    background-size: 60px 60px;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    /* border: 1px solid #000; */
  }

  li img.cate-1  {
    background-image: url(${myPet});
  }
  li img.cate-2 {
    background-image: url(${all});
  }
  li img.cate-3 {
    background-image: url(${feed});
  }
  li img.cate-4 {
    background-image: url(${snack});
  }
  li img.cate-5 {
    background-image: url(${accessory});
  }
  li img.cate-6 {
    background-image: url(${beauty});
  }
  li p {
    text-align: center;
    padding: 5px 0;
    font-weight: bold;
    color: #555;
  }
`;


function ShopCategory(props) {
  const dispatch = useDispatch();

  // 카테고리 별 페이지 요청 할 axios
  const axiosAll = async () => {
    dispatch(getSelectedCategory(''));
    const result = await axios.get(`http://localhost:3000/shop/`);
    dispatch(getProducts(result.data.posts));
  };
  const axiosFeed = async () => {
    dispatch(getSelectedCategory('feed'));
    const result = await axios.get(`http://localhost:3000/shop/category/feed`);
    dispatch(getProducts(result.data.posts));
  };
  const axiosSnack = async () => {
    dispatch(getSelectedCategory('snack'));
    const result = await axios.get(`http://localhost:3000/shop/category/snack`);
    dispatch(getProducts(result.data.posts));
  };
  const axiosPlay = async () => {
    dispatch(getSelectedCategory('play'));
    const result = await axios.get(`http://localhost:3000/shop/category/play`);
    dispatch(getProducts(result.data.posts));
  };
  const axiosHygiene = async () => {
    dispatch(getSelectedCategory('hygiene'));
    const result = await axios.get(`http://localhost:3000/shop/category/hygiene`);
    dispatch(getProducts(result.data.posts));
  };
  
  return (
    <StyledCategory>
      <li onClick={axiosAll}>
        <img className='cate-2 cate-st cursor-pointer'/>
        <p>전체상품</p>
      </li>
      <li onClick={axiosFeed}>
        <img className='cate-3 cate-st cursor-pointer'/>
        <p>사료</p>
      </li>
      <li onClick={axiosSnack}>
        <img className='cate-4 cate-st cursor-pointer'/>
        <p>간식/영양제</p>
      </li>
      <li onClick={axiosPlay}>
        <img className='cate-5 cate-st cursor-pointer'/>
        <p>산책/놀이</p>
      </li>
      <li onClick={axiosHygiene}>
        <img className='cate-6 cate-st cursor-pointer'/>
        <p>배변/위생</p>
      </li>
    </StyledCategory>
  );
}

export default ShopCategory;