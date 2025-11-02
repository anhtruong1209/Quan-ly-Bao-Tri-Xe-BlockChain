import React, { useRef, useState, useEffect } from "react";
import { Link, NavLink, Navigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { Space } from "antd";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import InputComponent from "../InputComponent/InputComponent";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  HistoryOutlined,
  SearchOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { FaTruck, FaBuilding } from "react-icons/fa";
import { Badge, Button, Popover } from "antd";
import { resetUser } from "../../redux/slides/userSlide";
import ResponsiveMenu from "./ResponsiveMenu";
import { Logo } from "../../assets";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import * as UserService from "../../services/UserService";
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
  if (!isAdmin) return []; // User không thấy "Trang chủ" và "Danh sách bất động sản"
  return [
    {
      path: "/realestate/dashboard",
      display: "Trang chủ",
    },
    {
      path: "/realestate/admin/dashboard",
      display: "Quản lý giao dịch",
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

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setLoading(false);
  }, [user?.name, user?.avatar]);
  const content = (
    <div>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => {
          navigate("/realestate/admin/dashboard");
          setIsOpenPopup(false);
        }}>
          Trang quản trị
        </WrapperContentPopup>
      )}
      {!user?.isAdmin && (
        <WrapperContentPopup onClick={() => {
          navigate("/realestate/dashboard");
          setIsOpenPopup(false);
        }}>
          Trang của tôi
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={handleLogout}>
        Đăng xuất
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
              width: "50px",
              height: "50px",
              backgroundColor: "#f9a826",
              borderRadius: "12px",
              marginRight: "8px"
            }}>
              <FaBuilding style={{ fontSize: "28px", color: "#000d6b" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h4 style={{ 
                margin: 0, 
                color: "#fff", 
                fontSize: "18px", 
                fontWeight: "bold",
                lineHeight: "1.2"
              }}>
                Hệ Thống Quản Lý Giao Dịch
              </h4>
              <p style={{ 
                margin: 0, 
                color: "rgba(255, 255, 255, 0.8)", 
                fontSize: "12px",
                lineHeight: "1.2"
              }}>
                Bất Động Sản
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
                  <NavLink
                    to={item.path}
                    className={(a) =>
                      a.isActive ? "nav_item nav_active" : "nav_item"
                    }
                    key={index}
                  >
                    {item.display}
                  </NavLink>
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
                      gap: "8px",
                      cursor: "pointer",
                      padding: "4px 12px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
                    onClick={() => setIsOpenPopup(!isOpenPopup)}
                  >
                    <UserOutlined style={{ color: "white", fontSize: "18px" }} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <span style={{ color: "white", fontSize: "12px", lineHeight: "1.2" }}>
                        Xin chào
                      </span>
                      <span style={{ color: "white", fontSize: "14px", fontWeight: "600", lineHeight: "1.2" }}>
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
                    backgroundColor: "#f9a826",
                    borderColor: "#f9a826",
                    color: "#000d6b",
                    fontWeight: "600",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
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
    </div>
  );
};

export default Navbar;
