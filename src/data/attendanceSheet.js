export const STATUS_CONFIG = {
  PRESENT:           { label: "P",   full: "Present",            color: "#16a34a", bg: "#dcfce7", border: "#86efac", editable: true  },
  WFH:               { label: "WFH", full: "Work From Home",     color: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc", editable: true  },
  SICK_FULL:         { label: "S",   full: "Sick (Full)",        color: "#db2777", bg: "#fce7f3", border: "#f9a8d4", editable: true  },
  SICK_FIRST_HALF:   { label: "S1",  full: "Sick (First Half)",  color: "#db2777", bg: "#fce7f3", border: "#f9a8d4", editable: true  },
  SICK_SECOND_HALF:  { label: "S2",  full: "Sick (Second Half)",   color: "#db2777", bg: "#fce7f3", border: "#f9a8d4", editable: true  },
  LEAVE_FULL:        { label: "L",   full: "Leave (Full)",       color: "#d97706", bg: "#fef3c7", border: "#fcd34d", editable: false },
  LEAVE_FIRST_HALF:  { label: "L1",  full: "Leave (First Half)", color: "#d97706", bg: "#fef3c7", border: "#fcd34d", editable: false },
  LEAVE_SECOND_HALF: { label: "L2",  full: "Leave (Second Half)",  color: "#d97706", bg: "#fef3c7", border: "#fcd34d", editable: false },
  HOLIDAY:           { label: "H",   full: "Holiday",            color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd", editable: false },
  WEEKLY_OFF:        { label: "WO",  full: "Weekly Off",         color: "#94a3b8", bg: "#f1f5f9", border: "#cbd5e1", editable: false },
  COMP_OFF:          {label: "CO",  full: "Comp Off",            color: "#FA310F", bg: "#FFBDB0", border: "#FF380F", editable: false}
};


// HR-editable cycle order
export const EDIT_CYCLE = ["PRESENT","WFH", "COMP_OFF", "SICK_FULL", "SICK_FIRST_HALF", "SICK_SECOND_HALF",  "LEAVE_FULL", "LEAVE_FIRST_HALF", "LEAVE_SECOND_HALF", "HOLIDAY","WEEKLY_OFF"]

export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

