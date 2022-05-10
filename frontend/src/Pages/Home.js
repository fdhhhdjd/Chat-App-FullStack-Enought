import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../Styles/Page_Styles/HomeStyle.css";
const Home = () => {
  return (
    <React.Fragment>
      <Row>
        <Col
          md={6}
          className="d-flex flex-direction-column align-items-center justify-content-center"
        >
          <div>
            <h1>Chia sẽ với bạn bè trên thế giới!!!</h1>
            <p>bắt đầu chát và kết nối với thế giới.</p>
            <LinkContainer to="/chat">
              <Button variant="success">
                Bắt đầu thôi{" "}
                <i className="fas fa-comments home-message-icon"></i>
              </Button>
            </LinkContainer>
          </div>
        </Col>
        <Col md={6} className="home_bg"></Col>
      </Row>
    </React.Fragment>
  );
};

export default Home;
