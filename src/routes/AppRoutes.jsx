import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";

import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import JobSeekerLayout from "../layouts/JobseekerLayout/JobSeekerLayout";
import EmployerLayout from "../layouts/EmployerLayout/EmployerLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import AdminDashboard from "../pages/admin/Dashboard/AdminDashboard";
import AdminUsers from "../pages/admin/Users/Users";
import AdminSettings from "../pages/admin/Settings/AdminSettings";

import JobSeekers from "../pages/admin/JobSeekers/JobSeekers";
import JobSeekerDetails from "../pages/admin/JobSeekers/JobSeekerDetails";
import AddJobSeeker from "../pages/admin/JobSeekers/AddJobSeeker";

import JobSeekerDashboard from "../pages/jobseeker/Dashboard/JobSeekerDashboard";
import JobSeekerProfile from "../pages/jobseeker/Profile/Profile";
import JobSeekerJobs from "../pages/jobseeker/Jobs/Jobs";

import EmployerDashboard from "../pages/employer/Dashboard/EmployerDashboard";
import EmployerProfile from "../pages/employer/Dashboard/Profile/Profile";
import EmployerJobs from "../pages/employer/Dashboard/Jobs/MyJobs";
import Users from "../pages/admin/Users/Users";
import EmployerList from "../pages/admin/Employer/EmployerList";

// import NotFound from "../pages/";
import Unauthorized from "../pages/auth/Unauthorized";
import ResetPassword from "../pages/admin/ResetPassword/ResetPassword";
import SimpleEnquiry from "../pages/admin/enquiry/SimpleEnquiry";
import GeneralEnquiry from "../pages/admin/enquiry/GeneralEnquiry";
import ViewSimpleEnquiry from "../pages/admin/enquiry/ViewSimpleEnquiry";
import ViewGerneralEnquiry from "../pages/admin/enquiry/ViewGerneralEnquiry";
import FeedbackList from "../pages/Feedback/FeedbackList";
import ViewFeedbackList from "../pages/Feedback/ViewFeedbackList";
import ComplaintList from "../pages/admin/Complaints/ComplaintList";
import ViewComplaintList from "../pages/admin/Complaints/ViewComplaintList";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            AUTH ROUTES
        ========================= */}

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="users" element={<AdminUsers />} />

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

            <Route path="feedback-list" element={<FeedbackList />} />
            <Route
              path="feedback-list/view/:id"
              element={<ViewFeedbackList />}
            />

            <Route path="complaint-list" element={<ComplaintList />} />
            <Route
              path="complaint-list/view/:id"
              element={<ViewComplaintList />}
            />

            <Route path="employer" element={<EmployerList />} />

            <Route path="settings" element={<AdminSettings />} />

            <Route path="userList" element={<Users />} />

            <Route path="reset-password" element={<ResetPassword />} />

            {/* JOBSEEKER MANAGEMENT */}
            <Route path="jobseekers" element={<JobSeekers />} />

            <Route path="jobseekers/add" element={<AddJobSeeker />} />

            <Route path="jobseekers/:id" element={<JobSeekerDetails />} />

            <Route path="jobseekers/:id/edit" element={<JobSeekerDetails />} />
          </Route>
        </Route>

        {/* =========================
            JOB SEEKER ROUTES
        ========================= */}

        <Route element={<ProtectedRoute allowedRole="jobseeker" />}>
          <Route path="/jobseeker" element={<JobSeekerLayout />}>
            <Route
              index
              element={<Navigate to="/jobseeker/dashboard" replace />}
            />

            <Route path="dashboard" element={<JobSeekerDashboard />} />

            <Route path="profile" element={<JobSeekerProfile />} />

            <Route path="jobs" element={<JobSeekerJobs />} />
          </Route>
        </Route>

        {/* =========================
            EMPLOYER ROUTES
        ========================= */}

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

        {/* =========================
            UNAUTHORIZED
        ========================= */}

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* =========================
            DEFAULT
        ========================= */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* =========================
            404
        ========================= */}

        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
