import React, { useRef, useState, useEffect } from "react";
import { Link, NavLink, Navigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { Space } from "antd";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import InputComponent from "../InputComponent/InputComponent";
import {
  SearchOutlined,
} from "@ant-design/icons";
import { RiBuilding2Line } from "react-icons/ri";
import { Badge, Button, Popover } from "antd";
import { resetUser } from "../../redux/slides/userSlide";
import ResponsiveMenu from "./ResponsiveMenu";
import { Logo } from "../../assets";
import { LogoutOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import * as UserService from "../../services/UserService";
import { Modal, Form, Input, message } from "antd";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccout,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
} from "./style";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { BsTelephoneInbound } from "react-icons/bs";

import "./NavBar.css";
// Nav links chỉ hiển thị cho admin
const getNavLinks = (isAdmin) => {
  if (!isAdmin) return []; // User không thấy "Trang chủ" và "Danh sách xe"
  return [
    {
      path: "/home",
      display: "Trang chủ",
    },
    {
      path: "/vehicles",
      display: "Danh sách xe",
    },
    {
      path: "/document",
      display: "Tài liệu",
    },
  ];
};

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  // console.log("use bên navbar", user);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [changePasswordForm] = Form.useForm();
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const handleLogout = async () => {
    try {
      // Xóa token và user data khỏi localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("isAdmin");
      // Reset user state
      dispatch(resetUser());
      // Điều hướng về trang đăng nhập
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn reset và redirect dù có lỗi
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("isAdmin");
      dispatch(resetUser());
      navigate("/sign-in");
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      let accessToken = null;
      
      if (token) {
        try {
          accessToken = JSON.parse(token);
        } catch (e) {
          accessToken = token;
        }
      }
      
      if (!accessToken && user?.access_token) {
        accessToken = user.access_token;
      }
      
      if (!accessToken) {
        message.error("Bạn cần đăng nhập");
        return;
      }

      if (!user?.id) {
        message.error("Không tìm thấy thông tin người dùng");
        return;
      }

      const res = await UserService.changePassword(
        user.id,
        values.oldPassword,
        values.newPassword,
        accessToken
      );

      if (res?.status === "OK") {
        message.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        setIsChangePasswordModalVisible(false);
        changePasswordForm.resetFields();
        setIsOpenPopup(false);
        // Logout sau 2 giây
        setTimeout(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          dispatch(resetUser());
          navigate("/sign-in");
        }, 2000);
      } else {
        message.error(res?.message || "Lỗi khi đổi mật khẩu");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      message.error(error?.response?.data?.message || "Lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setLoading(false);
  }, [user?.name, user?.avatar]);
  const content = (
    <div>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => {
          navigate("/home");
          setIsOpenPopup(false);
        }}>
        </WrapperContentPopup>
      )}
      {!user?.isAdmin && (
        <WrapperContentPopup onClick={() => {
          navigate("/user/dashboard");
          setIsOpenPopup(false);
        }}>
        </WrapperContentPopup>
      )}
      <WrapperContentPopup 
        onClick={() => {
          setIsChangePasswordModalVisible(true);
          setIsOpenPopup(false);
        }}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <LockOutlined style={{ fontSize: "14px" }} />
        <span>Đổi mật khẩu</span>
      </WrapperContentPopup>
      <WrapperContentPopup 
        onClick={handleLogout}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <LogoutOutlined style={{ fontSize: "14px" }} />
        <span>Đăng xuất</span>
      </WrapperContentPopup>
    </div>
  );
  const content2 = (
    <div>
      <WrapperContentPopup style={{ marginTop: "20px" }}>
        <InputComponent />
      </WrapperContentPopup>
    </div>
  );
  const [isPopup, setIsPopup] = useState(false);
  return (
    <div
      className="main_navbar"
      style={{
        position: "fixed",
        right: "0",
        left: "0",
        top: "0",
        zIndex: "10000",
      }}
    >
      <div className="container py-2 md:py-0" style={{ maxWidth: "1380px", margin: "0 auto" }}>
        <div className="flex justify-between items-center">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              width: "52px",
              height: "52px",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)",
              backdropFilter: "blur(10px)",
              borderRadius: "14px",
              marginRight: "12px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}>
              <RiBuilding2Line style={{ fontSize: "28px", color: "#fff" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h4 style={{ 
                margin: 0, 
                color: "#fff", 
                fontSize: "19px", 
                fontWeight: "700",
                lineHeight: "1.3",
                fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                letterSpacing: "-0.3px"
              }}>
                Hệ Thống Quản Lý Bảo Trì Xe
              </h4>
              <p style={{ 
                margin: 0, 
                color: "rgba(255, 255, 255, 0.85)", 
                fontSize: "12px",
                lineHeight: "1.3",
                fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: "400"
              }}>
              </p>
            </div>
          </div>
          <div className="block md:hidden">
            {showMenu ? (
              <HiMenuAlt1
                style={{ color: "white" }}
                onClick={toggleMenu}
                className=" cursor-pointer transition-all"
                size={30}
              />
            ) : (
              <HiMenuAlt3
                style={{ color: "white" }}
                onClick={toggleMenu}
                className="cursor-pointer transition-all"
                size={30}
              />
            )}
          </div>
          <div className="hidden md:block">
            <ul
              className="flex items-center gap-8"
              ref={menuRef}
              onClick={toggleMenu}
            >
              {getNavLinks(user?.isAdmin).map((item, index) => (
                <li key={index} className="py-4">
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav_item"
                    >
                      {item.display}
                    </a>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={(a) =>
                        a.isActive ? "nav_item nav_active" : "nav_item"
                      }
                      key={index}
                    >
                      {item.display}
                    </NavLink>
                  )}
                </li>
              ))}
              {/* <div className="navbar_search">
                <input
                  type="text"
                  placeholder="Search"
                  className="search-input"
                />
                <button className="search-btn">
                  {" "}
                  <IoSearchSharp />
                </button>
              </div> */}
              {/* Login/Logout removed */}

              <div className="hidden lg:block">
                <div className="navbar_search">
                  <input
                    type="text"
                    placeholder="Search"
                    className="search-input"
                  />
                  <button className="search-btn">
                    {" "}
                    <IoSearchSharp />
                  </button>
                </div>
              </div>
              <div className="block lg:hidden">
                <div
                  style={{
                    padding: 8,
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Popover content={content2} trigger="click" open={isPopup}>
                    <div
                      style={{
                        cursor: "pointer",
                        maxWidth: 100,
                        overflow: "hidden",
                        color: "white",
                        paddingLeft: "60px",
                        paddingTop: "12px",
                        fontSize: "20px",
                        fontWeight: "700",
                        textOverflow: "ellipsis",
                      }}
                      onClick={() => setIsPopup((prev) => !prev)}
                    >
                      <SearchOutlined style={{ color: "white" }} />
                    </div>
                  </Popover>
                </div>
              </div>

              {/* User info and logout button */}
              {user?.access_token || user?.email ? (
                <Popover
                  content={content}
                  trigger="click"
                  open={isOpenPopup}
                  onOpenChange={setIsOpenPopup}
                  placement="bottomRight"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                      padding: "8px 16px",
                      borderRadius: "14px",
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.25)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                    }}
                    onClick={() => setIsOpenPopup(!isOpenPopup)}
                  >
                    <UserOutlined style={{ color: "white", fontSize: "20px" }} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <span style={{ 
                        color: "rgba(255, 255, 255, 0.9)", 
                        fontSize: "11px", 
                        lineHeight: "1.3",
                        fontFamily: "'Inter', 'Poppins', sans-serif",
                        fontWeight: "400"
                      }}>
                        Xin chào
                      </span>
                      <span style={{ 
                        color: "white", 
                        fontSize: "15px", 
                        fontWeight: "700", 
                        lineHeight: "1.3",
                        fontFamily: "'Inter', 'Poppins', sans-serif",
                        letterSpacing: "-0.2px"
                      }}>
                        {user?.name || user?.email || "User"}
                      </span>
                    </div>
                  </div>
                </Popover>
              ) : (
                <Button
                  type="primary"
                  onClick={() => navigate("/sign-in")}
                  style={{
                    background: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "#fff",
                    fontWeight: "700",
                    fontFamily: "'Inter', 'Poppins', sans-serif",
                    borderRadius: "12px",
                    height: "42px",
                    padding: "0 24px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  Đăng nhập
                </Button>
              )}
            </ul>
            {/* <div
            style={{
              color: "white",
              display: "inline-block",
            }}
          >
            <div>
              <h6>
                {" "}
                Hotline{" "}
                <p style={{ color: "white", display: "flex" }}>
                  0942917989
                </p>{" "}
              </h6>
            </div>
          </div> */}
          </div>
        </div>
      </div>
      <ResponsiveMenu showMenu={showMenu} />

      {/* Modal đổi mật khẩu */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LockOutlined />
            <span>Đổi mật khẩu</span>
          </div>
        }
        open={isChangePasswordModalVisible}
        onCancel={() => {
          setIsChangePasswordModalVisible(false);
          changePasswordForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu cũ"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                backgroundColor: "#2563eb",
                borderColor: "#2563eb",
                height: "44px",
                fontWeight: "600",
              }}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Navbar;
