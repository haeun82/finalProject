import React, { useEffect, useState } from 'react';
import CommunitySlide from '../components/community/communityHome/CommunitySlide';
import { FaChevronRight } from "react-icons/fa";
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import NewToktok from '../components/community/communityHome/NewToktok';
import HoneyTip from '../components/community/communityHome/HoneyTip';
import axios from 'axios';
import NewDailyDog from '../components/community/communityHome/NewDailyDog';
import BestPost from '../components/community/communityHome/BestPost';

const CommunityHomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 70px;

  img {
    cursor: pointer;

    &:hover {
      transform: scale(0.99);
    }
  }

  .communityHomeContent {
    margin-top: 60px;

    h2 {
      font-size: 20px;
      font-weight: bold;
      display : inline-flex;
      align-items: center;

      button {
        cursor: pointer;
        border: none;
        background: none;
        display : inline-flex;
        align-items: center;
        color: #68a6fe;
      }
    }
  }
`;

function Community(props) {
  const navigate = useNavigate();

  const [items, setItems] = useState({
    bestLists: [],
    recentDailyDog: [],
    recentToktok: [],
    recentFleamarket: [],
  })

  const { bestLists, recentDailyDog, recentToktok, recentFleamarket } = items;

  useEffect(() => {
    const newDailyDogData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/community`);
        
        const bestLists = [...response.data.bestViewPost];
        const recentDailyDog = [...response.data.recentDailyPost];
        const recentToktok = [...response.data.recentToktokPost];

        setItems(prev => ({ ...prev, bestLists, recentDailyDog, recentToktok }))
      } catch (err) {
        console.error(err);
      }
    }
    newDailyDogData();
  }, [])
  
  return (
    <>
      <CommunitySlide />
      <CommunityHomeContainer>
        <div className='communityHomeContent'>
          <h2>
            HOT 게시글
          </h2>
          <BestPost items={bestLists} />
        </div>
        <div className='communityHomeContent'>
          <h2>
            육아톡톡 NEW
            <button title='더보기' onClick={() => navigate('/community/Toktok')}><FaChevronRight /></button>
          </h2>
            <NewToktok items={recentToktok}/>
        </div>
        <div className='communityHomeContent'>
          <h2>
            데일리독 NEW
            <button title='더보기' onClick={() => navigate('/community/dailydog?page=1')}><FaChevronRight /></button>
          </h2>
          <NewDailyDog items={recentDailyDog} />
        </div>
        <div className='communityHomeContent'>
          <h2>
            꿀팁 대방출
            <button title='더보기'><FaChevronRight /></button>
          </h2>
          <HoneyTip />
        </div>
      </CommunityHomeContainer>


    </>
  );
}

export default Community;