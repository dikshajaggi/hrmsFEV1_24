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

const casualData = [
  { month: "Jan", Engineering: 12, HR: 6, Sales: 10 },
  { month: "Feb", Engineering: 8, HR: 7, Sales: 9 },
  { month: "Mar", Engineering: 15, HR: 5, Sales: 12 }
];

export const CLTrendsWidget = () => {
  return (
    <div className="w-full h-[280px] bg-white rounded-2xl p-4 shadow">
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
            <Bar dataKey="Engineering" fill="#6366F1" radius={[8, 8, 0, 0]} />
            <Bar dataKey="HR" fill="#22C55E" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Sales" fill="#F59E0B" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// sick leave trends--------------------

const sickData = [
  { month: "Jan", Engineering: 4, HR: 2, Sales: 3 },
  { month: "Feb", Engineering: 5, HR: 1, Sales: 4 },
  { month: "Mar", Engineering: 3, HR: 2, Sales: 5 }
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
            <Bar dataKey="Engineering" fill="#6366F1" radius={[8, 8, 0, 0]} />
            <Bar dataKey="HR" fill="#22C55E" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Sales" fill="#F59E0B" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const data = [
  { name: "Engineering", value: 45 },
  { name: "Sales", value: 30 },
  { name: "HR", value: 12 },
  { name: "Support", value: 18 }
];

const COLORS = [
  "#4F46E5", // Engineering
  "#F59E0B", // Sales
  "#10B981", // HR
  "#6366F1"  // Support
];

export const DeptDistributionWidget = () => {

  const totalEmployees = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full">

      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Department Distribution
      </h3>

      <div className="flex items-center justify-between flex-col">

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
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-lg font-semibold text-gray-800">
              {totalEmployees}
            </span>

            <span className="text-xs text-gray-500">
              Employees
            </span>

          </div>

        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-8">

          {data.map((dept, index) => (

            <div
              key={dept.name}
              className="flex items-center gap-1.5 text-xs text-gray-600"
            >

              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />

              <span>{dept.name}</span>

              <span className="text-gray-700 font-medium">
                {dept.value}
              </span>

            </div>

          ))}

        </div>
        </div>

    </div>
  );
};