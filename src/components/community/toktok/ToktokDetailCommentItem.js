import axios from 'axios';
import React from 'react';
import styled from 'styled-components';

const ToktokDetailCommentItemWrapper = styled.div`
  .dateDel {
    display: flex;
    justify-content: end;
    .date {
      font-size: 12px;
      color: #0f0f10;
    }
  }
`;

function ToktokDetailCommentItem(props) {
  const { commentId } = props;

  const date = new Date(props.date)

  const hendleDel = async () => {
    try {
      await axios.post(`http://localhost:3000/community/toktok/ment/Del`, { commentId: commentId }, { withCredentials: true });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ToktokDetailCommentItemWrapper>
      <p className='b'>작성자: {props.user?.signUserNicname}</p> <br />
      <span className='b'>내용: {props.comment}</span>
      <div className='dateDel'>
        <span onClick={() => { hendleDel(); }}>🗑삭제</span>
        <span className='date'>{date?.toString().slice(0, 21)}  </span>
      </div>
      <hr />
    </ToktokDetailCommentItemWrapper>
  );
}

export default ToktokDetailCommentItem;