import { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell
} from "recharts";
import { MainContext } from "../../context/MainContext";

const casualData = [
  { month: "Jan", AI: 12, HR: 6, FINANCE: 10 },
  { month: "Feb", AI: 8, HR: 7, FINANCE: 9 },
  { month: "Mar", AI: 15, HR: 5, FINANCE: 12 }
];

export const CLTrendsWidget = () => {
  return (
    <div className="w-full h-70 bg-white rounded-2xl p-4 shadow">
      <h2 className="text-sm font-semibold mb-3 text-text-primary">
        Casual Leave Trends (Last 3 Months)
      </h2>

      <ResponsiveContainer width="90%" height="76%">
        <BarChart data={casualData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
                contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px"
                }}
            />
            <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
                iconSize={10}
            />
            <Bar dataKey="AI" fill="#6366F1" radius={[8, 8, 0, 0]} />
            <Bar dataKey="HR" fill="#22C55E" radius={[8, 8, 0, 0]} />
            <Bar dataKey="FINANCE" fill="#F59E0B" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// sick leave trends--------------------

const sickData = [
  { month: "Jan", AI: 4, HR: 2, FINANCE: 3 },
  { month: "Feb", AI: 5, HR: 1, FINANCE: 4 },
  { month: "Mar", AI: 3, HR: 2, FINANCE: 5 }
];

export const SLTrendsWidget = () => {
  return (
    <div className="w-full h-[280px] bg-white rounded-2xl p-4 shadow">
      <h2 className="text-sm font-semibold mb-3 text-text-primary">
        Sick Leave Trends (Last 3 Months)
      </h2>

      <ResponsiveContainer width="90%" height="76%">
        <BarChart data={sickData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
                contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px"
                }}
            />
            <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
                iconSize={10}
            />
            <Bar dataKey="AI" fill="#6366F1" radius={[8, 8, 0, 0]} />
            <Bar dataKey="HR" fill="#22C55E" radius={[8, 8, 0, 0]} />
            <Bar dataKey="FINANCE" fill="#F59E0B" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const data = [
  { name: "AI", value: 45 },
  { name: "FINANCE", value: 30 },
  { name: "HR", value: 12 },
  { name: "Support", value: 18 }
];

const COLORS = [
  "#4F46E5",
  "#F59E0B",
  "#10B981",
  "#6366F1"
];

export const DeptLeaveDistributionWidget = () => {

  const { dashboardData } = useContext(MainContext);

  if (!dashboardData) return null;

  const role = dashboardData.role;

  let data = [];
  let title = "";
  let centerValue = 0;
  let centerLabel = "";

  // ==============================
  // ADMIN / HR → DEPARTMENT DATA
  // ==============================

  if (role === "ADMIN" || role === "HR") {

    title = "Department Distribution";
    centerLabel = "Employees";

    data = dashboardData.teamSummary.map(team => ({
      name: team.team,
      value: team.totalEmployees
    }));

    centerValue = data.reduce((sum, d) => sum + d.value, 0);
  }

  // ==============================
  // EMPLOYEE → LEAVE USAGE
  // ==============================

  else if (role === "EMPLOYEE") {

    title = "Leave Usage";

    const {
      usedCL,
      remainingCL,
      usedSL,
      remainingSL
    } = dashboardData.leaveSummary;

    data = [
      { name: "CL Used", value: usedCL },
      { name: "CL Remaining", value: remainingCL },
      { name: "SL Used", value: usedSL },
      { name: "SL Remaining", value: remainingSL }
    ];

    centerValue = remainingCL;
    centerLabel = "Leaves Remaining";
  }

  // ==============================
  // MANAGER (Optional Future Use)
  // ==============================

  else if (role === "MANAGER") {

    title = "Team Distribution";
    centerLabel = "Employees";

    data = dashboardData.teamSummary?.map(team => ({
      name: team.team,
      value: team.totalEmployees
    })) || [];

    centerValue = data.reduce((sum, d) => sum + d.value, 0);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full">

      {/* Title */}
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        {title}
      </h3>

      <div className="flex flex-col items-center">

        {/* Donut Chart */}
        <div className="w-40 h-40 relative">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={data}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >

                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-lg font-semibold text-gray-800">
              {centerValue}
            </span>

            <span className="text-xs text-gray-500">
              {centerLabel}
            </span>

          </div>

        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-8">

          {data.map((item, index) => (

            <div
              key={item.name}
              className="flex items-center gap-1.5 text-xs text-gray-600"
            >

              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: COLORS[index % COLORS.length]
                }}
              />

              <span>{item.name}</span>

              <span className="text-gray-700 font-medium">
                {item.value}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};