// components/ui/Dropdown.jsx

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ label, options, onChange }) {

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(label);
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const selectOption = (option) => {
    setValue(option);
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="
        cursor-pointer
        flex items-center gap-2
        px-3 py-2
        rounded-lg
        text-sm
        bg-white
        hover:bg-gray-50
        transition
        "
      >
        {value}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="
        absolute
        right-0
        mt-2
        w-44
        bg-white
        rounded-lg
        shadow-lg
        z-50
        overflow-hidden
        ">

          {options.map((option) => (
            <button
              key={option}
              onClick={() => selectOption(option)}
              className="
              w-full
              text-left
              px-3 py-2
              text-sm
              hover:bg-gray-100
              "
            >
              {option}
            </button>
          ))}

        </div>
      )}
    </div>
  );
}