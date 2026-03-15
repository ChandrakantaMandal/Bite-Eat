import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { useAuth } from "../pages/auth/hook/useAuth";
import AppLoader from "../components/AppLoader";

const Home = lazy(() => import("../pages/general/Home"));
const Saved = lazy(() => import("../pages/general/Saved"));
const CreateFood = lazy(() => import("../pages/food-partner/pages/CreateFood"));
const Profile = lazy(() => import("../pages/food-partner/pages/Profile"));
const AccountProfile = lazy(() => import("../pages/general/AccountProfile"));
const ChooseRegister = lazy(() => import("../pages/auth/pages/ChooseRegister"));
const UserRegister = lazy(() => import("../pages/auth/pages/UserRegister"));
const UserLogin = lazy(() => import("../pages/auth/pages/UserLogin"));
const FoodPartnerRegister = lazy(
  () => import("../pages/auth/pages/FoodPartnerRegister"),
);
const FoodPartnerLogin = lazy(
  () => import("../pages/auth/pages/FoodPartnerLogin"),
);
const BottomNav = lazy(() => import("../components/BottomNav"));

const AppRoutes = () => {
  const { user, foodPartner, loading } = useAuth();
  const isSignedIn = Boolean(user || foodPartner);
  const authLoader = <AppLoader message="Checking your account..." />;

  const withBottomNav = (page) => (
    <>
      {page}
      <BottomNav />
    </>
  );

  return (
    <Suspense fallback={<AppLoader message="Loading BiteEat..." />}>
      <Router>
        <Routes>
          <Route path="/register" element={<ChooseRegister />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route
            path="/food-partner/register"
            element={<FoodPartnerRegister />}
          />
          <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
          <Route
            path="/"
            element={
              loading ? (
                authLoader
              ) : user ? (
                withBottomNav(<Home />)
              ) : (
                <Navigate to="/user/login" replace />
              )
            }
          />
          <Route
            path="/saved"
            element={
              loading ? (
                authLoader
              ) : user ? (
                withBottomNav(<Saved />)
              ) : (
                <Navigate to="/user/login" replace />
              )
            }
          />
          <Route
            path="/create-food"
            element={
              loading ? (
                authLoader
              ) : foodPartner ? (
                withBottomNav(<CreateFood />)
              ) : (
                <Navigate to="/food-partner/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              loading ? (
                authLoader
              ) : isSignedIn ? (
                withBottomNav(<AccountProfile />)
              ) : (
                <Navigate to="/user/register" replace />
              )
            }
          />
          <Route path="/food-partner/:id" element={<Profile />} />
        </Routes>
      </Router>
    </Suspense>
  );
};

export default AppRoutes;
