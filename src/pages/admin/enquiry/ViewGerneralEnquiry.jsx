import React from "react";
import { ArrowLeft, ChevronsLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewGeneralEnquiry = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const enquiry = location.state?.enquiry || {
    fullName: "Ayesha Khan",
    contact: "+91 98765 43210",
    email: "ayesha.khan@gmail.com",
    youAre: "Student",
    subject: "Course Information",
    message:
      "I would like to know more about the courses available.",
  };

  return (
    <div className="min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <div className="mx-auto max-w-[1400px] rounded-[10px] border border-[#e2e8ee] bg-white px-4 py-5 sm:px-[22px]">

        {/* Header */}

        <div className="flex items-center gap-4 border-b border-[#e2e8ee] pb-4">
        <button
  type="button"
  onClick={() => navigate(-1)}
  title="Back"
  aria-label="Back"
  className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#dce3eb] bg-white text-[#53677f] transition hover:bg-[#f7f9fb]"
>
  <ChevronsLeft size={20} strokeWidth={2} />
</button>

          <h1 className="m-0 font-serif text-[30px] font-bold text-[#2c6b8a]">
            General Enquiry - View
          </h1>
        </div>

        {/* Personal Details */}

        <div className="mt-7">
          <h2 className="mb-4 text-[18px] font-medium text-[#176b91]">
            Personal Details
          </h2>

          <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                Full Name
              </label>

              <div className="flex h-12 items-center rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 text-[14px] text-[#173b5c]">
                {enquiry.fullName || "-"}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                Contact No.
              </label>

              <div className="flex h-12 items-center rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 text-[14px] text-[#173b5c]">
                {enquiry.contact || "-"}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                Email
              </label>

              <div className="flex h-12 items-center rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 text-[14px] text-[#173b5c]">
                {enquiry.email || "-"}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                You Are
              </label>

              <div className="flex h-12 items-center rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 text-[14px] text-[#173b5c]">
                {enquiry.youAre || "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Details */}

        <div className="mt-7 pb-3">
          <h2 className="mb-4 text-[18px] font-medium text-[#176b91]">
            Enquiry Details
          </h2>

          <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                Subject
              </label>

              <div className="flex h-12 items-center rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 text-[14px] text-[#173b5c]">
                {enquiry.subject || "-"}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                Message
              </label>

              <div className="min-h-[100px] rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 py-3 text-[14px] leading-6 text-[#173b5c]">
                {enquiry.message || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGeneralEnquiry;