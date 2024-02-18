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

const DailyDogWriteContainer = styled.div`
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

function DailyDogWrite(props) {
  const navigate = useNavigate();
  const user = useSelector(getLoginUser);

  const [ values, setValues ] = useState({
    id: '',
    title: '',
    content: '',
  });
  const [ images, setImages ] = useState([]);
  const [ imagesKey, setImagesKey ] = useState([]);

  const { id, title, content } = values;

  useEffect(() => {
    const dailyDogData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/community/daily/number`);
        setValues(prevValue => ({ ...prevValue, id: response.data.id ? response.data.id + 1 : 1 }));
      } catch (err) {
        console.error(err);
      }
    }
    dailyDogData();
  }, [])

  const editorRef = useRef();

  const titleOnChange = (e) => {
   const title = e.target.value
   setValues(value => ({ ...value, title }));
  };

  const contentOnChange = () => {
    const content = editorRef.current?.getInstance().getHTML();
    setValues(value => ({ ...value, content }));
  };

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

  console.log(content);

  const handleSubmitValue = async () => {

    if (!title) {
      return alert('제목을 입력해주세요.');
    } else if (!content || content == '<p><br></p>') {
      return alert('내용을 입력해주세요.');
    } else {
      try {
        const date = new Date();

        await axios.post(`http://localhost:3000/community/daily/insert`, { id, title, content, imgUrl: images, imgKey: imagesKey, author: user.signUserNicname, authorId: user._id, date })
        alert('게시글이 등록되었습니다.');
        navigate('/community/dailyDog');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <DailyDogWriteContainer>
      <h1>데일리독</h1>
      <div className='tip-box'>
        <p>* 첫번째로 삽입한 이미지가 대표 이미지가 되며 업로드 시 이미지의 크기는 460*360으로 고정 됩니다.</p>
        <p>* 작성하신 글은 자동으로 가운데 정렬 됩니다.</p>
      </div>
      <input type='text' value={title} onChange={titleOnChange} placeholder='제목을 입력해주세요' />
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
        <button onClick={handleSubmitValue}>등록</button>
      </div>
    </DailyDogWriteContainer>
  );
}

export default DailyDogWrite;