import React, { useState } from "react";
import Logo from "../../logo.svg";
import {
  ChevronFirst,
  ChevronLast,
  EllipsisVertical,
} from "lucide-react";
import Profile from "../../logo.svg";
import { Link } from "react-router-dom";

export const AdminSidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={`h-screen transition-all duration-300 ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      <nav className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">

        {/* Logo + Chevron */}
        <div
          className={`p-4 pb-2 flex items-center ${
            expanded ? "justify-between" : "justify-center"
          }`}
        >
          {/* Logo */}
          <img
            src={Logo}
            alt="Logo"
            className={`overflow-hidden transition-all duration-300 ${
              expanded ? "w-20" : "w-0"
            }`}
          />

          {/* Chevron Button */}
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors"
          >
            {expanded ? (
              <ChevronFirst size={20} />
            ) : (
              <ChevronLast size={20} />
            )}
          </button>
        </div>

        {/* Sidebar Items */}
        <ul className="flex-1 px-3 list-none">
          {children}
        </ul>

        {/* Profile */}
        <div
          className={`border-t border-primary-100 flex p-3 ${
            expanded ? "justify-start" : "justify-center"
          }`}
        >
          <img
            src={Profile}
            alt="Profile"
            className="rounded-md shrink-0"
            width={40}
            height={40}
          />

          {/* Profile Details */}
          <div
            className={`flex justify-between items-center overflow-hidden transition-all duration-300 ${
              expanded ? "w-52 ml-3" : "w-0 ml-0"
            }`}
          >
            <div className="leading-4 whitespace-nowrap">
              <h4 className="font-semibold text-primary-800">
                ISHRAQ HR
              </h4>

              <span className="text-xs text-gray-500">
                ishraqhr18@gmail.com
              </span>
            </div>

            <EllipsisVertical
              size={20}
              className="text-primary-600"
            />
          </div>
        </div>
      </nav>
    </aside>
  );
};


export function SidebarItem({
  icon,
  text,
  active,
  alert,
  link

}) {
  return (
  <Link to={link}>
    
      <li
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-all duration-200 group
          ${
            active
              ? "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-800"
              : "text-gray-600 hover:bg-primary-50 hover:text-primary-700"
          }
        `}
      >
        {/* Icon */}
        <span
          className={`
            shrink-0
            ${
              active
                ? "text-primary-600"
                : "text-gray-500 group-hover:text-primary-600"
            }
          `}
        >
          {icon}
        </span>
        {/* Text */}
        <span
          className="
            overflow-hidden
            transition-all
            duration-300
            w-52
            ml-3
            whitespace-nowrap
          "
        >
          {text}
        </span>
        {/* Alert */}
        {alert && (
          <div className="absolute right-2 w-2 h-2 rounded-full bg-primary-500" />
        )}
      </li>
  </Link>
  );
}