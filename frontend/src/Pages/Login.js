import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import "../Styles/Page_Styles/Login_Styles.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { LoginInitial } from "../Redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { LoginRoute } from "../utils/ApiRoutes";
import { useMyContext } from "../useContext/GlobalState";
const initialState = {
  email: "",
  password: "",
};
const Login = () => {
  const [state, setState] = useState(initialState);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, password } = state;
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const validateForm = () => {
    if (!email || !password) {
      setErrorEmail("Mòi bạn nhập Email");
      setErrorPassword("Mời bạn nhập mật khẩu.");

      if (!email) {
        setErrorEmail("Mòi bạn nhập Email");
      } else if (!password) {
        setErrorPassword("Mời bạn nhập mật khẩu.");
      }
      return false;
    } else if (email === "") {
      setErrorEmail("Email của bạn không khớp.");
      return false;
    } else if (password === "") {
      setErrorPassword("Mời bạn nhập mật khẩu.");
      return false;
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      dispatch(LoginInitial({ LoginRoute, email, password })).then((item) => {
        if (item.payload.status === true) {
          window.location.href = "/chat";
          // navigate("/chat");
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(item?.payload?.user)
          );
        } else {
          toast.error(item.payload.msg);
        }
      });
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setErrorPassword(null);
      setErrorEmail(null);
    }, [5000]);
  }, [validateForm]);
  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col md={5} className="login_bg"></Col>
          <Col
            md={7}
            className="d-flex align-items-center justify-content-center flex-direction-column"
          >
            <Form
              style={{ width: "80%", maxWidth: 500 }}
              onSubmit={handleSubmit}
            >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email của bạn"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
                {errorEmail && (
                  <Form.Text className="text-muted">
                    <p style={{ color: "red" }}> {errorEmail}</p>
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
                {errorPassword && (
                  <Form.Text className="text-muted">
                    <p style={{ color: "red" }}> {errorPassword}</p>
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="nhớ mật khẩu" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Đăng nhập
              </Button>
              <div className="py-4">
                <p className="text-center">
                  Bạn chưa có tài khoản ? <Link to="/register">Đăng ký</Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Login;
