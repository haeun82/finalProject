import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlusCircle } from "react-icons/fi";
import { addItemToFleamarket, selectFleamarket } from '../../../features/dailyDogSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getLoginUser } from '../../../features/userInfoSlice';

const FleamarketWriteContainer = styled.div`
  max-width: 1200px;
  min-height: 800px;
  margin: 70px auto;

  h1 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  h3 {
    padding: 10px 0;
    font-size: 14px;
    color: #222;
    opacity: 0.7;
  }

  &.text-box:last-child {
    padding: 10px;
  }

  .tip-box {
    font-size: 13px;
    line-height: 26px;
    padding: 6px 0;
    color: #68a6fe;
    margin-bottom: 10px;
  }

  img {
    width: 120px;
    height: 120px;
    margin-right: 10px;
    border: 1px solid #68a6fe;
    cursor: pointer;
  }
  
  .img-box {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .add-images {
      cursor: pointer;
      width: 120px;
      height: 120px;
      border: 1px solid #68a6fe;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      color: #68a6fe;
    }

    #images {
      display: none;
    }
  }

  .write-form {
    width: 55%;
    margin: 0 auto;
    
    input, textarea, select {
      margin-bottom: 10px;
      padding: 8px 10px;
      border: 1px solid #ccc;

      &:focus {
        outline: none;
      } 
    }

    span {
      margin-right: 8px;
      font-weight: bold;
    }

    .text-box {
      .content-title {
        vertical-align: top;
      }

      label {
        width: 100%;

        input {
          width: 93.5%;
        }

        textarea {
          width: 93.5%;
          min-height: 400px;
          resize: none;
        }
      }

      .dogInfo-box {
        display: flex;
        
        label {
          width: 25%;
          display: flex;
          align-items: center;
        }
        
        span {
          padding-bottom: 10px;
          white-space: nowrap;
        }

        & label:nth-child(2), label:last-child {
          margin-left: 10px;
        }
      }
    }

    .type-box {
      display: flex;

      #price {
        margin-right: 10px;
      }

      .place-box {
        margin-left: 10px;
      }
    }

    .btn-box {
      margin: 0 auto;
      margin-right: 4px;
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

  .content-box {
    padding-top: 20px;
  }
`;

