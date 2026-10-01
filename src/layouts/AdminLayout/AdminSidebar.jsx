import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../logo.svg";
import {
  ChevronFirst,
  ChevronLast,
  Search,
  LayoutDashboard,
  BookUser,
  IdCardLanyard,
  UserKey,
  NotebookTabs,
  MessagesSquare,
  Flag,
  Settings,
  LifeBuoy,
} from "lucide-react";

export const AdminSidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [search, setSearch] = useState("");

  // All sidebar menu items are maintained here
  const menuItems = [
    {
      text: "Dashboard",
      icon: LayoutDashboard,
      link: "/admin/dashboard",
    },
    {
      text: "JobSeeker List",
      icon: BookUser,
      link: "/admin/jobseekers",
      // alert: true,
    },
    {
      text: "Employers",
      icon: IdCardLanyard,
      link: "/admin/employer",
    },
    {
      text: "Reset Password",
      icon: UserKey,
      link: "/admin/reset-password",
    },
    {
      text: "Simple Enquiry",
      icon: NotebookTabs,
      link: "/admin/simple-enquiry",
    },
    {
      text: "General Enquiry",
      icon: NotebookTabs,
      link: "/admin/general-enquiry",
    },
    {
      text: "Complaints",
      icon: Flag,
      link: "/admin/complaint-list",
    },
  ];

  const bottomItems = [
    {
      text: "Settings",
      icon: Settings,
      link: "/admin/settings",
    },
    {
      text: "Feedback",
      icon: MessagesSquare,
      link: "/admin/feedback-list",
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredBottomItems = bottomItems.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = (item) => {
    const Icon = item.icon;

    return (
      <li key={item.text} className="list-none">
        <NavLink
          to={item.link}
          end
          title={!expanded ? item.text : undefined}
          className={({ isActive }) =>
            `relative flex items-center h-10 px-3 my-1 rounded-lg
            transition-all duration-200 group
            ${
              isActive
                ? "bg-[#2f6b8a] text-white shadow-sm"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
            }
            ${expanded ? "justify-start" : "justify-center"}`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={18}
                strokeWidth={1.8}
                className={`shrink-0 ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-blue-600"
                }`}
              />

              <span
                className={`overflow-hidden whitespace-nowrap text-sm
                  transition-all duration-300 ${
                    expanded ? "w-44 ml-3 opacity-100" : "w-0 ml-0 opacity-0"
                  }`}
              >
                {item.text}
              </span>

              {item.alert && (
                <span className="absolute right-2 top-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </>
          )}
        </NavLink>
      </li>
    );
  };

  return (
    <aside
      className={`h-screen shrink-0 transition-all duration-300 ${
        expanded ? "w-64" : "w-[68px]"
      }`}
    >
      <nav className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
        {/* Logo and Collapse Button */}
        <div
          className={`h-16 px-3 flex items-center border-b border-gray-100 ${
            expanded ? "justify-between" : "justify-center"
          }`}
        >
          {/* <img
            src={Logo}
            alt="Ishraq HR"
            className={`object-contain transition-all duration-300 ${
              expanded ? "w-32 max-h-10" : "hidden"
            }`}
          /> */}
          <h2
            className={`font-bold text-xl tracking-wide
    text-[#2f6b8a]
    transition-all duration-300
    hover:scale-105
    
    ${expanded ? "w-32 max-h-10 ml-10" : "hidden"}`}
          >
            Ishraq HR
          </h2>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            className="p-2 rounded-full text-white bg-[#2f6b8a] hover:bg-[#2f6b8a]/80 ]
             transition-colors"
          >
            {expanded ? <ChevronFirst size={12} /> : <ChevronLast size={12} />}
          </button>
        </div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto px-2 pt-2">
          <ul className="space-y-1">{filteredItems.map(renderItem)}</ul>
        </div>

        {/* Bottom Menu */}
        <div className="px-2 py-3 border-t border-gray-100">
          <ul className="space-y-1">{filteredBottomItems.map(renderItem)}</ul>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
