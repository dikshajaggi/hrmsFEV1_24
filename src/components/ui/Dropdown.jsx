// components/ui/Dropdown.jsx

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ label, options, onChange }) {

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(label);
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const selectOption = (option) => {
    setValue(option.label);
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <p className="text-xs text-gray-500 font-medium capitalize mb-1">{label}</p>
      <button
        onClick={() => setOpen(!open)}
        className="
        w-full
        flex items-center justify-between
        px-3 py-2
        rounded-lg
        text-sm
        border border-gray-200
        bg-white
        hover:bg-gray-50
        transition
        "
      >
        <span className="text-gray-700 text-sm">{value}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>

      {open && (
        <div
          className="
          absolute
          left-0
          mt-2
          w-full
          bg-white
          rounded-lg
          shadow-lg
          border border-gray-100
          z-50
          overflow-hidden
          "
        >

          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => selectOption(option)}
              className="
              w-full
              text-left
              px-3 py-2
              text-sm
              hover:bg-gray-50
              transition
              "
            >
              {option.label}
            </button>
          ))}

        </div>
      )}

    </div>
  );
}