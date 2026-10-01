import AnimatedNumber from "./AnimatedNumber";

const DashboardCard = ({ title, value, icon: Icon }) => {
  return (
    <div
      className="
        w-full
        min-w-0
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-md
        sm:p-5
      "
    >
      <div className="flex justify-between">
          <div>
              <p className="truncate text-sm font-medium text-[#606060]">
                {title}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#2f6b8a] sm:text-3xl">
               <AnimatedNumber value={value} />
              </h2>
          </div>
      {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2f6b8a]/10">
            <Icon
              size={28}
              strokeWidth={2}
              className="text-[#2f6b8a]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;