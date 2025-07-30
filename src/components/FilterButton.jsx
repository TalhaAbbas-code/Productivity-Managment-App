const FilterButton = ({
  label,
  isActive = false,
  onClick,
  className = "",
  type = "button", 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded transition-all duration-200 ${
        isActive
          ? "bg-secondary text-primarytext border border-secondary"
          : "bg-primary text-secondarytext"
      } ${className}`}
    >
      {label}
    </button>
  );
};

export default FilterButton;
