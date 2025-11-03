import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import Loading from "../../components/LoadingComponent/Loading";
import { message } from "antd";
import * as UserService from "../../services/UserService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      message.error("Vui lòng nhập email");
      return;
    }

    setIsPending(true);
    try {
      const res = await UserService.forgotPassword(email);
      if (res?.status === "OK") {
        message.success(res?.message || "Mật khẩu đã được đặt lại. Vui lòng kiểm tra email (hoặc console nếu chưa cấu hình email).");
        setEmail("");
      } else {
        message.error(res?.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email của bạn để nhận liên kết đặt lại mật khẩu."
      icon={FaKey}
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

        <Loading isLoading={isPending}>
          <ButtonComponent
            disabled={!email.length}
            onClick={handleForgotPassword}
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
            textbutton={"Gửi liên kết đặt lại"}
            styleTextButton={{
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              letterSpacing: "0.5px",
            }}
          />
        </Loading>

        <div className="form-footer-top">
          <NavLink to="/sign-in" className="signup-link">
            Quay lại đăng nhập
          </NavLink>
          <NavLink to="/sign-up" className="signup-link">
            Đăng ký ngay
          </NavLink>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;

