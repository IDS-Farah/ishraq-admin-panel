import { Link, Outlet } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext"; 

import {
  Calendar,
  Flag,
  Home,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  StickyNote,
} from "lucide-react";

import { EmployerSidebar, SidebarItem } from "./EmployerSidebar"
import EmployerHeader from "./EmployerHeader";
 
const EmployerLayout = () => { 
  const { logout, user } = useAuth(); 
 
  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <EmployerSidebar>

        <SidebarItem
          icon={<Home size={20} />}
          text="Home"
          alert
        />

        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active
        />

        <SidebarItem
          icon={<StickyNote size={20} />}
          text="Projects"
          alert
        />

        <SidebarItem
          icon={<Calendar size={20} />}
          text="Calendar"
        />

        <SidebarItem
          icon={<Layers size={20} />}
          text="Tasks"
        />

        <SidebarItem
          icon={<Flag size={20} />}
          text="Reporting"
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

      </EmployerSidebar>

      <div className=" flex-1 flex flex-col min-w-0">
        {/* HEADER */}
          <EmployerHeader />
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}; 
 
export default EmployerLayout;