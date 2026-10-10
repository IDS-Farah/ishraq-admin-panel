import dayjs from "dayjs";
export const STATUSES = [
  { value: "Active", tone: "success" },
  { value: "Inactive", tone: "danger" },
];

export const formatDate = (value) =>
  value && dayjs(value).isValid()
    ? dayjs(value).format("DD-MM-YYYY")
    : "-";

const orDash = (value) =>
  value === null || value === undefined || value === "" ? "-" : value;

const rating = (value) => (value ? `${value} / 5` : "-");

const anonymous = (value) => value || "Anonymous";

export const ENQUIRY_CONFIGS = {
  complaint: {
    title: "Complaints",
    entityName: "Complaint",
    endpoint: "/Complaint",
    idField: "CP_complaint_id",
    // activeField: "CP_is_active",
    titleField: "CP_full_name",
    searchPlaceholder: "Search by reference, name, email or mobile",
    canToggle: true,
    categoryLabel: "Category",
    categoryField: "ComplaintCategoryName",
    detailPath: "/admin/complaints",
    exportFileName: "ishraq-complaints.xlsx",
    listColumns: [
      { key: "CP_reference_no", label: "Reference", sortable: true, format: orDash },
      { key: "CP_full_name", label: "Name", sortable: true },
      { key: "CP_email", label: "Email", format: orDash },
      { key: "CP_mobile", label: "Mobile", format: orDash },
      { key: "ComplaintCategoryName", label: "Category", format: orDash },
      { key: "UserTypeName", label: "You are", format: orDash },
      { key: "CP_created_at", label: "Submitted", format: formatDate },
    ],
    detailFields: [
      { key: "CP_reference_no", label: "Reference" },
      { key: "CP_full_name", label: "Full Name" },
      { key: "CP_mobile", label: "Mobile" },
      { key: "CP_email", label: "Email" },
      { key: "UserTypeName", label: "You are" },
      { key: "ComplaintCategoryName", label: "Category" },
      { key: "CP_details", label: "Complaint Details", type: "multiline" },
      { key: "CP_file_path", label: "Supporting Document", type: "file" },
      { key: "CP_created_at", label: "Submitted", type: "date" },
    ],
  },

  career: {
    title: "Career Enquiries",
    entityName: "Career enquiry",
    endpoint: "/CareerEnquiry",
    idField: "CE_career_enquiry_id",
    // activeField: "CE_is_active",
    titleField: "CE_name",
    searchPlaceholder: "Search by name, email, mobile or course",
    canToggle: true,
    detailPath: "/admin/career",
    exportFileName: "ishraq-career-enquiries.xlsx",
    listColumns: [
      { key: "CE_name", label: "Name", sortable: true },
      { key: "CE_age", label: "Age", format: orDash },
      { key: "CE_qualification", label: "Qualification", format: orDash },
      { key: "CE_mobile", label: "Mobile", format: orDash },
      { key: "CE_email", label: "Email", format: orDash },
      { key: "CE_course_considered", label: "Course / Career", format: orDash },
      { key: "CE_created_at", label: "Submitted", format: formatDate },
    ],
    detailFields: [
      { key: "CE_name", label: "Name" },
      { key: "CE_age", label: "Age" },
      { key: "CE_qualification", label: "Qualification" },
      { key: "CE_mobile", label: "Mobile" },
      { key: "CE_email", label: "Email" },
      { key: "CE_course_considered", label: "Course / Career" },
      { key: "CE_question", label: "Question", type: "multiline" },
      { key: "CE_created_at", label: "Submitted", type: "date" },
    ],
  },

  contact: {
    title: "Contact Enquiries",
    entityName: "Contact enquiry",
    endpoint: "/ContactEnquiry",
    idField: "CN_contact_enquiry_id",
    activeField: "CN_is_active",
    titleField: "CN_full_name",
    searchPlaceholder: "Search by name, email, mobile or subject",
    canToggle: false, // enable once the ContactEnquiry active-status endpoint exists
    detailPath: "/admin/contact",
    exportFileName: "ishraq-contact-enquiries.xlsx",
    listColumns: [
      { key: "CN_full_name", label: "Name", sortable: true },
      { key: "CN_email", label: "Email", format: orDash },
      { key: "CN_mobile", label: "Mobile", format: orDash },
      { key: "UserTypeName", label: "You are", format: orDash },
      { key: "CN_subject", label: "Subject", format: orDash },
      { key: "CN_created_at", label: "Submitted", format: formatDate },
    ],
    detailFields: [
      { key: "CN_full_name", label: "Full Name" },
      { key: "CN_mobile", label: "Mobile" },
      { key: "CN_email", label: "Email" },
      { key: "UserTypeName", label: "You are" },
      { key: "CN_subject", label: "Subject" },
      { key: "CN_message", label: "Message", type: "multiline" },
      { key: "CN_created_at", label: "Submitted", type: "date" },
    ],
  },

  feedback: {
    title: "Feedback",
    entityName: "Feedback",
    endpoint: "/Feedback",
    idField: "FB_feedback_id",
    activeField: "FB_is_active",
    titleField: "FB_name",
    searchPlaceholder: "Search by name, contact or comments",
    canToggle: false, // no active-status endpoint in the controller you shared
    detailPath: "/admin/feedback",
    exportFileName: "ishraq-feedback.xlsx",
    listColumns: [
      { key: "FB_name", label: "Name", sortable: true, format: anonymous },
      { key: "FB_contact", label: "Contact", format: orDash },
      { key: "UserTypeName", label: "You are", format: orDash },
      { key: "FB_rating", label: "Rating", format: rating },
      { key: "FB_created_at", label: "Submitted", format: formatDate },
    ],
    detailFields: [
      { key: "FB_name", label: "Name" },
      { key: "FB_contact", label: "Contact" },
      { key: "UserTypeName", label: "You are" },
      { key: "FB_rating", label: "Overall Experience", type: "rating" },
      { key: "FB_overall_experience", label: "Overall Experience (text)", type: "multiline" },
      { key: "FB_useful_text", label: "What did you find useful?", type: "multiline" },
      { key: "FB_improve_text", label: "What can we improve?", type: "multiline" },
      { key: "FB_suggestions", label: "Additional Suggestions", type: "multiline" },
      { key: "FB_created_at", label: "Submitted", type: "date" },
    ],
  },
};