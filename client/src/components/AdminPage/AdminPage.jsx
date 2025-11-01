import {
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Divider, Menu, Switch } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";

import User from "./UserPage/User";
import Vehicle from "./VehiclePage/Vehicle";
import { useSelector } from "react-redux";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Phương tiện", "vehicles", <AppstoreOutlined />),
  getItem("Người dùng", "users", <UserOutlined />),
  // getItem(
  //   <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
  //     Ant Design
  //   </a>,
  //   "link",
  //   <LinkOutlined />
  // ),
];
const AdminPage = () => {
  const [mode, setMode] = useState("inline");
  const [theme, setTheme] = useState("light");
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const rootSubmenuKeys = ["user", "product"];
  const [openKeys, setOpenKeys] = useState(["user"]);
  const [keySelect, setKeyselect] = useState("vehicles");
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const changeMode = (value) => {
    setMode(value ? "vertical" : "inline");
  };
  const changeTheme = (value) => {
    setTheme(value ? "dark" : "light");
  };
  const handleOnclick = ({ key }) => {
    setKeyselect(key);
    console.log("kEY ĐÃ được select: ", keySelect);
  };
  let renderPage = () => {
    if (keySelect === "users") {
      return <User />;
    } else return <Vehicle />;
  };
  return user?.isAdmin ? (
    <div className="container-fluid" style={{ marginTop: "100px" }}>
      <div className="lg:hidden">
        <Menu
          style={{
            width: 300,
            borderRadius: 10,
            // height: "100vh",
          }}
          onClick={handleOnclick}
          defaultSelectedKeys={["vehicles"]}
          defaultOpenKeys={["vehicles"]}
          mode={"inline"}
          // theme={"light"}
          items={items}
        />
      </div>
      <div className="row">
        <div className="col-lg-3 hidden lg:block">
          <Menu
            style={{
              width: 256,
              borderRadius: 10,
              height: "100vh",
            }}
            onClick={handleOnclick}
            defaultSelectedKeys={["vehicles"]}
            defaultOpenKeys={["vehicles"]}
            mode={"inline"}
            // theme={"light"}
            items={items}
          />
        </div>
        {/* <Switch onChange={changeMode} /> Mode
        <Divider type="vertical" />
        <Switch onChange={changeTheme} /> Style */}
        <div className="col-lg-9">
          <div style={{ flex: 1, padding: "15px 0 15px 15px" }}>
            {renderPage()}
          </div>{" "}
        </div>
      </div>
    </div>
  ) : (
    <div style={{ marginTop: "100px", padding: "100px", fontSize: "100px" }}>
      Bạn không có quyền truy cập trang web này trừ anh TOÀN đẹp trai
    </div>
  );
};

export default AdminPage;
