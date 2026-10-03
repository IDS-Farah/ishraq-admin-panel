
import { Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";

import AdminDashboard from "../pages/admin/Dashboard/AdminDashboard";
import AdminUsers from "../pages/admin/Users/Users";
import AdminSettings from "../pages/admin/Settings/AdminSettings";

import JobSeekers from "../pages/admin/JobSeekers/JobSeekers";
import JobSeekerDetails from "../pages/admin/JobSeekers/JobSeekerDetails";
import AddJobSeeker from "../pages/admin/JobSeekers/AddJobSeeker";

import EmployerList from "../pages/admin/Employer/EmployerList";

import ResetPassword from "../pages/admin/ResetPassword/ResetPassword";

import SimpleEnquiry from "../pages/admin/enquiry/SimpleEnquiry";
import GeneralEnquiry from "../pages/admin/enquiry/GeneralEnquiry";
import ViewSimpleEnquiry from "../pages/admin/enquiry/ViewSimpleEnquiry";
import ViewGerneralEnquiry from "../pages/admin/enquiry/ViewGerneralEnquiry";

import FeedbackList from "../pages/admin/Feedback/FeedbackList";
import ViewFeedbackList from "../pages/admin/Feedback/ViewFeedbackList";

import ComplaintList from "../pages/admin/Complaints/ComplaintList";
import ViewComplaintList from "../pages/admin/Complaints/ViewComplaintList";

const AdminRoutes = (
  <Route element={<ProtectedRoute allowedRole="admin" />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />

      {/* Enquiries */}
      <Route path="simple-enquiry" element={<SimpleEnquiry />} />
      <Route
        path="simple-enquiry/view/:id"
        element={<ViewSimpleEnquiry />}
      />

      <Route path="general-enquiry" element={<GeneralEnquiry />} />
      <Route
        path="general-enquiry/view/:id"
        element={<ViewGerneralEnquiry />}
      />

      {/* Feedback */}
      <Route path="feedback-list" element={<FeedbackList />} />
      <Route
        path="feedback-list/view/:id"
        element={<ViewFeedbackList />}
      />

      {/* Complaints */}
      <Route path="complaint-list" element={<ComplaintList />} />
      <Route
        path="complaint-list/view/:id"
        element={<ViewComplaintList />}
      />

      {/* Employer */}
      <Route path="employer" element={<EmployerList />} />

      {/* Settings */}
      <Route path="settings" element={<AdminSettings />} />
      <Route path="userList" element={<AdminUsers />} />
      <Route path="reset-password" element={<ResetPassword />} />

      {/* Job Seeker Management */}
      <Route path="jobseekers" element={<JobSeekers />} />
      <Route path="jobseekers/add" element={<AddJobSeeker />} />
      <Route path="jobseekers/:id" element={<JobSeekerDetails />} />
      <Route
        path="jobseekers/:id/edit"
        element={<JobSeekerDetails />}
      />
    </Route>
  </Route>
);

export default AdminRoutes;
