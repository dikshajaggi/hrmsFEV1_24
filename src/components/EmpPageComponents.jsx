import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

const data = [
  {
    id: 1,
    name: "Aman Gupta",
    email: "aman@company.com",
    team: "Engineering",
    role: "Frontend Developer",
    status: "Active",
  },
];

export const EmployeeTable = () => {
  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()] ?? null}

                  </th>
                ))}

              </tr>
            ))}

          </thead>

          <tbody>

            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
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

    </div>
  );
}


const columns = [
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
    header: "Team",
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

      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          {status}
        </span>
      );
    },
  },

  // {
  //   id: "actions",
  //   header: "",
  //   cell: () => <EmployeeActions />,
  // },
];



const EmployeeActions = () => {

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-gray-100"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg">

          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
            View
          </button>

          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
            Edit
          </button>

          <button className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50">
            Deactivate
          </button>

        </div>
      )}

    </div>
  );
}