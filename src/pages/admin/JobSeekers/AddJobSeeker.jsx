import { useRef, useState } from "react";
import { ArrowLeft,ChevronsLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JOB_CATEGORIES = [
  "Nurse",
  "Doctor",
  "Pharmacist",
  "Lab Technician",
  "Caregiver",
  "Admin / Office Staff",
  "Other",
];

const MAX_FILE_MB = 5;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const STORAGE_KEY = "ishraq_jobseekers";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  mobile: "",
  jobCategory: "",
  address: "",
  document: null,
};

const getUsers = () => {
  const saved = localStorage.getItem(
    STORAGE_KEY
  );

  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

const validate = (
  form,
  requireDocument = true
) => {
  const errors = {};

  if (!form.fullName.trim()) {
    errors.fullName =
      "Full name is required";
  }

  const digits = form.mobile.replace(
    /\D/g,
    ""
  );

  if (!form.mobile.trim()) {
    errors.mobile =
      "Mobile number is required";
  } else if (
    digits.length < 10 ||
    digits.length > 15
  ) {
    errors.mobile =
      "Enter a valid mobile number, 10 to 15 digits";
  }

  if (
    form.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      form.email.trim()
    )
  ) {
    errors.email =
      "Enter a valid email address";
  }

  if (!form.jobCategory) {
    errors.jobCategory =
      "Select a profession";
  }

  if (!form.address.trim()) {
    errors.address =
      "Address is required";
  }

  if (
    requireDocument &&
    !form.document
  ) {
    errors.document =
      "Upload a document";
  }

  return errors;
};

const AddJobSeeker = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(
    EMPTY_FORM
  );

  const [errors, setErrors] = useState({});

  const fileRef = useRef(null);

  /* ================= INPUT ================= */

  const set = (key) => (e) => {
    setForm((current) => ({
      ...current,
      [key]: e.target.value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  };

  const onMobile = (e) => {
    const clean = e.target.value.replace(
      /[^\d+\s]/g,
      ""
    );

    setForm((current) => ({
      ...current,
      mobile: clean,
    }));

    setErrors((current) => ({
      ...current,
      mobile: undefined,
    }));
  };

  /* ================= FILE ================= */

  const onFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        document:
          "Only PDF, JPG, PNG, DOC or DOCX files are allowed",
      }));

      return;
    }

    if (
      file.size >
      MAX_FILE_MB * 1024 * 1024
    ) {
      setErrors((current) => ({
        ...current,
        document: `File must be smaller than ${MAX_FILE_MB} MB`,
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      document: {
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      },
    }));

    setErrors((current) => ({
      ...current,
      document: undefined,
    }));
  };

  /* ================= SUBMIT ================= */

  const submit = (e) => {
    e.preventDefault();

    const foundErrors = validate(
      form,
      true
    );

    if (
      Object.keys(foundErrors).length
    ) {
      setErrors(foundErrors);
      return;
    }

    const users = getUsers();

    const newJobseeker = {
      ...form,
      id: Date.now(),
      status: "Active",
      fullName:
        form.fullName.trim(),
      email:
        form.email.trim(),
      mobile:
        form.mobile.trim(),
      address:
        form.address.trim(),
    };

    const updatedUsers = [
      newJobseeker,
      ...users,
    ];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedUsers)
    );

    navigate("/admin/jobseekers");
  };

  /* ================= STAR ================= */

  const star = (
    <span className="ml-0.5 text-[#e03131]">
      *
    </span>
  );

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div className="min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">

      <div className="w-full rounded-[10px] border border-[#e2e8ee] bg-white p-3.5 sm:px-[22px] sm:pb-[22px] sm:pt-5">

        {/* ================= TOP BAR ================= */}

        <div className="mb-[22px] flex flex-wrap items-center gap-3.5 border-b border-[#e2e8ee] pb-4">

       <button
  type="button"
  onClick={() => navigate(-1)}
  title="Back"
  aria-label="Back"
  className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#dce3eb] bg-white text-[#53677f] transition hover:bg-[#f7f9fb]"
>
  <ChevronsLeft size={20} strokeWidth={2} />
