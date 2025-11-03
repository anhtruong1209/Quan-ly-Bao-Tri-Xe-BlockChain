import Home from "../pages/Home/Home";
import Detail from "../pages/Detail/Detail";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import VehicleByType from "../pages/VehicleByType/VehicleByType";
import Vehicles from "../pages/Vehicles/Vehicles";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import UserDashboard from "../pages/UserDashboard/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import ProjectDocumentation from "../pages/ProjectDocumentation/ProjectDocumentation";

export const routes = [
  {
    path: "/",
    page: Home,
    isShowHeader: true,
    requireAuth: true,
    requireAdmin: true, // Chỉ admin mới xem được home
  },
  {
    path: "/vehicles",
    page: Vehicles,
    isShowHeader: true,
    requireAuth: true,
    requireAdmin: true, // Chỉ admin mới xem được vehicles list
  },
  {
    path: "/home",
    page: Home,
    isShowHeader: true,
    requireAuth: true,
    requireAdmin: true, // Chỉ admin mới xem được home
  },
  {
    path: "/detail/:plate",
    page: Detail,
    isShowHeader: true,
  },
  {
    path: "/vehicle-type/:name",
    page: VehicleByType,
    isShowHeader: true,
  },
  {
    path: "/document",
    page: ProjectDocumentation,
    isShowHeader: true,
  },
  {
    path: "/sign-in",
    page: SignIn,
    isShowHeader: false,
  },
  {
    path: "/sign-up",
    page: SignUp,
    isShowHeader: false,
  },
  {
    path: "/forgot-password",
    page: ForgotPassword,
    isShowHeader: false,
  },
  {
    path: "/user/dashboard",
    page: UserDashboard,
    isShowHeader: true,
    requireAuth: true,
  },
  {
    path: "/admin/dashboard",
    page: AdminDashboard,
    isShowHeader: true,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
];
