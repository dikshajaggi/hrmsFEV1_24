import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  Users,
  UserCheck,
  Home,
  Folders
} from "lucide-react";

export const sidebarConfig = [
  {
    label: "Home",
    icon: Home,
    path: "/dashboard",
    roles: ["hr", "manager", "employee"]
  },

  {
    label: "Attendance",
    icon: Clock,
    path: "/attendance",
    roles: ["hr", "manager"]
  },

  {
    label: "Employees",
    icon: Users,
    path: "/employees",
    roles: ["hr"]
  },

  {
    label: "Approvals",
    icon: UserCheck,
    path: "/approvals",
    roles: ["hr", "manager"]
  },

  {
    label: "Leave Status",
    icon: CalendarDays,
    path: "/leave-status",
    roles: ["hr", "manager", "employee"]
  },

  {
    label: "Policies",
    icon: Folders,
    path: "/policies",
    roles: ["hr", "manager", "employee"]
  },
  
];