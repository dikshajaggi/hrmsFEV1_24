import { Bell, UserPlus, CheckCircle2, FileText, CalendarCheck, ClipboardList } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "3 Leave Requests Pending",
    description: "Engineering team has pending approvals.",
    time: "5 min ago",
    type: "warning"
  },
  {
    id: 2,
    title: "2 Employees on Sick Leave",
    description: "Sales department reported sick leaves.",
    time: "30 min ago",
    type: "info"
  },
  {
    id: 3,
    title: "Holiday Tomorrow",
    description: "Holi will be observed tomorrow.",
    time: "1 day ago",
    type: "success"
  }
];

export const NotificationWidget = () => {

  const colorMap = {
    warning: "bg-amber-400",
    info: "bg-blue-400",
    success: "bg-green-400"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Bell size={16} />
          Notifications
        </h3>

        <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
          {notifications.length}
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 max-h-55 overflow-y-auto">

        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 transition"
          >
            {/* Dot */}
            <div className={`w-2.5 h-2.5 rounded-full mt-2 ${colorMap[n.type]}`} />

            {/* Text */}
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium text-gray-700">
                {n.title}
              </span>

              <span className="text-xs text-gray-500">
                {n.description}
              </span>
            </div>

            {/* Time */}
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {n.time}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
};

const links = [
  {
    label: "Add Employee",
    icon: UserPlus,
    roles: ["hr"]
  },
  {
    label: "Approve Users",
    icon: ClipboardList,
    roles: ["hr"]
  },
  {
    label: "Approve Leaves",
    icon: ClipboardList,
    roles: ["manager"]
  },
  {
    label: "Attendance",
    icon: CalendarCheck,
    roles: ["hr", "manager"]
  },
  {
    label: "Leave Status",
    icon: CalendarCheck,
    roles: ["employee"]
  },
  {
    label: "Policies",
    icon: FileText,
    roles: ["employee"]
  }
];

export const QuickLinksWidget = ({ role }) => {

  const filteredLinks = links.filter(
    (link) => !link.roles || link.roles.includes(role)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">

      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">

        {filteredLinks.map((link) => {
          const Icon = link.icon;

          return (
            <button
              key={link.label}
              className="
              cursor-pointer
              flex flex-col
              items-center
              justify-center
              gap-2
              p-3
              rounded-lg
              border border-gray-100
              hover:bg-gray-50
              hover:shadow-sm
              transition
              "
            >
              <Icon
                size={18}
                className="text-brand"
              />

              <span className="text-xs font-medium text-gray-600 text-center">
                {link.label}
              </span>
            </button>
          );
        })}

      </div>

    </div>
  );
};


const activities = [
  {
    id: 1,
    title: "Rahul Sharma joined Engineering",
    time: "10 min ago",
    type: "join"
  },
  {
    id: 2,
    title: "Leave approved for Neha Kapoor",
    time: "35 min ago",
    type: "leave"
  },
//   {
//     id: 3,
//     title: "Payroll generated for March",
//     time: "2 hrs ago",
//     type: "payroll"
//   },
  {
    id: 3,
    title: "Attendance finalized for today",
    time: "Today",
    type: "attendance"
  }
];

const iconMap = {
  join: UserPlus,
  leave: CheckCircle2,
  payroll: FileText,
  attendance: CalendarCheck
};

const colorMap = {
  join: "bg-blue-50 text-blue-600",
  leave: "bg-green-50 text-green-600",
  payroll: "bg-purple-50 text-purple-600",
  attendance: "bg-amber-50 text-amber-600"
};

export const HRActTimelineWidget = () => {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 max-h-65 overflow-y-auto">

      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        HR Activity
      </h3>

      <div className="flex flex-col gap-4">

        {activities.map((activity, index) => {

          const Icon = iconMap[activity.type];

          return (
            <div key={activity.id} className="flex items-start gap-3 group">

              {/* timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={`p-2 rounded-lg ${colorMap[activity.type]}`}
                >
                  <Icon size={14} />
                </div>

                {index !== activities.length - 1 && (
                  <div className="w-px h-6 bg-gray-200 mt-1" />
                )}
              </div>

              {/* content */}
              <div className="flex flex-col flex-1">

                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
                  {activity.title}
                </span>

                <span className="text-xs text-gray-400">
                  {activity.time}
                </span>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};