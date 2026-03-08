export const dashboardConfig = [

  // MAIN AREA

  {
    widget: "todayStats",
    section: "main",
    row: "stats",
    order: 1,
    roles: ["hr", "manager"],
    scope: {
      hr: "org",
      manager: "team"
    },
  },

  {
    widget: "monthlyCLStats",
    section: "main",
    row: "charts",
    order: 1,
    roles: ["hr", "manager"],
    scope: {
      hr: "org",
      manager: "team"
    },
  },

  {
    widget: "monthlySLStats",
    section: "main",
    row: "charts",
    order: 2,
    roles: ["hr", "manager"],
    scope: {
      hr: "org",
      manager: "team"
    },
  },

  {
    widget: "DeptDistribution",
    section: "main",
    row: "insights",
    order: 1,
    roles: ["hr"],
    scope: {
      hr: "org"
    },
  },

  {
    widget: "HRActTimeline",
    section: "main",
    row: "insights",
    order: 2,
    roles: ["hr"],
    scope: {
      hr: "org",
    },
  },

  {
    widget: "UpcomingLeaves",
    section: "main",
    row: "insights",
    order: 3,
    roles: ["hr"],
    scope: {
      hr: "org",
    },
  },


  // RIGHT PANEL

  {
    widget: "notifications",
    section: "right",
    row: "top",
    order: 1,
    roles: ["hr", "manager", "employee"],
    scope: {
      hr: "org",
      manager: "team",
      employee: "individual"
    },
  },

  {
    widget: "quickLinks",
    section: "right",
    row: "middle",
    order: 1,
    roles: ["hr", "manager", "employee"],
    scope: {
      hr: "org",
      manager: "team",
      employee: "individual"
    },
  },

    {
    widget: "holidayCalendar",
    section: "right",
    row: "lower",
    order: 1,
    roles: ["hr", "manager", "employee"],
    scope: {
      hr: "org",
      manager: "team",
      employee: "individual"
    },
  },

];