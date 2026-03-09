import { useEffect, useState } from "react";
import {
  fetchPendingUsers,
  approveUser,
  fetchManagerData,
  fetchDesignationData,
  fetchTeamData,
} from "../apis";
import Dropdown from "../components/ui/Dropdown";

export default function Approvals() {

  const [users, setUsers] = useState([
  {
    id: 1,
    fullName: "Ankit Sharma",
    email: "ankit.sharma@company.com",
    createdAt: "2026-03-07T10:30:00Z",
  },
  {
    id: 2,
    fullName: "Priya Mehta",
    email: "priya.mehta@company.com",
    createdAt: "2026-03-08T09:12:00Z",
  },
  {
    id: 3,
    fullName: "Rahul Verma",
    email: "rahul.verma@company.com",
    createdAt: "2026-03-08T14:20:00Z",
  },
]);

const [teams, setTeams] = useState([
  { id: 1, name: "Engineering" },
  { id: 2, name: "Product" },
  { id: 3, name: "Design" },
  { id: 4, name: "HR" },
]);

const [designations, setDesignations] = useState([
  { id: 1, title: "Software Engineer" },
  { id: 2, title: "Senior Software Engineer" },
  { id: 3, title: "Engineering Manager" },
  { id: 4, title: "HR Executive" },
]);

const [managers, setManagers] = useState([
  { id: 1, fullName: "Amit Gupta" },
  { id: 2, fullName: "Neha Kapoor" },
  { id: 3, fullName: "Siddharth Jain" },
]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    role: "EMPLOYEE",
    teamId: "",
    designationId: "",
    managerId: "",
  });

  const loadUsers = async () => {
    const res = await fetchPendingUsers();
    setUsers(res.data);
  };

//   const fetchTeams = async () => {
//     const res = await fetchTeamData();
//     setTeams(res.data);
//   };

//   const fetchDesignations = async () => {
//     const res = await fetchDesignationData();
//     setDesignations(res.data);
//   };

//   const fetchManagers = async () => {
//     const res = await fetchManagerData();
//     setManagers(res.data);
//   };

  useEffect(() => {
    // loadUsers();
    // fetchTeams();
    // fetchDesignations();
    // fetchManagers();
  }, []);

  const openApproveModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleApprove = async () => {
    const payload = {
      userId: selectedUser.id,
      roles: [form.role],
      teamId: Number(form.teamId),
      designationId: Number(form.designationId),
      managerId: form.managerId || null,
    };

    await approveUser(payload);

    setOpenModal(false);
    setSelectedUser(null);

    loadUsers();
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Pending User Approvals
      </h1>

      {users.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          No pending user approvals
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

  <table className="w-full text-sm">

    <thead className="text-xs uppercase text-gray-500 bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-left font-medium">User</th>
        <th className="px-4 py-3 text-left font-medium">Email</th>
        <th className="px-4 py-3 text-left font-medium">Registered</th>
        <th className="px-4 py-3 text-right font-medium">Actions</th>
      </tr>
    </thead>

    <tbody>

      {users.map((user) => (
        <tr
          key={user.id}
          className="border-t border-gray-100 hover:bg-gray-50 transition"
        >

          {/* USER */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-soft text-brand flex items-center justify-center text-xs font-semibold">
                {user.fullName.charAt(0)}
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-medium text-gray-900">
                  {user.fullName}
                </span>
                <span className="text-xs text-gray-500">
                  Pending approval
                </span>
              </div>
            </div>
          </td>

          {/* EMAIL */}
          <td className="px-4 py-3 text-gray-600">
            {user.email}
          </td>

          {/* DATE */}
          <td className="px-4 py-3 text-gray-500 text-xs">
            {new Date(user.createdAt).toLocaleDateString()}
          </td>

          {/* ACTIONS */}
          <td className="px-4 py-3">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => openApproveModal(user)}
                className="cursor-pointer px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition"
              >
                Approve
              </button>
              <button
                className="cursor-pointer px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
              >
                Reject
              </button>
            </div>
            </td>
            </tr>
            ))}
            </tbody>
        </table>
        </div>
      )}

      {/* APPROVAL MODAL */}

      {openModal && (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-105 bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">

            <div className="w-9 h-9 rounded-full bg-brand-soft text-brand flex items-center justify-center text-sm font-semibold">
            {selectedUser.fullName.charAt(0)}
            </div>

            <div className="flex flex-col leading-tight">
            <span className="font-medium text-gray-900">
                {selectedUser.fullName}
            </span>
            <span className="text-xs text-gray-500">
                {selectedUser.email}
            </span>
            </div>
        </div>

        {/* FORM */}

        <div className="px-6 py-5 space-y-4">
            {/* ROLE */}
            <Dropdown
                label="Select role"
                options={[
                    { label: "Employee", value: "EMPLOYEE" },
                    { label: "Manager", value: "MANAGER" },
                    { label: "HR", value: "HR" }
                ]}
                onChange={(option) =>
                    setForm({ ...form, role: option.value })
                }
                />

            {/* TEAM */}
            <Dropdown
                label="Select team"
                options={teams.map(team => ({
                    label: team.name,
                    value: team.id
                }))}
                onChange={(option) =>
                    setForm({ ...form, teamId: option.value })
                }
            />

            {/* DESIGNATION */}
            <Dropdown
                label="Select designation"
                options={designations.map(d => ({
                    label: d.title,
                    value: d.id
                }))}
                onChange={(option) =>
                    setForm({ ...form, designationId: option.value })
                }
            />

            {/* MANAGER */}
            <Dropdown
                label="Select manager"
                options={managers.map(m => ({
                    label: m.fullName,
                    value: m.id
                }))}
                onChange={(option) =>
                    setForm({ ...form, managerId: option.value })
                }
            />
        </div>

      {/* FOOTER */}

      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">

        <button
          onClick={() => setOpenModal(false)}
          className="cursor-pointer px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition"
        >
          Cancel
        </button>

            <button
            onClick={handleApprove}
            className="cursor-pointer px-4 py-2 text-sm rounded-lg bg-brand text-white hover:bg-[#A50D25] transition shadow-sm"
            >
            Approve User
            </button>

        </div>

        </div>

    </div>
    )}
    </div>
  );
}