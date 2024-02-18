import ToktokItem from './ToktokItem';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Pagination from 'react-js-pagination';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getLoginUser } from '../../../features/userInfoSlice';

const ToktokWrapper = styled.div`
  margin: 0 auto;
  width: 1208px;
  height: 1000px;
  background-color: #fff;
  padding: 0 20px;
  h1 {
    font-size: 28px;
    font-weight: bold;
    margin-top: 23px;
  }
  .between {
    display: flex;
    justify-content: space-between;
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
  .test {
    font-size: 33px;
    color: red;
    background-color: beige;
  }
`;

const PagWrapper = styled.div` // 페이지네이션
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 15px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  ul.pagination li {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #e2e2e2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
  }
  ul.pagination li:first-child{
    border-radius: 5px 0 0 5px;
  }
  ul.pagination li:last-child{
    border-radius: 0 5px 5px 0;
  }
  ul.pagination li a {
    text-decoration: none;
    color: #337ab7;
    font-size: 1rem;
  }
  ul.pagination li.active a {
    color: white;
  }
  ul.pagination li.active {
    background-color: #337ab7;
  }
  ul.pagination li a:hover,
  ul.pagination li a.active {
    color: blue;
  }
  .page-selection {
    width: 48px;
    height: 30px;
    color: #337ab7;
  }
`;

function Toktok(props) {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [getList, setGetList] = useState();
  const [comment, setComment] = useState();

  const 로그인중 = useSelector(getLoginUser) // 현재 로그인중 유저 정보

  useEffect(() => {
    const toktokListGet = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/community/toktok`);
        await setGetList(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }
    toktokListGet();

    const commentGet = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/community/toktok/comment`, { withCredentials: true });
        setComment(response.data.commentData);
      } catch (error) {
        console.error(error);
      }
    }
    commentGet();
  }, []);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const insertClick = () => {
    if (로그인중) {
      navigate(`/community/insert/toktok`);
    } else {
      alert('로그인 시 이용 가능합니다.')
      navigate(`/login`);
    }
  }

  return (
    <ToktokWrapper>
      <PagWrapper>
        <Pagination
          activePage={page}
          itemsCountPerPage={4}
          totalItemsCount={getList?.length || 0}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={handlePageChange} />
      </PagWrapper>
      <h1>육아톡톡</h1>
      <br /><br />
      <div className='between'>
        <span>반려 생활 중 고민거리, 궁금증이 있으신가요? 지금 바로 질문해 보세요</span>
        <button className='click post-btn' onClick={() => insertClick()}>질문하러 가기</button>
      </div>
      <br /><hr />
      <div>
        {getList?.map((getListMap) => { // 게시글들 맵
          return <ToktokItem
            key={getListMap._id}
            _id={getListMap._id}
            title={getListMap.title}
            content={getListMap.content}
            user={getListMap.user}
            imgUrl={getListMap.imgUrl}
            like={getListMap.like}
            view={getListMap.view}
            date={getListMap.date}
            comment={comment}
          />
        }).slice(((page * 4) - 4), (page * 4))}
      </div>




      {/* 남은거..
  ) 포스트 삭제시 이동 ㅇ
  ) 워닝없애기 ㅇ
  ) 댓글 삭제 실시간 반영 o
  ) 퍼스널독에 들어갈 데이터 추가요청 ㅇ
  
  ) tok , tokdetail, personal  css ..... 
  ) 퍼스널독 콘텐츠 추가..? 뭐하냐..
  ) 각종 유효성 검사 진행중  { 로그인관련 o , 본인이 쓴 글만 삭제 및 수정 x  }
  ) ㅇㅇㅇ??????????????

*/}



    </ToktokWrapper>
  );
}

export default Toktok;