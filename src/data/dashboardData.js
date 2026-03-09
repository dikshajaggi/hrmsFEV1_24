import { Users, UserCheck, UserMinus, Stethoscope, UserPlus, FileText, CalendarCheck, ClipboardList } from "lucide-react";


export const todayStats = [
    {
        icon:Users,
        value:"124",
        label:"Total Employees"
    },
    {
        icon:UserCheck,
        value:"98",
        label:"Present"
    },
    {
        icon:UserMinus,
        value:"12",
        label:"On Leave"
    },
    {
        icon:Stethoscope,
        value:"5",
        label:"Sick Leave"
    }
]


export const links = [
  {
    label: "Add Employee",
    icon: UserPlus,
    roles: ["hr"],
    link: ""
  },
  {
    label: "Approve Users",
    icon: ClipboardList,
    roles: ["hr"],
    link: ""
  },
  {
    label: "Approve Leaves",
    icon: ClipboardList,
    roles: ["manager"],
    link: ""
  },
  {
    label: "Attendance",
    icon: CalendarCheck,
    roles: ["hr", "manager"],
    link: ""
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
