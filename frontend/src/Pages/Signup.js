import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { avatar } from "../Import/ImportImg";
import { RegisterInitial } from "../Redux/AuthSlice";
import "../Styles/Page_Styles/Signup_Style.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RegisterRoute } from "../utils/ApiRoutes";
const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const Signup = () => {
  const [state, setState] = useState(initialState);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const { loadings } = useSelector((state) => state.auth);
  const [errorName, setErrorName] = useState(null);
  const navigate = useNavigate();
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);
  const [uploadImg, setUploadImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { name, email, password, confirmPassword } = state;
  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return toast.error("Kích thước quá lớn!");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", process.env.REACT_APP_KEY_CLOUDINARY);
    try {
      setUploadImg(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/taithinhnam/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadImg(false);
      return urlData.url;
    } catch (error) {
      setUploadImg(false);
      console.log(error);
    }
  };
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const handleValidation = () => {
    if (!name || !email || !password || !confirmPassword) {
      setErrorName("Tên không được trống");
      setErrorEmail("Email Không được để trống.");
      setErrorPassword("Mật khẩu không được để trống.");
      setErrorConfirmPassword("Nhập lại mật khẩu không được để trống.");
      if (!name) {
        setErrorName("Tên không được trống");
      } else if (!email) {
        setErrorEmail("Email Không được để trống.");
      } else if (!password) {
        setErrorPassword("Mật khẩu không được để trống.");
      } else if (!confirmPassword) {
        setErrorConfirmPassword("Nhập lại mật khẩu không được để trống.");
      }
      return false;
    } else if (!image) {
      toast.error("Mời bạn chọn hình !!");
      return false;
    } else if (password !== confirmPassword) {
      setErrorPassword("Mật khẩu và nhập mật khẩu không khớp.");
      setErrorConfirmPassword("Mật khẩu và nhập mật khẩu không khớp.");

      return false;
    } else if (name.length < 3) {
      setErrorName("Tên của bạn phải lớn hơn 3 kí tự.");
      return false;
    } else if (password.length < 8) {
      setErrorPassword("Mật Khẩu của bạn phải lớn hơn 8 kí tự.");
      return false;
    } else if (email === "") {
      setErrorEmail("Email của bạn không đúng.");
      return false;
    }

    return true;
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    const url = await uploadImage(image);
    if (handleValidation()) {
      dispatch(
        RegisterInitial({ RegisterRoute, name, email, password, picture: url })
      )
        .then((item) => {
          if (item.payload.status === true) {
            navigate("/login");
          } else {
            toast.error(item.payload.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setErrorConfirmPassword(null);
      setErrorName(null);
      setErrorPassword(null);
      setErrorEmail(null);
    }, [5000]);
  }, [handleValidation]);
  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col
            md={7}
            className="d-flex align-items-center justify-content-center flex-direction-column"
          >
            <Form
              style={{ width: "80%", maxWidth: 500 }}
              onSubmit={handleSignUp}
            >
              <h1 className="text-center">Tạo Tài khoản</h1>
              <div className="signup-profile-pic_container">
                <img
                  src={imagePreview || avatar}
                  alt=""
                  className="signup-profile-pic"
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  <i className="fas fa-plus-circle add-picture-icon"></i>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  hidden
                  accept="image/png, image/jpeg"
                  onChange={handleChangeImage}
                />
              </div>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Tên bạn</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ:taideptrai"
                  name="name"
                  value={name}
                  onChange={handleChange}
                />
                {errorName && (
                  <Form.Text className="text-muted text-danger">
                    <p style={{ color: "red" }}> {errorName}</p>
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ví dụ:nguyentientai@gmail.com"
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
                <Form.Label>Mật Khẩu</Form.Label>
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

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Nhập lại mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                />
                {errorConfirmPassword && (
                  <Form.Text className="text-muted">
                    <p style={{ color: "red" }}> {errorConfirmPassword}</p>
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Nhớ mật khẩu" />
              </Form.Group>
              <Button variant="primary" type="submit">
                {loadings ? <Spinner animation="grow" /> : "Đăng ký ngay"}
              </Button>
              <div className="py-4">
                <p className="text-center">
                  Bạn không có tài khoản ? <Link to="/login">Đăng nhập</Link>
                </p>
              </div>
            </Form>
          </Col>
          <Col md={5} className="signup_bg"></Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Signup;
