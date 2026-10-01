import React from "react";
import { Outlet } from "react-router-dom";
import JobSeekerSidebar from "./JobSeekerSidebar";
import JobSeekerHeader from ".//JobSeekerHeader";

const JobSeekerLayout = () => {
  return (
    <div className="flex h-screen min-w-0 overflow-hidden bg-gray-50">

      {/* SIDEBAR */}
      <JobSeekerSidebar />

      {/* RIGHT SIDE */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* HEADER */}
        <JobSeekerHeader />

        {/* PAGE CONTENT */}
        <main className="min-w-0 flex-1 overflow-auto p-3 sm:p-4 lg:p-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default JobSeekerLayout;
