import React, { useState, useEffect } from "react";
import "./SignIn.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye, FaCar, FaWrench, FaShieldAlt, FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import { jwtDecode } from "jwt-decode";
import * as UserService from "../../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Loading from "../../components/LoadingComponent/Loading";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { message } from "antd";
import { updateUser } from "../../redux/slides/userSlide";

const SignInPage = (props) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleOnchangePassword = (value) => {
    setPassword(value);
  };
  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isPending, isSuccess, isError } = mutation;
  console.log("mutation: ", mutation);
  const handleSignIn = () => {
    console.log("logingloin");
    mutation.mutate({
      email,
      password,
    });
  };

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    console.log("Detail user is Admin: ", res.data.isAdmin);
    // Lưu isAdmin vào localStorage
    if (res.data.isAdmin !== undefined) {
      localStorage.setItem("isAdmin", JSON.stringify(res.data.isAdmin));
    }
    if (res.data.isAdmin) setIsAdmin(true);
    else setIsAdmin(false);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };
  useEffect(() => {
    if (isSuccess) {
      console.log("Kết quả đăng nhập: ", isSuccess);
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));

      localStorage.setItem(
        "refresh_token",
        JSON.stringify(data?.refresh_token)
      );
      // console.log("access_token bên sign in: ", data?.access_token);
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        // console.log("decode: ", decoded);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    } else if (isError) {
      message.error("Sai tên tài khoản hoặc mật khẩu");
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (user?.id && user?.isAdmin !== undefined) {
      if (user.isAdmin) {
        navigate("/home");
      } else {
        navigate("/user/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className="signin-container">
      <div className="signin-wrapper">
        {/* Left Side - Visual Section */}
        <div className="signin-visual">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <div className="logo-section">
              <div className="logo-icon">
                <FaCar className="car-icon" />
                <FaWrench className="wrench-icon" />
              </div>
              <h2 className="visual-title">VehicleWarranty</h2>
              <p className="visual-subtitle">Hệ thống quản lý bảo trì & bảo hành</p>
            </div>
            <div className="features-list">
              <div className="feature-item">
                <FaShieldAlt className="feature-icon" />
                <span>Bảo hành minh bạch</span>
              </div>
              <div className="feature-item">
                <FaCar className="feature-icon" />
                <span>Theo dõi lịch sử bảo trì</span>
              </div>
              <div className="feature-item">
                <FaWrench className="feature-icon" />
                <span>Quản lý sửa chữa hiệu quả</span>
              </div>
            </div>
            <div className="decorative-elements">
              <div className="gear gear-1"></div>
              <div className="gear gear-2"></div>
              <div className="gear gear-3"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="signin-form-section">
          <div className="form-wrapper">
            <div className="form-header">
              <h1 className="form-title">
                <span className="title-icon"><FaUser /></span>
                Đăng nhập
              </h1>
              <p className="form-subtitle">Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.</p>
            </div>

            <div className="form-content">
              <div className="input-group">
                <label className="input-label">
                  <MdEmail className="label-icon" />
                  Email
                </label>
                <InputForm
                  className="custom-input"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={handleOnchangeEmail}
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <FaLock className="label-icon" />
                  Mật khẩu
                </label>
                <div className="password-wrapper">
                  <InputForm
                    className="custom-input"
                    placeholder="Nhập mật khẩu"
                    type={isShowPassword ? "text" : "password"}
                    value={password}
                    onChange={handleOnchangePassword}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  >
                    {isShowPassword ? (
                      <FaRegEyeSlash size={18} />
                    ) : (
                      <FaRegEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {data?.status === "ERR" && (
                <div className="error-message">
                  <span>{data?.message}</span>
                </div>
              )}

              <div className="form-footer-top">
                <NavLink to="/forgot-password" className="forgot-link">
                  Quên mật khẩu?
                </NavLink>
              </div>

              <Loading isLoading={isPending}>
                <ButtonComponent
                  disabled={!email.length || !password.length}
                  onClick={handleSignIn}
                  size={40}
                  styleButton={{
                    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                    height: "52px",
                    width: "100%",
                    border: "none",
                    borderRadius: "12px",
                    margin: "24px 0 16px",
                    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.4)",
                    transition: "all 0.3s ease",
                  }}
                  textbutton={"Đăng nhập"}
                  styleTextButton={{
                    color: "#fff",
                    fontSize: "16px",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                  }}
                />
              </Loading>

              <div className="form-footer-bottom">
                <p className="signup-text">
                  Bạn mới sử dụng VehicleWarranty?{" "}
                  <NavLink to="/sign-up" className="signup-link">
                    Đăng ký ngay
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
