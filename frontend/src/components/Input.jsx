import { useState } from "react";
import { ChevronRight } from "lucide-react";

const Input = ({
  inputType = "text",
  label,
  icon: Icon,
  options = [],
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]); // Store selected option as an object

  const handleDropdownClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsCollapsed(false);
  };

  return (
    <div className="relative w-full">
      {/* Label */}
      {label && <label className="text-gray-500 text-sm">{label}</label>}

      {/* Icon (if provided) */}
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="size-5 text-accent" />
        </div>
      )}

      {/* Input Field */}
      {inputType === "text" && (
        <input
          {...props}
          type="text"
          className={`peer w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-dark placeholder-transparent focus:border-accent  focus:ring-4 focus:ring-accent/40 focus:outline-none transition duration-200 ${
            Icon ? "pl-10" : ""
          }`}
          placeholder=" " // Required for label overlay effect
        />
      )}

      {/* Checkbox */}
      {inputType === "checkbox" && (
        <input {...props} type="checkbox" className="w-5 h-5 text-accent" />
      )}

      {/* Dropdown */}
      {inputType === "dropdown" && (
        <div className="relative">
          {/* Button */}
          <button
            type="button"
            id="dropdownDefaultButton"
            className="text-white bg-accent hover:bg-accent-hover focus:ring-4 focus:ring-accent/40 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            onClick={handleDropdownClick}
          >
            {selectedOption.label} {/* Show selected option */}
            <ChevronRight
              className={`ml-2 transition-transform ${
                isCollapsed ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Dropdown Options */}
          {isCollapsed && (
            <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {options
                .filter((option) => option.value !== selectedOption.value) // Remove selected option from list
                .map((option, index) => (
                  <button
                    type="button"
                    key={index}
                    className="block w-full px-4 py-3 text-left text-dark hover:bg-gray-100"
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
  <select
    {...props}
    className="peer w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-dark focus:border-accent focus:ring-accent focus:outline-none transition duration-200"
  >
    {options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>;
};

export default Input;
