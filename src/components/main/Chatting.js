import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import io from "socket.io-client";
import { useSelector } from 'react-redux';
import { getLoginUser } from '../../features/userInfoSlice';
import axios from 'axios';
import { useParams } from 'react-router';
import ChatList from '../community/chatting/ChatList';


const ChattingContainer = styled.div`
  max-width: 1000px;
  height: 800px;
  margin: 70px auto;
  border: 1px solid #ccc;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .inner {
    display: flex;
    height: 800px;

    .userinfo-box {
      flex-basis: 150px;
      border-right: 1px solid #ccc;
      overflow: auto;

      div {
        padding: 10px 0;
        display: flex;
        justify-content: center;
      }

      span {
        margin-left: 6px;
        font-weight: bold;
      };
    }

    .chattinglist-box {
      /* padding: 10px 0; */
      flex-basis: 350px;
      border-right: 1px solid #ccc;
      overflow: auto;

      span {
        font-weight: bold;
      }

      .chattinglist-inner-box {
        display: flex;
        padding: 6px 10px;
      }
      .chattinglist-inner-box + .chattinglist-inner-box {
        border-top: 1px solid #ccc;
      }

      .chattinglist-userinfo-box {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 0 6px;

        .sort {
          display: flex;
          justify-content: space-between;
        }
      }
    }
    
    .chatting-box {
      flex-basis: 700px;
      display: flex;
      flex-direction: column;

      .sellerinfo-box {
        height: 100px;
        border-bottom: 1px solid #ccc;

        span {
          font-size: 18px;
          font-weight: bold;
        }
      }

      .chatting-detail-box {
        height: 560px;
        overflow: auto;
        padding: 0 10px;
        /* display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end; */

        &::-webkit-scrollbar {
          display: none;
        }

        .message-notme-box {
          max-width: 50%;
          margin-top: 10px;
          min-height: 36px;
          padding: 10px;
          background-color: #ccc;
          border-radius: 10px;
          clear: both;
          float: left;
        }

        .message-box {
          max-width: 50%;
          margin-top: 10px;
          min-height: 36px;
          padding: 10px;
          background-color: orange;
          border-radius: 10px;
          clear: both;
          float: right;
        }

        .day {
          text-align: center;
          padding-top: 20px
        }

        .nonChat{
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 3rem;
          font-weight: bold;
        }

      }

      .chatting-input-box {
        margin: 10px 0;
        border: 1px solid orange;
        border-radius: 10px;
        padding: 10px;
        height: 140px;
        display: flex;

        textarea {
          border: none;
          width: 90%;
          height: 90%;
          resize: none;
          font-size: 18px;

          &:focus {
            outline: none;
          }
        }
        
        button {
          border: none;
          background: orange;
          border-radius: 15px;
          font-weight: bold;
          color: white;
        }
      }
    }
  }
`;

