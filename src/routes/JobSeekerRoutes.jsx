
import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";
import JobSeekerLayout from "../layouts/JobseekerLayout/JobSeekerLayout";

import JobSeekerDashboard from "../pages/jobseeker/Dashboard/JobSeekerDashboard";
import JobSeekerJobs from "../pages/jobseeker/Jobs/Jobs";
import MyDetails from "../pages/jobseeker/Profile/Profile"

const JobSeekerRoutes = (
  <Route element={<ProtectedRoute allowedRole="jobseeker" />}>
    <Route path="/jobseeker" element={<JobSeekerLayout />}>
      <Route
        index
        element={<Navigate to="/jobseeker/dashboard" replace />}
      />

      <Route path="dashboard" element={<JobSeekerDashboard />} />
      <Route path="profile/:id" element={<MyDetails />} />
      <Route path="jobs" element={<JobSeekerJobs />} />
    </Route>
  </Route>
);

export default JobSeekerRoutes;
