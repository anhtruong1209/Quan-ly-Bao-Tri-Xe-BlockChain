import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  
  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      // Lưu isAdmin vào localStorage để check ngay khi reload
      if (res?.data?.isAdmin !== undefined) {
        localStorage.setItem("isAdmin", JSON.stringify(res.data.isAdmin));
      }
      dispatch(
        updateUser({
          ...res?.data,
          access_token: token,
        })
      );
      setIsUserLoaded(true);
    } catch (error) {
      console.error("Error getting user details:", error);
      setIsUserLoaded(true);
    }
  };
  
  const handleDecoded = () => {
    let storageData =
      user?.access_token || localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  // Interceptor để tự động refresh token khi hết hạn
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("access_token");
      if (token && isJsonString(token)) {
        const parsedToken = JSON.parse(token);
        
        // Kiểm tra xem token có sắp hết hạn không (còn < 1 ngày)
        try {
          const decoded = jwtDecode(parsedToken);
          const currentTime = Date.now() / 1000;
          const timeUntilExpiry = decoded.exp - currentTime;
          const oneDay = 24 * 60 * 60; // 1 ngày tính bằng giây
          
          // Nếu token còn hơn 1 ngày thì không cần refresh
          // Chỉ refresh khi còn < 1 ngày để tránh refresh liên tục
          if (timeUntilExpiry < oneDay && timeUntilExpiry > 0) {
            // Token vẫn còn hiệu lực nhưng sắp hết, có thể refresh (tùy chọn)
            // Hiện tại chỉ dùng token hiện tại
          }
          
          config.headers["Authorization"] = `Bearer ${parsedToken}`;
        } catch (e) {
          console.error("Error decoding token:", e);
          config.headers["Authorization"] = `Bearer ${parsedToken}`;
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  // Interceptor để xử lý lỗi 401 và tự động refresh token
  UserService.axiosJWT.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Nếu lỗi 401 và chưa retry
      if (error?.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Nếu đang refresh, đợi
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return UserService.axiosJWT(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          let refresh_token = localStorage.getItem("refresh_token");
          if (!refresh_token) {
            throw new Error("No refresh token");
          }

          // Xử lý nếu refresh_token là JSON string
          if (isJsonString(refresh_token)) {
            refresh_token = JSON.parse(refresh_token);
          }

          const res = await UserService.refreshToken(refresh_token);
          
          if (res?.status === "OK" && res?.access_token) {
            const newToken = res.access_token;
            localStorage.setItem("access_token", JSON.stringify(newToken));
            
            // Update Redux store
            const decoded = jwtDecode(newToken);
            if (decoded?.id) {
              await handleGetDetailsUser(decoded.id, newToken);
            }
            
            processQueue(null, newToken);
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return UserService.axiosJWT(originalRequest);
          } else {
            throw new Error("Failed to refresh token");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Refresh token cũng hết hạn -> logout
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("isAdmin");
          dispatch(resetUser());
          window.location.href = "/sign-in";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      const { storageData, decoded } = handleDecoded();
      if (decoded?.id && storageData) {
        await handleGetDetailsUser(decoded?.id, storageData);
      } else {
        // Không có token hoặc không decode được -> đánh dấu đã load xong
        setIsUserLoaded(true);
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Cập nhật isLoading khi user đã load xong
  useEffect(() => {
    if (isUserLoaded) {
      setIsLoading(false);
    }
  }, [isUserLoaded]);

  // Helper để lấy isAdmin từ localStorage hoặc user state
  const getIsAdmin = () => {
    if (user?.isAdmin !== undefined) {
      return user.isAdmin;
    }
    const storedIsAdmin = localStorage.getItem("isAdmin");
    if (storedIsAdmin) {
      try {
        return JSON.parse(storedIsAdmin);
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  return (
    <div style={{ padding: "0" }}>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;
              
              // Kiểm tra authentication nếu cần
              let element = (
                <Layout>
                  <Page />
                </Layout>
              );
              
              // Chờ user data load xong trước khi check route
              if (route.requireAuth) {
                const token = localStorage.getItem("access_token");
                // Nếu chưa load xong user data nhưng có token, chờ load xong
                if (isLoading && token) {
                  // Đang loading, không redirect
                } else if (!token && !user?.access_token) {
                  // Không có token -> redirect đến sign-in
                  element = <Navigate to="/sign-in" replace />;
                } else if (route.requireAdmin && isUserLoaded) {
                  // Check isAdmin từ user state hoặc localStorage
                  const isAdmin = getIsAdmin();
                  if (!isAdmin) {
                    // Nếu yêu cầu admin nhưng không phải admin -> redirect về dashboard của user
                    element = <Navigate to="/user/dashboard" replace />;
                  }
                }
              }
              
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={element}
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
