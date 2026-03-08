import { useMemo } from "react";
import { Calendar } from "lucide-react";
import dayjs from "../utils/dayjs"

export const AttendanceSheet = ({ data, month }) => {

  const days = useMemo(() => {
    const start = dayjs(month + "-01");
    const end = start.endOf("month");

    const arr = [];
    let current = start;

    while (current.isSameOrBefore(end, "day")) {
      arr.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    return arr;
  }, [month]);

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm">

      <div className="flex-1 overflow-auto">

        <table className="w-full text-xs">

          {/* HEADER */}
          <thead className="bg-gray-50 sticky top-0 z-10">

            <tr>

              <th className="px-4 py-3 text-left min-w-[200px]">
                Employee
              </th>

              <th className="px-4 py-3 text-left min-w-[140px]">
                Team
              </th>

              {days.map(day => (
                <th
                  key={day}
                  className="px-2 py-3 text-center text-gray-500"
                >
                  {dayjs(day).format("DD")}
                </th>
              ))}

              <th className="px-3 text-center">P</th>
              <th className="px-3 text-center">L</th>
              <th className="px-3 text-center">WFH</th>
              <th className="px-3 text-center">A</th>

            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {data.map(emp => (

              <tr
                key={emp.employeeId}
                className="border-t border-gray-100 hover:bg-gray-50"
              >

                {/* Employee */}
                <td className="px-4 py-3">

                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-semibold">
                      {emp.name
                        .split(" ")
                        .map(n => n[0])
                        .join("")}
                    </div>

                    <div>
                      <p className="font-medium text-sm">
                        {emp.name}
                      </p>
                    </div>

                  </div>

                </td>

                <td className="px-4 text-sm text-gray-600">
                  {emp.team}
                </td>

                {/* DAILY CELLS */}
                {days.map(date => {

                  const status = emp.attendance[date];

                  return (
                    <td key={date} className="text-center">
                      <AttendanceCell status={status} />
                    </td>
                  );
                })}

                {/* SUMMARY */}
                <td className="text-center text-green-600 font-medium">
                  {emp.summary.totalPresentDays}
                </td>

                <td className="text-center text-yellow-600 font-medium">
                  {emp.summary.totalLeaveDays}
                </td>

                <td className="text-center text-blue-600 font-medium">
                  {emp.summary.totalWFH}
                </td>

                <td className="text-center text-red-600 font-medium">
                  {emp.summary.totalAbsence}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function AttendanceCell({ status }) {

  const styles = {
    PRESENT: "bg-green-100 text-green-700",
    LEAVE_FULL: "bg-yellow-100 text-yellow-700",
    HOLIDAY: "bg-purple-100 text-purple-700",
    WEEKLY_OFF: "bg-gray-200 text-gray-600",
    WFH: "bg-blue-100 text-blue-700",
  };

  const labels = {
    PRESENT: "P",
    LEAVE_FULL: "L",
    HOLIDAY: "H",
    WEEKLY_OFF: "O",
    WFH: "WFH",
  };

  const style = styles[status] || "bg-gray-100 text-gray-500";
  const label = labels[status] || "-";

  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-medium ${style}`}
    >
      {label}
    </span>
  );
}


export const AttendanceToolbar = () => {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <Calendar size={18} />

        <input
          type="month"
          className="
          border border-gray-200
          rounded-lg
          px-3 py-2
          text-sm
          "
        />

      </div>

      <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm">
        Export CSV
      </button>

    </div>
  );
}