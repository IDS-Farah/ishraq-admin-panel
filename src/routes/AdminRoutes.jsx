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
import EmployerProfile from "../pages/admin/Employer/EmployerDetails";

import ResetPassword from "../pages/admin/ResetPassword/ResetPassword";

import SimpleEnquiry from "../pages/admin/enquiry/SimpleEnquiry";
import GeneralEnquiry from "../pages/admin/enquiry/GeneralEnquiry";

import FeedbackList from "../pages/admin/Feedback/FeedbackList";

import ComplaintList from "../pages/admin/Complaints/ComplaintList";
import SimpleEnquiryDetails from "../pages/admin/enquiry/SimpleEnquiryDetails";
import GeneralEnquiryDetails from "../pages/admin/enquiry/GeneralEnquiryDetails";
import ComplaintDetails from "../pages/admin/Complaints/ComplaintDetails";
import FeedbackDetails from "../pages/admin/Feedback/FeedbackDetails";
// import MasterDataForm from "../pages/admin/Settings/MasterData/MasterDataForm";
import JobRequirementList from "../pages/admin/JobRequirement/JobRequirementList";
import JobRequirementView from "../pages/admin/JobRequirement/Jobrequirementview";
import JobRequirementEdit from "../pages/admin/JobRequirement/Jobrequirementedit";
import JobRequirementCreate from "../pages/admin/JobRequirement/Jobrequirementcreate";
import JobApplicantsList from "../pages/admin/JobRequirement/JobApplicantsList";

// master data imports
import ComplaintCategoryList from "../pages/admin/MasterData/ComplaintCategoryList";
import MasterDataList from "../pages/admin/MasterData/MasterDataList";
import MasterDataForm from "../pages/admin/MasterData/MasterDataForm";

// admin enquiry imports 
import EnquiryListPage from "../pages/admin/EnquiryListPage"
import EnquiryDetails from "../components/form/EnquiryDetails"

const AdminRoutes = (
  <Route element={<ProtectedRoute allowedRole="admin" />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      {/* Enquiries */}
      <Route path="simple-enquiry" element={<SimpleEnquiry />} />
      <Route path="simple-enquiry/:id" element={<SimpleEnquiryDetails />} />
      <Route path="general-enquiry" element={<GeneralEnquiry />} />
      <Route path="general-enquiry/:id" element={<GeneralEnquiryDetails />} />
      {/* Feedback */}
      <Route path="feedback-list" element={<FeedbackList />} />
      <Route path="feedback/:id" element={<FeedbackDetails />} />
      {/* Complaints */}
      <Route path="complaint-list" element={<ComplaintList />} />
      <Route path="complaints/:id" element={<ComplaintDetails />} />
      {/* Employer */}
      <Route path="employer" element={<EmployerList />} />
      <Route path="employers/:id" element={<EmployerProfile />} />
      {/* Settings */}
      <Route path="userList" element={<Navigate to="/admin/users" replace />} />
      <Route path="reset-password" element={<ResetPassword />} />
      {/* Job Seeker Management */}
      <Route path="jobseekers" element={<JobSeekers />} />
      <Route path="jobseekers/add" element={<AddJobSeeker />} />
      <Route path="jobseekers/:id" element={<JobSeekerDetails />} />
      <Route path="jobseekers/:id/edit" element={<JobSeekerDetails />} />
      {/* settings  */}
      <Route path="settings" element={<AdminSettings />} />
      {/* master data  */}
      <Route
        path="settings/master-data/:masterType"
        element={<AdminSettings />}
      />
      <Route
        path="settings/master-data/:masterType/create"
        element={<MasterDataForm />}
      />
      <Route
        path="settings/master-data/:masterType/edit/:id"
        element={<MasterDataForm />}
      />
      <Route
        path="settings/master-data/:masterType/view/:id"
        element={<MasterDataForm />}
      />
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
      <Route path="job-applicant/:jobId" element={<JobApplicantsList />} />
      {/* master data routes  */}
      <Route
        path="master-data/complaint-category"
        element={<ComplaintCategoryList />}
      />
      <Route path="settings/master/:masterKey" element={<MasterDataList />} />
      <Route
        path="settings/master/:masterKey/add"
        element={<MasterDataForm mode="create" />}
      />
      <Route
        path="settings/master/:masterKey/:id/edit"
        element={<MasterDataForm mode="edit" />}
      />
      <Route
        path="settings/master/:masterKey/:id/view"
        element={<MasterDataForm mode="view" />}
      />
      {/* Admin Enquiry routes  */}
      
      <Route
        path="complaints"
        element={<EnquiryListPage formType="complaint" />}
      />
      <Route
        path="complaints/:id"
        element={<EnquiryDetails formType="complaint" />}
      />
      <Route
        path="career"
        element={<EnquiryListPage formType="career" />}
      />
      <Route
        path="career/:id"
        element={<EnquiryDetails formType="career" />}
      />
      <Route
        path="contact"
        element={<EnquiryListPage formType="contact" />}
      />
      <Route
        path="contact/:id"
        element={<EnquiryDetails formType="contact" />}
      />
      <Route
        path="feedback"
        element={<EnquiryListPage formType="feedback" />}
      />
      <Route
        path="feedback/:id"
        element={<EnquiryDetails formType="feedback" />}
      />
    </Route>
  </Route>
);

export default AdminRoutes;
