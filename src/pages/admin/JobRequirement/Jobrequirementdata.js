// New key on purpose: the old "ishraq_job_req" key holds employer-shaped data.
export const STORAGE_KEY = "ishraq_job_requirements";

export const EMPLOYMENT_TYPES = [
  "Full Time",
  "Part Time",
  "Contract",
  "Visiting Consultant",
];
export const JOB_STATUSES = ["Open", "Closed"];
const YES_NO = ["Yes", "No"];

// Form + view field config (from the Job Requirement Form in the PDF)
export const FIELDS = [
  {
    name: "organizationName",
    label: "Organization",
    type: "text",
    required: true,
  },
  {
    name: "mobile",
    label: "Registered Mobile Number",
    type: "tel",
    required: true,
  },
  {
    name: "position",
    label: "Position Required",
    type: "text",
    required: true,
  },
  { name: "department", label: "Department / Speciality", type: "text" },
  {
    name: "vacancies",
    label: "Number of Vacancies",
    type: "number",
    required: true,
  },
  {
    name: "qualification",
    label: "Qualification Required",
    type: "text",
    required: true,
  },
  { name: "experience", label: "Experience Required", type: "text" },
  { name: "salary", label: "Salary / Salary Range", type: "text" },
  { name: "location", label: "Job Location", type: "text", required: true },
  {
    name: "employmentType",
    label: "Employment Type",
    type: "select",
    options: EMPLOYMENT_TYPES,
  },
  { name: "dutyHours", label: "Duty Hours", type: "text" },
  {
    name: "accommodation",
    label: "Accommodation",
    type: "select",
    options: YES_NO,
  },
  { name: "food", label: "Food Facility", type: "select", options: YES_NO },
  { name: "joiningDate", label: "Expected Joining Date", type: "date" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: JOB_STATUSES,
  },
  {
    name: "description",
    label: "Job Description / Special Requirements",
    type: "textarea",
    full: true,
  },
];

const job = (id, o) => ({
  id,
  status: "Open",
  department: "",
  experience: "",
  salary: "",
  dutyHours: "",
  accommodation: "No",
  food: "No",
  joiningDate: "",
  description: "",
  applicants: 0,
  createdAt: new Date().toISOString(),
  ...o,
});

export const SEED_JOBS = [
  job(1, {
    organizationName: "Ayesha Health Services",
    mobile: "9876543210",
    position: "Staff Nurse",
    department: "ICU",
    vacancies: 5,
    qualification: "GNM / B.Sc Nursing",
    experience: "1-3 years",
    salary: "18,000 - 25,000",
    location: "Aurangabad",
    employmentType: "Full Time",
    dutyHours: "8 hours",
    accommodation: "Yes",
    food: "Yes",
    applicants: 12,
    description:
      "Night shift rotation. Registration with Nursing Council required.",
  }),
  job(2, {
    organizationName: "Imran Labs",
    mobile: "9823012345",
    position: "Lab Technician",
    department: "Pathology",
    vacancies: 2,
    qualification: "DMLT",
    experience: "0-2 years",
    salary: "15,000 - 20,000",
    location: "CIDCO, Aurangabad",
    employmentType: "Full Time",
    applicants: 7,
  }),
  job(3, {
    organizationName: "Sana Pathan Enterprises",
    mobile: "9922334455",
    position: "Pharmacist",
    vacancies: 1,
    qualification: "D.Pharm / B.Pharm",
    location: "Jalna",
    employmentType: "Part Time",
    status: "Closed",
    applicants: 3,
  }),
  job(4, {
    organizationName: "Rohit Deshmukh Clinic",
    mobile: "9011022334",
    position: "RMO",
    department: "General Medicine",
    vacancies: 2,
    qualification: "MBBS",
    experience: "1+ years",
    salary: "40,000 - 55,000",
    location: "Garkheda, Aurangabad",
    employmentType: "Contract",
    dutyHours: "12 hours",
    accommodation: "Yes",
    applicants: 9,
  }),
  job(5, {
    organizationName: "City Care Hospital",
    mobile: "9765088123",
    position: "Radiology Technician",
    department: "Radiology",
    vacancies: 3,
    qualification: "Diploma / B.Sc Radiology",
    experience: "2+ years",
    location: "Waluj, Aurangabad",
    employmentType: "Full Time",
    applicants: 0,
  }),
  job(6, {
    organizationName: "Sunrise Medical College",
    mobile: "8888841290",
    position: "Visiting Consultant - Medicine",
    department: "Medicine",
    vacancies: 1,
    qualification: "MD Medicine",
    location: "Aurangabad",
    employmentType: "Visiting Consultant",
    applicants: 4,
  }),
];

// Replace these with API calls when your backend is ready.
export const getJobs = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* fall through to seed */
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_JOBS));
  return SEED_JOBS;
};

export const saveJobs = (jobs) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));

export const getJob = (id) =>
  getJobs().find((j) => String(j.id) === String(id)) || null;

export const updateJob = (id, patch) => {
  const jobs = getJobs().map((j) =>
    String(j.id) === String(id)
      ? { ...j, ...patch, updatedAt: new Date().toISOString() }
      : j,
  );
  saveJobs(jobs);
  return jobs;
};

export const createJob = (data) => {
  const jobs = getJobs();
  const id = jobs.reduce((max, j) => Math.max(max, Number(j.id) || 0), 0) + 1;
  const job = {
    status: "Open",
    applicants: 0,
    ...data,
    id,
    vacancies: Number(data.vacancies),
    createdAt: new Date().toISOString(),
  };
  saveJobs([job, ...jobs]);
  return job;
};

export function validate(data) {
  const errors = {};
  FIELDS.forEach(({ name, label, type, required }) => {
    const v = data[name];
    if (required && !String(v ?? "").trim())
      errors[name] = `${label} is required`;
    else if (v && type === "tel" && !/^[+]?[0-9\s-]{10,15}$/.test(v))
      errors[name] = "Enter a valid mobile number";
    else if (
      v &&
      type === "number" &&
      (!Number.isInteger(Number(v)) || Number(v) < 1)
    )
      errors[name] = "Enter a whole number of 1 or more";
  });
  return errors;
}
