import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Database,
  UserRound,
  LockKeyhole,
  SlidersHorizontal,
  Building2,
  BriefcaseBusiness,
  Users,
  Star,
  GraduationCap,
  CheckCircle2,
  ChevronRight,
  Plus,
  Search,
  Pencil,
  Eye,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
// import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MASTER_DATA = {
  userType: {
    title: "User Type",
    icon: Users,
    values: [
      { id: 1, name: "Employer", active: true },
      { id: 2, name: "Jobseeker", active: true },
      { id: 3, name: "Other", active: true },
      { id: 4, name: "Visitor", active: false },
    ],
  },

  organizationType: {
    title: "Organization Type",
    icon: Building2,
    values: [
      { id: 1, name: "Hospital", active: true },
      { id: 2, name: "Clinic", active: true },
      { id: 3, name: "Medical College", active: true },
      { id: 4, name: "Nursing College", active: true },
      { id: 5, name: "Diagnostic Centre", active: true },
      { id: 6, name: "Pharmacy", active: true },
      { id: 7, name: "Other", active: true },
    ],
  },

  profession: {
    title: "Profession / Job Category",
    icon: BriefcaseBusiness,
    values: [
      { id: 1, name: "Doctors", active: true },
      { id: 2, name: "Consultants", active: true },
      { id: 3, name: "RMOs", active: true },
      { id: 4, name: "Nurses", active: true },
      { id: 5, name: "Pharmacists", active: true },
      { id: 6, name: "Laboratory Technicians", active: true },
      { id: 7, name: "Radiology Technicians", active: true },
      { id: 8, name: "Physiotherapists", active: true },
      {
        id: 9,
        name: "Medical & Nursing Faculty",
        active: true,
      },
      {
        id: 10,
        name: "Hospital Administration",
        active: true,
      },
      {
        id: 11,
        name: "Allied Healthcare Professionals",
        active: true,
      },
      {
        id: 12,
        name: "Healthcare Support Staff",
        active: true,
      },
    ],
  },

  employmentType: {
    title: "Employment Type",
    icon: BriefcaseBusiness,
    values: [
      { id: 1, name: "Full Time", active: true },
      { id: 2, name: "Part Time", active: true },
      { id: 3, name: "Contract", active: true },
      { id: 4, name: "Visiting Consultant", active: true },
      { id: 5, name: "Locum", active: true },
    ],
  },

  yesNo: {
    title: "Yes / No",
    icon: CheckCircle2,
    values: [
      { id: 1, name: "Yes", active: true },
      { id: 2, name: "No", active: true },
    ],
  },

  rating: {
    title: "Rating",
    icon: Star,
    values: [
      { id: 1, name: "1 Star", active: true },
      { id: 2, name: "2 Stars", active: true },
      { id: 3, name: "3 Stars", active: true },
      { id: 4, name: "4 Stars", active: true },
      { id: 5, name: "5 Stars", active: true },
    ],
  },

  careerGuidance: {
    title: "Career Guidance Category",
    icon: GraduationCap,
    values: [
      { id: 1, name: "Medical Courses", active: true },
      { id: 2, name: "Nursing Careers", active: true },
      { id: 3, name: "Allied Health Courses", active: true },
      { id: 4, name: "Healthcare Jobs", active: true },
      { id: 5, name: "Career After 12th", active: true },
      { id: 6, name: "Salary & Career Scope", active: true },
      { id: 7, name: "Higher Education", active: true },
      { id: 8, name: "Healthcare Jobs Abroad", active: true },
      { id: 9, name: "Expert Career Guidance", active: true },
    ],
  },
};

