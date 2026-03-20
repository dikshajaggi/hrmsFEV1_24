import { useNavigate } from "react-router-dom";
import { EmployeeTable } from "../components/EmpPageComponents";
import { NormalButton } from "../components/ui/Buttons";
import { InviteEmployeeModal } from "../components/InviteEmployeeModal";
import { useState } from "react";

export default function Employees() {  
  const navigate = useNavigate()
  const [showInviteModal, setShowInviteModal] =  useState(false)
  const handleInvitation = () => {
    setShowInviteModal(prev => !prev)
  }

  const onInvite = () => {
    // api call
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] p-6 gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage employees, roles and access
          </p>
        </div>

        <div className="flex gap-2">
          <NormalButton text="Export" classes="border border-gray-400" />
          <NormalButton text="Invite Employee" classes="border border-gray-400" onClick={handleInvitation} />
          <NormalButton text="Bulk Upload" classes="bg-brand text-white" onClick={() => navigate("/employees/bulk-upload")} />
        </div>
      </div>
      <InviteEmployeeModal onClose={() => setShowInviteModal(false)} open={showInviteModal} onInvite={onInvite} />
      <div className="flex-1">
        <EmployeeTable  />
      </div>

    </div>
  );
}