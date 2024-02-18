import React, { useEffect, useState } from 'react';
import { dateFormat, needLogin } from '../../../util';
import { MdOutlineClear } from "react-icons/md";
import axios from 'axios';

function DailyDogComment(props) {
  const { item, user } = props;
  console.log(props);

  const [ isExpanded, setIsExpanded ] = useState(false);
  const [ comments, setComments ] = useState([]);
  const [ newComment, setNewComment ] = useState('');

  useEffect(() => {
    const dailyDogCommentData = async () => {
      try {
        // const responseComment = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/community/daily/comment/${item._id}`);
        const responseComment = await axios.get(`http://localhost:3000/community/daily/comment/${item._id}`);
        setComments(responseComment.data);
      } catch (err) {
        console.error(err);
      }
    }
    dailyDogCommentData();
  }, []);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value)
  };

  const handleSubmitComment = async () => {

    if (!user) {
      return needLogin();
    }

    try {
      const date = new Date();
      // await axios.post(`${process.env.REACT_APP_SERVER_DOMAIN}/community/daily/comment/insert`, { postId: item._id , comment: newComment, date, author: user.signUserNicname, authorId: user._id }); 
      await axios.post(`http://localhost:3000/community/daily/comment/insert`, { postId: item._id , comment: newComment, date, author: user.signUserNicname, authorId: user._id }); 

      const responseComment = await axios.get(`http://localhost:3000/community/daily/comment/${item._id}`); 
      setComments(responseComment.data);
    } catch (err) {
      console.error(err);
    }
    setNewComment('');
  }

  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/community/daily/comment/delete/${id}`);
      const responseComment = await axios.get(`http://localhost:3000/community/daily/comment/${item._id}`); 
      setComments(responseComment.data);
    } catch (err) {
      console.error(err);
    }
  } 

  console.log(comments);

  return (
    <>      
      <div className='comment-box'>
        <div className='comment-detail-box'>
          <h2>댓글 {comments.length}</h2>
          <div className='comment-insert-box'>
            <input 
              type='text' 
              value={newComment} 
              onChange={handleCommentChange}
              onKeyUp={(e) => { if (e.key === 'Enter') {handleSubmitComment()} }}
            />
            <button onClick={handleSubmitComment}>등록</button>
          </div>
          <div className='comment-list-box'>
            {comments && comments.map(comment => {
              return (
                <div key={comment._id} className='comment-one-box'>
                  <img src='https://i.namu.wiki/i/Bge3xnYd4kRe_IKbm2uqxlhQJij2SngwNssjpjaOyOqoRhQlNwLrR2ZiK-JWJ2b99RGcSxDaZ2UCI7fiv4IDDQ.webp'/>
                  <div className='comment-user-box'>
                    <div>
                      <p>{comment.author}</p>
                      <p>{dateFormat(comment.date)}</p>
                      {user && comment.author == user.signUserNicname && <button onClick={() => handleDeleteComment(comment._id)}><MdOutlineClear /></button>}
                    </div>
                    {comment.comment.length > 120
                      ? <div className='comment-expanded'> 
                          <p>{comment.comment.slice(0, 120)}{isExpanded ? '' : '...'}{isExpanded && comment.comment.slice(100, comment.comment.length)}
                            <button onClick={toggleExpansion}>{isExpanded ? '접기' : '더보기'}</button>
                          </p>
                        </div>
                      : <p>{comment.comment}</p>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default DailyDogComment;