import React, { useEffect, useState } from "react";
import { ListGroup, Row, Col } from "react-bootstrap";
import { useMyContext } from "../useContext/GlobalState";
import "../Styles/Compoents-Styles/Sidebar_Style.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import resetNotify from "../Redux/AuthSlice";
import AddNotify from "../Redux/AuthSlice";
import { resetNotifications, AddNotifications } from "../Redux/AuthSlice";
const SideBar = () => {
  const {
    user,
    setUser,
    setRooms,
    currentRoom,
    setCurrentRoom,
    members,
    setMembers,
    messages,
    setMessages,
    privateMemberMsg,
    setPrivateMemberMsg,
    newMessage,
    setNewMessage,
    rooms,
    socket,
    SOCKET_URL,
  } = useMyContext();
  const dispatch = useDispatch();
  const [notify, setNotify] = useState([]);
  const joinRoom = (room, isPublic = true) => {
    if (!user) {
      return alert("Please Login");
    }
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);
    if (isPublic) {
      setPrivateMemberMsg(null);
    }
    dispatch(resetNotifications(room));

    socket.off("notifications").on("notifications", (room) => {
      if (currentRoom !== room) {
        dispatch(AddNotifications(room));
        // setNotify((notify) => [...notify, room]);
      }
      dispatch(AddNotifications(room));
    });
  };
  const orderIds = (id1, id2) => {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  };
  const HandlePrivateMemberMsg = (member) => {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  };
  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      GetRoom();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, [user]);
  //take user All Rom
  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  const GetRoom = () => {
    fetch(`${SOCKET_URL}/rooms`).then((res) => {
      res.json({}).then((data) => setRooms(data));
    });
  };
  return (
    <React.Fragment>
      <h2>Phòng Mở chung </h2>
      {rooms?.map((item, index) => {
        return (
          <>
            <ListGroup.Item
              key={index}
              onClick={() => joinRoom(item)}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
              active={item == currentRoom}
            >
              {item}{" "}
              {currentRoom !== item && (
                <span className="badge rounded-pill bg-primary">
                  {/* {notify.length === 0 ? "" : notify.length} */}
                  {user.newMessage[item]}
                </span>
              )}
            </ListGroup.Item>
          </>
        );
      })}
      <h2>Các thành viên </h2>
      {members?.map((member) => {
        return (
          <ListGroup.Item
            key={member._id}
            style={{ cursor: "pointer" }}
            active={privateMemberMsg?._id == member?._id}
            onClick={() => HandlePrivateMemberMsg(member)}
            disabled={member._id === user._id}
          >
            <Row>
              <Col xs={2} className="member-status">
                <img
                  src={member.picture}
                  alt="member"
                  className="member-status-img"
                />
                {member.status == "online" ? (
                  <i className="fas fa-circle sidebar-online-status"></i>
                ) : (
                  <i className="fas fa-circle sidebar-offline-status"></i>
                )}
              </Col>
              <Col xs={9}>
                {member.name}
                {member._id === user._id && " ( You ) "}
                {member.status == "offline" && " ( Offline )"}
              </Col>
              <Col xs={1}>
                <span className="badge rounded-pill bg-primary">
                  {user.newMessage[orderIds(member._id, user._id)]}
                </span>
              </Col>
            </Row>
          </ListGroup.Item>
        );
      })}
    </React.Fragment>
  );
};

export default SideBar;
