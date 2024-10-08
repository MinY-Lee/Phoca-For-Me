import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import getCookie from "../../utils/getCookie";

import { setBias } from "../../store2/loginUser.js";

import { Avatar, Button } from "@mui/material";

import GroupDropdown from "../UI/Dropdown/GroupDropdown2";
import MemberDropdown from "../UI/Dropdown/MemberDropdown2";

const Bias = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const [selectedGroup, setSelectedGroup] = useState(user.defalutGroup);
  const [selectedMember, setSelectedMember] = useState(user.defalutMember);
  const [imageUrl, setImageUrl] = useState(null);

  // useEffect 해서 렌더링할 때 최애 정보 들고와라
  useEffect(() => {
    if (getCookie('profile')) {
      axios
        .get(process.env.REACT_APP_API_URL + `user/bias`, {
          withCredentials: true,
        })
        .then((response) => {
          setImageUrl(response.data.idolImage);
        })
        .catch((error) => {
          console.error("Error get bias:", error);
        });
    }
  }, [user]);

  const handleGroupChange = (group) => {
    if (group) {
      setSelectedGroup(group);
    } else {
      setSelectedGroup(null);
    }
  };

  const handleMemberChange = (member) => {
    setSelectedMember(member);
  };

  const generateImageUrl = (group, member) => {
    if (group && member) {
      return member.idolImage;
    }
    return null;
  };

  const handleApplyClick = () => {
    // db 에 반영하기
    axios
      .put(
        process.env.REACT_APP_API_URL + `user/bias`,
        {
          idolMemberId: selectedMember.idolMemberId,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setImageUrl(response.data);
        dispatch(setBias([selectedGroup, selectedMember]));
      })
      .catch((error) => {
        console.error("Error setting bias:", error);
      });
  };

  return (
    <div className="profile-item-container">
      <h2 className="profile-title">최애 설정</h2>

      <div className="profile-dropdown-container">
        <div className="profile-group-container">
          <div className="bias-title">그룹명</div>
          <div>
            <GroupDropdown
              isProfile={true}
              onChange={(group) => {
                handleGroupChange(group);
              }}
            />
          </div>
        </div>
        <div id="bias-member-container">
          <div className="bias-title">멤버명</div>
          <div>
            <MemberDropdown
              isProfile={true}
              selectedGroup={selectedGroup}
              onChange={(member) => {
                handleMemberChange(member);
              }}
            />
          </div>
        </div>
        <div id="bias-description">*설정 시 프로필이 바뀌어요!</div>
      </div>
      <div>
        <Avatar id="bias-avatar" src={imageUrl} />
      </div>
      <div>
        <Button variant="contained" onClick={handleApplyClick}>
          설정
        </Button>
      </div>
    </div>
  );
};

export default Bias;