</button>

          <h1 className="m-0 flex-1 font-serif text-[22px] font-bold text-[#2c6b8a] sm:text-[26px]">
            Add User
          </h1>
        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={submit}
          noValidate
        >

          {/* ================= PERSONAL ================= */}

          <p className="mb-3 mt-1 text-[17px] font-semibold text-[#2c6b8a]">
            Personal Details
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* FULL NAME */}

            <div className="flex flex-col gap-1.5">

              <label className="text-sm font-semibold text-[#1e2b36]">
                Full Name {star}
              </label>

              <input
                value={form.fullName}
                onChange={set("fullName")}
                placeholder="Your full name"
                className="w-full rounded-[10px] border border-[#c9d5dd] bg-white px-3.5 py-3 text-sm placeholder:text-[#9aa5b1] focus:border-[#1e5a63] focus:outline-none focus:ring-2 focus:ring-[#1e5a63]"
              />

              {errors.fullName && (
                <span className="text-[12.5px] text-[#d64545]">
                  {errors.fullName}
                </span>
              )}

            </div>

            {/* MOBILE */}

            <div className="flex flex-col gap-1.5">

              <label className="text-sm font-semibold text-[#1e2b36]">
                Mobile Number {star}
              </label>

              <input
                inputMode="tel"
                value={form.mobile}
                onChange={onMobile}
                placeholder="+91 98765 43210"
                className="w-full rounded-[10px] border border-[#c9d5dd] bg-white px-3.5 py-3 text-sm placeholder:text-[#9aa5b1] focus:border-[#1e5a63] focus:outline-none focus:ring-2 focus:ring-[#1e5a63]"
              />

              {errors.mobile && (
                <span className="text-[12.5px] text-[#d64545]">
                  {errors.mobile}
                </span>
              )}

            </div>

            {/* EMAIL */}

            <div className="flex flex-col gap-1.5 sm:col-span-2">

              <label className="text-sm font-semibold text-[#1e2b36]">
                Email Address
              </label>

              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                className="w-full rounded-[10px] border border-[#c9d5dd] bg-white px-3.5 py-3 text-sm placeholder:text-[#9aa5b1] focus:border-[#1e5a63] focus:outline-none focus:ring-2 focus:ring-[#1e5a63]"
              />

              {errors.email && (
                <span className="text-[12.5px] text-[#d64545]">
                  {errors.email}
                </span>
              )}

            </div>
          </div>

          {/* ================= PROFESSIONAL ================= */}

          <p className="mb-3 mt-[26px] text-[17px] font-semibold text-[#2c6b8a]">
            Professional Details
          </p>

          <div className="grid grid-cols-1 gap-4">

            <div className="flex flex-col gap-1.5">

              <label className="text-sm font-semibold text-[#1e2b36]">
                Profession / Job Category {star}
              </label>

              <select
                value={form.jobCategory}
                onChange={set(
                  "jobCategory"
                )}
                className="w-full rounded-[10px] border border-[#c9d5dd] bg-white px-3.5 py-3 text-sm focus:border-[#1e5a63] focus:outline-none focus:ring-2 focus:ring-[#1e5a63]"
              >
                <option value="">
                  Select Profession
                </option>

                {JOB_CATEGORIES.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>

              {errors.jobCategory && (
                <span className="text-[12.5px] text-[#d64545]">
                  {errors.jobCategory}
                </span>
              )}

            </div>
          </div>

          {/* ================= ADDRESS + DOCUMENT ================= */}

          <p className="mb-3 mt-[26px] text-[17px] font-semibold text-[#2c6b8a]">
            Address and Document
          </p>

          <div className="grid grid-cols-1 gap-4">

            {/* ADDRESS */}

            <div className="flex flex-col gap-1.5">

              <label className="text-sm font-semibold text-[#1e2b36]">
                Address {star}
              </label>

              <textarea
                rows={3}
                value={form.address}
                onChange={set("address")}
                placeholder="House no., area, city, state"
                className="w-full resize-y rounded-[10px] border border-[#c9d5dd] bg-white px-3.5 py-3 text-sm placeholder:text-[#9aa5b1] focus:border-[#1e5a63] focus:outline-none focus:ring-2 focus:ring-[#1e5a63]"
              />

              {errors.address && (
                <span className="text-[12.5px] text-[#d64545]">
                  {errors.address}
                </span>
              )}

            </div>

            {/* DOCUMENT */}

            <div className="flex flex-col gap-1.5">

              <label className="text-sm font-semibold text-[#1e2b36]">
                Document {star}
              </label>

              <input
                ref={fileRef}
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={onFile}
              />

              <div className="flex items-center gap-3 rounded-[10px] border border-dashed border-[#b6c8d4] bg-[#f7f9fb] p-3">

                <button
                  type="button"
                  onClick={() =>
                    fileRef.current?.click()
                  }
                  className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#2c6b8a] bg-white px-4 py-2.5 text-sm font-medium text-[#2c6b8a] hover:bg-[#e8f1f6]"
                >
                  {form.document
                    ? "Change file"
                    : "Choose file"}
                </button>

                <span className="truncate text-[13.5px] text-[#6b7a88]">
                  {form.document
                    ? form.document.name
                    : "No file chosen"}
                </span>

              </div>

              <span className="text-[12.5px] text-[#6b7a88]">
                PDF, JPG, PNG, DOC or DOCX, up to{" "}
                {MAX_FILE_MB} MB
              </span>

              {errors.document && (
                <span className="text-[12.5px] text-[#d64545]">
                  {errors.document}
                </span>
              )}

            </div>
          </div>

          {/* ================= BUTTONS ================= */}

          <div className="mt-7 flex justify-end gap-2.5 border-t border-[#e2e8ee] pt-[18px]">

            <button
              type="button"
              onClick={() =>
                navigate("/admin/jobseekers")
              }
              className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#e2e8ee] px-4 py-2.5 text-sm font-medium text-[#6b7a88] hover:bg-[#f7f9fb]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-[#2c6b8a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#22566f]"
            >
              Add User
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobSeeker;