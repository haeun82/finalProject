import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import DailyDogItem from './DailyDogItem';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination';

const DailyDogContainer = styled.div`
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

  .pagination > li > a:focus {
    background: none;
    box-shadow: none;
  }
`;

const DailyDogItemContainer = styled(Container)`
  margin-top: 20px;
`;

const StyledPagination = styled(Pagination)`
  margin-top: 20px;
  display: flex;
  justify-content: center;

  span.page-link {
    cursor: pointer;
    background-color: #68a6fe;
    border: none;
  }
`;

function DailyDog(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const rememberPage = searchParams.get('page');
  const [ data, setData ] = useState([]);
  const [ page, setPage ] = useState({
    numOfPage: null,
    selectPage: 1,
    passPage: 1
  });
  
  const { numOfPage, selectPage, passPage } = page;

  useEffect(() => {
    const dailyDogData = async () => {
      try {
        const perPage = 9;
        // const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/community/daily?page=${rememberPage}`, { params: { perPage }});
        const response = await axios.get(`http://localhost:3000/community/daily?page=${rememberPage}`, { params: { perPage }});

        setData(response.data.data);
        setPage(prev => ({ ...prev, numOfPage: response.data.numOfPage }));
      } catch (err) {
        console.error(err);
      }
    }
    dailyDogData();
  }, [selectPage])

  useEffect(() => {
    if (rememberPage) {
      setPage(prev => ({ ...prev, selectPage: Number(rememberPage) }));
    }
  }, [rememberPage])
  
  const handlePage = (index) => {
    window.scrollTo(0, 0);
    setPage(prev => ({ ...prev, selectPage: index + 1 }));
    navigate(`/community/dailydog?page=${index+1}`)
  }

  const handlePageFirst = () => {
    if (selectPage > 1) {
      window.scrollTo(0, 0);
      setPage(prev => ({ ...prev, passPage: 1, selectPage: 1 }));
      navigate('/community/dailydog?page=1');
    }
  }

  const handlePagePrev = () => {
    if (selectPage > 10) {
      window.scrollTo(0, 0);
      setPage(prev => ({ ...prev, passPage: passPage - 10, selectPage: passPage - 1 }));
      navigate(`/community/dailydog?page=${passPage-10}`)
    } else if (selectPage > 1) {
      window.scrollTo(0, 0);
      setPage(prev => ({ ...prev, selectPage: selectPage - 1 }));
      navigate(`/community/dailydog?page=${selectPage-1}`)
    } else {
      return null;
    }
  }
  
  const handlePageNext = () => {
    if (passPage + 9 < numOfPage) {
      window.scrollTo(0, 0);
      setPage(prev => ({ ...prev, passPage: passPage + 10, selectPage: passPage + 10 }));
      navigate(`/community/dailydog?page=${passPage+10}`)
    } else if (selectPage < numOfPage) {
      window.scrollTo(0, 0);
      setPage(prev => ({ ...prev, selectPage: selectPage + 1 }));
      navigate(`/community/dailydog?page=${selectPage+1}`)
    } else {
      return null;
    }
  }

  const handlePageLast = () => {
    const stringOfPage = numOfPage.toString();
    const result = stringOfPage.slice(0, stringOfPage.length - 1).concat('1');

    window.scrollTo(0, 0);
    setPage(prev => ({ ...prev, passPage: Number(result), selectPage: numOfPage }));
    navigate(`/community/dailydog?page=${numOfPage}`)
  }

  return (
    <DailyDogContainer>
      <h1>데일리독</h1>
      <div className='info'>
        <p>사랑스러운 내 반려견의 일상을 공유해요!</p>
        <button className='post-btn' onClick={() => navigate('/community/dailydog/write')}>공유하기</button>
      </div>
      <DailyDogItemContainer>
        <Row>
          {data.map((item, index) => <DailyDogItem key={index} item={item}/>)}

        </Row>
      </DailyDogItemContainer>
      {numOfPage 
        ? 
        <StyledPagination>
          <Pagination.First onClick={handlePageFirst}/>
          <Pagination.Prev onClick={handlePagePrev} />
          {[...Array(numOfPage)].map((num, index) => <Pagination.Item active={index + 1 === selectPage} key={index} onClick={() => handlePage(index)}>{index + 1}</Pagination.Item>).slice(passPage - 1, passPage === 1 ? 10 : passPage + 9)}
          <Pagination.Next onClick={handlePageNext}/>
          <Pagination.Last onClick={handlePageLast}/>
        </StyledPagination>
        : null
      }
    </DailyDogContainer>
  );
}

export default DailyDog;