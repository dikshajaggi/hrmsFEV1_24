
import { X, Mail, AlertTriangle, Briefcase, Users } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { employeeEditConfig } from "../configs/employeeAllDetails";
import { FormField } from "./ui/FormField";
import { NormalButton } from "./ui/Buttons";

 const departmentOptions = [
  { label: "Engineering", value: "Engineering" },
  { label: "HR", value: "HR" },
  { label: "Finance", value: "Finance" },
];

 const roleOptions = [
  { label: "Frontend Developer", value: "Frontend Developer" },
  { label: "Backend Developer", value: "Backend Developer" },
  { label: "HR Manager", value: "HR Manager" },
];

const employeeEditForm = {
  quick: [
    { key: "name", label: "Full Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone Number", type: "tel" },
    { key: "team", label: "Department", type: "select" },
    { key: "role", label: "Designation", type: "select" },
  ],
};

export function EmployeeDrawer({ open, onClose, employee, onEdit }) {
  if (!open || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex">

      {/* Overlay */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-[420px] bg-white shadow-2xl h-full flex flex-col animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Employee Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-lg font-semibold text-red-600 shadow-sm">
              {employee.name?.[0]}
            </div>

            <div>
              <p className="font-semibold text-gray-900 text-base">
                {employee.name}
              </p>
              <p className="text-sm text-gray-500">
                {employee.email}
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-4">

            <InfoItem icon={<Users size={16} />} label="Department" value={employee.team} />
            <InfoItem icon={<Briefcase size={16} />} label="Role" value={employee.role} />

            <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
              <p className="text-sm text-gray-500">Status</p>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                {employee.status}
              </span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
           <NormalButton text="Edit" classes="bg-brand text-white hover:opacity-90 flex-1" onClick={onEdit} />
           <NormalButton text="Deactivate" classes="flex-1 border border-red-200 text-red-600 hover:bg-red-50"  />
        </div>

      </div>
    </div>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
    <div className="text-gray-500">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

export function EditEmployeeModal({ open, onClose, employee }) {
  const navigate = useNavigate()
  if (!open || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl w-[500px] shadow-2xl p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-base font-semibold">Edit Employee</h2>
            <p className="text-xs text-gray-500">
              Update employee information
            </p>
          </div>
          <button
            onClick={() => navigate(`/employees/edit/${employee.id}`)}
            className="flex items-center gap-1 text-sm text-brand hover:underline cursor-pointer"
          >
            Full Edit <ExternalLink size={14} />
          </button>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-2 gap-4">

          {employeeEditForm.quick.map((field) => (
            <FormField key={field.key} label={field.label}>

              {field.type === "select" ? (
                <select
                  defaultValue={employee[field.key]}
                  className="w-full border px-3 py-2 rounded-lg bg-white focus:ring-2 focus:ring-brand/40"
                >
                  {(field.key === "team" ? departmentOptions : roleOptions).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  defaultValue={employee[field.key]}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-brand/40"
                />
              )}

            </FormField>
          ))}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <NormalButton text="Cancel" classes="text-sm text-gray-600" onClick={onClose} />  
          <NormalButton text="Save Changes" classes="bg-brand text-white hover:opacity-90" />
        </div>

      </div>
    </div>
  );
}


export function DeleteModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-white p-6 rounded-2xl w-[360px] shadow-2xl text-center">

        {/* Icon */}
        <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="text-red-600" size={22} />
        </div>

        <h2 className="text-lg font-semibold mb-2">
          Deactivate Employee?
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          This will disable access for this employee. You can reactivate later.
        </p>

        <div className="flex gap-2">
          <NormalButton text="Cancel" classes="flex-1 border border-gray-200" onClick={onClose} />
          <NormalButton text="Deactivate" classes="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm} />
        </div>

      </div>
    </div>
  );
}