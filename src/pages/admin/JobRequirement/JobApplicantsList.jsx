import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsLeft, Mail, Phone, Paperclip } from "lucide-react";
import DataListPage, {
  TwoLineCell,
} from "../../../components/common/DataListPage";
import { JOB_CATEGORIES, getUsers } from "./jobseekerData";

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
    <span className="truncate">{category}</span>
  </span>
);

const JobApplicantsList = () => {
  const navigate = useNavigate();
  const [users] = useState(getUsers);

  const columns = [
    {
      key: "fullName",
      label: "Full Name",
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar user={u} />
          <span
            className={`flex flex-col ${
              u.status === "Active" ? "text-slate-900" : "text-[#6b7a88]"
            }`}
          >
            <span className="font-medium">{u.fullName}</span>
            {u.email ? (
              <span className="inline-flex items-center gap-1 text-[12px] text-[#6b7a88]">
                <Mail size={12} className="shrink-0" />
                {u.email}
              </span>
            ) : (
              <span className="text-[12px] text-[#9aa5b1]">-</span>
            )}
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
      key: "mobile",
      label: "Mobile",
      render: (u) => (
        <span className="inline-flex items-center gap-1">
          <Phone size={13} className="shrink-0" />
          {u.mobile || "-"}
        </span>
      ),
    },
    {
      key: "totalYearsExpirence",
      label: "Experience",
      sortable: true,
      render: (u) => `${u.totalYearsExpirence} Years`,
    },
    {
      key: "document",
      label: "Resume",
      render: (u) => (
        <span className="inline-flex items-center gap-1">
          <Paperclip size={13} className="shrink-0" />
          {u.document?.name || "-"}
        </span>
      ),
    },
  ];

  return (
    <DataListPage
      title="Applicant List"
      headerLeading={
        <button
          type="button"
          onClick={() => navigate(-1)}
          title="Back"
          aria-label="Back"
          className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-[#2c6b8a] text-white transition hover:bg-[#245a75] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2c6b8a] focus-visible:ring-offset-2"
        >
          <ChevronsLeft size={18} />
        </button>
      }
      rows={users}
      searchPlaceholder="Search by email, name or mobile"
      searchKeys={["fullName", "email", "mobile"]}
      // statuses={[
      //   { value: "Active", tone: "success" },
      //   { value: "Inactive", tone: "danger" },
      // ]}
      activeValue="Active"
      inactiveValue="Inactive"
      categoryLabel="Job Category"
      categoryField="jobCategory"
      categories={JOB_CATEGORIES}
      columns={columns}
      rowTitle={(u) => u.fullName}
      entityName="Jobseeker"
      onView={(u) => navigate(`/admin/jobseekers/${u.id}`)}
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
  );
};

export default JobApplicantsList;
