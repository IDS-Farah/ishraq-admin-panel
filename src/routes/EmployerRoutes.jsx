import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";
import EmployerLayout from "../layouts/EmployerLayout/EmployerLayout";

import EmployerDashboard from "../pages/employer/Dashboard/EmployerDashboard";
import EmployerProfile from "../pages/employer/Dashboard/Profile/Profile";
import EmployerJobs from "../pages/employer/Dashboard/Jobs/MyJobs";
import OrganizationDetails from "../pages/employer/OrganizationDetails/OrganizationDetails";
import JobRequirementList from "../pages/employer/JobRequirement/JobRequirementList";
import JobRequirementEdit from "../pages/employer/JobRequirement/Jobrequirementedit";
import JobRequirementView from "../pages/employer/JobRequirement/Jobrequirementview";
import JobRequirementCreate from "../pages/employer/JobRequirement/Jobrequirementcreate";
import EmployerEdit from "../pages/employer/OrganizationDetails/EditOrganization";
import FeedbackList from "../pages/employer/Feedback/FeedbackList";
import FeedbackDetails from "../pages/employer/Feedback/FeedbackDetails";
import ComplaintList from "../pages/employer/Complaints/ComplaintList";
import ComplaintDetails from "../pages/employer/Complaints/ComplaintDetails";
import CreateComplaint from "../pages/employer/Complaints/ComplaintDetails";
import CreateFeedback from "../pages/employer/Feedback/CreateFeedback";
const EmployerRoutes = (
  <Route element={<ProtectedRoute allowedRole="employer" />}>
    <Route path="/employer" element={<EmployerLayout />}>
      <Route index element={<Navigate to="/employer/dashboard" replace />} />

      <Route path="dashboard" element={<EmployerDashboard />} />
      <Route path="profile" element={<EmployerProfile />} />
      <Route path="jobs" element={<EmployerJobs />} />
      <Route
        path="organization-profile/:id"
        element={<OrganizationDetails />}
      />
      <Route path="organization-profile/edit/:id" element={<EmployerEdit />} />
      <Route path="job-requirement-list" element={<JobRequirementList />} />
      {/* <Route path="/admin/job-requirements" element={<JobRequirementList />} /> */}
      <Route path="job-requirements/:id" element={<JobRequirementView />} />
      <Route
        path="job-requirements/:id/edit"
        element={<JobRequirementEdit />}
      />
      <Route
        path="job-requirements/create"
        element={<JobRequirementCreate />}
      />
      <Route path="feedback-list" element={<FeedbackList />} />
      <Route path="feedback/:id" element={<FeedbackDetails />} />
      <Route path="feedback-add" element={<CreateFeedback />} />
      <Route path="complaint-list" element={<ComplaintList />} />
      <Route path="complaints/:id" element={<ComplaintDetails />} />
      <Route path="complaint-add" element={<CreateComplaint />} />
    </Route>
  </Route>
);

export default EmployerRoutes;
