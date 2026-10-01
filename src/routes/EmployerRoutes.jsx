import EmployerLayout from "../layouts/EmployerLayout/EmployerLayout";

import Dashboard from "../pages/employer/Dashboard";
import Profile from "../pages/employer/Profile";
import Jobs from "../pages/employer/Jobs";

const EmployerRoutes = () => {
  return {
    path: "/employer",
    element: <EmployerLayout />,
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

export default EmployerRoutes;