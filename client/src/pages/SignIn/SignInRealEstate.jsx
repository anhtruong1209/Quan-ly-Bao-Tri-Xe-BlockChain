import React, { useState, useEffect } from "react";
import "./SignInRealEstate.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye, FaBuilding, FaLock } from "react-icons/fa";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import * as UserService from "../../services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slides/userSlide";
import Loading from "../../components/LoadingComponent/Loading";

const SignInRealEstatePage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isPending, isSuccess, isError } = mutation;

  const handleSignIn = () => {
    if (!email || !password) {
      message.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    mutation.mutate({
      email,
      password,
    });
  };

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    if (res.data.isAdmin !== undefined) {
      localStorage.setItem("isAdmin", JSON.stringify(res.data.isAdmin));
    }
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      localStorage.setItem("refresh_token", JSON.stringify(data?.refresh_token));
      
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
      message.success("Đăng nhập thành công!");
    } else if (isError) {
      message.error("Sai tên tài khoản hoặc mật khẩu");
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (user?.id && user?.isAdmin !== undefined) {
      if (user.isAdmin) {
        navigate("/realestate/admin/dashboard");
      } else {
        navigate("/realestate/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className="signin-realestate">
      <div className="signin-realestate-container">
        {/* Left side - Decorative */}
        <div className="signin-realestate-left">
          <div className="signin-realestate-left-content">
            <div className="signin-realestate-logo">
              <FaBuilding className="logo-icon" />
              <h1>Bất Động Sản</h1>
            </div>
            <div className="signin-realestate-slogan">
              <h2>Quản Lý Giao Dịch</h2>
              <h2>Bất Động Sản</h2>
              <p>Hệ thống quản lý giao dịch bất động sản hiện đại và minh bạch</p>
            </div>
            <div className="signin-realestate-features">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Giao dịch minh bạch</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Xác thực blockchain</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Bảo mật cao</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="signin-realestate-right">
          <div className="signin-realestate-form-wrapper">
            <div className="signin-realestate-form-header">
              <FaBuilding className="form-header-icon" />
              <h2>Đăng Nhập</h2>
              <p>Chào mừng bạn trở lại!</p>
            </div>

            <div className="signin-realestate-form">
              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span> Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSignIn();
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span> Mật khẩu
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={isShowPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSignIn();
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  >
                    {isShowPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="forgot-password">
                  Quên mật khẩu?
                </a>
              </div>

              <Loading isLoading={isPending}>
                <button
                  className="signin-button"
                  onClick={handleSignIn}
                  disabled={!email.length || !password.length || isPending}
                >
                  <FaLock className="button-icon" />
                  Đăng Nhập
                </button>
              </Loading>

              {data?.status === "ERR" && (
                <div className="error-message">{data?.message}</div>
              )}

              <div className="signin-divider">
                <span>Hoặc</span>
              </div>

              <div className="signup-link">
                <p>
                  Chưa có tài khoản?{" "}
                  <NavLink to="/sign-up">Đăng ký ngay</NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInRealEstatePage;

