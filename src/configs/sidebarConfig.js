import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  Users,
  UserCheck,
  Home
} from "lucide-react";

export const sidebarConfig = [
  {
    label: "Home",
    icon: Home,
    path: "/",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"]
  },

  {
    label: "Leaves",
    icon: CalendarDays,
    path: "/leaves",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"]
  },

  {
    label: "Attendance",
    icon: Clock,
    path: "/attendance",
    roles: ["ADMIN", "MANAGER"]
  },

  {
    label: "Employees",
    icon: Users,
    path: "/employees",
    roles: ["ADMIN"]
  },

  {
    label: "Approvals",
    icon: UserCheck,
    path: "/approvals",
    roles: ["MANAGER"]
  }
];