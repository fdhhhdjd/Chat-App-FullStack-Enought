import React, { useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { SideBar, MessageForm } from "../Import/Index";
import { useMyContext } from "../useContext/GlobalState";
const Chat = () => {
  const { socket, user } = useMyContext();

  useEffect(() => {
    if (user) {
      socket.emit("new-user");
    }
  }, [user]);
  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col md={4}>
            <SideBar />
          </Col>
          <Col md={8}>
            <MessageForm />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Chat;
