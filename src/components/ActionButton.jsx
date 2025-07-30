// components/ActionButton.jsx
import React from "react";
const ActionButton = ({
  label,
  onClick,
  color = "gray", // green, yellow, red, etc.
  textColor = "white",
  className = "",
  disabled = false,
}) => {
  const baseColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-400 text-black",
    red: "bg-red-500",
    gray: "bg-gray-500",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded font-semibold text-sm ${
        baseColors[color]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {label}
    </button>
  );
};

export default React.memo(ActionButton);
