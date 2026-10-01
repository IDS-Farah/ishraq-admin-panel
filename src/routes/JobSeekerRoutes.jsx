import JobSeekerLayout from "../layouts/JobSeekerLayout/JobSeekerLayout";

import Dashboard from "../pages/jobseeker/Dashboard";
import Profile from "../pages/jobseeker/Profile";
import Jobs from "../pages/jobseeker/Jobs";

const JobSeekerRoutes = () => {
  return {
    path: "/jobseeker",
    element: <JobSeekerLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
    ],
  };
};

export default JobSeekerRoutes;