import Home from "../pages/Home/Home";
import Detail from "../pages/Detail/Detail";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import VehicleByType from "../pages/VehicleByType/VehicleByType";
import Vehicles from "../pages/Vehicles/Vehicles";

export const routes = [
  {
    path: "/",
    page: Home,
    isShowHeader: true,
  },
  {
    path: "/vehicles",
    page: Vehicles,
    isShowHeader: true,
  },
  {
    path: "/home",
    page: Home,
    isShowHeader: true,
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
  // {
  //   path: "/sign-in-new",
  //   page: SigninNew,
  //   isShowHeader: false,
  // },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
];
