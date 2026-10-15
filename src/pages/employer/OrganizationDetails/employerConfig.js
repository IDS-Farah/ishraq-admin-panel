// employerConfig.js

// API is retained for any other existing code that uses it.
export const API = "/api/employers";

// Legacy constants retained to avoid breaking other imports.
// EmployerEdit now loads these options from the master APIs.
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

export const FIELDS = [
  {
    name: "organizationName",
    label: "Organization Name",
    type: "text",
    required: true,
  },
  {
    name: "organizationType",
    label: "Institute Type",
    type: "select",
    required: true,
  },
  {
    name: "contactPerson",
    label: "Contact Person",
    type: "text",
    required: true,
  },
  {
    name: "designation",
    label: "Designation",
    type: "text",
  },
  {
    name: "mobile",
    label: "Mobile Number",
    type: "tel",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
  },
  {
    name: "country",
    label: "Country",
    type: "select",
    required: true,
  },
  {
    name: "state",
    label: "State",
    type: "select",
    required: true,
  },
  {
    name: "city",
    label: "City",
    type: "select",
    required: true,
  },
  {
    name: "website",
    label: "Website (optional)",
    type: "url",
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
  country: "",
  city: "",
  state: "",
  website: "https://example.com",
  status: "Active",
  consent: true,
  registeredAt: new Date().toISOString(),
};

export function validate(data) {
  const errors = {};

  FIELDS.forEach(({ name, label, type, required }) => {
    const value = data[name];
    const cleanLabel = label.replace(" (optional)", "");

    if (required && !String(value ?? "").trim()) {
      errors[name] = `${cleanLabel} is required`;
    } else if (value && type === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      errors[name] = "Enter a valid email";
    } else if (
      value &&
      type === "tel" &&
      !/^[+]?[0-9\s-]{10,15}$/.test(value)
    ) {
      errors[name] = "Enter a valid mobile number";
    } else if (value && type === "url" && !/^https?:\/\/\S+\.\S+/.test(value)) {
      errors[name] = "Start with http:// or https://";
    }
  });

  return errors;
}
