// 게시글 생성 페이지
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addPost } from "../../store2/post.js";

import {
  Container,
  TextField,
  Button,
  TextareaAutosize,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import RadioButton2 from "../../components/UI/RadioButton2.jsx";
import BarterWrite from "./BarterWrite.jsx";
import SellWrite from "./SellWrite.jsx";
import TypeDropdown from "../UI/Dropdown/TypeDropdown.jsx";
import axios from "axios";

const PostWrite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [content, setContent] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isExchange, setIsExchange] = useState(true);
  const [ownIdolMembers, setownIdolMembers] = useState([]);
  const [findIdolMembers, setfindIdolMembers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(0);

  // 카드 타입 핸들러
  const [cardType, setCardType] = useState(null);

  const posts = useSelector((state) => (state.post ? state.post.posts : []));
  const user = useSelector((state) => (state.user ? state.user.user : []));

  // 교환인지 판매인지
  function onExchangeChange(value) {
    setIsExchange(value === "교환");
  }

  const handleOwnMemberSelection = (members) => {
    setownIdolMembers(members);
  };

  const handleTargetMemberSelection = (members) => {
    setfindIdolMembers(members);
  };
  ////// 0214 그냥 타입 넘겨줄 때 객체형식 말고 문자로 넘겨줌
  const handleTypeChange = (cardType) => {
    setCardType(cardType);
  };

  const handleSelectedGroupChange = (group) => {
    console.log(group);
    setSelectedGroup(group);
  };

  // const handleTypeChange = (cardType) => {
  //   if (cardType == null) {
  //     cardType = {
  //       value: "",
  //       label: "",
  //     };
  //   }
  //   setCardType(cardType);
  // };

  // 제목 변경 핸들러
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // 이미지 변경 핸들러
  const handleImageDelete = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });

    setImagePreviews((prevImagePreviews) => {
      const newImagePreviews = [...prevImagePreviews];
      newImagePreviews.splice(index, 1);
      return newImagePreviews;
    });
  };

  const fileInputRef = useRef(null);
  const handleImageAdd = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    setImages((prevImages) => [...prevImages, ...Array.from(files)]);

    const newImages = Array.from(files);
    const newImagePreviews = [];

    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviews.push(reader.result);
        // 모든 파일의 미리보기 이미지가 준비되면 상태 업데이트
        if (newImagePreviews.length === newImages.length) {
          setImagePreviews((prevImagePreviews) => [
            ...prevImagePreviews,
            ...newImagePreviews,
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 내용 변경 핸들러
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const [loading, setLoading] = useState(false);
  // 게시물 생성 버튼 클릭 핸들러
  const handlePostClick = () => {
    setLoading(true);
    // 새로운 게시물 객체 생성
    const newPost = new FormData();
    newPost.append("title", title);
    // newPost.append("content", content);

    const encodedContent = encodeURIComponent(content);
    newPost.append("content", encodedContent);
    ownIdolMembers.forEach((member) => {
      newPost.append("ownIdolMembers", member.idolMemberId);
    });

    findIdolMembers.forEach((member) => {
      newPost.append("findIdolMembers", member.idolMemberId);
    });
    newPost.append("cardType", cardType.value);

    images.forEach((image) => {
      newPost.append(`photos`, image);
    });

    newPost.append("groupId", selectedGroup.idolGroupId);

    // formdata값확인용 코드 //////
    const formDataToJson = (formData) => {
      const jsonObject = {};
      for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
      }
      return JSON.stringify(jsonObject);
    };

    const test = formDataToJson(newPost);
    console.log(test);
    // navigate("/post", {state: });

    axios
      .post(process.env.REACT_APP_API_URL + "barter", newPost, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // navigate("/post");
        setTimeout(() => {
          setLoading(false);
          navigate("/post");
        }, 3000);
      })
      .catch((error) => {
        setTimeout(() => {
          setLoading(false);
          console.error("Error creating post:", error);
        }, 3000);
      });
  };

  const handleCancelButton = () => {
    console.log("게시물 생성 취소");
    navigate("/post");
  };

  return (
    <Container>
      <h2 className="write-title">게시글 작성하기</h2>

      <div id="write-container">
        <div id="image-input">
          <div id="image-list">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              ref={fileInputRef}
              multiple
            />
            <div id="image-add-button" onClick={handleImageAdd}>
              <PhotoCameraIcon id="image-add-icon" />
            </div>
            {imagePreviews &&
              imagePreviews.map((preview, index) => (
                <div
                  className="image-container"
                  key={index}
                  onClick={() => handleImageDelete(index)}
                >
                  <img
                    className="image-preview"
                    src={preview}
                    alt={`Image Preview ${index + 1}`}
                  />
                </div>
              ))}
          </div>
          <p className="info-msg">* 사진 클릭 시 삭제됩니다.</p>
        </div>
        <div id="title-container">
          <h3 style={{ margin: "0" }}>제목</h3>
          <input
            id="title-input"
            value={title}
            onChange={handleTitleChange}
            variant="outlined"
            placeholder="앨범명, 버전명을 입력하세요"
          />
        </div>

        <div id="group-member-input">
          {isExchange ? (
            <BarterWrite
              onChange={(ownIdolMembers, findIdolMembers, selectedGroup) => {
                handleOwnMemberSelection(ownIdolMembers);
                handleTargetMemberSelection(findIdolMembers);
                handleSelectedGroupChange(selectedGroup);
              }}
            />
          ) : (
            <SellWrite
              onChange={(ownIdolMembers) => {
                handleOwnMemberSelection(ownIdolMembers);
              }}
            />
          )}
        </div>
        <div id="card-input">
          <h3>포토카드 종류</h3>
          <TypeDropdown
            onChange={(type) => {
              handleTypeChange(type);
            }}
          />
        </div>

        <div id="content-input-container">
          <h3>상세 내용</h3>
          <textarea
            className="content-input"
            value={content}
            onChange={handleContentChange}
            placeholder="포토카드 상태에 대한 세부 내용을 적어주세요."
            style={{ whiteSpace: "pre-line" }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          {loading && <CircularProgress />}
        </div>
        <div id="button-container">
          <Button
            variant="contained"
            color="primary"
            onClick={handlePostClick}
            style={{ marginRight: "10px" }}
          >
            게시글 등록
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleCancelButton}
          >
            취소
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default PostWrite;
