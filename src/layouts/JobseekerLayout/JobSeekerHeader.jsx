import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronUp,
  Settings,
  LogOut,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const JobSeekerHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className="h-[62px] shrink-0 bg-white border-b border-gray-200
      flex items-center justify-between px-4 sm:px-6 relative z-40"
    >
      {/* LEFT SIDE - SEARCH */}
      {/* <div className="flex items-center flex-1 min-w-0">
        <div className="relative w-full max-w-[320px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search jobs, candidates, or anything..."
            className="w-full h-[34px] pl-9 pr-3 rounded-lg
              bg-gray-50 border border-gray-100
              text-xs text-gray-700
              placeholder:text-gray-400
              outline-none transition-all
              focus:bg-white focus:border-[#2f6b8a]
              focus:ring-2 focus:ring-[#2f6b8a]/10"
          />
        </div>
      </div> */}
      <div></div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 sm:gap-5 ml-3">
        {/* NOTIFICATION */}
        <button
          type="button"
          title="Notifications"
          className="relative flex items-center justify-center
            w-8 h-8 rounded-lg text-[#526581]
            hover:bg-gray-100 hover:text-[#2f6b8a]
            transition-colors"
        >
          <Bell size={17} strokeWidth={1.8} />

          {/* Notification Indicator */}
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5
            rounded-full bg-[#2f6b8a] ring-2 ring-white"
          />
        </button>

        {/* DIVIDER */}
        <div className="h-7 w-px bg-gray-200" />

        {/* PROFILE */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 sm:gap-2.5
              rounded-lg px-2 py-1.5
              hover:bg-gray-50 transition-colors"
          >
            {/* AVATAR */}
            <div
              className="w-8 h-8 rounded-full bg-[#e8f0f5]
              flex items-center justify-center shrink-0
              border border-gray-100"
            >
              <UserRound size={17} className="text-[#2f6b8a]" />
            </div>

            {/* USER DETAILS */}
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-semibold text-gray-800">JobSeeker Name</p>
              <p className="text-[10px] text-gray-500 mt-0.5">JobSeeker</p>
            </div>

            {/* DROPDOWN ARROW */}
            {profileOpen ? (
              <ChevronUp size={14} className="text-gray-500" />
            ) : (
              <ChevronDown size={14} className="text-gray-500" />
            )}
          </button>

          {/* PROFILE DROPDOWN */}
          {profileOpen && (
            <>
              {/* Outside click area */}
              <button
                type="button"
                aria-label="Close profile menu"
                onClick={() => setProfileOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div
                className="absolute right-0 top-[48px] w-[240px]
                bg-white rounded-xl shadow-xl
                border border-gray-100 z-50 overflow-hidden
                animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* PROFILE INFORMATION */}
                <div className="p-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full
                    bg-[#e8f0f5] flex items-center justify-center"
                  >
                    <UserRound size={20} className="text-[#2f6b8a]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800">
                      JobSeeker
                    </h3>
                    <p className="text-xs text-gray-500 truncate">Ishraq HR</p>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* ACCOUNT SETTINGS */}
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3
                    px-4 py-3 text-sm text-gray-600
                    hover:bg-gray-50 hover:text-[#2f6b8a]
                    transition-colors text-left"
                >
                  <Settings size={17} />
                  Account Settings
                </button>

                <div className="border-t border-gray-100" />

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={() => handleLogout()}
                  className="w-full flex items-center gap-3
                    px-4 py-3 text-sm text-red-500
                    hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default JobSeekerHeader;
