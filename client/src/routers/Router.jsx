import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../pages/Home/Home";
import Detail from "../pages/Detail/Detail";
import Vehicles from "../pages/Vehicles/Vehicles";
import VehicleByType from "../pages/VehicleByType/VehicleByType";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import UserDashboard from "../pages/UserDashboard/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import ProjectDocumentation from "../pages/ProjectDocumentation/ProjectDocumentation";

// Component để redirect nếu chưa đăng nhập
const RequireAuth = ({ children }) => {
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("access_token");

  if (!token && !user?.access_token) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/detail/:plate" element={<Detail />} />
      <Route path="/vehicle-type/:name" element={<VehicleByType />} />
      <Route path="/document" element={<ProjectDocumentation />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="/user/dashboard"
        element={
          <RequireAuth>
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          </RequireAuth>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <RequireAuth>
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Routers;
