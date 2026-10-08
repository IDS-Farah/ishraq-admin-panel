import React, { useState } from "react";

import SettingsSidebar from "./components/SettingsSidebar";
import GeneralSettings from "./components/GeneralSettings";
import ProfileSettings from "./components/ProfileSettings";
import PasswordSecurity from "./components/PasswordSecurity";
import MasterDataLayout from "./components/master/MasterDataLayout";

import { MASTER_DATA } from "./data/masterData";

const AdminSettings = () => {
  const [activeSection, setActiveSection] =
    useState("general");

  const [masterData, setMasterData] =
    useState(MASTER_DATA);

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSettings />;

      case "profile":
        return <ProfileSettings />;

      case "security":
        return <PasswordSecurity />;

      case "masterData":
        return (
          <MasterDataLayout
            masterData={masterData}
            setMasterData={setMasterData}
          />
        );

      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-full bg-[#f4f8fb]">
      <div className="flex min-h-[85vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <SettingsSidebar
          activeSection={activeSection}
          onChange={setActiveSection}
        />

        <div className="flex min-w-0 flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;