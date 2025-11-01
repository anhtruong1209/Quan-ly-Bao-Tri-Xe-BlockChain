import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
const ResponsiveMenu = ({ showMenu }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const navLinks = [
    {
      path: "/home",
      display: "Trang chủ",
    },
    {
      path: "/findcar",
      display: "Tìm xe ngay",
    },
    {
      path: "/about",
      display: "Chứng Nhận ",
    },
    // {
    //   path: "/register",
    //   display: "Đăng kí",
    // },
  ];
  useEffect(() => {
    setUserName(user?.name);
  }, [user?.name, user?.avatar]);
  // console.log("showMenu", showMenu);
  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-light  px-8 pb-6 pt-16 text-black transition-all duration-200 md:hidden rounded-r-xl shadow-md`}
    >
      <div className="container">
        {/* <div className="card"> */}
        <div className="flex items-center justify-start gap-3 ">
          <FaUserCircle size={50} />
          <div>
            <h1>Hello {userName}</h1>
            {/* <h1 className="text-sm text-slate-500">Premium user</h1> */}
          </div>
        </div>
        <nav className="mt-12">
          <ul className="space-y-4 text-xl">
            {navLinks.map((data, index) => (
              <li>
                <NavLink
                  to={data.path}
                  style={{ textDecoration: "none" }}
                  href={data.link}
                  className="mb-5 inline-block text-black"
                >
                  {data.display}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
    // </div>
  );
};

export default ResponsiveMenu;
