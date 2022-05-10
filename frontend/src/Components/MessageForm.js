import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import "../Styles/Compoents-Styles/MessageForm_Style.css";
import { useMyContext } from "../useContext/GlobalState";
const MessageForm = () => {
  const [message, setMessage] = useState("");
  const messageEndRef = useRef(null);
  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return month + "/" + day + "/" + year;
  };
  const {
    user,
    setUser,
    rooms,
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
    socket,
  } = useMyContext();
  const todayDate = getFormattedDate();
  socket.off("room-messages").on("room-messages", (roomMessage) => {
    setMessages(roomMessage);
    console.log(roomMessage);
  });
  const ScrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  };
  useEffect(() => {
    ScrollToBottom();
  }, [messages]);
  return (
    <React.Fragment>
      <div className="message-output">
        {user && !privateMemberMsg?.id && (
          <div className="alert alert-info">
            You are in the {currentRoom} room
          </div>
        )}
        {user && privateMemberMsg?.id && (
          <div className="alert alert-info conversation-info">
            <span>
              You are in the {privateMemberMsg.name}{" "}
              <img
                src={privateMemberMsg.picture}
                alt="image"
                className="conversation-profile-pic"
              />
            </span>
          </div>
        )}
        {!user && <div className="alert alert-danger">Please Login</div>}
        {user &&
          messages.map(({ _id: date, messagesByDate, from: sender }, idx) => (
            <div key={idx}>
              <p className="alert alert-info text-center message-date-indicator">
                {date}
              </p>
              {messagesByDate?.map(
                ({ content, time, from: sender }, msgIdx) => (
                  <div
                    key={msgIdx}
                    className={
                      sender?.email === user?.email
                        ? "message"
                        : "incoming-message"
                    }
                  >
                    <div className="message-inner">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={sender.picture}
                          style={{
                            width: 35,
                            height: 35,
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: 10,
                          }}
                        />
                        <p className="message-sender">
                          {sender._id == user?._id ? "You" : sender.name}
                        </p>
                      </div>
                      <p className="message-content">{content}</p>
                      <p className="message-timestamp-left">{time}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        <div ref={messageEndRef} />
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Tin nhắn"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!user}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "orange" }}
              disabled={!user}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default MessageForm;
