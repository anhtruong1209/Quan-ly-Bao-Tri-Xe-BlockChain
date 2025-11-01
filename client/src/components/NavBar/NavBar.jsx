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
} from "@ant-design/icons";
import { Badge, Button, Popover } from "antd";
import { resetUser } from "../../redux/slides/userSlide";
import ResponsiveMenu from "./ResponsiveMenu";
import { Logo } from "../../assets";
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
const navLinks = [
  {
    path: "/home",
    display: "Trang chủ",
  },
  {
    path: "/vehicles",
    display: "Danh sách xe",
  },
];

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
    navigate("/");
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setLoading(false);
  }, [user?.name, user?.avatar]);
  const handleClickNavigate = (type) => {
    if (type === "admin") {
      navigate("/admin");
    } else {
      handleLogout();
    }
    setIsOpenPopup(false);
  };
  const content = (
    <div>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>
          Quản lí hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate()}>
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
      <div className="container py-2 md:py-0">
        <div className="flex justify-between items-center">
          <img src={Logo} style={{ width: "70px" }} alt="" />
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
              {navLinks.map((item, index) => (
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
                {/* <button className="search-btn">
                  {" "}
                  <IoSearchSharp />
                </button> */}
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
                  {/* <InputComponent
                    style={{
                      marginBottom: 8,
                      display: isPopup ? "block" : "none",
                    }}
                  />
                  <Space>
                    <Button
                      type="primary"
                      // onClick={() =>
                      //   handleSearch(selectedKeys, confirm, dataIndex)
                      // }
                      icon={<SearchOutlined />}
                      size="large"
                      style={{
                        width: 90,
                      }}
                    ></Button>
                  </Space> */}
                </div>
              </div>
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
