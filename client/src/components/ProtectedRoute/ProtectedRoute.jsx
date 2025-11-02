import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../LoadingComponent/Loading";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("access_token");

  // Kiểm tra đang loading
  if (!token && !user.access_token) {
    return <Loading isLoading={true}>{children}</Loading>;
  }

  // Kiểm tra đã đăng nhập chưa
  if (!user.access_token && !token) {
    return <Navigate to="/sign-in" replace />;
  }

  // Kiểm tra quyền admin nếu cần
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

