import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Send,
  FileText,
  Clock,
  User,
  CheckCircle2,
  ChevronsLeft,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// ----------------------------------------------------
// FORM CONFIG
// ----------------------------------------------------

const USER_TYPE_3 = ["Employer", "Jobseeker", "Other"];

export const simpleEnquiryForm = {
  id: "simpleEnquiry",
  title: "Ask a Career Expert",
  submitLabel: "Ask Your Question",
  fields: [
    { name: "name", label: "Name", type: "text", required: false },
    {
      name: "ageOrQualification",
      label: "Age / Current Qualification",
      type: "text",
      required: false,
    },
    {
      name: "contact",
      label: "Mobile Number / Email",
      type: "text",
      required: false,
    },
    {
      name: "courseOrCareer",
      label: "Course or Career Being Considered",
      type: "text",
      required: false,
    },
    {
      name: "question",
      label: "Your Question",
      type: "textarea",
      required: false,
    },
  ],
};

export const generalEnquiryForm = {
  id: "generalEnquiry",
  title: "General Enquiry",
  submitLabel: "Send Enquiry",
  fields: [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
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
      required: false,
    },
    {
      name: "userType",
      label: "You are",
      type: "select",
      options: USER_TYPE_3,
      required: false,
    },
    {
      name: "subject",
      label: "Subject",
      type: "text",
      required: false,
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      required: true,
    },
  ],
};

export const complaintForm = {
  id: "complaint",
  title: "Complaint / Grievance",
  submitLabel: "Submit Complaint",
  generatesReferenceNo: true,
  fields: [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      required: true,
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
      required: false,
    },
    {
      name: "userType",
      label: "You are",
      type: "select",
      options: USER_TYPE_3,
      required: false,
    },
    {
      name: "category",
      label: "Complaint Category",
      type: "select",
      options: [
        "Service Related",
        "Recruitment Process",
        "Communication",
        "Payment / Fees",
        "Other",
      ],
      required: false,
    },
    {
      name: "details",
      label: "Complaint Details",
      type: "textarea",
      required: true,
    },
    {
      name: "supportingDocument",
      label: "Supporting Document",
      type: "file",
      required: false,
    },
  ],
};

export const feedbackForm = {
  id: "feedback",
  title: "Feedback",
  submitLabel: "Submit Feedback",
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: false,
    },
    {
      name: "contact",
      label: "Contact Number / Email",
      type: "text",
      required: false,
    },
    {
      name: "userType",
      label: "You are",
      type: "select",
      options: ["Employer", "Jobseeker", "Visitor"],
      required: false,
    },
    {
      name: "rating",
      label: "Overall Experience",
      type: "rating",
      min: 1,
      max: 5,
      required: false,
    },
    {
      name: "useful",
      label: "What did you find useful?",
      type: "textarea",
      required: false,
    },
    {
      name: "improve",
      label: "What can we improve?",
      type: "textarea",
      required: false,
    },
    {
      name: "suggestions",
      label: "Additional Suggestions",
      type: "textarea",
      required: false,
    },
  ],
};

export const forms = {
  simpleEnquiry: simpleEnquiryForm,
  generalEnquiry: generalEnquiryForm,
  complaint: complaintForm,
  feedback: feedbackForm,
};

// ----------------------------------------------------
// DEMO DATA
// ----------------------------------------------------

const demoData = {
  simpleEnquiry: {
    name: "Sample Student",
    ageOrQualification: "17, 12th Science",
    contact: "9876543210",
    courseOrCareer: "GNM vs B.Sc Nursing",
    question: "Which one has better job scope?",
  },

  generalEnquiry: {
    fullName: "Rahul Sharma",
    mobile: "9876543210",
    email: "rahul@example.com",
    userType: "Jobseeker",
    subject: "Job registration enquiry",
    message: "I would like to know more about the registration process.",
  },

  complaint: {
    fullName: "Amit Patil",
    mobile: "9876543210",
    email: "amit@example.com",
    userType: "Jobseeker",
    category: "Recruitment Process",
    details: "I have not received an update regarding my job application.",
    supportingDocument: "",
    referenceNo: "CMP-20261005-4821",
  },

  feedback: {
    name: "Neha Sharma",
    contact: "9876543210",
    userType: "Employer",
    rating: 4,
    useful: "The job search functionality was useful.",
    improve: "The filtering options can be improved.",
    suggestions: "Add more job categories.",
  },
};

// ----------------------------------------------------
// HELPERS
// ----------------------------------------------------

const STATUS_OPTIONS = ["New", "Answered", "Closed"];

function generateComplaintRef() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);

  return `CMP-${date}-${random}`;
}

function getStatusClass(status) {
  switch (status) {
    case "Answered":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";

    case "Closed":
      return "bg-slate-100 text-slate-700 border-slate-200";

    case "New":
    default:
      return "bg-amber-100 text-amber-700 border-amber-200";
  }
}

// ----------------------------------------------------
// COMPONENT
// ----------------------------------------------------

