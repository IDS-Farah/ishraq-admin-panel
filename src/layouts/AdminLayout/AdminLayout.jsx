import { Outlet } from "react-router-dom";
import {
  Flag,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  BookUser,
  UserKey,
  NotebookTabs,
  MessagesSquare,
  IdCardLanyard,
} from "lucide-react";

import {
  AdminSidebar,
  SidebarItem,
} from "./AdminSidebar";

import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex h-screen min-w-0 bg-gray-50">

      {/* SIDEBAR */}
      <AdminSidebar>

        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active
          link="/admin/dashboard"
        />

        <SidebarItem
          icon={<BookUser size={20} />}
          text="JobSeeker List"
          alert
         link="/admin/jobseekers"
        />

        <SidebarItem
          icon={<IdCardLanyard size={20} />}
          text="Employers"
          link="/admin/employer"
        />

        <SidebarItem
          icon={<UserKey size={20} />}
          text="Reset Password"
          link="/admin/reset-password"
        />

        <SidebarItem
          icon={<NotebookTabs size={20} />}
          text="Simple Enquiry"
          link="/admin/simple-enquiry"
        />

          <SidebarItem
          icon={<NotebookTabs size={20} />}
          text="General Enquiry"
          link="/admin/general-enquiry"
        />

        <SidebarItem
          icon={<MessagesSquare size={20} />}
          text="Feedback"
          link="/admin/feedback-list"
        />

        <SidebarItem
          icon={<Flag size={20} />}
          text="Complaints"
          link="/admin/complaint-list"
        />

        <hr className="my-3 border-primary-100" />

        <SidebarItem
          icon={<Settings size={20} />}
          text="Settings"
        />

        <SidebarItem
          icon={<LifeBuoy size={20} />}
          text="Help"
        />

      </AdminSidebar>

      {/* RIGHT SIDE */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* HEADER */}
        <AdminHeader />

        {/* PAGE CONTENT */}
        <main className="min-w-0 flex-1 overflow-auto p-3 sm:p-4 lg:p-4">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;