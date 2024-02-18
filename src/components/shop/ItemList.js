import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { addMoreProducts, getProducts, selectProductList, selectSelectedCategory } from '../../features/productSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RiArrowDropDownLine } from "react-icons/ri";

const ItemContainer = styled.section`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .sortBox{
    display: flex;
    justify-content: space-between;
    position: relative;
    .productCount {
      font-size: 18px;
      font-weight: bold;
    }
    .sortBtn{
      display: flex;
      line-height: 30px;
      cursor: pointer;
      .icon {
        font-size: 30px;
      }
    }
    .sortmenu {
      position: absolute;
      right: 0px;
      top: 30px;
      li {
        padding: 5px;
        background-color: #fff;
        border: 1px solid #111;
        cursor: pointer;
      }
      li:hover {
        color: blue;
        font-weight: bold;
      }
      li + li {
        border-top: none;
      }
    }
  }
  h2 {
    font-size: 40px;
    font-weight: bold;
    margin: 10px 0 20px;
  }
  #itemlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
  }
  #itemlist > div {
    width: 250px;
    height: 320px;
    margin: 10px 25px;
  }
  #itemlist > div .list {
    width: 100%;
  }
  #itemlist > div .list .itemImage {
    width: 225px;
    height: 225px;
    border-radius: 10px;
    overflow: hidden;
  }
  #itemlist > div p {
    color: #ababab;
    padding: 3px 0;
  }
  #itemlist > div span {
    font-size: 18px;
  }
  #itemlist > div p.price {
    font-size: 18px;
    font-weight: bold;
    color: #3d3d3d;
    padding-top: 8px;
  } 
  button {
    display: block;
    width: 20rem;
    height: 2.5rem;
    background-color: #68a6fe;
    border: none;
    border-radius: 0.7rem;
    font-weight: bold;
    font-size: 20px;
    color: white;
    margin: 20px 0;
    padding: 5px 0;
  }
`;

const useDetectClose = (ref, initialState) => {
  const [isOpen, setIsOpen] = useState(initialState);

  useEffect(() => {
    const pageClickEvent = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(!isOpen);
      }
    };

    if (!isOpen) {
      window.addEventListener('click', pageClickEvent);
    }

    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  }, [isOpen, ref]);
  return [isOpen, setIsOpen];
}

function ItemList(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productList = useSelector(selectProductList);
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortRef = useRef();
  const [ isOpen, setIsOpen ] = useDetectClose(sortRef, true);
  const [ moreBtn, setMoreBtn ] = useState(true);

  useEffect(() => {
    try {
      const getList = async () => {
        const result =  await axios.get(`http://localhost:3000/shop/`, {withCredentials: true});
        dispatch(getProducts(result.data.posts));
      }
      getList();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSort = async (e) => {
    const text = document.querySelector('.text');
    let array = [...productList];
    switch (e.target.textContent) {
      // array 대신 productList 넣기
      case '가격 높은 순':
        array.sort(function (a, b) {
          return Number(a.price) > Number(b.price) ? -1 : Number(a.price) < Number(b.price) ? 1 : 0;
        })
        dispatch(getProducts(array));
        text.textContent = '가격 높은 순';
        break;
      case '추천 순':
        array.sort(function (a, b) {
          return Number(a.rate) > Number(b.rate) ? -1 : Number(a.rate) < Number(b.rate) ? 1 : 0;
        })
        dispatch(getProducts(array));
        text.textContent = '추천 순';
        break;
      case '가격 낮은 순':
        array.sort(function (a, b) {
          return Number(a.price) < Number(b.price) ? -1 : Number(a.price) > Number(b.price) ? 1 : 0;
        })
        dispatch(getProducts(array));
        text.textContent = '가격 낮은 순';
        break;
    }
  }

  const handleMore = async () => {
    console.log(selectedCategory);
    if (!selectedCategory) {
      const result = await axios.get(`http://localhost:3000/shop/?nextId=${productList[productList.length - 1]._id}`);
      dispatch(addMoreProducts(result.data.posts));
    } else {
      const result = await axios.get(`http://localhost:3000/shop/category/${selectedCategory}?nextId=${productList[productList.length - 1]._id}`);
      dispatch(addMoreProducts(result.data.posts));
    }
  };

  return (
    <ItemContainer>
      <Container>
        <div className='sortBox'>
          <div className='productCount'>총 {productList.length}개 상품</div>
          <div ref={sortRef} className='sortBtn' onClick={() => setIsOpen(!isOpen)}>
            <div className='text'>추천 순</div>
            <RiArrowDropDownLine className='icon'/>
          </div>
          {!isOpen && 
            <ul className='sortmenu'>
              <li onClick={handleSort}>추천 순</li>
              <li onClick={handleSort}>가격 낮은 순</li>
              <li onClick={handleSort}>가격 높은 순</li>
            </ul>
          }
        </div>
        <Row id='itemlist'>
          {productList.map((item, index) => {
            return (
              <div key={index} className='cursor-pointer'>
                <Col md={4} className='list' onClick={() => {
                  navigate(`/shop/detail/${item._id}`)
                }}>
                  <img src={item.imgUrl} className='itemImage' />
                  <p>{item.brand}</p>
                  <span>{item.title}</span>
                  <p className='price'>{item.price}원</p>
                </Col>
              </div>
            )
          })}
        </Row>
      </Container>
      {moreBtn && <button className='moreBtn cursor-pointer' onClick={handleMore}>더보기</button>}
    </ItemContainer>
  );
}

export default ItemList;