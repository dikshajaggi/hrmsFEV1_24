import { useEffect, useState } from "react";
import {
  fetchPendingUsers,
  approveUser,
  fetchManagerData,
  fetchDesignationData,
  fetchTeamData,
} from "../apis";
import Dropdown from "../components/ui/Dropdown";
import { Users } from "lucide-react";

const ApprovalCard = ({ user, onApprove }) => {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">

      {/* TOP */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-soft text-brand flex items-center justify-center text-sm font-semibold">
            {user.fullName.charAt(0)}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500">
              {user.email}
            </p>
          </div>
        </div>

        {/* STATUS DOT */}
        <span className="w-2 h-2 rounded-full bg-yellow-400 mt-1" />
      </div>

      {/* META */}
      <div className="mt-4 text-xs text-gray-500">
        Requested on{" "}
        {new Date(user.createdAt).toLocaleDateString()}
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">

        <button
          onClick={() => onApprove(user)}
          className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition cursor-pointer"
        >
          Approve
        </button>

        <button className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer">
          Reject
        </button>

      </div>

    </div>
  );
};

const ApproveModal = ({openModal, setOpenModal, selectedUser, form, setForm, teams, designations, managers, handleApprove, loadingApprove}) => {
  return (
    <>
    {openModal && (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-105 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold">
              Approve User
            </h2>
            <p className="text-xs text-gray-500">
              Assign role and organizational details
            </p>
          </div>

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

      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">

        <button
          onClick={() => setOpenModal(false)}
          className="cursor-pointer px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition"
        >
          Cancel
        </button>

            <button
            onClick={handleApprove}
            disabled={loadingApprove}
            className="cursor-pointer px-4 py-2 text-sm rounded-lg bg-brand text-white hover:bg-[#A50D25] transition shadow-sm"
            >
            {loadingApprove ? "Approving..." : "Approve User"}
            </button>
        </div>

        </div>

    </div>
    )}
    </>
  )
}

export default function Approvals() {
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [users, setUsers] = useState([
  {
    id: 1,
    fullName: "Shivani",
    email: "shivani@company.com",
    createdAt: "2026-03-07T10:30:00Z",
  },
  {
    id: 2,
    fullName: "Ronaldo",
    email: "ronaldo@company.com",
    createdAt: "2026-03-08T09:12:00Z",
  },
  {
    id: 3,
    fullName: "Thomas",
    email: "thomas@company.com",
    createdAt: "2026-03-08T14:20:00Z",
  },
]);

const [teams, setTeams] = useState([
  { id: 1, name: "AI" },
  { id: 2, name: "Finance" },
  { id: 3, name: "Designing" },
  { id: 4, name: "HR" },
]);

const [designations, setDesignations] = useState([
  { id: 1, title: "Software Developer" },
  { id: 2, title: "Senior Software Developer" },
  { id: 3, title: "Assistant Manager" },
  { id: 4, title: "HR Executive" },
  { id: 5, title: "Accountant" },
  { id: 6, title: "Design Engineer" },
]);

  const [managers, setManagers] = useState([
    { id: 1, fullName: "Niladri Bose" },
    { id: 2, fullName: "Nitin Madhavan" },
    { id: 3, fullName: "Pushpdeep Singh" },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [form, setForm] = useState({
    role: "EMPLOYEE",
    teamId: "",
    designationId: "",
    managerId: "",
  });

  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-orange-100 text-orange-600",
  ];


  const loadUsers = async () => {
    const res = await fetchPendingUsers();
    setUsers(users);
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
    loadUsers()
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

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Pending User Approvals
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and approve new users before they access the system
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-4">
        {users.map(user => (
          <ApprovalCard key={user.id} user={user} onApprove={openApproveModal} />
        ))}
      </div>
      <ApproveModal openModal = {openModal} setOpenModal = {setOpenModal} selectedUser = {selectedUser} form = {form} setForm = {setForm} 
      teams = {teams} designations = {designations} managers = {managers} handleApprove = {handleApprove} loadingApprove = {loadingApprove} />

    </div>
  );
}