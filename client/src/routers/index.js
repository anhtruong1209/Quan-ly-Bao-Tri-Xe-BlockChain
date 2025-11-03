import SignIn from "../pages/SignIn/SignInRealEstate";
import SignUp from "../pages/SignUp/SignUpRealEstate";
import RealEstateDashboard from "../pages/RealEstateDashboard/RealEstateDashboard";
import RealEstateAdminDashboard from "../pages/RealEstateAdminDashboard/RealEstateAdminDashboard";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import Documentation from "../pages/Documentation/Documentation";

export const routes = [
  {
    path: "/",
    page: RealEstateDashboard,
    isShowHeader: true,
    requireAuth: true,
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
    path: "/realestate/dashboard",
    page: RealEstateDashboard,
    isShowHeader: true,
    requireAuth: true,
  },
  {
    path: "/realestate/admin/dashboard",
    page: RealEstateAdminDashboard,
    isShowHeader: true,
    requireAuth: true,
    requireAdmin: true,
  },
  {
    path: "/documentation",
    page: Documentation,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
];
