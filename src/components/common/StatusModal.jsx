import React from "react";
import { AlertTriangle, CheckCircle, XCircle, Info, X } from "lucide-react";

const StatusModal = ({
  isOpen,
  entity,
  entityName = "Item",
  actionType,
  onConfirm,
  onCancel,
  customMessage,
  successType = "",
}) => {
  if (!isOpen) return null;

  const displayName = entity?.name || entity?.entityName || entity?.label || entityName;

  const isError = actionType === "Error" || successType === "error";
  const isSuccess = actionType === "Success" || successType === "success";
  const isWarning = actionType === "Warning" || successType === "warning";
  const isInfo = actionType === "Info" || successType === "info";
  const isActivate = actionType === "Activate";
  const isDeactivate = actionType === "Deactivate";
  const isDelete = actionType === "Delete";

  const getConfig = () => {
    const base = { showCancel: false, buttonText: "OK" };

    // Success - only OK button, no cancel
    if (isSuccess) return {
      ...base,
      title: "Success!",
      message: customMessage || `${entityName} "${displayName}" processed successfully!`,
      icon: <CheckCircle size={30} />,
      headerBg: "bg-[#336298]",
      headerTextColor: "text-white",
      iconColor: "text-white",
      buttonColor: "bg-[#336298] hover:bg-[#2a507a]",
      showCancel: false,
    };

    // Error - only OK button, no cancel
    if (isError) return {
      ...base,
      title: "Error!",
      message: customMessage || "An error occurred. Please try again.",
      icon: <XCircle size={30} />,
      headerBg: "bg-[#336298]",
      headerTextColor: "text-white",
      iconColor: "text-white",
      buttonColor: "bg-[#336298] hover:bg-[#2a507a]",
      showCancel: false,
    };

    // Warning - has Cancel and OK
   // Warning - only OK button
if (isWarning) return {
  ...base,
  title: "Warning!",
  message: customMessage || "Please review the information below.",
  icon: <AlertTriangle size={30} />,
  headerBg: "bg-[#336298]",
  headerTextColor: "text-white",
  iconColor: "text-white",
  buttonColor: "bg-[#336298] hover:bg-[#2a507a]",
  buttonText: "OK",
  showCancel: false,
};

    // Info - has Cancel and OK
    if (isInfo) return {
      ...base,
      title: "Information",
      message: customMessage || "Please review the information below.",
      icon: <Info size={30} />,
      headerBg: "bg-[#336298]",
      headerTextColor: "text-white",
      iconColor: "text-white",
      buttonColor: "bg-[#336298] hover:bg-[#2a507a]",
      showCancel: true,
    };

    // Activate - has Cancel and Activate button
    if (isActivate) return {
      ...base,
      title: `Activate ${entityName}`,
      message: customMessage || `Are you sure you want to activate "${displayName}"?`,
      icon: <AlertTriangle size={30} />,
      headerBg: "bg-[#336298]",
      headerTextColor: "text-white",
      iconColor: "text-white",
      buttonColor: "bg-[#336298] hover:bg-[#2a507a]",
      buttonText: "Activate",
      showCancel: true,
    };

    // Deactivate - has Cancel and Deactivate button
    if (isDeactivate) return {
      ...base,
      title: `Deactivate ${entityName}`,
      message: customMessage || `Are you sure you want to deactivate "${displayName}"?`,
      icon: <AlertTriangle size={30} />,
      headerBg: "bg-[#336298]",
      headerTextColor: "text-white",
      iconColor: "text-white",
      buttonColor: "bg-[#336298] hover:bg-[#2a507a]",
      buttonText: "Deactivate",
      showCancel: true,
    };

    // Delete - has Cancel and Delete button
    if (isDelete) return {
      ...base,
      title: `Delete ${entityName}`,
      message: customMessage || `Are you sure you want to delete "${displayName}"?`,
      icon: <AlertTriangle size={30} />,
      headerBg: "bg-[#336298]",
      headerTextColor: "text-white",
      iconColor: "text-white",
      buttonColor: "bg-[#336298] hover:bg-[#2a507a]",
      buttonText: "Delete",
      showCancel: true,
    };

    // Default - has Cancel and Confirm
    return {
      ...base,
      title: `${entityName} Action`,
      message: customMessage || "Are you sure you want to proceed?",
      icon: <Info size={30} />,
      headerBg: "bg-[#336298]",
      headerTextColor: "text-white",
      iconColor: "text-white",
      buttonColor: "bg-[#336298] hover:bg-[#2a507a]",
      buttonText: "Confirm",
      showCancel: true,
    };
  };

  const config = getConfig();

  const getCloseButtonColor = () => {
    return "text-white hover:text-red-500";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[410px] rounded-lg bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with Close Button */}
        <div className={`px-6 py-4 ${config.headerBg} border-b border-slate-200 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className={config.iconColor}>{config.icon}</span>
            <h3 className={`text-[20px] font-semibold ${config.headerTextColor}`}>{config.title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel || onConfirm}
            className={`p-1 rounded-full hover:bg-red-50 transition-colors duration-200 ${getCloseButtonColor()}`}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <div className="px-15 py-5">
          <p className="text-[15px] font-medium  text-black leading-relaxed whitespace-pre-line">{config.message}</p>
        </div>

        {/* Buttons */}
        <div className="px-2 py-2 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-2.5">
          {config.showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-md border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`px-3 py-2 rounded-md text-xs font-semibold text-white shadow-sm transition ${config.buttonColor}`}
          >
            {config.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;