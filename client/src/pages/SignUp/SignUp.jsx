import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import InputForm from "../../components/InputForm/InputForm";
import * as message from "../../components/Message/Message";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { FaRegEyeSlash, FaRegEye, FaUserPlus } from "react-icons/fa";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import * as UserService from "../../services/UserService";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import AuthLayout from "../../components/AuthLayout/AuthLayout";

const SignUp = () => {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const mutation = useMutationHooks((data) => UserService.signupUser(data));

  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleNavigateSignIn();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    mutation.mutate({ email, password, confirmPassword });
  };

  return (
    <AuthLayout
      title="Đăng ký"
      subtitle="Tạo tài khoản mới để bắt đầu sử dụng hệ thống."
      icon={FaUserPlus}
    >
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

        <div className="input-group">
          <label className="input-label">
            <FaLock className="label-icon" />
            Xác nhận mật khẩu
          </label>
          <div className="password-wrapper">
            <InputForm
              className="custom-input"
              placeholder="Nhập lại mật khẩu"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            >
              {isShowConfirmPassword ? (
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
          <NavLink to="/sign-in" className="signup-link">
            Đã có tài khoản? Đăng nhập
          </NavLink>
        </div>

        <Loading isLoading={isPending}>
          <ButtonComponent
            disabled={
              !email.length || !password.length || !confirmPassword.length
            }
            onClick={handleSignUp}
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
            textbutton={"Đăng ký"}
            styleTextButton={{
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              letterSpacing: "0.5px",
            }}
          />
        </Loading>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
