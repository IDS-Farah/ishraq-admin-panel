import {
  Building2,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";

export const MASTER_DATA = {
  userType: {
    title: "User Type",
    icon: Users,
    values: [
      { id: 1, name: "Employer", active: true },
      { id: 2, name: "Jobseeker", active: true },
      { id: 3, name: "Other", active: true },
      { id: 4, name: "Visitor", active: false },
    ],
  },

  organizationType: {
    title: "Organization Type",
    icon: Building2,
    values: [
      { id: 1, name: "Hospital", active: true },
      { id: 2, name: "Clinic", active: true },
      { id: 3, name: "Medical College", active: true },
      { id: 4, name: "Nursing College", active: true },
      { id: 5, name: "Diagnostic Centre", active: true },
      { id: 6, name: "Pharmacy", active: true },
      { id: 7, name: "Other", active: true },
    ],
  },

  profession: {
    title: "Profession / Job Category",
    icon: BriefcaseBusiness,
    values: [
      { id: 1, name: "Doctors", active: true },
      { id: 2, name: "Consultants", active: true },
      { id: 3, name: "RMOs", active: true },
      { id: 4, name: "Nurses", active: true },
      { id: 5, name: "Pharmacists", active: true },
      { id: 6, name: "Laboratory Technicians", active: true },
      { id: 7, name: "Radiology Technicians", active: true },
      { id: 8, name: "Physiotherapists", active: true },
      { id: 9, name: "Medical & Nursing Faculty", active: true },
      { id: 10, name: "Hospital Administration", active: true },
      { id: 11, name: "Allied Healthcare Professionals", active: true },
      { id: 12, name: "Healthcare Support Staff", active: true },
    ],
  },

  employmentType: {
    title: "Employment Type",
    icon: BriefcaseBusiness,
    values: [
      { id: 1, name: "Full Time", active: true },
      { id: 2, name: "Part Time", active: true },
      { id: 3, name: "Contract", active: true },
      { id: 4, name: "Visiting Consultant", active: true },
      { id: 5, name: "Locum", active: true },
    ],
  },

  yesNo: {
    title: "Yes / No",
    icon: CheckCircle2,
    values: [
      { id: 1, name: "Yes", active: true },
      { id: 2, name: "No", active: true },
    ],
  },

  rating: {
    title: "Rating",
    icon: Star,
    values: [
      { id: 1, name: "1 Star", active: true },
      { id: 2, name: "2 Stars", active: true },
      { id: 3, name: "3 Stars", active: true },
      { id: 4, name: "4 Stars", active: true },
      { id: 5, name: "5 Stars", active: true },
    ],
  },

  careerGuidance: {
    title: "Career Guidance Category",
    icon: GraduationCap,
    values: [
      { id: 1, name: "Medical Courses", active: true },
      { id: 2, name: "Nursing Careers", active: true },
      { id: 3, name: "Allied Health Courses", active: true },
      { id: 4, name: "Healthcare Jobs", active: true },
      { id: 5, name: "Career After 12th", active: true },
      { id: 6, name: "Salary & Career Scope", active: true },
      { id: 7, name: "Higher Education", active: true },
      { id: 8, name: "Healthcare Jobs Abroad", active: true },
      { id: 9, name: "Expert Career Guidance", active: true },
    ],
  },
};