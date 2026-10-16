import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function SelectField({
  value,
  onChange,
  options = [],
  placeholder = "Select",
  disabled = false,
  hasError = false,
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value));

  // Close when clicking outside the dropdown.
  useEffect(() => {
    if (!open) return undefined;
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // Keep the highlighted option visible while using arrow keys.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const openList = () => {
    if (disabled) return;
    const index = options.findIndex((o) => String(o.value) === String(value));
    setActiveIndex(index >= 0 ? index : 0);
    setOpen(true);
  };

  const pick = (option) => {
    onChange(String(option.value));
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        if (options[activeIndex]) pick(options[activeIndex]);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const triggerClass = `flex w-full items-center rounded-lg border bg-white py-2.5 pl-10 pr-10 text-left text-sm outline-none transition focus:border-[#2f6b8a] focus:ring-2 focus:ring-[#2f6b8a]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
    hasError
      ? "border-red-400"
      : open
        ? "border-[#2f6b8a] ring-2 ring-[#2f6b8a]/20"
        : "border-slate-200"
  }`;

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={triggerClass}
      >
        <span
          className={`truncate ${selected ? "text-slate-800" : "text-slate-400"}`}
        >
          {selected ? selected.label || selected.value : placeholder}
        </span>
      </button>

      <ChevronDown
        size={16}
        className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-200 ${
          open ? "rotate-180 text-[#2f6b8a]" : ""
        }`}
      />

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5"
        >
          {options.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-400">
              No options available
            </li>
          )}

          {options.map((option, index) => {
            const isSelected = String(option.value) === String(value);
            const isActive = index === activeIndex;

            return (
              <li
                key={`${option.value}-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => pick(option)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? "bg-[#eaf3f7]" : ""
                } ${isSelected ? "font-semibold text-[#2f6b8a]" : "text-slate-700"}`}
              >
                <span className="truncate">{option.label || option.value}</span>
                {isSelected && <Check size={14} className="shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}