export const FormField = ({ label, children, hint, error }) => (
  <div className="flex flex-col gap-1.5">

    <label className="text-xs font-medium text-gray-500">
      {label}
    </label>

    {children}

    {hint && (
      <p className="text-xs text-gray-400">{hint}</p>
    )}

    {error && (
      <p className="text-xs text-red-500">{error}</p>
    )}

  </div>
);