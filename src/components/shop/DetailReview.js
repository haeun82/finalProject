import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MdDelete } from "react-icons/md";
import { dateFormat, needLogin } from '../../util';
import { useNavigate } from 'react-router-dom';
import Star from './Star';
import StarReview from './StarReview';
import { useSelector } from 'react-redux';
import { getLoginUser } from '../../features/userInfoSlice';

const ReviewContainer = styled.div`
  margin: 0 auto;
  width: 83%;
  display: flex;
  flex-direction: column;

  .review-wrap h3 {
    font-size: 30px;
    font-weight: bold;
    color: #68a6fe;
    margin-top: 20px;
  }
  p.title-sub {
    margin: 10px 0px;
  }
  .wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
  }
  .sorting {
    text-align: center;
    border-radius: 10px;
    padding: 3px 5px;
    width: 16%;
    align-self: flex-end;
    margin-bottom: 10px;
  }
  .review-wrap {
    width: 50%;
    display: flex;
    flex-direction: column;
  }
  .review-wrap p {
    margin-top: 10px;
  }
  
  button.review-btn  {
    height: 50px;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    background-color: #68a6fe;
    border: none;
    border-radius: 10px;
  }
  .review-wrap button:active {
    background-color: #4290fc;
  }
  hr {
  }
  .list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    background-color: #ececec;
    padding: 5px 10px;
    border-radius: 10px;
  }
  .list .starwrap {
    margin-bottom: 10px;
  }
  .list div img {
    width: 180px;
    height: 180px;
    border-radius: 10px;
  }
  .list .titlewrap {
    width: 600px;
    margin-left: 20px;
    .title {
      font-weight: bold;
    }
  }
  .list .titlewrap .date {
    margin: 5px 0px 10px;
    display: inline-block;
  }
  .list div:nth-child(1) {
    margin-bottom: 5px;
  }
  .list .delete-btn {
    display: inline-block;
    border: none;
    background-color: #b4bdff;
    color: #fff;
    border-radius: 10px;
    font-size: 18px;
    padding: 0px 10px;
    text-align: center;
  }
  .list .userId {
    font-size: 20px;
    font-weight: bold;
    color: #666;
    margin-bottom: 5px;
  }
  .list span.date {
    font-size: 16px;
    font-weight: 400;
    margin-left: 20px;
  }
`;

const Modal = styled.div`
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
    textarea {
      width: 100%;
      height: 55%;
      margin: 20px 0px 10px;
      outline: none;
      resize: none;
      font-size: 18px;
      border-radius: 10px;
    }
    button {
    width: 48%;
    margin: 20px 0;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    background-color: #68a6fe;
    border: none;
    padding: 10px 0px;
    border-radius: 10px;
    }
    button:active {
      background-color: #4290fc;
    }
    .modal-wrap {
      position: absolute;
      width: 50%;
      margin: 0 auto;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%); 
    }
    .modal-wrap form {
      width: 600px;
      height: 800px;
      padding: 40px;
      margin: 0 auto;
      background-color: #ececec;
      border-radius: 15px;
      box-sizing: border-box;
    }
    .modal-wrap div {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .modal-wrap input {
      width: 70%;
    }
    .modal-wrap form h3 {
      font-size: 25px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
    }
    .modal-wrap .starwrap {
      flex-direction: column;
    }
    .modal-wrap .starwrap p {
      text-align: center;
      margin: 10px 0;
    }
    .modal-wrap p {
      margin-bottom: 10px;
    }
    .modal-wrap p {
      font-weight: bold;
      color: #555;
      font-size: 18px;
    }
    .modal-wrap .brand,
    .modal-wrap .item {
      background-color: #68a6fe;
      color: #fff;
      padding: 5px 10px 0;
      border-radius: 5px;
    }
    .modal-wrap .item {
      width: 84px;
      text-align: center;
    }
    .modal-wrap .input {
      width: 80%;
      outline: none;
    }
    .modal-wrap .filebox {
      display: flex;
      justify-content: space-between;
    }
    .modal-wrap .filebox .upload-name {
      outline: none;
      border: 1px solid #777;
      padding: 5px;
      width: 75%;
      border-radius: 10px;
    }
    .modal-wrap .btn-img {
      background-color: #68a6fe;
      color: #fff;
      background-color: #68a6fe;
      padding: 7px 5px;
      width: 23%;
      border-radius: 10px;
      text-align: center;
      font-weight: bold;
    }
    .modal-wrap .btn-wrap {
      display: flex;
      justify-content: space-between;
    }
    .modal-wrap .btn-wrap button.close {
      border: 1px solid #68a6fe;
      background-color: #fff;
      color: #333;
    }
`;

