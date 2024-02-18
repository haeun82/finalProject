import React from 'react';
import styled from 'styled-components';
import Col from 'react-bootstrap/Col';
import testImage from '../../../image/app.jpg'
import { useNavigate } from 'react-router';
import axios from 'axios';

const StyledCol = styled(Col)`
  cursor: pointer;
  text-align: center;
  margin: 20px 0;
  line-height: 24px;

  &:hover img {
    transform: scale(1.03);
  }

  h4 {
    font-size: 14px;
    color: #222;
    opacity: 0.7;
  }

  h2 {
    font-weight: bold;
  }

  h3 {
    font-size: 15px;
  }
`; 

const ItemImage = styled.img`
  width: 100%;
  height: 190px;
  border: 1px solid #ccc;
  border-radius: 10px 10px 0 0;
  transition: transform 0.5s;
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

function FleamarketItem(props) {
  const { item: { _id, id, title, price, category, area, src, imgUrl }, index } = props;

  const navigate = useNavigate();

  const handleItemClick = async () => {
    try {
      await axios.patch(`http://localhost:3000/vintage/view/${_id}`);
      navigate(`/community/fleamarket/${id}`)
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <StyledCol md={3} onClick={handleItemClick}>
      {imgUrl
        ? <ItemImage src={imgUrl[0]} />
        : <ItemImage src={testImage} />
      }
      <h4>{mappings[category]} / {mappings[area]}</h4>
      <h2>{title}</h2>
      <h3>{Number(price).toLocaleString('kr-KR')}원</h3>
    </StyledCol>
  );
}

export default FleamarketItem;