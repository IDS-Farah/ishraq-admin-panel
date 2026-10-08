import React from "react";

const GeneralSettings = () => {
  return (
    <div className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          General Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage general application settings.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Add general settings fields here */}
        <p className="text-sm text-slate-500">
          General settings content
        </p>
      </div>
    </div>
  );
};

export default GeneralSettings;