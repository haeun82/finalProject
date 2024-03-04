import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import nophoto from '../../../image/nophoto.jpg'
import { useNavigate } from 'react-router-dom';

const NewDailyDogContainer = styled.div`
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

function NewDailyDog(props) {
  const navigate = useNavigate();

  const { items } = props;

  return (
    <NewDailyDogContainer>
      <Container>
        <Row>
          {items.map(item => {
            return (
              <StyledCol sm key={item._id} onClick={() => navigate(`/community/dailydog/detail/${item.id}`)} >
                <img src={item.imgUrl ? item.imgUrl : nophoto}/>
                <h3>{item.title}</h3>
              </StyledCol>
              )
            })}
        </Row>
      </Container>
    </NewDailyDogContainer>
  );
}

export default NewDailyDog;