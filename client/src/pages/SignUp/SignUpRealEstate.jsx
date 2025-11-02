import React, { useState, useEffect } from "react";
import "./SignUpRealEstate.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye, FaBuilding, FaUserPlus } from "react-icons/fa";
import { message } from "antd";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";

const SignUpRealEstatePage = () => {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const mutation = useMutationHooks((data) => UserService.signupUser(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setTimeout(() => {
        navigate("/sign-in");
      }, 1500);
    } else if (isError) {
      message.error(data?.message || "Lỗi khi đăng ký");
    }
  }, [isSuccess, isError, data, navigate]);

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      message.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (password.length < 6) {
      message.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    mutation.mutate({ email, password, confirmPassword, name });
  };

  return (
    <div className="signup-realestate">
      <div className="signup-realestate-container">
        {/* Left side - Decorative */}
        <div className="signup-realestate-left">
          <div className="signup-realestate-left-content">
            <div className="signup-realestate-logo">
              <FaBuilding className="logo-icon" />
              <h1>Bất Động Sản</h1>
            </div>
            <div className="signup-realestate-slogan">
              <h2>Tham Gia Ngay</h2>
              <h2>Hệ Thống Quản Lý</h2>
              <p>Đăng ký tài khoản để bắt đầu quản lý giao dịch bất động sản một cách hiệu quả</p>
            </div>
            <div className="signup-realestate-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">🏠</div>
                <div>
                  <h4>Quản lý BĐS</h4>
                  <p>Dễ dàng quản lý danh sách bất động sản</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">💼</div>
                <div>
                  <h4>Giao dịch an toàn</h4>
                  <p>Xác thực bằng công nghệ blockchain</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🔐</div>
                <div>
                  <h4>Bảo mật cao</h4>
                  <p>Thông tin được mã hóa và bảo vệ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="signup-realestate-right">
          <div className="signup-realestate-form-wrapper">
            <div className="signup-realestate-form-header">
              <FaUserPlus className="form-header-icon" />
              <h2>Đăng Ký</h2>
              <p>Tạo tài khoản mới của bạn</p>
            </div>

            <div className="signup-realestate-form">
              <div className="form-group">
                <label htmlFor="name">
                  <span className="label-icon">👤</span> Họ và tên
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

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
                    if (e.key === 'Enter') handleSignUp();
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
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSignUp();
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

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <span className="label-icon">🔒</span> Xác nhận mật khẩu
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={isShowConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSignUp();
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                  >
                    {isShowConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
              </div>

              {data?.status === "ERR" && (
                <div className="error-message">{data?.message}</div>
              )}

              <Loading isLoading={isPending}>
                <button
                  className="signup-button"
                  onClick={handleSignUp}
                  disabled={!email.length || !password.length || !confirmPassword.length || isPending}
                >
                  <FaUserPlus className="button-icon" />
                  Đăng Ký
                </button>
              </Loading>

              <div className="signup-divider">
                <span>Hoặc</span>
              </div>

              <div className="signin-link">
                <p>
                  Đã có tài khoản?{" "}
                  <NavLink to="/sign-in">Đăng nhập ngay</NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpRealEstatePage;

