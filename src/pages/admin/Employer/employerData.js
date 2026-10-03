/* Shared by the Employer list page and the Employer profile page.
   Replace getEmployers() with your API call when the backend is ready. */

export const EMPLOYER_STORAGE_KEY = "ishraq_employers_v1";

export const ORG_TYPES = ["Hospital", "Clinic", "Pharmacy", "Diagnostic Lab", "Nursing Home", "Home Care", "Other"];

const job = (id, title, category, vacancies, filled, applicants, status, postedOn, deadline) => ({
  id, title, category, vacancies, filled, applicants, status, postedOn, deadline,
});

export const SEED_EMPLOYERS = [
  {
    id: 1, status: "Active", verified: true,
    companyName: "Godavari Multispeciality Hospital", orgType: "Hospital", registrationNumber: "MH-HOS-20418",
    contactPerson: "Dr. Anil Kulkarni", designation: "Medical Director",
    email: "hr@godavarihospital.in", mobile: "+91 98220 11223", whatsapp: "+91 98220 11223",
    website: "www.godavarihospital.in", address: "Jalna Road, Near Cidco Bus Stand", city: "Aurangabad", state: "Maharashtra",
    about: "A 220-bed multispeciality hospital providing emergency, critical care, maternity and surgical services across Marathwada.",
    joinedOn: "12 Jan 2025",
    jobs: [
      job(101, "Staff Nurse (ICU)", "Nurse", 6, 2, 48, "Open", "28 Sep 2026", "20 Oct 2026"),
      job(102, "Resident Medical Officer", "Doctor", 3, 1, 21, "Open", "25 Sep 2026", "18 Oct 2026"),
      job(103, "Lab Technician", "Lab Technician", 2, 2, 17, "Closed", "02 Sep 2026", "25 Sep 2026"),
      job(104, "Front Office Executive", "Admin / Office Staff", 2, 0, 33, "Paused", "20 Sep 2026", "30 Oct 2026"),
      job(105, "Staff Nurse (OT)", "Nurse", 4, 1, 29, "Open", "01 Oct 2026", "25 Oct 2026"),
    ],
  },
  {
    id: 2, status: "Active", verified: true,
    companyName: "Sanjeevani Diagnostics", orgType: "Diagnostic Lab", registrationNumber: "MH-LAB-11872",
    contactPerson: "Meera Joshi", designation: "HR Manager",
    email: "careers@sanjeevanilabs.com", mobile: "+91 97650 44112", whatsapp: "+91 97650 44112",
    website: "www.sanjeevanilabs.com", address: "Garkheda Parisar, Plot 14", city: "Aurangabad", state: "Maharashtra",
    about: "NABL accredited diagnostic centre with 12 collection points and in-house pathology and radiology.",
    joinedOn: "03 Mar 2025",
    jobs: [
      job(201, "Phlebotomist", "Lab Technician", 5, 3, 26, "Open", "27 Sep 2026", "15 Oct 2026"),
      job(202, "Pathologist", "Doctor", 1, 0, 6, "Open", "22 Sep 2026", "12 Oct 2026"),
    ],
  },
  {
    id: 3, status: "Inactive", verified: false,
    companyName: "CareNest Home Services", orgType: "Home Care", registrationNumber: "",
    contactPerson: "Farah Sheikh", designation: "Founder",
    email: "", mobile: "+91 88050 33221", whatsapp: "",
    website: "", address: "Kranti Chowk", city: "Aurangabad", state: "Maharashtra",
    about: "Home nursing and elder care provider. Registration documents are pending.",
    joinedOn: "18 Aug 2026",
    jobs: [],
  },
  {
    id: 4, status: "Active", verified: true,
    companyName: "Apex Pharmacy Chain", orgType: "Pharmacy", registrationNumber: "MH-PH-30977",
    contactPerson: "Rakesh Patil", designation: "Operations Head",
    email: "jobs@apexpharmacy.in", mobile: "+91 90110 78456", whatsapp: "+91 90110 78456",
    website: "www.apexpharmacy.in", address: "Station Road, Opp. Railway Station", city: "Pune", state: "Maharashtra",
    about: "A chain of 38 retail pharmacies hiring pharmacists and store staff across western Maharashtra.",
    joinedOn: "22 May 2025",
    jobs: [
      job(401, "Pharmacist", "Pharmacist", 8, 5, 74, "Open", "30 Sep 2026", "22 Oct 2026"),
      job(402, "Store Assistant", "Admin / Office Staff", 6, 6, 40, "Closed", "01 Sep 2026", "20 Sep 2026"),
      job(403, "Regional Coordinator", "Admin / Office Staff", 1, 0, 12, "Open", "26 Sep 2026", "10 Oct 2026"),
    ],
  },
  {
    id: 5, status: "Active", verified: true,
    companyName: "Sunrise Nursing Home", orgType: "Nursing Home", registrationNumber: "MH-NH-09231",
    contactPerson: "Dr. Shabana Qureshi", designation: "Administrator",
    email: "admin@sunrisenursing.in", mobile: "+91 93720 66778", whatsapp: "+91 93720 66778",
    website: "", address: "Harsul Road", city: "Aurangabad", state: "Maharashtra",
    about: "Maternity and general nursing home with a 40-bed capacity.",
    joinedOn: "09 Jul 2025",
    jobs: [job(501, "Caregiver", "Caregiver", 4, 1, 19, "Open", "29 Sep 2026", "19 Oct 2026")],
  },
];

export const getEmployers = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(EMPLOYER_STORAGE_KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch {
    /* fall through to seed data */
  }
  localStorage.setItem(EMPLOYER_STORAGE_KEY, JSON.stringify(SEED_EMPLOYERS));
  return SEED_EMPLOYERS;
};

export const jobsPosted = (e) => e.jobs?.length || 0;
export const openJobs = (e) => (e.jobs || []).filter((j) => j.status === "Open").length;