const EnquiryDetails = ({
  formType = "simpleEnquiry",
  apiBase = "/api",
  listPath = "/admin/simple-enquiry",
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useMemo(() => {
    return forms[formType] || forms.simpleEnquiry;
  }, [formType]);

  const storageKey = `${form.id}:${id || "demo"}`;

  const [record, setRecord] = useState(null);
  const [status, setStatus] = useState("New");
  const [reply, setReply] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // LOAD RECORD
  // --------------------------------------------------

  useEffect(() => {
    loadRecord();
  }, [formType, id]);

  const loadRecord = async () => {
    setLoading(true);

    try {
      if (!id || id === "demo") {
        throw new Error("Demo mode");
      }

      const response = await fetch(
        `${apiBase}/${form.id}/${encodeURIComponent(id)}`,
      );

      if (!response.ok) {
        throw new Error("API unavailable");
      }

      const data = await response.json();

      const finalRecord = {
        ...data,
        responses: data.responses || [],
      };

      setRecord(finalRecord);
      setStatus(finalRecord.status || "New");
    } catch (error) {
      const localRecord = JSON.parse(
        localStorage.getItem(storageKey) || "null",
      );

      const demoRecord = {
        id: id || "demo",
        referenceNo:
          demoData[form.id]?.referenceNo ||
          (form.generatesReferenceNo ? generateComplaintRef() : ""),
        submittedAt: new Date().toISOString(),
        status: "New",
        responses: [],
        ...(demoData[form.id] || {}),
      };

      const finalRecord = localRecord || demoRecord;

      setRecord(finalRecord);
      setStatus(finalRecord.status || "New");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FORMAT VALUE
  // --------------------------------------------------

  const renderValue = (field, value) => {
    if (value === undefined || value === null || value === "") {
      return <span className="text-slate-400">—</span>;
    }

    if (field.type === "rating") {
      return (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= Number(value)
                    ? "text-yellow-400 text-lg"
                    : "text-slate-300 text-lg"
                }
              >
                ★
              </span>
            ))}
          </div>

          <span className="text-sm text-slate-500">({value}/5)</span>
        </div>
      );
    }

    if (field.type === "file") {
      return value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#2f6b8a] hover:underline"
        >
          <FileText size={16} />
          View Document
        </a>
      ) : (
        <span className="text-slate-400">No document</span>
      );
    }

    return (
      <span className="whitespace-pre-wrap break-words">{String(value)}</span>
    );
  };

  // --------------------------------------------------
  // CONTACT ACTIONS
  // --------------------------------------------------

  const getContactValue = () => {
    if (!record) return "";

    if (form.id === "simpleEnquiry") {
      return record.contact;
    }

    if (form.id === "generalEnquiry" || form.id === "complaint") {
      return record.mobile || record.email;
    }

    if (form.id === "feedback") {
      return record.contact;
    }

    return "";
  };

  const contactValue = getContactValue();

  const isEmail = contactValue && String(contactValue).includes("@");

  const phoneNumber = contactValue
    ? String(contactValue).replace(/\D/g, "").slice(-10)
    : "";

  // --------------------------------------------------
  // SEND RESPONSE
  // --------------------------------------------------

  const sendResponse = async () => {
    setMessage("");

    const trimmedReply = reply.trim();

    if (!trimmedReply) {
      setMessage("Please write a response.");
      return;
    }

    const entry = {
      text: trimmedReply,
      status,
      by: "Admin",
      at: new Date().toISOString(),
    };

    try {
      if (id && id !== "demo") {
        const response = await fetch(
          `${apiBase}/${form.id}/${encodeURIComponent(id)}/respond`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(entry),
          },
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        setMessage("Response saved successfully.");
      } else {
        setMessage("Response saved successfully.");
      }
    } catch (error) {
      setMessage("Server not reachable. Response saved locally.");
    }

    const updatedRecord = {
      ...record,
      status,
      responses: [...(record.responses || []), entry],
    };

    setRecord(updatedRecord);

    localStorage.setItem(storageKey, JSON.stringify(updatedRecord));

    setReply("");
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-slate-500">Loading enquiry details...</div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          Enquiry not found.
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className=" bg-[#f4f7f9]">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                title="Back"
                aria-label="Back"
                className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-[#2f6b8a] text-white  transition hover:bg-[#2f6b8a]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronsLeft size={18} strokeWidth={2} />
              </button>
              <h1 className="text-xl font-bold text-[#2f6b8a]">{form.title}</h1>

              {record.referenceNo && (
                <span className="text-sm font-medium text-slate-500">
                  · {record.referenceNo}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto py-4">
        {/* -----------------------------------------
              DETAILS
          ------------------------------------------ */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#e9f4f7] p-2 text-[#2f6b8a]">
                <FileText size={18} />
              </div>

              <h2 className="font-semibold text-slate-800">Details</h2>
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                record.status,
              )}`}
            >
              {record.status || "New"}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {form.fields.map((field) => (
              <div
                key={field.name}
                className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[220px_1fr] sm:gap-5"
              >
                <div className="text-sm font-medium text-slate-500">
                  {field.label}
                </div>

                <div className="text-sm text-slate-800">
                  {renderValue(field, record[field.name])}
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[220px_1fr] sm:gap-5">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Clock size={15} />
                Submitted
              </div>

              <div className="text-sm text-slate-800">
                {record.submittedAt
                  ? new Date(record.submittedAt).toLocaleString()
                  : "—"}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EnquiryDetails;
