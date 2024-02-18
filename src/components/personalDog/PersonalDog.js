import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getLoginUser } from '../../features/userInfoSlice';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import KakaoMap from '../KakaoMap';

const PersonalDogWrapper = styled.div`
  max-width: 1200px;
  min-height: 800px;
  margin: 70px auto;
  padding: 0 20px;
  h1 {
    font-size: 44px;
    font-weight: bold;
    color: #000;
  }
  h2 {
    padding: 10px 0;
    font-size: 24px;
  }
  .hrDiv {
    margin: 80px 0;
  }
  .ListBox {
    text-align: center;
    margin: 30px 0;
    display: flex;
    justify-content: center;
    h4{
      font-size: 24px;
      margin-bottom: 35px;
      border-bottom: 2px solid #eee;
      padding-bottom: 20px;
    }
    .toktok {
      max-width: 300px;
      margin: 0 30px;
      flex: 1;
      font-size: 14px;
    }
    .daily {
      max-width: 300px;
      margin: 0 30px;
      flex: 1;
      font-size: 14px;
    }
    .shop {
      max-width: 300px;
      margin: 0 30px;
      flex: 1;
      font-size: 14px;
    }
    .slider {
      margin-bottom: 30px;
      border-left: 2px solid greenyellow;
      line-height: 100px;
      width: 300px;
      height: 100px;
      background-color: #F8F9EF;
      .sliderItem {
        display: flex;
        flex-flow: row;
        text-align: center;
      }
      p {
        flex: 1;
      }
      img {
        flex: 1;
        max-height: 80px;
        max-width: 120px;
        margin: auto 0;
      }
    }
    .typeAgeInfo{
      border: 1px solid #000;
      border-radius: 10px;
      background-color: #f7f7f7;
      h4 {
        padding-top: 10px;
        font-weight: bold;
      }
      p {
        border: 1px solid #000;
        background-color: #fff;
        border-radius: 10px;
        margin: 20px;
        padding: 10px;
        line-height: 30px;
      }
    }


    .KaKaoMap{
      width: 900px;
    }
  }
`;

