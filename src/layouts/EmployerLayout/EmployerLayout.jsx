import React from "react";
import { Outlet } from "react-router-dom";
import EmployerSidebar from "./EmployerSidebar";
import EmployerHeader from "./EmployerHeader";

const EmployerLayout = () => {
  return (
    <div className="flex h-screen min-w-0 overflow-hidden bg-gray-50">

      {/* SIDEBAR */}
      <EmployerSidebar />

      {/* RIGHT SIDE */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* HEADER */}
        <EmployerHeader />

        {/* PAGE CONTENT */}
        <main className="min-w-0 flex-1 overflow-auto p-3">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default EmployerLayout;
