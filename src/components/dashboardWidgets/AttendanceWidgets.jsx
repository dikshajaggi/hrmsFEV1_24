import React from 'react'
import { todayStats } from '../../data/dashboardData'
import MetricCard from '../MetricCard'
import { CalendarClock } from "lucide-react";

export const TodayStatsWidget = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
      {todayStats.map(item =>{
        return (
          <MetricCard
            icon={item.icon}
            value={item.value}
            label={item.label}
          />
        )
      })}
    </div>
  )
}

const upcomingLeaves = [
  {
    id: 1,
    name: "Amit Sharma",
    department: "Engineering",
    date: "12 Mar"
  },
  {
    id: 2,
    name: "Neha Kapoor",
    department: "HR",
    date: "14 Mar"
  },
  {
    id: 3,
    name: "Rahul Mehta",
    department: "Sales",
    date: "16 Mar"
  }
];

export const UpcomingLeavesWidget = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 max-h-65 overflow-y-auto">

      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <CalendarClock size={16} />
        Upcoming Leaves
      </h3>

      <div className="flex flex-col gap-3">

        {upcomingLeaves.map((leave) => (

          <div
            key={leave.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition"
          >

            {/* Left */}
            <div className="flex flex-col">

              <span className="text-sm font-medium text-gray-700">
                {leave.name}
              </span>

              <span className="text-xs text-gray-500">
                {leave.department}
              </span>

            </div>

            {/* Date */}
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
              {leave.date}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
};