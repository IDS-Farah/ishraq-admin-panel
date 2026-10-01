import { Routes, Route } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout/AuthLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

const AuthRoutes = () => {
  return (
    <Routes>

      <Route element={<AuthLayout />}>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

      </Route>

    </Routes>
  );
};

export default AuthRoutes;