import AdminLayout from "../layouts/AdminLayout/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Settings from "../pages/admin/Settings";

const AdminRoutes = () => {
  return {
    path: "/admin",
    element: <AdminLayout />,
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
        path: "users",
        element: <Users />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  };
};

export default AdminRoutes;