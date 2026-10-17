import React, { useEffect, useState } from "react";
import { ChevronsLeft, Paperclip } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getComplaintCategories,
  submitComplaint,
} from "../../../api/complaintApi";
import { getCurrentUserId } from "../../../utils/authUtils";

const initialForm = {
  name: localStorage.getItem("organizationName") || "",
  phone: localStorage.getItem("organizationNo") || "",
  email: localStorage.getItem("employerEmail") || "",
  categoryId: "",
  details: "",
};

const Field = ({ id, label, error, optional, children }) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-sm font-medium text-slate-700"
    >
      {label}
      {optional && (
        <span className="ml-1 font-normal text-slate-400">(optional)</span>
      )}
    </label>

    {children}

    {error && (
      <p className="mt-1.5 text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
);

const CreateComplaint = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const inputClass = (field) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm
     text-slate-900 placeholder-slate-400 shadow-sm outline-none
     transition focus:ring-2 ${
       errors[field]
         ? "border-red-400 focus:border-red-500 focus:ring-red-200"
         : "border-slate-300 focus:border-[#2f6b8a] focus:ring-sky-100"
     }`;

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const response = await getComplaintCategories();

        if (response?.success === false || response?.Success === false) {
          throw new Error(
            response.message ||
              response.Message ||
              "Unable to load complaint categories.",
          );
        }

        const records = Array.isArray(response)
          ? response
          : (response?.data ?? response?.Data);

        if (!Array.isArray(records)) {
          throw new Error("Invalid complaint category response.");
        }

        const activeCategories = records.filter(
          (item) => item.cC_is_active !== false && item.CC_IsActive !== false,
        );

        if (active) {
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Failed to load complaint categories:", error);

        if (active) {
          setErrors((prev) => ({
            ...prev,
            categories:
              error.response?.data?.message ||
              error.response?.data?.Message ||
              error.message ||
              "Unable to load complaint categories.",
          }));
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      form: undefined,
    }));
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) {
      next.name = "Enter your name.";
    }

    if (!form.email.trim()) {
      next.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }

    if (form.phone.trim() && !/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) {
      next.phone = "Enter a valid phone number.";
    }

    if (!form.categoryId) {
      next.categoryId = "Choose a complaint category.";
    }

    if (!form.details.trim()) {
      next.details = "Enter your complaint details.";
    } else if (form.details.trim().length < 20) {
      next.details =
        "Please enter at least 20 characters describing your complaint.";
    }

    if (attachment && attachment.size > 10 * 1024 * 1024) {
      next.attachment = "The attachment must be 10 MB or smaller.";
    }

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const rawUserId = getCurrentUserId();
    const userId = Number(rawUserId);

    if (!rawUserId || !Number.isInteger(userId) || userId <= 0) {
      setErrors({
        form: "Unable to identify the logged-in user. Please log in again.",
      });
      return;
    }

    const categoryId = Number(form.categoryId);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      setErrors({
        categoryId: "Please select a valid complaint category.",
      });
      return;
    }

    const formData = new FormData();

    // Fields from ComplaintCreateDto
    formData.append("CP_full_name", form.name.trim());
    formData.append("CP_mobile", form.phone.trim());
    formData.append("CP_email", form.email.trim());
    formData.append("CP_complaint_category_id", String(categoryId));
    formData.append("CP_details", form.details.trim());
    formData.append("complainer", String(userId));
    formData.append("CP_user_type_id", Number(2));
    // Send the actual file, not just its filename.
    if (attachment) {
      formData.append("Attachment", attachment, attachment.name);
    }

    // Optional user type ID, if stored by the login flow.
    const storedUserTypeId = Number(2);

    console.log("Submitting complaint:", {
      CP_full_name: form.name.trim(),
      CP_mobile: form.phone.trim(),
      CP_email: form.email.trim(),
      CP_user_type_id: 2 || null,
      complainer: userId,
      CP_complaint_category_id: categoryId,
      CP_details: form.details.trim(),
      Attachment: attachment?.name || null,
    });

    setSubmitting(true);

    try {
      const response = await submitComplaint(formData);

      console.log("Complaint API response:", response);

      if (response?.success === false || response?.Success === false) {
        throw new Error(
          response.message ||
            response.Message ||
            "Failed to submit the complaint.",
        );
      }

      navigate("/employer/complaint-list", {
        replace: true,
        state: {
          successMessage: "Complaint submitted successfully.",
        },
      });
    } catch (error) {
      console.error("Complaint submission failed:", error);

      const apiErrors = error.response?.data?.errors;
      const validationMessage =
        apiErrors && typeof apiErrors === "object"
          ? Object.values(apiErrors).flat().join(" ")
          : "";

      setErrors({
        form:
          validationMessage ||
          error.response?.data?.message ||
          error.response?.data?.Message ||
          error.response?.data?.title ||
          error.message ||
          "Unable to submit your complaint. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryId = (category) =>
    category.cC_complaint_category_id ??
    category.CC_Complaint_Category_Id ??
    category.CC_Id;

  const getCategoryName = (category) =>
    category.cC_name ?? category.CC_Name ?? category.CC_ComplaintCategoryName;

  return (
    <div className="mx-auto">
      <header
        className="ep-hero relative mb-4 overflow-hidden rounded-2xl p-4 text-white shadow-sm sm:px-4 sm:py-2"
        style={{
          backgroundImage:
            "linear-gradient(110deg,#17405a 0%,#2f6b8a 40%,#4a9bb3 70%,#2f6b8a 100%)",
        }}
      >
        <span className="ep-orb ep-orb-a !h-40 !w-40" />
        <span className="ep-orb ep-orb-b !h-24 !w-24" />

        <div className="relative flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Back"
            aria-label="Back"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/15 text-white transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronsLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight sm:text-[26px]">
              Add Complaint
            </h1>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="name" label="Name" error={errors.name}>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your full name"
              className={inputClass("name")}
            />
          </Field>

          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="name@example.com"
              className={inputClass("email")}
            />
          </Field>
        </div>

        <Field id="phone" label="Mobile number" optional error={errors.phone}>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className={inputClass("phone")}
          />
        </Field>

        <Field
          id="categoryId"
          label="Complaint Category"
          error={errors.categoryId || errors.categories}
        >
          <select
            id="categoryId"
            value={form.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            disabled={categoriesLoading}
            className={inputClass("categoryId")}
          >
            <option value="">
              {categoriesLoading
                ? "Loading categories..."
                : "Select a category"}
            </option>

            {categories.map((category) => {
              const id = getCategoryId(category);
              const name = getCategoryName(category);

              if (id == null || !name) return null;

              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </Field>

        <Field id="details" label="Complaint Details" error={errors.details}>
          <textarea
            id="details"
            rows={6}
            value={form.details}
            onChange={(e) => update("details", e.target.value)}
            placeholder="Describe your complaint in detail."
            className={`${inputClass("details")} resize-y`}
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {form.details.length} characters
          </p>
        </Field>

        <Field
          id="attachment"
          label="Attachment"
          optional
          error={errors.attachment}
        >
          <div className="rounded-lg border border-dashed border-slate-300 p-4">
            <label
              htmlFor="attachment"
              className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
            >
              <Paperclip size={20} className="shrink-0 text-slate-500" />

              <span className="break-all">
                {attachment ? attachment.name : "Choose a file or document"}
              </span>

              <input
                id="attachment"
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => {
                  setAttachment(e.target.files?.[0] || null);
                  setErrors((prev) => ({
                    ...prev,
                    attachment: undefined,
                    form: undefined,
                  }));
                }}
              />
            </label>

            <p className="mt-2 text-xs text-slate-400">
              PDF, images, or documents. Maximum 10 MB.
            </p>

            {attachment && (
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="mt-2 text-xs font-medium text-red-600 hover:text-red-700"
              >
                Remove attachment
              </button>
            )}
          </div>
        </Field>

        {errors.form && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {errors.form}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || categoriesLoading}
          className="w-full rounded-lg bg-[#2f6b8a] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#24556e] focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit complaint"}
        </button>
      </form>
    </div>
  );
};

export default CreateComplaint;
