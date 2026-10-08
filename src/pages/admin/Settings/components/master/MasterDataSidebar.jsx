import React from "react";
import { ChevronRight } from "lucide-react";

const MasterDataSidebar = ({
  masterData,
  selectedMaster,
  onSelect,
}) => {
  const masterMenus = Object.entries(masterData).map(
    ([key, value]) => ({
      id: key,
      title: value.title,
      icon: value.icon,
    }),
  );

  return (
    <aside className="w-[260px] shrink-0 border-r border-slate-200 bg-[#fafcfd]">
      <div className="border-b border-slate-200 px-4 py-4">
        <h2 className="font-semibold text-slate-800">
          Master Data
        </h2>
      </div>

      <div className="p-2">
        {masterMenus.map((item) => {
          const Icon = item.icon;
          const active = selectedMaster === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                active
                  ? "bg-[#2f6b8a] font-semibold text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon size={17} />

                <span className="truncate">
                  {item.title}
                </span>
              </span>

              {active && <ChevronRight size={16} />}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default MasterDataSidebar;