function FleamarketWrite(props) {
  const navigate = useNavigate();
  const user = useSelector(getLoginUser);

  const [ values, setValues ] = useState(
    {
      id: '',
      title: '',
      price: '',
      category: '',
      content: '',
      area: '',
      dogType: '',
      dogAge: '',
      dogWeight: '',
    }
  );
  const [ images, setImages ] = useState([]);
  const [ sendImages, setSendImages ] = useState([]);
  const imgFileExt = ['jpg', 'png', 'jpeg'];

  const { id, title, price, category, content, area, dogType, dogAge, dogWeight } = values;

  useEffect(() => {
    const fleamarketData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/vintage/number`);
        console.log(response.data.id);
        setValues(prevValue => ({ ...prevValue, id: response.data.id ? response.data.id + 1 : 1 }));
      } catch (err) {
        console.error(err);
      }
    }
    fleamarketData();
  }, [])

  console.log(typeof(id));

  const handleFileChange = async (e) => {
    const files = e.target.files;
    
    for (const file of files) {
      const fileExtFilter = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      
      if (!imgFileExt.includes(fileExtFilter)) {
        return alert('이미지 파일만 첨부 가능합니다.');
      }      
    }

    if (files && files.length > 0) {
      if (images.length + files.length <= 5) {
        const newImage = [];

        Array.from(files).forEach(file => {
          const reader = new FileReader();
       
          reader.onloadend = () => {
            newImage.push(reader.result);

            if (newImage.length === files.length) {
              setImages(prevImage => [...prevImage, ...newImage]);
              setSendImages(prevSendImg => [...prevSendImg, ...files]);
            }
          };

          reader.readAsDataURL(file);
        })
      } else {
        return alert('사진은 최대 5장까지 첨부 가능합니다.');
      }
    }
  };

  const handleClickImage = (indexRemove) => {
    const deleteImage = images.filter((prevSrc, index) => index !== indexRemove);
    const deleteSendImage = sendImages.filter((prevSrc, index) => index !== indexRemove);
    setImages(deleteImage);
    setSendImages(deleteSendImage)
  }

  const contentOnChange = (e) => {
    const { name, value } = e.target;
    setValues(prevValue => ({ ...prevValue, [name]: value }));
  }

  const handleSubmitValue = async () => {

    const date = new Date();

    const formData = new FormData();
    formData.append('id', id);
    formData.append('title', title);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('content', content);
    formData.append('area', area);
    formData.append('dogType', dogType);
    formData.append('dogAge', dogAge);
    formData.append('dogWeight', dogWeight);
    formData.append('author',  user.signUserNicname);
    formData.append('authorId', user._id);
    formData.append('date', date);
    for (const image of sendImages) {
      formData.append('img', image);
    }

    if (title && price && category && area && content && images[0] && dogType && dogAge && dogWeight) {
      try {
        await axios.post(`http://localhost:3000/vintage/insert`, formData, {withCredentials: true})
        alert('게시글이 등록되었습니다.');
        navigate('/community/Fleamarket');
      } catch (err) {
        console.error(err);
      } 
    } else if (!images[0]) {
      alert('최소 1장 이상의 사진을 첨부해주세요.');
    } else if (!title) {
      alert('제목을 입력해주세요.');
    } else if (!price) {
      alert('가격을 입력해주세요.');
    } else if (!category) {
      alert('카테고리를 선택하세요.');
    } else if (!area) {
      alert('장소를 입력해주세요.');
    } else if (!content) {
      alert('내용을 입력해주세요.');
    } else if (!dogType) {
      alert('견종을 선택하세요.');
    } else if (!dogAge) {
      alert('나이를 입력해주세요.');
    } else if (!dogWeight) {
      alert('몸무게를 입력해주세요.');
    }
  }

  return (
    <FleamarketWriteContainer>
      <h1>중고거래</h1>
      <div className='tip-box'>
        <p>* 첫번째로 삽입한 사진 대표 사진이 되며 업로드 시 사진의 크기는 600*360으로 고정 됩니다.</p>
        <p>* 사진은 최대 5장까지 첨부 가능합니다. (첨부 된 사진을 클릭하면 삭제 됩니다.)</p>
      </div>
      <div className='img-box'>
        {images && images.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <img id='image' src={item} onClick={() => handleClickImage(index)} /> 
            </React.Fragment>
          )
        })}
        {images.length < 5 
          ? 
            <>
              <label className='add-images' htmlFor='images' title='사진추가'>
                <FiPlusCircle />
              </label>
              <input type='file' id='images' onChange={handleFileChange} multiple/>  
            </>
          : null
        }
      </div>
      <div className='write-form'>
        <h3>판매 정보</h3>
        <div className='text-box'>
          <label>
            <span>제목</span>
            <input value={title} type='text' name='title' onChange={contentOnChange}/>
          </label>
        </div>
        <div className='type-box'>
          <div className='typeInner-box'>
            <label>
              <span>가격</span>
              <input value={price} id='price' type='number' name='price' onChange={contentOnChange}/>
            </label>
          </div>
          <div className='typeInner-box'>
            <span>카테고리</span>
              <select value={category} name='category' onChange={contentOnChange}>
                <option value=''>선택</option>
                <option value='feed'>사료</option>
                <option value='snackNutritional'>간식/영양제</option>
                <option value='bowelHygiene'>배변/위생</option>
                <option value='walkPlay'>산책/놀이</option>
              </select>
          </div>
          <label className='place-box'>
            <span>장소</span>
            <select value={area} name='area' onChange={contentOnChange}>
              <option value=''>지역</option>
              <option value='seoul'>서울</option>
              <option value='gyeonggi'>경기</option>
              <option value='incheon'>인천</option>
              <option value='daejeon'>대전</option>
              <option value='daegu'>대구</option>
              <option value='gwangju'>광주</option>
              <option value='busan'>부산</option>
              <option value='gangwon'>강원</option>
              <option value='ulsan'>울산</option>
              <option value='jeju'>제주</option>
            </select>
          </label>
        </div>
        <div className='text-box'>
          <h3>애견 정보</h3>
          <div className='dogInfo-box'>
            <label>
              <span>견종</span>
              <select value={dogType} name='dogType' onChange={contentOnChange}>
                <option value=''>선택</option>
                <option value='허스키'>허스키</option>
                <option value='푸들'>푸들</option>
                <option value='리트리버'>리트리버</option>
                <option value='포메라니안'>포메라니안</option>
                <option value='스피츠'>스피츠</option>
              </select>
            </label>
            <label>
              <span>나이</span>
              <input value={dogAge} type='number' name='dogAge' onChange={contentOnChange}/>
            </label>
            <label>
              <span>몸무게</span>
              <input value={dogWeight} type='number' name='dogWeight' onChange={contentOnChange}/>
            </label>
          </div>
        </div>
        <div className='text-box content-box'>
          <label>
            <span className='content-title'>내용</span>
            <textarea value={content} id='content' name='content' onChange={contentOnChange}/>
          </label>
        </div>
        <div className='btn-box'>
          <button onClick={() => navigate(-1)}>취소</button>
          <button onClick={handleSubmitValue}>등록</button>
        </div>
      </div>
    </FleamarketWriteContainer>
  );
}

export default FleamarketWrite;