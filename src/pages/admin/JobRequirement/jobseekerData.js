export const STORAGE_KEY = "ishraq_jobseekers";

export const JOB_CATEGORIES = [
  "Nurse",
  "Doctor",
  "Pharmacist",
  "Lab Technician",
  "Caregiver",
  "Admin / Office Staff",
  "Other",
];

export const SEED_USERS = [
  {
    id: 1,
    status: "Active",
    fullName: "Ayesha Khan",
    email: "ayesha.khan@gmail.com",
    mobile: "+91 98765 43210",
    jobCategory: "Nurse",
    address: "Roshan Gate, Aurangabad, Maharashtra",
    document: { name: "ayesha-cv.pdf", url: "" },
    totalYearsExpirence: 2,
  },
  {
    id: 2,
    status: "Active",
    fullName: "Imran Shaikh",
    email: "imran.shaikh@gmail.com",
    mobile: "+91 98230 12345",
    jobCategory: "Lab Technician",
    address: "CIDCO N-4, Aurangabad",
    document: { name: "imran-certificate.jpg", url: "" },
    totalYearsExpirence: 4,
  },
  {
    id: 3,
    status: "Inactive",
    fullName: "Sana Pathan",
    email: "",
    mobile: "+91 99223 34455",
    jobCategory: "Pharmacist",
    address: "Jalna Road, Aurangabad",
    document: { name: "sana-resume.pdf", url: "" },
    totalYearsExpirence: 5,
  },
 {
    id: 4,
    status: "Active",
    fullName: "Rohit Deshmukh",
    email: "rohit.deshmukh@gmail.com",
    mobile: "+91 90110 22334",
    jobCategory: "Doctor",
    address: "Garkheda, Aurangabad",
    document: { name: "rohit-degree.pdf", url: "" },
    totalYearsExpirence: 8,
  },
  {
    id: 5,
    status: "Active",
    fullName: "Neha Jadhav",
    email: "neha.jadhav@outlook.com",
    mobile: "+91 97650 88123",
    jobCategory: "Caregiver",
    address: "Satara Parisar, Aurangabad",
    document: null,
    totalYearsExpirence: 6,
  },
  {
    id: 6,
    status: "Inactive",
    fullName: "Farhan Sayyed",
    email: "farhan.s@gmail.com",
    mobile: "+91 88888 41290",
    jobCategory: "Admin / Office Staff",
    address: "Kranti Chowk, Aurangabad",
    document: { name: "farhan-id.jpg", url: "" },
    totalYearsExpirence: 3,
  },
  {
    id: 7,
    status: "Active",
    fullName: "Pooja Wagh",
    email: "pooja.wagh@gmail.com",
    mobile: "+91 93720 55671",
    jobCategory: "Nurse",
    address: "Waluj MIDC, Aurangabad",
    document: { name: "pooja-cv.pdf", url: "" },
    totalYearsExpirence: 0.5,
  },
  {
    id: 8,
    status: "Active",
    fullName: "Zaid Ansari",
    email: "",
    mobile: "+91 70200 91822",
    jobCategory: "Other",
    address: "Harsul, Aurangabad",
    document: { name: "zaid-resume.pdf", url: "" },
    totalYearsExpirence: 1,
  },
];

export const getUsers = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return SEED_USERS;
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_USERS));
  return SEED_USERS;
};

export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};
