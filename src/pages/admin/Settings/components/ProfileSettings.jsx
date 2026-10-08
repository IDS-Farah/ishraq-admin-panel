import React from "react";

const ProfileSettings = () => {
  return (
    <div className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Profile Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage administrator profile information.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Profile form */}
        <p className="text-sm text-slate-500">
          Profile settings content
        </p>
      </div>
    </div>
  );
};

export default ProfileSettings;