function Chatting(props) {
  const scrollRef = useRef();
  const { toChat } = useParams();
  const isLogin = useSelector(getLoginUser);

  const [ update, setUpdate ] = useState('');
  const [ chats, setChats ] = useState([]);
  const [ chatDetail, setChatDetail ] = useState([]);
  const [ chatRoomFilter, setChatRoomFilter ] = useState('');
  const [ value, setValue ] = useState('');
  const [ sendId, setSendId ] = useState('');
  const [ room, setRoom ] = useState('');

  const valueOnChange = (e) => {
    setValue(e.target.value);
  };
  
  
  const socket = io.connect(`${process.env.REACT_APP_SERVER_DOMAIN}`);


  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    socket.emit('login', isLogin.userId);
  }, []);

  useEffect(() => {
    socket.on('update', (data) => {
      setUpdate(prev => [...prev, data]);
    })
  }, []); 

  
  useEffect(() => {
    const getChatListHandler = async () => {
      
      const getChatList = await axios.get(`http://localhost:3000/getChatHeaderList`, {withCredentials: true});
      if (!getChatList.data.flag) {
        alert(getChatList.data.message);
      }
      setChats(getChatList.data.chatData);
    };
    getChatListHandler();

  }, [update]);
  
  useEffect(() => {
    socket.on('updateChatDetail', (chatData) => {
      setChatRoomFilter('');
      setChatDetail(prev => [...prev, chatData.lastChat]);
      setChatRoomFilter(chatData.user2)
    })
  }, []);

  const handleToChatroom = async (id) => {
    setSendId('')
    setRoom('')
    setChatDetail([]);
    socket.emit('leaveRoom', room);
    socket.disconnect();
    setSendId(id);
    const chatting = await axios.get(`http://localhost:3000/getChatting?id=${id}`, {withCredentials: true});
    if (chatting.data.resulte?.chatList) {
      socket.emit('joinRoom', chatting.data.resulte.room);
      setRoom(chatting.data.resulte.room)
      setChatDetail(chatting.data.resulte.chatList);
    } else {
      socket.emit('joinRoom', chatting.data.resulte2.room);  
      setRoom(chatting.data.resulte2.room)
      setChatDetail(chatting.data.resulte2.chatList)
    }
  };

  const handleSubmitMessage = async () => {
    const loginUser = isLogin.userId;
    const data = {
      msg: value,
      user2: sendId,
      id: loginUser,
      room: loginUser,
    }

    await axios.post(`http://localhost:3000/inChating`, { data }, { withCredentials: true });
    // socket.emit('answer', data);
    setValue('');
    
  };
  const handleSubmitMessageDirect = async (toChat) => {
    const loginUser = isLogin.userId;
    const data = {
      msg: value,
      user2: toChat,
      id: loginUser,
      room: loginUser,
    }
    await axios.post(`http://localhost:3000/inChating`, { data }, { withCredentials: true });
    setValue('');
  };

  const scrollToBottom = () => {
    if ((scrollRef.current)) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  let today = new Date();
  today = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;


  return (
    <ChattingContainer>
      <div className='inner'>
        <div className='chattinglist-box'>
          { chats?.map((chat, index) => {
            return (
              <ChatList 
                key={index}
                audience={chat.user}
                msg={chat.msg}
                chatTime={chat?.chatTime}
                lastChatUser={chat.lastChatUser}
                isLogin={isLogin.userId}
                handleToChatroom={() => handleToChatroom(chat.user)}
              /> 
            )}) 
          }
        </div>
        <div className='chatting-box' >
          <div className='sellerinfo-box'>
            <p><span>{sendId}</span></p>
          </div>
          <div ref={scrollRef} className='chatting-detail-box'>
            { chatDetail.map((chat, index) => {
              return (
                <>
                  {index === 0 && <p className='day'>{today}</p>}
                  { chat.user !== isLogin.userId && 
                    <>
                      <p key={index} className='message-notme-box'>{chat.user}:</p>
                      <p className='message-notme-box'>{chat.msg}</p>
                    </>
                  }
                  { chat.user === isLogin.userId &&
                    <>
                      <p key={index} className='message-box'>{chat.user}:</p>
                      <p className='message-box'>{chat.msg}</p>
                      
                    </>
                  }
                </>
              )
            })}
          </div>

          { sendId 
            ?
              <div className='chatting-input-box' >
                <textarea
                  value={value} 
                  onChange={valueOnChange} 
                  onKeyUp={(e) => { if (e.key === 'Enter') {handleSubmitMessage()} }}
                  placeholder={sendId ? '메시지를 입력해주세요' : '채팅방을 눌러주세요!'}
                  disabled={sendId ? false : true }
                  />
                <button 
                  onClick={handleSubmitMessage}
                  disabled={sendId ? false : true }
                >
                  보내기
                </button>
              </div>
            :
            <div className='chatting-input-box' >
                <textarea
                  value={value} 
                  onChange={valueOnChange} 
                  onKeyUp={(e) => { if (e.key === 'Enter') {handleSubmitMessageDirect(toChat)} }}
                  placeholder={toChat ? '메시지를 입력해주세요' : chats ? '채팅방을 눌러주세요!' : '커뮤니티에서 새로운 채팅을 시작해보세요!'}
                  disabled={toChat ? false : true }
                />
                <button 
                  onClick={handleSubmitMessage}
                  disabled={toChat ? false : true }
                >
                  보내기
                </button>
              </div>
          }
        </div>
      </div>
    </ChattingContainer>
  );
}

export default Chatting;