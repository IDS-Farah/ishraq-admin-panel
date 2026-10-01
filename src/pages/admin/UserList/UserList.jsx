const users = [
  {
    id: 1,
    name: "Rahul Sharma",
    category: "Doctor",
    contact: "9876543210",
    email: "rahul@gmail.com",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Patel",
    category: "Nurse",
    contact: "9876543211",
    email: "priya@gmail.com",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Amit Kumar",
    category: "Pharmacist",
    contact: "9876543212",
    email: "amit@gmail.com",
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Verma",
    category: "Lab Technician",
    contact: "9876543213",
    email: "sneha@gmail.com",
    status: "Active",
  },
  {
    id: 5,
    name: "Arjun Singh",
    category: "Physiotherapist",
    contact: "9876543214",
    email: "arjun@gmail.com",
    status: "Inactive",
  },
];

const UserList = () => {
  return (
    <div className="w-full min-w-0">

      {/* Page Heading */}
      <div className="mb-6">
        <h1 className="text-center mt-3 text-2xl font-bold text-[#2f6b8a] sm:text-3xl md:text-xl">
          User List
        </h1>

      </div>


      {/* Registered Users Section */}
      <div className="-mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">


        {/* Responsive Table */}
<div className="w-full overflow-x-auto">

  <table className="w-full min-w-[850px] border-collapse">

    {/* Table Head */}
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">

        {/* Sr. No. */}
        <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-[#606060]">
          Sr. No.
        </th>

        {/* User Name */}
        <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-[#606060]">
          User Name
        </th>

        {/* Category */}
        <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-[#606060]">
          Category
        </th>

        {/* Contact */}
        <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-[#606060]">
          Contact No.
        </th>

        {/* Email */}
        <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-[#606060]">
          Email Address
        </th>

        {/* Sticky Status */}
        <th
          className="
            sticky
            right-0
            z-20
            whitespace-nowrap
            border-l
            border-gray-200
            bg-gray-50
            px-4
            py-3
            text-left
            text-sm
            font-semibold
            text-[#606060]
          "
        >
          Status
        </th>

      </tr>
    </thead>


    {/* Table Body */}
    <tbody>

      {users.map((user, index) => (
        <tr
          key={user.id}
          className="
            border-b
            border-gray-100
            transition-colors
            duration-150
            hover:bg-gray-50
          "
        >

          {/* Sr. No. */}
          <td className="whitespace-nowrap px-4 py-4 text-sm text-[#606060]">
            {index + 1}
          </td>

          {/* User Name */}
          <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-[#2f6b8a]">
            {user.name}
          </td>

          {/* Category */}
          <td className="whitespace-nowrap px-4 py-4 text-sm text-[#606060]">
            {user.category}
          </td>

          {/* Contact */}
          <td className="whitespace-nowrap px-4 py-4 text-sm text-[#606060]">
            {user.contact}
          </td>

          {/* Email */}
          <td className="whitespace-nowrap px-4 py-4 text-sm text-[#606060]">
            {user.email}
          </td>

          {/* Sticky Status */}
          <td
            className="
              sticky
              right-0
              z-10
              whitespace-nowrap
              border-l
              border-gray-200
              bg-white
              px-4
              py-4
            "
          >
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                user.status === "Active"
                  ? "bg-[#2f6b8a]/10 text-[#2f6b8a]"
                  : "bg-gray-100 text-[#606060]"
              }`}
            >
              {user.status}
            </span>
          </td>

        </tr>
      ))}

    </tbody>

  </table>

</div>

      </div>

    </div>
  );
};

export default UserList;