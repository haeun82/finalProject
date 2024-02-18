import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getLoginUser } from '../../features/userInfoSlice';
import { Table } from 'react-bootstrap';
import { dateFormat } from '../../util';

const PurchaseWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  
  h2 {
    padding: 10px 0;
    font-size: 30px;
    font-weight: bold;
    margin: 25px 0px;
  }
  .table thead {
    border-bottom: 1px solid #999;
  }
  .img {
    width: 150px;
    height: 150px;
  }
  tbody td {
    vertical-align: middle;
    /* background-color: #ececec; */
  }

  tbody .date {
    font-weight: bold;
  }

  .total-price {
    font-weight: bold;
  }

  .empty-list {
    text-align: center;
    padding: 100px 0px;
  }
  .empty-list img {
    width: 200px;
    height: 200px;
    color: #68a6fe;
  }
  .shop-btn {
    background-color: #68a6fe;
    width: 150px;
    padding: 10px;
    border-radius: 31px;
    font-weight: bold;
    color: #fff;
    margin: 20px auto;
    transition: 0.3s;
    border: none;
    display: flex;
    justify-content: center;

  }
   .shop-btn:hover {
    background-color: #3e8bf7;
  }
`;

function Purchase(props) {
  const navigate = useNavigate();
  const [purchaseList, setPurchaseList] = useState([]);
  const loginUser = useSelector(getLoginUser);
  const formatter = new Intl.NumberFormat('ko-KR');

  useEffect(() => {
    const purchaseList = async () => {
      const result = await axios.get(`http://localhost:3000/shop/purchase`, { withCredentials: true });
      if (result.data) setPurchaseList(result.data.list);
    }
    purchaseList();
  }, []);

  return (
    <PurchaseWrap>
      <h2>주문 내역</h2>
      <Table className='table' hover>
        <thead>
          <tr>
            <th>주문 날짜</th>
            <th>주문 상품</th>
            <th>수량</th>
            <th>총 금액</th>
          </tr>
        </thead>
        <tbody>
        {purchaseList.length ? purchaseList.map((item, index) => {
          console.log(item);
          return (
            <Fragment key={index}>
              <tr>
                <td className='date'>{dateFormat(item.date)}</td>
              </tr>
              {item.list &&
                item.list.map((item, i) => {
                return (
                  <tr key={i}>
                    <td></td>
                    <td>{item.title}</td>
                    <td>{item.count}</td>
                    <td>{formatter.format(item.price * item.count)}원</td>
                  </tr>
              )})}
            </Fragment>
            )
          })
          :
          <tr className='empty-list'>
            <td>구매내역이 없습니다.</td>
            <td></td>
            <td><button className='shop-btn cursor-pointer' onClick={() => {navigate('/shop')}}>쇼핑으로 이동</button></td>
            <td></td>
          </tr>
        }
        </tbody>
      </Table>
    </PurchaseWrap>
  );
}

export default Purchase;