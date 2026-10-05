import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";
import EmployerLayout from "../layouts/EmployerLayout/EmployerLayout";

import EmployerDashboard from "../pages/employer/Dashboard/EmployerDashboard";
import EmployerProfile from "../pages/employer/Dashboard/Profile/Profile";
import EmployerJobs from "../pages/employer/Dashboard/Jobs/MyJobs";
import OrganizationDetails from "../pages/employer/OrganizationDetails/OrganizationDetails";
import JobRequirementList from "../pages/employer/JobRequirement/JobRequirementList";

const EmployerRoutes = (
  <Route element={<ProtectedRoute allowedRole="employer" />}>
    <Route path="/employer" element={<EmployerLayout />}>
      <Route index element={<Navigate to="/employer/dashboard" replace />} />

      <Route path="dashboard" element={<EmployerDashboard />} />
      <Route path="profile" element={<EmployerProfile />} />
      <Route path="jobs" element={<EmployerJobs />} />
      <Route path="organization-profile/:id" element={<OrganizationDetails />} />
      <Route path="job-requirements" element={<JobRequirementList />} />
    </Route>
  </Route>
);

export default EmployerRoutes;
