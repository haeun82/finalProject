import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getLoginUser } from '../../../features/userInfoSlice';
import { useParams } from 'react-router-dom';

const DailyDogEditContainer = styled.div`
  max-width: 1200px;
  min-height: 800px;
  margin: 70px auto;

  h1 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .tip-box {
    font-size: 13px;
    line-height: 26px;
    padding: 6px 0;
    color: #68a6fe;
    margin-bottom: 10px;
  }

  input {
    width: 100%;
    border: 1px solid #ccc;
    border-bottom: none;
    padding: 8px 25px;

    &:focus {
      outline: none;
    }
  }

  .btn-box {
    margin-top: 10px;
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

   .ProseMirror-widget {
    background: #fff;
    font-size: 16px;
    cursor: text;
  }
`;

function DailyDogEdit(props) {
  // 이미지 첨부 시 바로 s3에 저장 됨
  // 해결: 백에서 images와 content와 비교하여 값이 없으면 s3의 image를 삭제해라 
  const navigate = useNavigate();
  const user = useSelector(getLoginUser);
  const { postId } = useParams();

  const [ values, setValues ] = useState({
    title: '',
    content: '',
  });
  const [ images, setImages ] = useState([]);
  const [ imagesKey, setImagesKey ] = useState([]);

  const { title, content } = values;

  const editorRef = useRef();

  useEffect(() => {
    const dailyDogEditData = async () => {
      try {
        // const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/community/daily/edit/${postId}`);
        const response = await axios.get(`http://localhost:3000/community/daily/edit/${postId}`);
        setValues(prev => ({ ...prev, title: response.data.data.title, author: response.data.data.author }));
        editorRef.current?.getInstance().setHTML(response.data.data.content)

        setImages(image => [ ...image, ...response.data.data.imgUrl ]);
        setImagesKey(image => [ ...image, ...response.data.data.imgKey ]);
        
        if (user) {
          if (!(user.signUserNicname === response.data.data.author)) {
            alert('수정 권한이 없습니다.')
            return navigate(-1);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    dailyDogEditData();
  }, []);

  // 이미지 첨부를 위한 코드
  // https://kim-hasa.tistory.com/133
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().removeHook('addImageBlobHook');
      editorRef.current.getInstance().addHook('addImageBlobHook', (blob, callback) => {
        (async () => {
          let formData = new FormData();
          formData.append('img', blob);

          const response = await axios.post(`http://localhost:3000/community/daily/insert/image`, formData, {
            header: { 'content-type': 'multipart/formdata' },
            withCredentials: true,
          });

          const imageUrl = `${response.data.fileName}`;
          const imageKey = `${response.data.fileKey}`;
          setImages(image => [ ...image, imageUrl ]);
          setImagesKey(imagekey => [ ...imagekey, imageKey ]);

          callback(imageUrl, 'img');
        })();

        return false;
      });
    }

    return () => {};
  }, [editorRef]);

  const titleOnChange = (e) => {
   const title = e.target.value
   setValues(value => ({ ...value, title }));
  };

  const contentOnChange = () => {
    const content = editorRef.current?.getInstance().getHTML();
    setValues(value => ({ ...value, content }));
  };

  const handleSubmitValue = async () => {

    if (!title) {
      return alert('제목을 입력해주세요.');
    } else if (!content || content == '<p><br></p>') {
      return alert('내용을 입력해주세요.');
    } else {
      try {
        await axios.patch(`http://localhost:3000/community/daily/edit/${postId}`, { title, content, imgUrl: images, imgKey: imagesKey })
        alert('게시글이 수정되었습니다.');
        navigate('/community/dailyDog');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <DailyDogEditContainer>
      <h1>데일리독 글수정</h1>
      <div className='tip-box'>
        <p>* 첫번째로 삽입한 이미지가 대표 이미지가 되며 업로드 시 이미지의 크기는 460*360으로 고정 됩니다.</p>
        <p>* 작성하신 글은 자동으로 가운데 정렬 됩니다.</p>
      </div>
      <input type='text' defaultValue={title} onChange={titleOnChange} placeholder='제목을 입력해주세요' />
      <Editor
        ref={editorRef}
        placeholder="내용을 입력해주세요."
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={false}
        language="ko-KR"
        plugins={[colorSyntax]}
        hideModeSwitch={true}
        onChange={contentOnChange}
      />  
      <div className='btn-box'>
        <button onClick={() => navigate(-1)}>취소</button>
        <button onClick={handleSubmitValue}>수정</button>
      </div>
    </DailyDogEditContainer>
  );
}

export default DailyDogEdit;