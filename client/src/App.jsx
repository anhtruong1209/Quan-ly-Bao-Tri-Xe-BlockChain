import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as UserService from "./services/UserService";
import { useDispatch, useSelector } from "react-redux";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import Loading from "./components/LoadingComponent/Loading";
import { routes } from "./routers";
import { updateUser, resetUser } from "./redux/slides/userSlide";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storageRefreshToken);
    const res = await UserService.getDetailsUser(id, token);
    // console.log("Detail user ben app: ", res);
    dispatch(
      updateUser({
        ...res?.data,
        access_token: token,
        refreshToken: refreshToken,
      })
    );
  };
  const handleDecoded = () => {
    // console.log("User sau khi đăng xuất: ", user?.name);
    let storageData =
      user?.access_token || localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      // console.log("Vô được decoded");
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
      // console.log("DEcoded ben apP: ", decoded);
    }
    return { decoded, storageData };
  };
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      try {
        // Do something before request is sent
        const currentTime = new Date();
        const { decoded } = handleDecoded();
        let storageRefreshToken = localStorage.getItem("refresh_token");
        const refreshToken = JSON.parse(storageRefreshToken);
        const decodedRefreshToken = jwtDecode(refreshToken);
        if (decoded?.exp < currentTime.getTime() / 1000) {
          if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
            const data = await UserService.refreshToken(refreshToken);
            config.headers["token"] = `Bearer ${data?.access_token}`;
          } else {
            dispatch(resetUser());
          }
        }
        return config;
      } catch (error) {
        console.log("Eror user so vit: ", error);
      }
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, []);

  return (
    <div style={{ padding: "0" }}>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  );
}
export default App;
// import React from 'react'
// import CarCard from './components/CarCard'

// const App = () => {
//   return (
//     <CarCard />
//   )
// }

// export default App