const AdminSettings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("general");

  const [selectedMaster, setSelectedMaster] = useState("userType");

  const [masterData, setMasterData] = useState(MASTER_DATA);

  const [search, setSearch] = useState("");

  const [formMode, setFormMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const settingsMenu = [
    {
      id: "general",
      title: "General Settings",
      icon: SlidersHorizontal,
    },
    {
      id: "profile",
      title: "Profile Settings",
      icon: UserRound,
    },
    {
      id: "security",
      title: "Password & Security",
      icon: LockKeyhole,
    },
    {
      id: "masterData",
      title: "Master Data",
      icon: Database,
    },
  ];

  const masterMenus = Object.entries(masterData).map(([key, value]) => ({
    id: key,
    title: value.title,
    icon: value.icon,
  }));

  const currentMaster = masterData[selectedMaster];

  const filteredValues = currentMaster.values.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setSelectedItem(null);
    setFormMode("create");
  };

  const openEdit = (item) => {
    setSelectedItem(item);
    setFormMode("edit");
  };

  const openView = (item) => {
    setSelectedItem(item);
    setFormMode("view");
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedItem(null);
  };

  const saveMaster = (name) => {
    if (!name.trim()) return;

    if (formMode === "create") {
      const newItem = {
        id: Math.max(0, ...currentMaster.values.map((x) => x.id)) + 1,
        name: name.trim(),
        active: true,
      };

      setMasterData((prev) => ({
        ...prev,
        [selectedMaster]: {
          ...prev[selectedMaster],
          values: [...prev[selectedMaster].values, newItem],
        },
      }));
    }

    if (formMode === "edit" && selectedItem) {
      setMasterData((prev) => ({
        ...prev,
        [selectedMaster]: {
          ...prev[selectedMaster],
          values: prev[selectedMaster].values.map((item) =>
            item.id === selectedItem.id
              ? {
                  ...item,
                  name: name.trim(),
                }
              : item,
          ),
        },
      }));
    }

    closeForm();
  };

  const toggleStatus = (item) => {
    setMasterData((prev) => ({
      ...prev,
      [selectedMaster]: {
        ...prev[selectedMaster],
        values: prev[selectedMaster].values.map((value) =>
          value.id === item.id
            ? {
                ...value,
                active: !value.active,
              }
            : value,
        ),
      },
    }));
  };

  return (
    <div className="min-h-full bg-[#f4f8fb]">
      {/* Settings Container */}
      <div className="flex min-h-[85vh] overflow-y-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* ========================================
            SETTINGS LEFT MENU
        ========================================= */}
        <aside className="w-[245px] shrink-0 border-r border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-4">
            <div className="flex items-center gap-2">
              <SettingsIcon size={19} className="text-[#2f6b8a]" />

              <span className="font-semibold text-slate-800">Settings</span>
            </div>
          </div>

          <div className="p-2">
            {settingsMenu.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-[#e9f4f7] font-semibold text-[#2f6b8a]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} />

                    {item.title}
                  </span>

                  {active && <ChevronRight size={16} />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ========================================
            MAIN SETTINGS AREA
        ========================================= */}
        <div className="flex min-w-0 flex-1">
          {activeSection === "masterData" ? (
            <>
              {/* ==================================
                  MASTER DATA LEFT MENU
              ================================== */}
              <aside className="w-[260px] shrink-0 border-r border-slate-200 bg-[#fafcfd]">
                <div className="border-b border-slate-200 px-4 py-4">
                  <h2 className="font-semibold text-slate-800">Master Data</h2>
                </div>

                <div className="p-2">
                  {masterMenus.map((item) => {
                    const Icon = item.icon;

                    const active = selectedMaster === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedMaster(item.id);
                          setSearch("");
                          closeForm();
                        }}
                        className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                          active
                            ? "bg-[#2f6b8a] font-semibold text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon size={17} />

                          <span className="truncate">{item.title}</span>
                        </span>

                        {active && <ChevronRight size={16} />}
                      </button>
                    );
                  })}
                </div>
              </aside>

              {/* ==================================
                  MASTER DATA RIGHT SIDE
              ================================== */}
              <main className="min-w-0 flex-1 bg-[#f8fafc]">
                {/* Header */}
                <div className="border-b border-slate-200 bg-white px-4 py-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-800">
                        {currentMaster.title}
                      </h2>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/settings/master-data/${selectedMaster}/create`,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-[#2f6b8a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#25566f]"
                    >
                      <Plus size={17} />
                      Add
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="p-2">
                  <div className="overflow-y-auto common-scrollbar h-[72vh] rounded-xl border border-slate-200 bg-white shadow-sm">
                    {/* Search */}
                    <div className="border-b border-slate-200 p-4">
                      <div className="relative max-w-sm">
                        <Search
                          size={17}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder={`Search ${currentMaster.title}...`}
                          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10"
                        />
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full  text-left">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              #
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Name
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Status
                            </th>

                            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Actions
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {filteredValues.map((item, index) => (
                            <tr
                              key={item.id}
                              className="transition hover:bg-slate-50"
                            >
                              <td className="px-5 py-3.5 text-sm text-slate-500">
                                {index + 1}
                              </td>

                              <td className="px-5 py-3.5">
                                <span className="text-sm font-medium text-slate-700">
                                  {item.name}
                                </span>
                              </td>

                              <td className="px-5 py-3.5">
                                <button
                                  onClick={() => toggleStatus(item)}
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                                    item.active
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                      : "border-red-200 bg-red-50 text-red-600"
                                  }`}
                                >
                                  {item.active ? (
                                    <UserRoundCheck size={13} />
                                  ) : (
                                    <UserRoundX size={13} />
                                  )}

                                  {item.active ? "Active" : "Inactive"}
                                </button>
                              </td>

                              <td className="px-5 py-3.5">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/admin/settings/master-data/${selectedMaster}/view/${item.id}`,
                                      )
                                    }
                                    title="View"
                                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-[#2f6b8a] hover:bg-[#e9f4f7] hover:text-[#2f6b8a]"
                                  >
                                    <Eye size={16} />
                                  </button>

                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/admin/settings/master-data/${selectedMaster}/edit/${item.id}`,
                                      )
                                    }
                                    title="Edit"
                                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-[#2f6b8a] hover:bg-[#e9f4f7] hover:text-[#2f6b8a]"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {!filteredValues.length && (
                            <tr>
                              <td
                                colSpan={4}
                                className="px-5 py-12 text-center text-sm text-slate-500"
                              >
                                No records found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </main>
            </>
          ) : (
            /* ======================================
               OTHER SETTINGS
            ====================================== */
            <div className="flex flex-1 items-start ">
              <div className="w-full border border-slate-200 px-4 py-4 bg-white shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800">
                  {settingsMenu.find((x) => x.id === activeSection)?.title}
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          CREATE / EDIT / VIEW FORM
      =========================================== */}
      {formMode && (
        <MasterDataForm
          mode={formMode}
          title={currentMaster.title}
          item={selectedItem}
          onClose={closeForm}
          onSave={saveMaster}
        />
      )}
    </div>
  );
};