function DetailReview(props) {
  const navigate = useNavigate();
  const [upDown, setUpDown] = useState('등록순');
  const [review, setReview] = useState(true);
  const [content, setContent] = useState('');
  const [reviewList, setReviewList] = useState([]);
  const [ selected, setSelected ] = useState('latest');
  const [modalOpen, setModalOpen] = useState(false);
  const [star, setStar] = useState('');
  const { product: { brand, title }, postId, user } = props;
  const loginUser = useSelector(getLoginUser);
  
  useEffect(() => {
    const list = async () => {
      try {
        const result = await axios.get(`http://localhost:3000/shop/review/${postId}`);
        const reviewArr = [...result.data.itemReview];
        switch (selected) {
          case 'latest':
            reviewArr.sort(function (a, b) {
              return Number(a.date) < Number(b.date) ? -1 : Number(a.date) > Number(b.date) ? 1 : 0;
            })
            break;
          case 'highRate':
            reviewArr.sort(function (a, b) {
              return a.star > b.star ? -1 : a.star < b.star ? 1 : 0;
            })
            break;
          case 'lowRate':
            reviewArr.sort(function (a, b) {
              return a.star < b.star ? -1 : a.star > b.star ? 1 : 0;
            })
            break;
        }
        setReviewList(reviewArr);
      } catch (err) {
        console.error(err);
      }
    }
    list();
  }, [modalOpen, review, selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!content) {
        return alert('내용을 입력해주세요!');
      }
      if (!star) return alert('별점을 입력해주세요!');
      const fileInput = document.querySelector('input[type=file]');
      const img = fileInput.files[0];
      const date = dateFormat(new Date());
      const formData = new FormData();
      
      formData.append('img', img);
      formData.append('star', star);
      formData.append('content', content);
      formData.append('postId', postId);
      formData.append('title', title);
      formData.append('date', date);

      const result = await axios.post(`http://localhost:3000/shop/reviewInsert/${postId}`, formData, {withCredentials:true});
      console.log(result);
      setReviewList(result.data);
    } catch (err) {
      console.error(err);
    }
    setContent('');
    setModalOpen(false);
  };

  const openModal = () => {
    if (!user) {
      const result = needLogin();
      if (result) navigate('/login');
    }
    else setModalOpen(true);
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };
  const handleStar = (rate) => {
    setStar(rate);
  };
  const handleReviewDelete = async (_id) => {
    try {
      await axios.post(`http://localhost:3000/shop/reviewDelete`, { _id, postId }, {withCredentials: true});
      setReview(prev => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <ReviewContainer>
        <div className='wrap'>
          <div className='review-wrap'>
            <h3 className='review-title'>상품 리뷰📦</h3>
            <p className='title-sub'>다양한 리뷰를 확인해보세요!</p>       
          </div>
          <button type='button' className='cursor-pointer review-btn' onClick={openModal} >리뷰 작성</button>
        </div>
        
        <hr />
        <select className='sorting' onChange={handleSelect} value={selected}>
          <option value='latest' >최신순</option>
          <option value='highRate' >별점 높은 순</option>
          <option value='lowRate' >별점 낮은 순</option>
        </select>
        {reviewList.length > 0 && (
          reviewList.map((item, index) => {
            return (
              <div className='list' key={index}>
                <div><img src={item.imgUrl}/></div>
                <div className='titlewrap'>
                  <p className='starwrap'><StarReview star={item.star}/></p>
                  <p className='title'>{item.title}</p>
                  <p className='userId'>{item.id}<span className='date'>{dateFormat(item.date)}</span></p>
                  <p>{item.content}</p>
                </div>
                {(item.user === loginUser?._id) && 
                <div>
                  {}
                  <button className='delete-btn cursor-pointer' onClick={() => {handleReviewDelete(item._id)}}><MdDelete /></button>
                </div>}
              </div>
            )
          })
        )}
      </ReviewContainer>
      {modalOpen && 
        <Modal>
          <div className='modal-wrap'>
            <form>
              <h3>리뷰 작성📝</h3>
              <div className='starwrap'>
                <p>상품을 사용해보셨나요?</p>
                <div><Star handleStar={handleStar}/></div>
              </div>
              <div>
                <label name='brand' className='brand'>브랜드명</label>
                <input type='text' value={brand} name='brand' className='input' readOnly />
              </div>
              <div>
                <label className='item'>상품명</label>
                <input type='text' value={title} name='brand' className='input' readOnly />
              </div>
              
              <textarea 
                spellCheck="false" 
                placeholder='리뷰를 작성해주세요 :)'
                value={content}
                onChange={(e) => {setContent(e.target.value)}}
              />
              <div className='filebox'>
                <input type='file' name="img" id='file_upload' />
              </div>

              
              <div className='btn-wrap'>
                <button type='submit' className='cursor-pointer' onClick={handleSubmit} >리뷰 등록</button>
                <button type='button' className='close cursor-pointer' onClick={() => {setModalOpen(false)}} >취소</button>
              </div>
            </form>
          </div> 
        </Modal>
      }
    </>
  );
}

export default DetailReview;