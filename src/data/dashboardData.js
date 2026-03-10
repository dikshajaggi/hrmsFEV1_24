import { Users, UserCheck, UserMinus, Stethoscope, UserPlus, FileText, CalendarCheck, ClipboardList } from "lucide-react";

export const todayStats = (dashboardData) => {

  if (!dashboardData) return [];

  const data = dashboardData.workforceToday;

  return [
    {
      icon: Users,
      value: data.totalEmployees,
      label: "Total Employees"
    },
    {
      icon: UserCheck,
      value: data.present,
      label: "Present"
    },
    {
      icon: UserMinus,
      value: data.leaveFull,
      label: "On Leave"
    },
    {
      icon: Stethoscope,
      value: data.sickFull,
      label: "Sick Leave"
    }
  ];
};

export const links = [
  {
    label: "Add Employee",
    icon: UserPlus,
    roles: ["hr"],
    link: "/employees"
  },
  {
    label: "Approve Users",
    icon: ClipboardList,
    roles: ["hr"],
    link: "/approvals"
  },
  {
    label: "Approve Leaves",
    icon: ClipboardList,
    roles: ["manager"],
    link: "/approvals"
  },
  {
    label: "Attendance",
    icon: CalendarCheck,
    roles: ["hr", "manager"],
    link: "/attendance"
  },
  {
    label: "Leave Status",
    icon: CalendarCheck,
    roles: ["employee"],
    link: "/leave-status"
  },
  {
    label: "Policies",
    icon: FileText,
    roles: ["employee"],
    link: "/policies"
  }
];
