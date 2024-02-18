import React from 'react';
import nophoto from '../../../image/nophoto.jpg'
import { Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const StyledCol = styled(Col)`
  cursor: pointer;
  margin: 20px 0 30px 0;

  &:hover img {
    transform: scale(1.03);
  }

  .item-box {
    min-height: 116px;
    text-align: center;
    line-height: 24px;

    h2 {
      padding-top: 10px;
      font-size: 16px;
      font-weight: bold;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .author-info {
      padding: 5px 0;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 20px;
        height: 100%;
        margin-right: 5px;
      }
  
      h3 {
        font-weight: bold;
        font-size: 15px;
      }
    }
    
    p {
      font-size: 14px;
      color: #222;
      opacity: 0.6;
    }
  }


`;

const ItemImage = styled.img`
  width: 100%;
  height: 258px;
  border: 1px solid #ccc;
  border-radius: 10px 10px 0 0;
  transition: transform 0.5s;
`;

function DailyDogItem(props) {
  const { item: { _id, id, title, imgUrl, author, view, like } } = props;

  const navigate = useNavigate();

  const handleItemClick = async () => {
    try {
      await axios.patch(`http://localhost:3000/community/daily/view/${_id}`);
      navigate(`/community/dailydog/detail/${id}`)
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <StyledCol md={4} onClick={handleItemClick}>
        {imgUrl[0] 
          ? <ItemImage src={imgUrl[0]} />
          : <ItemImage src={nophoto} /> 
        }
        <div className='item-box'>
          <h2>{title}</h2>
          <div className='author-info'>
            <img src='https://i.namu.wiki/i/Bge3xnYd4kRe_IKbm2uqxlhQJij2SngwNssjpjaOyOqoRhQlNwLrR2ZiK-JWJ2b99RGcSxDaZ2UCI7fiv4IDDQ.webp' />
            <h3>{author}</h3>
          </div>
          <p>조회 {view} &nbsp;좋아요 {like ? like.length : 0}</p>
        </div>
      </StyledCol>
    
    </>
  );
}

export default DailyDogItem;