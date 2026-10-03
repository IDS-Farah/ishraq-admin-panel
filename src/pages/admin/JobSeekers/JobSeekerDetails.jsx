import { useEffect, useState } from "react";

import {
  FileText as FileIcon,
  ChevronsLeft,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

const STORAGE_KEY = "ishraq_jobseekers";

const EMPTY_FORM = {
  fullName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  jobCategory: "",
  highestQualification: "",
  speciality: "",
  professionalRegistrationNumber: "",
  totalExperience: "",
  currentDesignation: "",
  address: "",
  currentCity: "",
  state: "",
  expectedSalary: "",
  preferredJobLocation: "",
  willingToRelocate: "",
  employmentPreference: "",
  availabilityToJoin: "",
  document: null,
};

const getUsers = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

const JobSeekerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    const users = getUsers();

    const found = users.find(
      (item) => String(item.id) === String(id)
    );

    if (found) {
      setUser(found);

      setForm({
        ...EMPTY_FORM,
        ...found,
      });
    }
  }, [id]);

  const show = (value) => (
    <div className="min-h-[47px] whitespace-pre-wrap break-words rounded-[10px] border border-[#e2e8ee] bg-[#f7f9fb] px-3.5 py-3 text-sm text-[#1e2b36]">
      {value || "-"}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-full bg-[#f7f9fb] p-0">
        <div className="rounded-[10px] border border-[#e2e8ee] bg-white p-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Back"
            aria-label="Back"
            className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#dce3eb] bg-white text-[#53677f] transition hover:bg-[#f7f9fb]"
          >
            <ChevronsLeft size={20} strokeWidth={2} />
          </button>

          <p className="px-4 py-10 text-center text-[#6b7a88]">
            This jobseeker was not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <div className="w-full rounded-[10px] border border-[#e2e8ee] bg-white p-3.5 sm:px-[18px] sm:pb-[22px] sm:pt-5">

        {/* HEADER */}
        <div className="mb-[22px] flex items-center gap-3.5 border-b border-[#e2e8ee] pb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Back"
            aria-label="Back"
            className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#dce3eb] bg-white text-[#53677f] transition hover:bg-[#f7f9fb]"
          >
            <ChevronsLeft size={20} strokeWidth={2} />
          </button>

          <h1 className="m-0 flex flex-1 items-center gap-3 font-serif text-[22px] font-bold text-[#2c6b8a] sm:text-[26px]">
            User Detail

            <span
              className={
                user.status === "Active"
                  ? "rounded-md bg-[#e3f5ec] px-3 py-1 font-sans text-[12.5px] font-semibold text-[#1f9d63]"
                  : "rounded-md bg-[#fbe9e9] px-3 py-1 font-sans text-[12.5px] font-semibold text-[#d64545]"
              }
            >
              {user.status}
            </span>
          </h1>
        </div>

        {/* PERSONAL */}
        <p className="mb-3 mt-1 text-[17px] font-semibold text-[#2c6b8a]">
          Personal Details
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Full Name
            </label>
            {show(form.fullName)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Mobile Number
            </label>
            {show(form.mobile)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              WhatsApp Number
            </label>
            {show(form.whatsapp)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Email Address
            </label>
            {show(form.email)}
          </div>

        </div>

        {/* PROFESSIONAL */}
        <p className="mb-3 mt-[26px] text-[17px] font-semibold text-[#2c6b8a]">
          Professional Details
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Profession / Job Category
            </label>
            {show(form.jobCategory)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Highest Qualification
            </label>
            {show(form.highestQualification)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Speciality / Department
            </label>
            {show(form.speciality)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Professional Registration Number
            </label>
            {show(form.professionalRegistrationNumber)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Total Experience (Years)
            </label>
            {show(form.totalExperience)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Current Designation
            </label>
            {show(form.currentDesignation)}
          </div>

        </div>

        {/* LOCATION */}
        <p className="mb-3 mt-[26px] text-[17px] font-semibold text-[#2c6b8a]">
          Location & Preferences
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Address
            </label>
            {show(form.address)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Current City
            </label>
            {show(form.currentCity)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              State
            </label>
            {show(form.state)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Expected Salary
            </label>
            {show(form.expectedSalary)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Preferred Job Location
            </label>
            {show(form.preferredJobLocation)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Willing to Relocate?
            </label>
            {show(form.willingToRelocate)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Employment Preference
            </label>
            {show(form.employmentPreference)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1e2b36]">
              Availability to Join
            </label>
            {show(form.availabilityToJoin)}
          </div>

        </div>

        {/* DOCUMENT */}
        <p className="mb-3 mt-[26px] text-[17px] font-semibold text-[#2c6b8a]">
          Document Upload
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1e2b36]">
            Resume / CV
          </label>

          <div className="min-h-[47px] rounded-[10px] border border-[#e2e8ee] bg-[#f7f9fb] px-3.5 py-3 text-sm">
            {form.document ? (
              form.document.url ? (
                <a
                  href={form.document.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13.5px] text-[#2c6b8a] hover:underline"
                >
                  <FileIcon size={16} />
                  {form.document.name}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[13.5px] text-[#2c6b8a]">
                  <FileIcon size={16} />
                  {form.document.name}
                </span>
              )
            ) : (
              "Not uploaded"
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobSeekerDetails;