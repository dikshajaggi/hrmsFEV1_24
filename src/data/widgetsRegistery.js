import { lazy } from "react";

export const widgetsRegistery = {
  todayStats: lazy(() =>
    import("../components/dashboardWidgets/AttendanceWidgets")
      .then(m => ({ default: m.TodayStatsWidget }))
  ),

   attendanceStats: lazy(() =>
    import("../components/dashboardWidgets/AttendanceWidgets")
      .then(m => ({ default: m.AttendanceWidget }))
  ),

  monthlyCLStats: lazy(() =>
    import("../components/dashboardWidgets/ChartWidgets")
      .then(m => ({ default: m.CLTrendsWidget }))
  ),

  monthlySLStats: lazy(() =>
    import("../components/dashboardWidgets/ChartWidgets")
      .then(m => ({ default: m.SLTrendsWidget }))
  ),

  DeptLeaveDistribution: lazy(() =>
    import("../components/dashboardWidgets/ChartWidgets")
      .then(m => ({ default: m.DeptLeaveDistributionWidget }))
  ),

  UpcomingHolidays: lazy(() =>
    import("../components/dashboardWidgets/MiscWidgets")
      .then(m => ({ default: m.UpcomingHolidaysWidget }))
  ),

  HRActTimeline: lazy(() =>
    import("../components/dashboardWidgets/MiscWidgets")
      .then(m => ({ default: m.HRActTimelineWidget }))
  ),

  UpcomingLeaves: lazy(() =>
    import("../components/dashboardWidgets/AttendanceWidgets")
      .then(m => ({ default: m.UpcomingLeavesWidget }))
  ),

  notifications: lazy(() =>
    import("../components/dashboardWidgets/MiscWidgets")
      .then(m => ({ default: m.NotificationWidget }))
  ),

  quickLinks: lazy(() =>
    import("../components/dashboardWidgets/MiscWidgets")
      .then(m => ({ default: m.QuickLinksWidget }))
  ),

  holidayCalendar: lazy(() =>
    import("../components/dashboardWidgets/CalendarWidgets")
      .then(m => ({ default: m.HolidayCalendarWidget }))
  )
};