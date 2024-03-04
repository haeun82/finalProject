import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import nophoto from '../../../image/nophoto.jpg'
import { useNavigate } from 'react-router-dom';

const BestPostContainer = styled.div`
  margin-top: 20px;

  img {
    cursor: pointer;
    width: 100%;
    min-height: 220px;
    max-height: 220px;
    border: 1px solid #ccc;
    border-radius: 10px 10px 0 0;
  }

  h3 {
    padding-top: 5px;
    margin: 0 auto;
    width: 80%;
    height: 24px;
    text-align: center;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  h4 {
    padding-top: 5px;
    text-align: center;
    font-size: 14px;
    color: #222;
    opacity: 0.8;
  }
`;

const StyledCol = styled(Col)`
  padding: 0;
  margin-right: 10px;
  overflow: hidden;
  border-radius: 10px 10px 0 0;

  &:last-child {
    margin: 0;
  }
`;

const mappings = {
  toktok: '육아톡톡',
  daily: '데일리독'
};

function BestPost(props) {
  const navigate = useNavigate();

  const { items } = props;

  const handleMove = (item) => {

    if (item.type === 'daily') {
      console.log(item.id);
      return navigate(`/community/dailydog/detail/${item.id}`)
    }
    if (item.type === 'toktok') {
      return navigate(`/community/Toktok/${item._id}`)
    }
  }

  return (
    <BestPostContainer>
      <Container>
        <Row>
          {items.map(item => {
            return (
              <StyledCol sm key={item._id} onClick={() => handleMove(item)}>
                {/* <img src={item.imgUrl[0] ? item.imgUrl[0] : nophoto}/> */}
                <img src={item.imgUrl ? item.imgUrl : nophoto}/>
                <h4>{mappings[item.type]}</h4>
                <h3>{item.title}</h3>
              </StyledCol>
              )
            })}
        </Row>
      </Container>
    </BestPostContainer>
  );
}

export default BestPost;