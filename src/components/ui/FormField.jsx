export const FormField = ({ label, children }) => (
  <div>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    {children}
  </div>
);