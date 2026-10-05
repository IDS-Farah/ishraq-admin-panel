export const API = "/api/employers";

export const ORG_TYPES = [
  "Hospital",
  "Clinic",
  "Medical College",
  "Nursing College",
  "Diagnostic Centre",
  "Pharmacy",
  "Other",
];

export const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Chandigarh",
  "Puducherry",
];

// name, label, type, required, options
export const FIELDS = [
  {
    name: "organizationName",
    label: "Organization Name",
    type: "text",
    required: true,
  },
  {
    name: "organizationType",
    label: "Organization Type",
    type: "select",
    required: true,
    options: ORG_TYPES,
  },
  {
    name: "contactPerson",
    label: "Contact Person",
    type: "text",
    required: true,
  },
  { name: "designation", label: "Designation", type: "text" },
  { name: "mobile", label: "Mobile Number", type: "tel", required: true },
  { name: "email", label: "Email Address", type: "email" },
  { name: "city", label: "City", type: "text", required: true },
  {
    name: "state",
    label: "State",
    type: "text",
    required: true,
    list: "states",
  },
  { name: "website", label: "Website (optional)", type: "url" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: ["Active", "Inactive"],
  },
  {
    name: "consent",
    label: "Consent to Privacy Policy and Terms of Service",
    type: "checkbox",
  },
];

export const DEMO_EMPLOYER = {
  organizationName: "Sample Hospital",
  organizationType: "Hospital",
  contactPerson: "Dr. Sample",
  designation: "Medical Director",
  mobile: "9876543210",
  email: "hr@example.com",
  city: "Chhatrapati Sambhaji Nagar",
  state: "Maharashtra",
  website: "https://example.com",
  status: "Active",
  consent: true,
  registeredAt: new Date().toISOString(),
};

// Load from API; fall back to localStorage / demo data if server is unreachable.
export async function loadEmployer(id) {
  try {
    const r = await fetch(`${API}/${encodeURIComponent(id)}`);
    if (!r.ok) throw new Error("load failed");
    return await r.json();
  } catch {
    const local = localStorage.getItem(`employer:${id}`);
    return local ? JSON.parse(local) : { id, ...DEMO_EMPLOYER };
  }
}

export function validate(data) {
  const errors = {};
  FIELDS.forEach(({ name, label, type, required }) => {
    const v = data[name];
    const clean = label.replace(" (optional)", "");
    if (required && !String(v ?? "").trim())
      errors[name] = `${clean} is required`;
    else if (v && type === "email" && !/^\S+@\S+\.\S+$/.test(v))
      errors[name] = "Enter a valid email";
    else if (v && type === "tel" && !/^[+]?[0-9\s-]{10,15}$/.test(v))
      errors[name] = "Enter a valid mobile number";
    else if (v && type === "url" && !/^https?:\/\/\S+\.\S+/.test(v))
      errors[name] = "Start with http:// or https://";
  });
  return errors;
}
