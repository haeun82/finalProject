import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, Nav } from 'react-bootstrap';
import { clearSelectedProduct, getSelectedProduct, selectSelectedProduct } from '../../features/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import DetailReview from './DetailReview';
import DetailDetail from './DetailDetail';
import DetailQnA from './DetailQnA';
import DetailExchange from './DetailExchange';
import ShopModal from './ShopModal';
import Cart from './Cart';
import { pay } from './Pay';
import { getLoginUser } from '../../features/userInfoSlice';
import { needLogin } from '../../util';
import StarReview from './StarReview';

const ShopContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  .detail {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .detail .detail-img .img{
    border-radius: 10px;
    border: 0.5px solid #cdcdcd;
    width: 400px;
    height: 400px;
  }
  .rate {
    font-size: 20px;
    padding-bottom: 10px;
  }
  .detail .detail-text {
    width: 451px;
  }
  .detail .detail-text p,
  .detail .detail-text h3,
  .detail .detail-text h4 {
    font-weight: bold;
  }
  .detail .detail-text p {
    font-size: 16px;
    color: #cdcdcd;
    margin-bottom: 10px;
  }
  .detail .detail-text h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  .detail .detail-text h4 {
    font-size: 24px;
    color: #666;
    margin-bottom: 30px;
  }
  .detail .detail-text .text1 {
    font-weight: bold; 
  }
  .detail .detail-text .text1::after {
    content: '';
    display: inline-block;
    width: 1px;
    height: 15px;
    background-color: #666;
    margin-left: 10px;
  }

  .detail .detail-text .text2 {
    color: #666;
    margin-left: 40px;
    font-weight: bold; 
  }
  .detail .detail-text .text2 .countBtn {
    width: 20px;
    border-radius: 50%;
    border: none;
    margin: 0 10px;
    font-weight: bold;
    padding-bottom: 2px;
    /* line-height: 1; */
  }
  .detail .totalStar {
    color: #111;
  }
  .detail .detail-btn {
    margin-top: 50px;
  }
  .detail .detail-btn button {
    font-size: 20px;
    width: 47%;
    font-weight: bold;
    background-color: #fff;
    border-radius: 10px;
    padding: 10px 0px;
    border: 2px solid #cdcdcd;
  }
  .detail .detail-btn button + button {
    margin-left: 5%;
  }
  .detail .detail-btn .cart {
    color: #333;
    border: 2px solid #68a6fe;
  }
  .detail .detail-btn .cart:hover {
    background-color: #e6dfdf;
  }

  .detail .detail-btn .buy {
    color: #fff;
    background-color: #68a6fe;
    border: 2px solid #68a6fe;
    
  }
  .detail .detail-btn .buy:hover {
    background-color: #5396f5;
  }
`;

const TabContainer = styled.div`
  width: 90%;
  margin: 80px auto;
`;

const NavBox = styled(Nav)`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const ItemBox = styled(Nav.Item)`
  width: 25%;
  height: 50px;
  text-align: center;
  padding: 14px 0;
  font-size: 20px;

  :hover {
    color: #68a6fe;
  }
`;

const LinkBox = styled(Nav.Link)`
  text-decoration: none;
  color: #000;
`;


function ShopDetail(props) {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ productCount, setProductCount ] = useState(1);
  const [showTab, setShowTab] = useState('detail');
  const [showModal, setShowModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const user = useSelector(getLoginUser);
  const product = useSelector(selectSelectedProduct);

  useEffect(() => {
    // 서버에 특정 상품의 데이터 요청
    const fetchProductById = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/shop/detail/${postId}`, {withCredentials: true});
        dispatch(getSelectedProduct(response.data.itemDetail))
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductById();

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, []);

  const handleMinus = () => {
    if (productCount !== 1) setProductCount(productCount-1);
  };

  const handlePlus = () => {
    setProductCount(productCount+1);
  };

  // 장바구니
  const handleCart = async (title, price) => {
    if (!user) {
      const result = needLogin();
      if (result) navigate('/login');
    }
    try {
      const result = await axios.post(`http://localhost:3000/shop/plusCart`, { title, price, postId, productCount }, {withCredentials:true});
    } catch (err) {
      console.error(err);
    }
    setShowModal(true);
  }

  // 구매하기
  const handlePay = async() => {
    if (!user) {
      const result = needLogin();
      if (result) navigate('/login');
      else return;
    }
    const result = await pay(product, productCount, productCount * product.price);
    console.log('구매결과::', result);
    if (result.event === 'done' || result.event === 'issued') {
      const result = await axios.post(`http://localhost:3000/shop/purchaseAdd`, { postId, price, title, productCount }, {withCredentials: true});
      if (result.data.flag) {
        setShowBuyModal(false);
        alert('결제가 완료되었습니다!');
        // 구매목록으로
        navigate('/purchase');
        }
    }
    else if (result.event == 'cancel') {
      setShowBuyModal(false);
      alert('결제 취소');
    }
  };
    
  const openModal = () => {setShowModal(true)};
  const closeModal = () => {setShowModal(false)};
  const handleBuy = () => {setShowBuyModal(true)};
    
  if (!product) {
    return null; // store에 상품 없을 때 아무것도 렌더링하지 않음
  } 
    
  const { brand, title, price, imgUrl, rate } = product;

  return (
    <ShopContainer>
      <div className='detail'>
        <div className='detail-img'>
          <img className='img' src={imgUrl}/>
        </div>
        <div className='detail-text'>
          <p>{brand}</p>
          {rate ?
          <div className='rate'><StarReview star={rate} />{rate}점</div>
          : <div className='rate'>평점없음</div>}
          <h3>{title}</h3>
          <h4>{price * productCount}원</h4>
          <span className='text1'>수량</span>
          <span className='text2'>
            <button type='button' className='countBtn' onClick={handleMinus}>-</button>
            {productCount}
            <button type='button' className='countBtn' onClick={handlePlus}>+</button>
          </span><br />
          <span className='text1'>배송방법</span>
          <span className='text2'>무료배송</span>
          <div className='detail-btn'>
            <button 
              type='submit' 
              className='cart cursor-pointer'
              onClick={() => {handleCart(title, price)}}
            >장바구니</button>
            <button type='submit' className='buy cursor-pointer'
              onClick={handleBuy}
            >구매하기</button>
          </div>
           
          <Modal show={showBuyModal} onHide={() => setShowBuyModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>알림</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              상품명: {title}<br />
              수량: {productCount}<br />
              금액: {price * productCount}원<br /><br />
              구매하시겠습니까?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowBuyModal(false)}>
                취소
              </Button>
              <Button variant="primary" onClick={() => {handlePay(title)}}>
                확인
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>

      
      <TabContainer>
      <NavBox variant="tabs" defaultActiveKey="link-0" className='my-3'>
        <ItemBox>
          <LinkBox eventKey="link-0" onClick={() => setShowTab('detail')}>상세정보</LinkBox>
        </ItemBox>
        <ItemBox>
          <LinkBox eventKey="link-1" onClick={() => setShowTab('review')}>상품리뷰</LinkBox>
        </ItemBox>
        <ItemBox>
          <LinkBox eventKey="link-2" onClick={() => setShowTab('qa')}>Q&amp;A</LinkBox>
        </ItemBox>
        <ItemBox>
          <LinkBox eventKey="link-3" onClick={() => setShowTab('exchange')}>반품/교환정보</LinkBox>
        </ItemBox>
      </NavBox>
      {
        {
          'detail': <div><DetailDetail product={product} /></div>,
          'review': <div><DetailReview product={product} postId={postId} user={user}/></div>,
          'qa': <div><DetailQnA postId={postId} /></div>,
          'exchange': <div><DetailExchange /></div>
        }[showTab]
      }
      </TabContainer>
      
      {showModal && <ShopModal show={showModal} open={openModal} close={closeModal}/>}
    </ShopContainer>
  );
}

export default ShopDetail;