/* ==================================================
   REUSABLE MASTER FORM
================================================== */

const MasterDataForm = ({ mode, title, item, onClose, onSave }) => {
  const [name, setName] = useState(item?.name || "");

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isView) {
      onSave(name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-800">
              {isView
                ? `View ${title}`
                : isEdit
                  ? `Update ${title}`
                  : `Create ${title}`}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isView
                ? "View master data details"
                : isEdit
                  ? "Update master data"
                  : "Add a new master data value"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {/* Master */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Master
            </label>

            <input
              type="text"
              value={title}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
            />
          </div>

          {/* Value */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Value
              {!isView && <span className="ml-1 text-red-500">*</span>}
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isView}
              placeholder={`Enter ${title}`}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none ${
                isView
                  ? "border-slate-200 bg-slate-50 text-slate-500"
                  : "border-slate-300 bg-white text-slate-700 focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10"
              }`}
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>

            <div className="relative">
              <select
                disabled={isView}
                defaultValue={item?.active === false ? "Inactive" : "Active"}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/10 disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </span>
            </div>
          </div>

          {/* Audit Information */}
          {item && (
            <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-500">Created At</p>

                <p className="mt-1 text-sm text-slate-700">
                  05-10-2026 10:30 AM
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">Created By</p>

                <p className="mt-1 text-sm text-slate-700">Admin</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">Updated At</p>

                <p className="mt-1 text-sm text-slate-700">
                  05-10-2026 11:15 AM
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">Updated By</p>

                <p className="mt-1 text-sm text-slate-700">Admin</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {isView ? "Close" : "Cancel"}
            </button>

            {!isView && (
              <button
                type="submit"
                className="rounded-lg bg-[#2f6b8a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#25566f]"
              >
                {isEdit ? "Update" : "Create"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
