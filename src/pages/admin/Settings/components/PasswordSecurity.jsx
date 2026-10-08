import React from "react";

const PasswordSecurity = () => {
  return (
    <div className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Password & Security
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage password and account security settings.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Password / security form */}
        <p className="text-sm text-slate-500">
          Password and security content
        </p>
      </div>
    </div>
  );
};

export default PasswordSecurity;