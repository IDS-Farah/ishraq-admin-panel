export const STORAGE_KEY = "ishraq_jobseekers";

export const PROFESSIONS = [
  "Doctor",
  "Consultant",
  "RMO",
  "Nurse",
  "Pharmacist",
  "Laboratory Technician",
  "Radiology Technician",
  "Physiotherapist",
  "Medical & Nursing Faculty",
  "Hospital Administration",
  "Allied Healthcare Professional",
  "Healthcare Support Staff",
];
export const EMPLOYMENT_PREFERENCES = [
  "Full Time",
  "Part Time",
  "Contract",
  "Visiting",
  "Locum",
];
export const AVAILABILITY = ["Immediate", "15 days", "30 days", "60+ days"];
const YES_NO = ["Yes", "No"];

// Form config from the Jobseeker Registration Form in the PDF
export const SECTIONS = [
  {
    title: "Personal Details",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "mobile", label: "Mobile Number", type: "tel", required: true },
      { name: "whatsapp", label: "WhatsApp Number", type: "tel" },
      { name: "email", label: "Email Address", type: "email" },
      { name: "city", label: "Current City", type: "text", required: true },
      { name: "state", label: "State", type: "text" },
    ],
  },
  {
    title: "Professional Details",
    fields: [
      {
        name: "profession",
        label: "Profession / Job Category",
        type: "select",
        required: true,
        options: PROFESSIONS,
      },
      {
        name: "qualification",
        label: "Highest Qualification",
        type: "text",
        required: true,
      },
      { name: "speciality", label: "Speciality / Department", type: "text" },
      {
        name: "registrationNo",
        label: "Professional Registration Number",
        type: "text",
      },
      {
        name: "experience",
        label: "Total Experience (years)",
        type: "number",
        required: true,
      },
      {
        name: "currentDesignation",
        label: "Current Designation",
        type: "text",
      },
      { name: "currentEmployer", label: "Current Employer", type: "text" },
      { name: "currentSalary", label: "Current Salary", type: "text" },
    ],
  },
  {
    title: "Job Preferences",
    fields: [
      { name: "expectedSalary", label: "Expected Salary", type: "text" },
      {
        name: "preferredLocation",
        label: "Preferred Job Location",
        type: "text",
        required: true,
      },
      {
        name: "relocate",
        label: "Willing to Relocate",
        type: "select",
        options: YES_NO,
      },
      {
        name: "employmentPreference",
        label: "Employment Preference",
        type: "select",
        options: EMPLOYMENT_PREFERENCES,
      },
      {
        name: "availability",
        label: "Availability to Join",
        type: "select",
        options: AVAILABILITY,
      },
      {
        name: "status",
        label: "Profile Status",
        type: "select",
        required: true,
        options: ["Active", "Inactive"],
      },
    ],
  },
];

export const ALL_FIELDS = SECTIONS.flatMap((s) => s.fields);

export const DOCUMENTS = [
  { name: "resume", label: "Resume / CV", required: true },
  { name: "qualificationCert", label: "Qualification Certificate" },
  { name: "registrationCert", label: "Professional Registration Certificate" },
  { name: "experienceCert", label: "Experience Certificate" },
];

export const SEED_JOBSEEKERS = [
  {
    id: 1,
    status: "Active",
    fullName: "Ayesha Khan",
    mobile: "9876543210",
    whatsapp: "9876543210",
    email: "ayesha.khan@gmail.com",
    city: "Aurangabad",
    state: "Maharashtra",
    profession: "Nurse",
    qualification: "B.Sc Nursing",
    speciality: "ICU",
    registrationNo: "MNC-12345",
    experience: 3,
    currentDesignation: "Staff Nurse",
    currentEmployer: "City Care Hospital",
    currentSalary: "20,000",
    expectedSalary: "25,000",
    preferredLocation: "Aurangabad, Pune",
    relocate: "Yes",
    employmentPreference: "Full Time",
    availability: "30 days",
    consent: true,
    documents: {
      resume: { name: "ayesha-cv.pdf" },
      qualificationCert: { name: "bsc-nursing.pdf" },
      registrationCert: null,
      experienceCert: null,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    status: "Active",
    fullName: "Imran Shaikh",
    mobile: "9823012345",
    whatsapp: "",
    email: "",
    city: "Jalna",
    state: "Maharashtra",
    profession: "Laboratory Technician",
    qualification: "DMLT",
    speciality: "Pathology",
    registrationNo: "",
    experience: 1.5,
    currentDesignation: "",
    currentEmployer: "",
    currentSalary: "",
    expectedSalary: "16,000",
    preferredLocation: "Aurangabad",
    relocate: "No",
    employmentPreference: "Full Time",
    availability: "Immediate",
    consent: true,
    documents: {
      resume: { name: "imran-resume.pdf" },
      qualificationCert: null,
      registrationCert: null,
      experienceCert: null,
    },
    createdAt: new Date().toISOString(),
  },
];

// Replace these with API calls when your backend is ready.
export const getJobseekers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* fall through to seed */
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_JOBSEEKERS));
  return SEED_JOBSEEKERS;
};

export const getJobseeker = (id) =>
  getJobseekers().find((j) => String(j.id) === String(id)) || null;

export const updateJobseeker = (id, patch) => {
  const list = getJobseekers().map((j) =>
    String(j.id) === String(id)
      ? { ...j, ...patch, updatedAt: new Date().toISOString() }
      : j,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
};

export function validate(data) {
  const errors = {};
  ALL_FIELDS.forEach(({ name, label, type, required }) => {
    const v = data[name];
    if (required && !String(v ?? "").trim())
      errors[name] = `${label} is required`;
    else if (v && type === "tel" && !/^[+]?[0-9\s-]{10,15}$/.test(v))
      errors[name] = "Enter a valid mobile number";
    else if (v && type === "email" && !/^\S+@\S+\.\S+$/.test(v))
      errors[name] = "Enter a valid email";
    else if (
      v &&
      type === "number" &&
      (isNaN(Number(v)) || Number(v) < 0 || Number(v) > 60)
    )
      errors[name] = "Enter years between 0 and 60";
  });
  DOCUMENTS.forEach(({ name, label, required }) => {
    if (required && !data.documents?.[name])
      errors[name] = `${label} is required`;
  });
  return errors;
}
