import { useState, useEffect } from "react";
import { ChevronRight, Upload } from "lucide-react";

// Text Input
export const Input = ({ icon: Icon, label, ...props }) => (
  <div className="relative">
    {label && (
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
    )}
    {Icon && (
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon className="size-5 text-accent" />
      </div>
    )}
    <input
      {...props}
      className={`w-full border border-gray-300 rounded-lg md:px-3 md:py-3 bg-white text-dark placeholder-gray-400 focus:border-accent focus:ring-4 focus:ring-accent/40 focus:outline-none transition ${
        Icon ? "pl-10" : ""
      }`}
    />
  </div>
);

// Text Area
export const TextareaInput = ({ label, ...props }) => (
  <div className="relative w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
    )}
    <textarea
      {...props}
      className="w-full border border-gray-300 rounded-lg px-3 py-3 bg-white text-dark placeholder-gray-400 focus:border-accent focus:ring-4 focus:ring-accent/40 focus:outline-none transition resize-none"
    />
  </div>
);

// CheckBox
export const CheckboxInput = ({ options, label, ...props }) => (
  <div className="relative w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
    )}
    <div className="flex flex-wrap gap-5">
      {options.map((option, index) => (
        <div key={index}>
          <input
            id={`checkbox-${index}`}
            {...props}
            type="checkbox"
            value={option.value}
            className="w-5 h-5 text-accent cursor-pointer accent-accent hidden peer"
          />
          <label
            htmlFor={`checkbox-${index}`}
            className="flex w-fit px-3 py-2 items-center cursor-pointer peer-checked:border-2 hover:bg-gray-100 peer-checked:border-accent border border-gray-200 rounded-lg bg-white"
          >
            <span className="text-gray-700">{option.label}</span>
          </label>
        </div>
      ))}
    </div>
  </div>
);

// Dropdown
export const DropdownInput = ({
  options,
  value,
  label,
  name,
  onChange,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    value || options[0]?.value
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { name, value: newValue } }); // Notify parent
    }
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        className="w-full flex-nowrap text-left bg-white border border-gray-300 rounded-lg px-3 py-3 focus:border-accent focus:ring-4 focus:ring-accent/40 focus:outline-none flex items-center justify-between"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {options.find((opt) => opt.value === selectedValue)?.label ||
          placeholder}
        <ChevronRight
          className={`ml-2 transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className={"px-4 py-3 cursor-pointer hover:bg-gray-100"}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// File Upload
export const FileInput = ({ selectedFile, onFileChange, ...props }) => (
  <label className="relative w-full border border-gray-300 rounded-lg bg-white text-dark px-3 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition">
    <Upload className="size-5 text-accent" />
    <input type="file" className="hidden" onChange={onFileChange} {...props} />
    {selectedFile ? selectedFile.name : "Choose a file"}
  </label>
);
