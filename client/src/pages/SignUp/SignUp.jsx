import React, { useState, useEffect } from "react";
import "./SignUp.css";
import { NavLink, useNavigate } from "react-router-dom";
import InputForm from "../../components/InputForm/InputForm";
import audi from "../../assets/audirs7.jpg";
import mclaren from "../../assets/mclaren.jpg";
import * as message from "../../components/Message/Message";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { FaRegEyeSlash } from "react-icons/fa";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { FaRegEye } from "react-icons/fa";
import * as UserService from "../../services/UserService";

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
    <div className="sin">
      <div className="sin-header">
        <div className="sin-header-title">
          <NavLink style={{ textDecoration: "none", color: "black" }} to="/">
            <h1>Website đăng kiểm</h1>
          </NavLink>
          <h1 style={{ color: "red" }}>Đăng Kí</h1>
        </div>
        <p>Bạn cần giúp đỡ ?</p>
      </div>
      <div className="sin-content">
        <div className="sin-content-image">
          <img style={{ width: "70%" }} src={audi} alt="" />
          <img style={{ width: "70%" }} src={mclaren} alt="" />
        </div>
        <div className="sin-content-form" style={{ height: "500px" }}>
          <div>
            <h1 className="sin-content-form-title">Đăng kí</h1>
          </div>
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnchangeEmail}
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "25%",
                right: "15px",
              }}
            >
              {isShowPassword ? (
                <FaRegEye size={20} />
              ) : (
                <FaRegEyeSlash size={20} />
              )}
            </span>
            <InputForm
              placeholder="password"
              style={{ marginBottom: "10px" }}
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "25%",
                right: "15px",
              }}
            >
              {isShowConfirmPassword ? (
                <FaRegEye size={20} />
              ) : (
                <FaRegEyeSlash size={20} />
              )}
            </span>
            <InputForm
              placeholder="comfirm password"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
            />
          </div>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={
                !email.length || !password.length || !confirmPassword.length
              }
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 10px",
              }}
              textbutton={"Đăng ký"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
          <div className="sin-content-form-try">
            <a className="sin-content-form-try-pass">Quên mật khẩu ?</a>
            <a className="sin-content-form-try-pass">Đăng nhập với SMS</a>
          </div>
          <div className="sin-content-form-sup">
            <p>Bạn đã có tài khoản</p>
            <NavLink to="/sign-in">Đăng Nhập</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
