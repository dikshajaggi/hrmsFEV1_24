import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { getEmployees } from "../apis";
import { DeleteModal, EditEmployeeModal, EmployeeDrawer } from "./EmployeeActions";

const columns = (handlers) => [
  {
    accessorKey: "name",
    header: "Employee",
    cell: ({ row }) => {
      const emp = row.original;

      const initials = emp.name
        .split(" ")
        .map((n) => n[0])
        .join("");

      return (
        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>

          <div>
            <p className="font-medium">{emp.name}</p>
            <p className="text-xs text-gray-500">{emp.email}</p>
          </div>

        </div>
      );
    },
  },

  {
    accessorKey: "team",
    header: "Department",
  },

  {
    accessorKey: "role",
    header: "Role",
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const color =
        status === "ACTIVE"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600";

      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}
        >
          {status}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <EmployeeActions
        employee={row.original}
        onView={() => handlers.onView(row.original)}
        onEdit={() => handlers.onEdit(row.original)}
        onDelete={() => handlers.onDelete(row.original)}
      />
    ),
  },
];

export const EmployeeTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);

  // action states
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();

      const formatted = res.data.map((emp) => ({
        id: emp.id,
        name: emp.user.fullName,
        email: emp.user.email,
        team: emp.team?.name,
        role: emp.designation?.name,
        status: emp.status,
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const table = useReactTable({
  data,
  columns: columns({
    onView: (emp) => {
      setSelectedEmployee(emp);
      setDrawerOpen(true);
    },
    onEdit: (emp) => {
      setSelectedEmployee(emp);
      setEditOpen(true);
    },
    onDelete: (emp) => {
      setSelectedEmployee(emp);
      setDeleteOpen(true);
    },
  }),
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm">

      {/* TABLE */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>

                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-5 py-3 font-medium text-gray-600 cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">

                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {header.column.getIsSorted() === "asc" && (
                        <ArrowUp size={14} />
                      )}

                      {header.column.getIsSorted() === "desc" && (
                        <ArrowDown size={14} />
                      )}

                      {!header.column.getIsSorted() && (
                        <ArrowUpDown size={14} className="opacity-40" />
                      )}

                    </div>
                  </th>
                ))}

              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  setSelectedEmployee(row.original);
                  setDrawerOpen(true);
                }}
                className="border-t border-gray-100 hover:bg-gray-50 transition cursor-pointer"
              >

                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">

        <div className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer px-3 py-1 border rounded-md text-sm disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer px-3 py-1 border rounded-md text-sm disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>

      <EmployeeDrawer
        open={drawerOpen}
        employee={selectedEmployee}
        onClose={() => setDrawerOpen(false)}
        onEdit={() => {
          setDrawerOpen(false);
          setEditOpen(true);
        }}
      />

      <EditEmployeeModal
        open={editOpen}
        employee={selectedEmployee}
        onClose={() => setEditOpen(false)}
      />

      <DeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          console.log("Deactivate", selectedEmployee);
          setDeleteOpen(false);
        }}
      />

    </div>
  );
};

const EmployeeActions = ({ employee, onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-gray-100"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">

          <button
            onClick={() => {
              setOpen(false);
              onView()
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
          >
            View
          </button>

          <button
             onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete()
            }}
            className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
          >
            Deactivate
          </button>

        </div>
      )}
    </div>
  );
};

const TableSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="animate-pulse space-y-4">

        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">

            <div className="w-9 h-9 bg-gray-200 rounded-full"></div>

            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 bg-gray-200 rounded"></div>
              <div className="h-2 w-24 bg-gray-200 rounded"></div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};