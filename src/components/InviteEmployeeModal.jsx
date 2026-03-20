import { X, UserPlus } from "lucide-react";
import { useState } from "react";
import { FormField } from "./ui/FormField";
import Dropdown from "./ui/Dropdown";
import { NormalButton } from "./ui/Buttons";

export function InviteEmployeeModal({ open, onClose, onInvite }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    team: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[460px] bg-white rounded-2xl shadow-xl border border-gray-100">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-300 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-soft text-brand flex items-center justify-center">
            <UserPlus size={16} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Invite Employee
            </h2>
            <p className="text-xs text-gray-500">
              Send an invite to join your organization
            </p>
          </div>

          <button
            onClick={onClose}
            className="ml-auto p-2 hover:bg-gray-100 rounded-md"
          >
            <X size={16}  className="cursor-pointer"/>
          </button>
        </div>

        {/* FORM */}
        <div className="px-6 py-5 space-y-4">

          <FormField label="Full Name">
            <input
              className="input"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </FormField>

          <FormField label="Email Address">
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <Dropdown label={"Role"} options={[{label:"Employee", value: "Employee"}, {label: "Manager", value: "Manager"}, {label:"HR", value: "HR"}]}   onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }/>
            <Dropdown label={"Department"} options={[{label:"AI", value: "AI"}, {label: "Accounts", value: "Accounts"}]}   onChange={(e) =>
                setForm({ ...form, team: e.target.value })
            }/>
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-300 flex justify-end gap-2">
            <NormalButton text="Cancel" classes=" border border-gray-200 hover:bg-gray-50"  onClick={onClose} />
            <NormalButton text="Send Invite" classes="bg-brand text-white hover:opacity-90"  onClick={() => onInvite(form)} />
        </div>

      </div>
    </div>
  );
}