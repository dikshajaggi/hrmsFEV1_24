import React from "react";

const MetricCard = ({ icon: Icon, value, label }) => {
  return (
    <div
      className="
      group
      relative
      p-6
      rounded-xl
      bg-surface-light
      border border-border-light
      shadow-card
      hover:shadow-card-hover
      transition-all
      duration-300
      flex
      items-center
      gap-4
      "
    >
      {/* Icon */}
      {Icon && (
        <div
          className="
          flex
          items-center
          justify-center
          w-11
          h-11
          rounded-lg
          bg-brand-soft
          text-brand
          group-hover:scale-105
          transition
          "
        >
          <Icon size={20} />
        </div>
      )}

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-4xl font-semibold text-text-primary">
          {value}
        </span>

        <span className="text-sm text-text-secondary">
          {label}
        </span>
      </div>
    </div>
  );
};

export default MetricCard;