
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./AdminRoutes";
import JobSeekerRoutes from "./JobSeekerRoutes";
import EmployerRoutes from "./EmployerRoutes";

import Unauthorized from "../pages/auth/Unauthorized";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {AuthRoutes}
        {AdminRoutes}
        {JobSeekerRoutes}
        {EmployerRoutes}

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
