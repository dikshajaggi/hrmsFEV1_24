import { useState } from "react";

const Tooltip = ({ children, text, position = "right" }) => {
  const [visible, setVisible] = useState(false);

  if (!text) return children;

  const positions = {
    right: "left-full ml-3 top-1/2 -translate-y-1/2",
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div
          className={`
          absolute z-50 whitespace-nowrap
          px-3 py-1.5 text-xs
          rounded-md
          bg-gray-900 text-white
          dark:bg-gray-700
          shadow-lg
          transition-all duration-200
          ${positions[position]}
          `}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;