function PersonalDog(props) {
  const 로그인중 = useSelector(getLoginUser); // 현재 로그인중 유저 정보

  const [getPersonalDog, setGetPersonalDog] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const commentListGet = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/community/toktok/PersonalDog`, { withCredentials: true });
        setGetPersonalDog(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    commentListGet();
  }, []);
  console.log(getPersonalDog);


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 3,
    // slidesPerRow: 2
  }


  const testDogInfo = [
    {
      dogType/* 리트리버 */: '리트리버',
      info: '과거에 주로 날짐승, 특히 오리나 거위 같이 물에 사는 새 등을 사냥할 때 이용하던 중~대형견을 통칭하며, Retrieve라는 영어 단어 뜻이 되찾아오다인 것에서 알 수 있듯이, 총 같은 것으로 맞혀 떨어뜨린 사냥감을 물어오는 역할을 담당했던 견종들이다.',
      character: '학대, 방임, 공격성을 방치한 훈육 등의 악조건을 겪지 않은 골든 리트리버는 대체로 온화한 성격을 지닌다. 강형욱 훈련사는 골든 리트리버의 온화한 성격에 대해 "100개의 옐로카드를 가졌고, 한숨 자고 나면 옐로카드가 전부 회복된다"라고 설명하기도 했다. 누군가 자신을 괴롭히더라도 99번까지는 봐줄 만큼 인내심이 좋다는 뜻.'
    }
    ,
    {
      dogType/* 허스키 */: '허스키',
      info: '러시아 시베리아의 동북쪽 끝 추코트카가 발현지인 개의 일종.[2] 그곳에서 대대로 거주하던 축치인이 키우던 썰매견에서 유래된 견종이다. 그러나 시베리안 허스키라는 이름을 얻고 하나의 독립된 견종으로 고착된 것은 미국에서 이뤄진 것이며 이 때문에 견종 전문가들은 미국 개로 분류하고 있다. 참고로 시베리아에서 이주한 아메리카 원주민들과 함께 따라간 시베리아 토착견들은 아메리칸 인디언 독이 되었다.',
      character: '흰색에 가까운 홍채 때문에 눈동자가 삼백안 같은 매서운 눈빛을 가지고 있으나 겉보기와 달리 허스키는 대체로 성격이 순한 품종이다.[7] 순하기 때문에 경호견으로는 적합하지 않다.'
    }
    ,
    {
      dogType/* 말티즈 */: '말티즈',
      info: '개의 한 품종이며 남유럽 지방의 섬나라인 몰타가 원산인 소형견이다. Maltese [mɔːltíːz] 몰타 섬에서 유래된 종이라서 실제 발음은 ‘몰티즈’인데, 한국에서는 철자를 한국식으로 읽은 ‘말티즈’로 굳어졌지만 말티즈/몰티즈가 혼재되는 편이다.',
      character: '활발하고 놀기를 좋아하며 주인에게 치대는 성향이 강하기 때문에 주인이 집에 들어오면 방방 뛰는 모습을 쉽게 볼 수 있다. 눈치가 빨라서 주인의 마음을 민감하게 감지할 줄 알지만 한편으로는 자기 주장을 강하게 하고 고집이 있어 밥, 간식, 산책 등 자기가 원하는 바에 대해 적극적으로 의사를 표출하는 견종이다. 더불어 자신이 원하는 바가 달성되어야 직성이 풀리는 성격이기 때문에 훈련이 잘못될 경우 욕구를 충족시키지 못한다고 판단되면 뒤끝을 보이며 휴지통을 뒤엎는 등의 문제를 일으키기 때문에 어릴 때 엄격하게 훈련을 시켜 놓지 않으면 나중에 주인이 매우 힘들어질 수 있다.'
    }
    ,
    {
      dogType/* 푸들 */: '푸들',
      info: '독일이 원산인 개의 품종. 프랑스인들이 특히나 좋아하는 강아지이며 프랑스를 대표하는 이미지 중 하나이기도 하다.',
      character: '푸들은 인간과 가장 오랫동안 지내오며 가축화와 애견화가 가장 많이 진행된 품종에 속한다. 때문에 일반적인 다른 개들보다 사람과의 상호작용이 훨씬 뛰어나며, 다른 개들과는 같은 종이지만 공격성과 같은 본능에서 다른 점이 많은 특성을 가지고 있다.'
    }
  ]
  const DogInfoFilter = testDogInfo.filter((DogInfoFilter) => {
    return (
      DogInfoFilter.dogType === 로그인중?.signDogType
    )
  })



  return (
    <PersonalDogWrapper>
      <h1>{로그인중?.signDogName}</h1>
      <br /><br />
      <h2>{로그인중?.signDogName}과(와)의 생활 중 고민거리, 궁금증이 있으신가요? 저희가 알려드릴게요!</h2>
      <br /><hr />
      <div className='ListBox'>

        <div className='toktok'>
          <h4>육아톡톡</h4>
          <Slider {...settings}>
            {getPersonalDog?.toktokPostFilter.map((a) => {
              return (
                <div className='slider' onClick={() => { navigate(`/community/Toktok/${a._id}`) }} >
                  <div className='sliderItem'><p>{a.title.length > 13 ? a.title.slice(0, 13) + '...' : a.title}</p><img src={`${a.imgUrl}`} /></div>
                </div>
              )
            })}
          </Slider>
        </div>
        <div className='daily'>
          <h4>중고장터</h4>
          <Slider {...settings}>
            {getPersonalDog?.vinPostFilter.map((a) => {
              return (
                <div className='slider' onClick={() => { navigate(`/community/dailydog/detail/${a.id}`) }} >
                  <div className='sliderItem'><p>{a.title.length > 13 ? a.title.slice(0, 13) + '...' : a.title}</p><img src={`${a.imgUrl}`} /></div>
                </div>
              )
            })}
          </Slider>

        </div>

        <div className='shop'>
          <h4>샵</h4>
          <Slider {...settings}>
            {getPersonalDog?.shopPostFilter.map((a) => {
              return (
                <div className='slider' onClick={() => { navigate(`/shop/detail/${a._id}`) }} >
                  <div className='sliderItem'><p>{a.title.length > 13 ? a.title.slice(0, 13) + '...' : a.title}</p><img src={`${a.imgUrl}`} /></div>
                </div>
              )
            })}
          </Slider>
        </div>

      </div>

      <div className='hrDiv'>
        <hr />
        <hr />
      </div>

      <div className='ListBox'>
        {DogInfoFilter.length > 0 ?
          <div className='typeAgeInfo'>
            <h4>{로그인중?.signDogType}의 특징</h4>
            <p>{로그인중?.signDogType}의 정보: {DogInfoFilter[0]?.info}</p>
            <p>{로그인중?.signDogType}의 성격: {DogInfoFilter[0]?.character}</p>
          </div>
          : <div />
        }
      </div>

      <div className='hrDiv'>
        <hr />
        <hr />
      </div>

      <div className='ListBox'>
        <div className='KaKaoMap'>
          <h4>{로그인중?.signDogName}의 산책로 검색</h4>  {/* 지도로 산책로 찾기? */}
          <KakaoMap />
        </div>
      </div>

      {/* 견종, 나이별 맞춤제품/
        각종 게시글 취합..?/
        산책로 추천/
        꺼무위키 정보..?/
        블로그 추천..?/
        등등...뭐가 있지/
        ????????????????
      필요한거:
      쇼핑몰 맞춤 제품 구분할때 들어가는 데이터 소중대에서 나이,자견,성견,노견으로 바꿔야 할듯
      맞춤페이지 기획안... ; ; ; 위에 써논거 들어갈 예정

      회원가입시 견종 입력받고 그걸 토대로 소중대를 나눠..? 아님 소중대 아예 없애?
      가입시 정보를 너무 많이 받으면 클라이언트들이 너무 귀찮아할 거 같음..  ===
      === 물어봤더니 견주입장에선 귀찮더라도 한번 쓰고 자세한 정보를 얻을 수 있으면 좋을 것 같다...

      게시글 작성시 로그인중인 유저의 강아지의 나이, 견종 태그 들어가기 위해서 작성시 같이 데이터 정보를 보낼 */}

    </PersonalDogWrapper>
  );
}

export default PersonalDog;