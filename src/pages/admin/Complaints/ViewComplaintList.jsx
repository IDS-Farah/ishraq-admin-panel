import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText as FileIcon,
  ChevronsLeft
} from "lucide-react";

/* Demo Data */

const SEED_COMPLAINTS = [
  {
    id: 1,
    fullName: "Ayesha Khan",
    contactNo: "+91 98765 43210",
    email: "ayesha.khan@gmail.com",
    youAre: "Jobseeker",
    complaintCategory: "Service Related",
    complaintDetails:
      "I am unable to update my profile details and the changes are not being saved.",
    supportingDocument: {
      name: "profile_issue.pdf",
    },
  },
  {
    id: 2,
    fullName: "Imran Shaikh",
    contactNo: "+91 98230 12345",
    email: "imran.shaikh@gmail.com",
    youAre: "Employer",
    complaintCategory: "Technical Issue",
    complaintDetails:
      "The website is showing an error while submitting the job posting.",
    supportingDocument: null,
  },
  {
    id: 3,
    fullName: "Sana Pathan",
    contactNo: "+91 99223 34455",
    email: "sana.pathan@gmail.com",
    youAre: "Jobseeker",
    complaintCategory: "Website Related",
    complaintDetails:
      "The complaint submission page is taking too long to load.",
    supportingDocument: {
      name: "website_error.png",
    },
  },
];

/* View Complaint */

const ViewComplaintList = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const activeId = searchParams.get("id");

  const complaint = SEED_COMPLAINTS.find(
    (item) =>
      String(item.id) === String(activeId)
  );

  /* Back */

  const goBack = () => {
    setSearchParams({});
  };

  if (!complaint) {
    return (
      <div className="min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
        <div className="mx-auto max-w-[1400px] rounded-[10px] border border-[#e2e8ee] bg-white p-3.5 sm:px-[22px] sm:pb-4 sm:pt-5">
          <div className="border-b border-[#e2e8ee] pb-4">
            <h1 className="m-0 font-serif text-[22px] font-bold text-[#2c6b8a] sm:text-[26px]">
              Complaint Details
            </h1>
          </div>

          <div className="py-10 text-center text-sm text-[#6b7a88]">
            Complaint not found.

            <div className="mt-4">
            <button
  type="button"
  onClick={() => navigate(-1)}
  title="Back"
  aria-label="Back"
  className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#dce3eb] bg-white text-[#53677f] transition hover:bg-[#f7f9fb]"
>
  <ChevronsLeft size={20} strokeWidth={2} />
</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <div className="mx-auto max-w-[1400px] rounded-[10px] border border-[#e2e8ee] bg-white p-3.5 sm:px-[22px] sm:pb-4 sm:pt-5">

        {/* Header */}

        <div className="mb-4 flex items-center justify-between border-b border-[#e2e8ee] pb-4">
          <div>
            <h1 className="m-0 font-serif text-[22px] font-bold text-[#2c6b8a] sm:text-[26px]">
              Complaint Details
            </h1>

            <p className="mt-1 text-sm text-[#60738a]">
              View complaint information
            </p>
          </div>

          {/* Back */}

          <button
            type="button"
            onClick={goBack}
            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#dce3eb] bg-white px-4 text-sm font-medium text-[#2c6b8a] transition hover:bg-[#f4f8fa]"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Complaint Information */}

        <div className="overflow-hidden rounded-lg border border-[#e2e8ee]">

          {/* Basic Information */}

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Full Name */}

            <div className="border-b border-[#e2e8ee] px-4 py-4 md:border-r">
              <p className="mb-1 text-[12px] font-medium text-[#8a9aaa]">
                Full Name
              </p>

              <p className="text-sm font-medium text-[#1e2b36]">
                {complaint.fullName || "-"}
              </p>
            </div>

            {/* Contact No */}

            <div className="border-b border-[#e2e8ee] px-4 py-4">
              <p className="mb-1 text-[12px] font-medium text-[#8a9aaa]">
                Contact No.
              </p>

              <p className="text-sm text-[#1e2b36]">
                {complaint.contactNo || "-"}
              </p>
            </div>

            {/* Email */}

            <div className="border-b border-[#e2e8ee] px-4 py-4 md:border-r">
              <p className="mb-1 text-[12px] font-medium text-[#8a9aaa]">
                Email
              </p>

              <p className="break-all text-sm text-[#1e2b36]">
                {complaint.email || "-"}
              </p>
            </div>

            {/* You Are */}

            <div className="border-b border-[#e2e8ee] px-4 py-4">
              <p className="mb-1 text-[12px] font-medium text-[#8a9aaa]">
                You Are
              </p>

              <p className="text-sm text-[#1e2b36]">
                {complaint.youAre || "-"}
              </p>
            </div>

            {/* Complaint Category */}

            <div className="border-b border-[#e2e8ee] px-4 py-4 md:col-span-2">
              <p className="mb-1 text-[12px] font-medium text-[#8a9aaa]">
                Complaint Category
              </p>

              <p className="text-sm text-[#1e2b36]">
                {complaint.complaintCategory || "-"}
              </p>
            </div>
          </div>

          {/* Complaint Details */}

          <div className="border-b border-[#e2e8ee] px-4 py-4">
            <p className="mb-2 text-[12px] font-medium text-[#8a9aaa]">
              Complaint Details
            </p>

            <div className="rounded-lg border border-[#e2e8ee] bg-[#f9fbfc] px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-6 text-[#60738a]">
                {complaint.complaintDetails || "-"}
              </p>
            </div>
          </div>

          {/* Supporting Document */}

          <div className="px-4 py-4">
            <p className="mb-2 text-[12px] font-medium text-[#8a9aaa]">
              Supporting Document
            </p>

            {complaint.supportingDocument?.name ? (
              <div className="inline-flex items-center gap-2 rounded-md border border-[#dce3eb] bg-[#f9fbfc] px-3 py-2 text-sm text-[#2c6b8a]">
                <FileIcon size={17} />

                <span>
                  {complaint.supportingDocument.name}
                </span>
              </div>
            ) : (
              <span className="text-sm text-[#9aa5b1]">
                No supporting document uploaded
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewComplaintList;