import { useState } from "react";
import { employeeEditConfig } from "../configs/employeeAllDetails";
import { FormField } from "../components/ui/FormField";
import { NormalButton } from "../components/ui/Buttons";

export default function EmployeeEditPage() {
    console.log("edittt")
  const [activeTab, setActiveTab] = useState("personal");

  const activeSection = employeeEditConfig.sections.find(
    (s) => s.id === activeTab
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-xl font-semibold mb-6">
        Edit Employee
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {employeeEditConfig.sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            className={`px-4 py-2 text-sm cursor-pointer ${
              activeTab === section.id
                ? "border-b-2 border-brand text-brand font-medium"
                : "text-gray-500"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-4">
        {activeSection.fields.map((field) => (
          <FormField key={field.key} label={field.label}>
            <input className="w-full border px-3 py-2 rounded-lg" />
          </FormField>
        ))}
      </div>

      {/* Save */}
      <div className="mt-6">
        <NormalButton text="Save Changes" classes="bg-brand text-white " />
      </div>

    </div>
  );
}