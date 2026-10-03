import React from "react";
import { ArrowLeft, Star, ChevronsLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const ViewFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const feedback = location.state?.feedback || {
    name: "Ayesha Khan",
    contact: "+91 98765 43210",
    email: "ayesha.khan@gmail.com",
    youAre: "Jobseeker",
    rating: 5,
    useful:
      "The information about available job opportunities was very useful.",
    improvement:
      "More details about the application process can be added.",
    suggestions:
      "It would be helpful to have more career guidance resources.",
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={19}
            strokeWidth={1.8}
            className={
              star <= rating
                ? "fill-[#f4b740] text-[#f4b740]"
                : "text-[#c7d0d4]"
            }
          />
        ))}
      </div>
    );
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
            Feedback - View
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
                Name
              </label>

              <div className="flex h-12 items-center rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 text-[14px] text-[#173b5c]">
                {feedback.name || "-"}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                Contact Number
              </label>

              <div className="flex h-12 items-center rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 text-[14px] text-[#173b5c]">
                {feedback.contact || "-"}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                Email
              </label>

              <div className="flex h-12 items-center rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 text-[14px] text-[#173b5c]">
                {feedback.email || "-"}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                You Are
              </label>

              <div className="flex h-12 items-center rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 text-[14px] text-[#173b5c]">
                {feedback.youAre || "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Overall Experience */}

        <div className="mt-7">
          <h2 className="mb-4 text-[18px] font-medium text-[#176b91]">
            Overall Experience
          </h2>

          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
              Rating
            </label>

            <div className="flex h-12 items-center rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4">
              {renderStars(feedback.rating)}
            </div>
          </div>
        </div>

        {/* Feedback Details */}

        <div className="mt-7 pb-3">
          <h2 className="mb-4 text-[18px] font-medium text-[#176b91]">
            Feedback Details
          </h2>

          <div className="grid grid-cols-1 gap-5">

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                What did you find useful?
              </label>

              <div className="min-h-[100px] rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 py-3 text-[14px] leading-6 text-[#173b5c]">
                {feedback.useful || "-"}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                What can we improve?
              </label>

              <div className="min-h-[100px] rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 py-3 text-[14px] leading-6 text-[#173b5c]">
                {feedback.improvement || "-"}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[14px] font-medium text-[#111827]">
                Additional Suggestions
              </label>

              <div className="min-h-[100px] rounded-[10px] border border-[#dce3eb] bg-[#f7f9fb] px-4 py-3 text-[14px] leading-6 text-[#173b5c]">
                {feedback.suggestions || "-"}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFeedback;