import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserRoundCheck, UserRoundX, UserPlus, Mail, Phone } from "lucide-react";
import { StatCardGrid } from "../../../components/common/Dashboardkit";
import DataListPage from "../../../components/common/DataListPage";
import { JOB_CATEGORIES, getUsers, saveUsers } from "../JobRequirement/jobseekerData";

const CATEGORY_STYLE = {
  Nurse: "bg-sky-600 text-white ring-sky-700",
  Doctor: "bg-indigo-600 text-white ring-indigo-700",
  Pharmacist: "bg-violet-600 text-white ring-violet-700",
  "Lab Technician": "bg-teal-600 text-white ring-teal-700",
  Caregiver: "bg-amber-500 text-white ring-amber-600",
  "Admin / Office Staff": "bg-slate-600 text-white ring-slate-700",
  Other: "bg-gray-600 text-white ring-gray-700",
};

const AVATAR_GRADIENTS = [
  "from-[#2c6b8a] to-[#5ba6bd]",
  "from-violet-500 to-indigo-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-rose-500 to-pink-400",
  "from-sky-500 to-cyan-400",
];

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const Avatar = ({ user }) => (
  <span
    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${
      AVATAR_GRADIENTS[user.id % AVATAR_GRADIENTS.length]
    } text-[11px] font-bold text-white shadow-sm ring-2 ring-white`}
  >
    {initials(user.fullName)}
  </span>
);

const CategoryBadge = ({ category }) => (
  <span
    title={category}
    className={`inline-flex h-7 w-[140px] items-center justify-center rounded-md px-2.5 text-[15px] ring-1 ring-inset whitespace-nowrap shadow-sm ${
      CATEGORY_STYLE[category] || CATEGORY_STYLE.Other
    }`}
  >
    <span className="truncate">{category || "-"}</span>
  </span>
);

const JobSeekerList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(getUsers);

  const persist = (updated) => {
    setUsers(updated);
    saveUsers(updated);
  };

  /* STATS (computed from data, stay in the parent) */
  const stats = useMemo(
    () => [
      {
        title: "Total users",
        value: users.length,
        note: "All time",
        icon: Users,
        color: "#0ea5e9",
        color2: "#38bdf8",
        from: "#0ea5e9",
        to: "#2563eb",
      },
      {
        title: "Active users",
        value: users.filter((u) => u.status === "Active").length,
        note: "Can log in and apply",
        icon: UserRoundCheck,
        color: "#6366f1",
        color2: "#8b5cf6",
        from: "#6366f1",
        to: "#8b5cf6",
      },
      {
        title: "Inactive users",
        value: users.filter((u) => u.status !== "Active").length,
        note: "Access suspended",
        icon: UserRoundX,
        color: "#10b981",
        color2: "#34d399",
        from: "#10b981",
        to: "#059669",
      },
      {
        title: "Experienced",
        value: users.filter((u) => Number(u.totalYearsExpirence) >= 3).length,
        note: "3+ years experience",
        icon: UserPlus,
        color: "#f59e0b",
        color2: "#fb923c",
        from: "#f59e0b",
        to: "#ef4444",
      },
    ],
    [users],
  );

  const columns = [
    {
      key: "fullName",
      label: "Full Name",
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar user={u} />
          <span
            className={`transition-colors ${
              u.status === "Active" ? "text-slate-900" : "text-[#6b7a88]"
            }`}
          >
            {u.fullName}
          </span>
        </div>
      ),
    },
    {
      key: "jobCategory",
      label: "Job Category",
      render: (u) => <CategoryBadge category={u.jobCategory} />,
    },
    {
      key: "email",
      label: "Email",
      render: (u) =>
        u.email ? (
          <span className="inline-flex items-center gap-1">
            <Mail size={13} className="shrink-0" />
            {u.email}
          </span>
        ) : (
          <span className="text-[#9aa5b1]">-</span>
        ),
    },
    {
      key: "mobile",
      label: "Mobile",
      render: (u) => (
        <span className="inline-flex items-center gap-1">
          <Phone size={13} className="shrink-0" />
          {u.mobile || "-"}
        </span>
      ),
    },
  ];

  const handleToggleStatus = async (user, next) => {
    persist(users.map((u) => (u.id === user.id ? { ...u, status: next } : u)));
  };

  return (
    <div>
      <StatCardGrid items={stats} />

      <DataListPage
        title="Jobseeker List"
        hasStats
        rows={users}
        searchPlaceholder="Search by email, name or mobile"
        searchKeys={["fullName", "email", "mobile"]}
        statuses={[
          { value: "Active", tone: "success" },
          { value: "Inactive", tone: "danger" },
        ]}
        activeValue="Active"
        inactiveValue="Inactive"
        categoryLabel="Profession"
        categoryField="jobCategory"
        categories={JOB_CATEGORIES}
        columns={columns}
        rowTitle={(u) => u.fullName}
        entityName="Jobseeker"
        onView={(u) => navigate(`/admin/jobseekers/${u.id}`)}
        onToggleStatus={handleToggleStatus}
        exportConfig={{
          fileName: "ishraq-jobseekers.xlsx",
          sheetName: "Jobseekers",
          toRow: (u, i) => ({
            "Sr.No": i + 1,
            "Full Name": u.fullName,
            Email: u.email || "",
            Mobile: u.mobile || "",
            "Job Category": u.jobCategory || "",
            Experience: u.totalYearsExpirence,
            Status: u.status,
            Address: u.address || "",
            Document: u.document?.name || "",
          }),
        }}
      />
    </div>
  );
};

export default JobSeekerList;