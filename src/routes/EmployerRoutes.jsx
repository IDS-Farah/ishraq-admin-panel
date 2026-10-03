
import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";
import EmployerLayout from "../layouts/EmployerLayout/EmployerLayout";

import EmployerDashboard from "../pages/employer/Dashboard/EmployerDashboard";
import EmployerProfile from "../pages/employer/Dashboard/Profile/Profile";
import EmployerJobs from "../pages/employer/Dashboard/Jobs/MyJobs";

const EmployerRoutes = (
  <Route element={<ProtectedRoute allowedRole="employer" />}>
    <Route path="/employer" element={<EmployerLayout />}>
      <Route
        index
        element={<Navigate to="/employer/dashboard" replace />}
      />

      <Route path="dashboard" element={<EmployerDashboard />} />
      <Route path="profile" element={<EmployerProfile />} />
      <Route path="jobs" element={<EmployerJobs />} />
    </Route>
  </Route>
);

export default EmployerRoutes;
