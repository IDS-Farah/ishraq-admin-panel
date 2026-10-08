import React from "react";
import {
  Settings as SettingsIcon,
  SlidersHorizontal,
  UserRound,
  LockKeyhole,
  Database,
  ChevronRight,
} from "lucide-react";

const SETTINGS_MENU = [
  {
    id: "general",
    title: "General Settings",
    icon: SlidersHorizontal,
  },
  {
    id: "profile",
    title: "Profile Settings",
    icon: UserRound,
  },
  {
    id: "security",
    title: "Password & Security",
    icon: LockKeyhole,
  },
  {
    id: "masterData",
    title: "Master Data",
    icon: Database,
  },
];

const SettingsSidebar = ({ activeSection, onChange }) => {
  return (
    <aside className="w-[245px] shrink-0 border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-2">
          <SettingsIcon size={19} className="text-[#2f6b8a]" />

          <span className="font-semibold text-slate-800">
            Settings
          </span>
        </div>
      </div>

      <div className="p-2">
        {SETTINGS_MENU.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                active
                  ? "bg-[#e9f4f7] font-semibold text-[#2f6b8a]"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={17} />
                {item.title}
              </span>

              {active && <ChevronRight size={16} />}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default SettingsSidebar;