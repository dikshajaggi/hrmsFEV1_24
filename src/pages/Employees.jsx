import { EmployeeTable } from "../components/EmpPageComponents";

export default function Employees() {
  return (
    <div className="flex flex-col h-full p-6 gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Employees</h1>
          <p className="text-sm text-gray-500">
            Manage employees and permissions
          </p>
        </div>

        {/* <button className="bg-brand text-white px-4 py-2 rounded-lg">
          Add Employee
        </button> */}
      </div>

      <div className="flex-1">
        <EmployeeTable />
      </div>

    </div>
  );
}