export const employeeEditConfig = {
  quick: [
    {
      key: "name",
      label: "Full Name",
      type: "text",
    },
    {
      key: "email",
      label: "Email",
      type: "email",
    },
  ],

  sections: [
    {
      id: "personal",
      label: "Personal Details",
      fields: [
        { key: "name", label: "Full Name", type: "text" },
        { key: "email", label: "Email", type: "email" },
      ],
    },
    {
      id: "job",
      label: "Job Info",
      fields: [
        { key: "team", label: "Department", type: "text" },
        { key: "role", label: "Role", type: "text" },
      ],
    },
    {
      id: "bank",
      label: "Bank Details",
      fields: [
        { key: "account", label: "Account Number", type: "text" },
        { key: "ifsc", label: "IFSC Code", type: "text" },
      ],
    },
  ],
};