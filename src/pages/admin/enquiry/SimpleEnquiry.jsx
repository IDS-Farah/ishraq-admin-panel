import React, { useState } from "react";
import { Eye as EyeIcon, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SimpleEnquiry = () => {
     const navigate=useNavigate();
  const [search, setSearch] = useState("");

  const enquiries = [
    {
      id: 1,
      name: "Ayesha Khan",
      age: 24,
      qualification: "B.Sc Nursing",
      contact: "+91 98765 43210",
      email: "ayesha.khan@gmail.com",
      course: "Nursing",
      question:
        "I want to know about available nursing courses.",
    },
    {
      id: 2,
      name: "Imran Shaikh",
      age: 27,
      qualification: "B.Sc",
      contact: "+91 98230 12345",
      email: "imran.shaikh@gmail.com",
      course: "Lab Technician",
      question:
        "Please share the eligibility criteria.",
    },
    {
      id: 3,
      name: "Sana Pathan",
      age: 22,
      qualification: "B.Pharm",
      contact: "+91 99223 34455",
      email: "sana.pathan@gmail.com",
      course: "Pharmacy",
      question:
        "I would like information about career opportunities.",
    },
  ];

  const filteredEnquiries = enquiries.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.contact.toLowerCase().includes(query) ||
      item.qualification.toLowerCase().includes(query) ||
      item.course.toLowerCase().includes(query) ||
      item.question.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-full bg-[#f7f9fb] p-0 text-[#1e2b36]">
      <div className="mx-auto max-w-[1400px] rounded-[10px] border border-[#e2e8ee] bg-white p-3.5 sm:px-[22px] sm:pb-4 sm:pt-5">

        {/* Header */}

        <div className="mb-4 flex justify-between w-full items-center gap-6 border-b border-[#e2e8ee] pb-4">
          <h1 className="m-0 shrink-0 font-serif text-[22px] font-bold text-[#2c6b8a] sm:text-[26px]">
            Simple Enquiry List
          </h1>

          <div className="relative min-w-0 ">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />

            <input
              type="search"
              placeholder="Search by name, email, contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11  rounded-[10px] border border-[#c9d5dd] bg-white pl-10 pr-3.5 text-sm text-[#1e2b36] placeholder:text-[#9aa5b1] outline-none transition focus:border-[#1e5a63] focus:ring-2 focus:ring-[#1e5a63]"
            />
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto rounded-lg border border-[#e2e8ee]">
          <table className="w-full min-w-[1250px] border-collapse text-sm">

            <thead>
              <tr>
                {[
                  "Sr. No.",
                  "Name",
                  "Age",
                  "Current Qualification",
                  "Contact No.",
                  "Email",
                  "Course or Career",
                  "Your Question",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className={`whitespace-nowrap bg-[#2c6b8a] px-3.5 py-3 text-left text-[13.5px] font-semibold text-white ${
                      heading === "Action"
                        ? "sticky right-0 z-20 shadow-[-4px_0_8px_rgba(0,0,0,0.06)]"
                        : ""
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="border-t border-[#e2e8ee] px-4 py-10 text-center text-[#6b7a88]"
                  >
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry, index) => (
                  <tr
                    key={enquiry.id}
                    className="even:bg-[#f9fbfc] hover:bg-[#e8f1f6]"
                  >
                    <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                      {index + 1}
                    </td>

                    <td className="border-t border-[#e2e8ee] px-3.5 py-3 font-medium">
                      {enquiry.name}
                    </td>

                    <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                      {enquiry.age}
                    </td>

                    <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                      {enquiry.qualification}
                    </td>

                    <td className="whitespace-nowrap border-t border-[#e2e8ee] px-3.5 py-3">
                      {enquiry.contact}
                    </td>

                    <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                      {enquiry.email}
                    </td>

                    <td className="border-t border-[#e2e8ee] px-3.5 py-3">
                      {enquiry.course}
                    </td>

                    <td className="max-w-[300px] border-t border-[#e2e8ee] px-3.5 py-3 text-[#60738a]">
                      {enquiry.question}
                    </td>

                    <td className="sticky right-0 z-10 border-t border-[#e2e8ee] bg-white px-3.5 py-3 shadow-[-4px_0_8px_rgba(0,0,0,0.06)]">
                      <button
                        type="button"
                       
                       onClick={() =>
                          navigate (`/admin/simple-enquiry/view/${index}`)
                          
                        }
                        
                        title="View"
                        aria-label="View enquiry"
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-md bg-[#1a9aa8] text-white transition hover:opacity-90"
                      >
                        <EyeIcon
                          size={16}
                          strokeWidth={2}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}

        <div className="mt-4 flex flex-col gap-3 border-t border-[#e2e8ee] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[13.5px] text-[#60738a]">
            Showing{" "}
            <strong className="font-semibold text-[#53677f]">
              {filteredEnquiries.length ? 1 : 0}
            </strong>{" "}
            to{" "}
            <strong className="font-semibold text-[#53677f]">
              {filteredEnquiries.length}
            </strong>{" "}
            of{" "}
            <strong className="font-semibold text-[#53677f]">
              {filteredEnquiries.length}
            </strong>{" "}
            entries
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="h-11 rounded-[10px] border border-[#dce3eb] bg-white px-4 text-sm font-medium text-[#b8c4d3] disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              type="button"
              className="grid h-11 min-w-11 place-items-center rounded-[10px] bg-[#2f6b8a] px-4 text-sm font-semibold text-white"
            >
              1
            </button>

            <button
              type="button"
              disabled
              className="h-11 rounded-[10px] border border-[#dce3eb] bg-white px-4 text-sm font-medium text-[#b8c4d3] disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEnquiry;