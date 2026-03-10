import { Hammer, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnderConstruction({ title }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10">
      
      {/* Icon */}
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <Hammer size={40} className="text-gray-600" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        {title || "This Module is Under Development"}
      </h1>

      {/* Description */}
      <p className="text-gray-500 max-w-md mb-6">
        We're currently working on this feature. It will be available in an upcoming release.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="cursor-pointer flex items-center gap-2 px-5 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>
    </div>
  );
}