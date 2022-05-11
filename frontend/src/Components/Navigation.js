import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { logo } from "../Import/ImportImg";
import { LogoutInitial } from "../Redux/AuthSlice";
import { LogoutRoute } from "../utils/ApiRoutes";
import { useDispatch, useSelector } from "react-redux";
import { useMyContext } from "../useContext/GlobalState";
const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState();
  const { auth } = useSelector((state) => ({
    ...state.auth,
  }));
  const { messages } = useMyContext();
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setUser(user);
  }, [auth]);

  const handleLogout = async (e) => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    // dispatch(LogoutInitial({ LogoutRoute, id })).then((data) => {
    //   if (data?.payload?.status === true) {
    //     localStorage.clear();
    //     window.location.href = "/login";
    //   }
    // });
    dispatch(LogoutInitial({ LogoutRoute, user })).then((data) => {
      if (data?.payload?.status === true) {
        localStorage.clear();
        window.location.href = "/login";
      }
    });
  };

  return (
    <React.Fragment>
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="logo" style={{ width: 60, height: 60 }} />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {!user && (
                <React.Fragment>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/chat">
                    <Nav.Link>Chat</Nav.Link>
                  </LinkContainer>
                </React.Fragment>
              )}

              {user && (
                <NavDropdown
                  title={
                    <>
                      <img
                        src={user.picture}
                        alt="picture"
                        style={{
                          width: 30,
                          height: 30,
                          marginRight: 10,
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                      {user.name}
                    </>
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Something
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item>
                    <Button variant="danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </React.Fragment>
  );
};

export default Navigation;
