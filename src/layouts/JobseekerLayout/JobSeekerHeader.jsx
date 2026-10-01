import React, { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Bell,
  ChevronDown,
  ChevronUp,
  Settings,
  LogOut,
} from "lucide-react";
 

const JobSeekerHeader= () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-[82px] bg-white border-b border-gray-200 flex items-center justify-between px-6 relative">

      {/* LEFT SIDE */}
      <div className="w-[220px]">
        {/* Keep this empty for sidebar space */}
      </div>


      {/* CENTER TITLE */}
      <div className="absolute left-[35%] -translate-x-[50%]">
        <h1 className=" text-[36px] font-bold text-[#2f6b8a] whitespace-nowrap">
          Ishraq HR
        </h1>
      </div>


      {/* RIGHT SIDE */}
      <div className="ml-auto flex items-center gap-5">

        {/* DATE */}
        <div className="flex items-center gap-2 text-[#526581]">
          <CalendarDays size={18} strokeWidth={1.8} />

          <span className="text-sm">
            23-09-2026
          </span>
        </div>


        {/* TIME */}
        <div className="flex items-center gap-2 text-[#526581]">
          <Clock3 size={18} strokeWidth={1.8} />

          <span className="text-sm">
            04:23 PM
          </span>
        </div>


        {/* NOTIFICATION */}
        <button
  type="button"
  className="p-2 text-[#526581] hover:text-[#2f6b8a] transition"
>
  <Bell size={22} strokeWidth={1.8} />
</button>


        {/* DIVIDER */}
        <div className="h-8 w-px bg-gray-200"></div>


        {/* PROFILE */}
        <div className="relative">

          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2 transition"
          >

            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-semibold">
                
              </span>
            </div>


            {/* Name */}
            <div className="text-left leading-tight">
              <p className="font-semibold text-gray-800 text-sm">
                Jobseeker
              </p>

              <p className="text-xs text-gray-500">
                 User
              </p>
            </div>


            {/* Arrow */}
            {profileOpen ? (
              <ChevronUp
                size={18}
                className="text-[#7b8ba5]"
              />
            ) : (
              <ChevronDown
                size={18}
                className="text-[#7b8ba5]"
              />
            )}

          </button>


          {/* DROPDOWN */}
          {profileOpen && (
            <div className="absolute right-0 top-[58px] w-[335px] bg-white rounded-2xl shadow-lg border border-gray-200 z-50 overflow-hidden">

              {/* Profile Information */}
              <div className="p-5 flex items-center gap-4">

                <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">
                    J
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    JobSeeker
                  </h3>

                  <p className="text-xs text-gray-500">
                IshraqHR-Jobseeker.com
                  </p>
                </div>

              </div>


              <div className="border-t border-gray-100"></div>


              {/* Account Settings */}
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-gray-600 hover:bg-gray-50 transition text-left"
              >
                <Settings size={20} />

                <span className="text-[16px]">
                  Account Settings
                </span>
              </button>


              <div className="border-t border-gray-100"></div>


              {/* Logout */}
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 transition text-left"
              >
                <LogOut size={20} />

                <span className="text-[16px]">
                  Logout
                </span>
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default JobSeekerHeader;