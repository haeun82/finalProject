import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import testImage from '../../../image/app.jpg'
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { GrNext, GrPrevious } from "react-icons/gr";
import { useNavigate } from 'react-router';
import axios from 'axios';
import { dateFormat } from '../../../util';
import { useSelector } from 'react-redux';
import { getLoginUser } from '../../../features/userInfoSlice';

const FleamarketDetailContainer = styled.div`
  max-width: 1200px;
  min-height: 800px;
  margin: 70px auto;

  .edit-box {
    max-width: 600px;
    margin: 0 auto;
    margin-bottom: 12px;
    display: flex;
    justify-content: flex-end;

    button {
      margin-left: 14px;
      background: none;
      border: none;
      font-size: 15px;
      color: #222;
      opacity: 0.7;
    }
  }

  .slide-box {
    max-width: 600px;
    margin: 0 auto;

    .slick-prev, .slick-next {
      color: #000;
    }

    polyline {
      stroke-width: 3;
    }

    img {
      height: 360px;
      border: 1px solid #ccc;
    }

    .userinfo-box {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid #ccc;

      p {
        /* font-weight: bold; */
        span {
          font-weight: bold;
        }
      }

      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border-radius: 50%;
      }

      .user-box {
        display: flex;
        align-items: center;
      }
      
      .side-box {
        display: flex;
        align-items: center;

        p {
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }

    .iteminfo-box {
      margin-top: 20px;

      p:last-child {
        margin-top: 50px;
      }

      p {
        font-size: 18px;
        margin-bottom: 10px;
        

        span {
          font-weight: bold;
        }
      }

      .iteminfo-content {
        color: #222;
        opacity: 0.8;
        font-size: 15px;
      }

      .content-text {
        margin-bottom: 20px;
        word-break: break-all;
      }
    }

    .btn-box {
      margin-top: 50px;
      display: flex;
      justify-content: flex-end;

      button {
        margin: 10px;
        padding: 6px 12px;
        border: none;
        background: #68a6fe;
        color: #fff;
      }
    }
  }
`;

const mappings = {
  feed: '사료',
  snackNutritional: '간식/영양제',
  bowelHygiene: '배변/위생',
  walkPlay: '산책/놀이',
  seoul: '서울특별시',
  gyeonggi: '경기도',
  incheon: '인천광역시',
  daejeon: '대전광역시',
  daegu: '대구광역시',
  gwangju: '광주광역시',
  busan: '부산광역시',
  gangwon: '강원도',
  ulsan: '울산광역시',
  jeju: '제주특별자치도'
}

function FleamarketDetail(props) {
  const navigate = useNavigate();
  const [ item, setItem ] = useState('');
  const [ edit, setEdit ] = useState({
    content: '',
    state: false  
  });

  const { content, state } = edit;

  const { id } = useParams();
  const user = useSelector(getLoginUser);

  useEffect(() => {
    const fleamarketData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/vintage/detail/${id}`);        
        setItem(response.data.postData);
        setEdit(prev => ({ ...prev, content: response.data.postData.content }));
      } catch (err) {
        console.error(err);
      }
    }
    fleamarketData();
  }, [])

  if (!item) {
    return null;
  } 

  const handleDeleteItem = async () => {

    try {
      await axios.delete(`http://localhost:3000/community/daily/delete/${item.id}`);
      alert('게시글을 삭제하였습니다.');
      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <GrNext />,
    prevArrow: <GrPrevious />,
  };

  // 채팅하기 더미 테스트
  const toChat = 'hosik'
  return (
    <FleamarketDetailContainer>
      {user?.signUserNicname === item.author && 
        <div className='edit-box'>
          <button onClick={() => setEdit(prev => ({ ...prev, state: !state }))}>수정</button>
          <button onClick={handleDeleteItem}>삭제</button>
        </div>
      }
      <div className='slide-box'>
        <Slider {...settings}>
          {item.imgUrl
            ? item.imgUrl.map((srcItem, index) => 
                <div key={index}>
                  <img
                    src={srcItem}
                    style={{ width: '100%' }}
                  />
                </div>
              )
            : 
              <div>
                <img
                src={testImage}
                style={{ width: '100%' }}
                />
              </div>
          }
        </Slider>
        <div className='userinfo-box'>
          <div className='user-box'>
            <img src='https://i.namu.wiki/i/Bge3xnYd4kRe_IKbm2uqxlhQJij2SngwNssjpjaOyOqoRhQlNwLrR2ZiK-JWJ2b99RGcSxDaZ2UCI7fiv4IDDQ.webp'></img>
            <p><span>{item.author}</span></p>
            {/* <p>{item[0].user}</p> */}
          </div>
          <div className='side-box'>
            <p><span>등록일</span> {dateFormat(item.date)}</p>
            <p><span>조회수</span> {item.view}</p>
            <p><span>채팅</span> {item.chat.length}</p>
          </div>
        </div>
        <div className='iteminfo-box'>
          <p className='iteminfo-content'>{mappings[item.category]} / {mappings[item.area]}</p>
          <p><span>{item.title}</span></p>
          <p><span>{Number(item.price).toLocaleString('kr-KR')}원</span></p>
          <p className='content-text'>{item.content}</p>
        </div>
        <div className='btn-box'>
          {user?.signUserNicname === item.author
            ? <button >거래완료</button>
            : <button onClick={() => navigate(`/user/chatting/${item.author}`)}>채팅하기</button>
          }
        </div>
      </div>
    </FleamarketDetailContainer>
  );
}

export default FleamarketDetail;