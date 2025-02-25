import { useState } from "react";
import { ChevronRight, Upload } from "lucide-react";

const TextInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && (
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon className="size-5 text-accent" />
      </div>
    )}
    <input
      {...props}
      className={`w-full border border-gray-300 rounded-lg px-3 py-3 bg-white text-dark placeholder-gray-400 focus:border-accent focus:ring-4 focus:ring-accent/40 focus:outline-none transition ${
        Icon ? "pl-10" : ""
      }`}
    />
  </div>
);

const TextareaInput = (props) => (
  <textarea
    {...props}
    className="w-full border border-gray-300 rounded-lg px-3 py-3 bg-white text-dark placeholder-gray-400 focus:border-accent focus:ring-4 focus:ring-accent/40 focus:outline-none transition resize-none"
  />
);

const CheckboxInput = ({ options, ...props }) => {
  return (
    <div className="flex flex-wrap gap-5">
      {options.map((option, index) => (
        <div key={index}>
          <input
            id={index}
            {...props}
            type="checkbox"
            value={option.value}
            className="w-5 h-5 text-accent cursor-pointer accent-accent hidden peer"
          />
          <label
            htmlFor={index}
            className="flex w-fit px-3 py-2 items-center cursor-pointer peer-checked:border-2 hover:bg-gray-100 peer-checked:border-accent border border-gray-200 rounded-lg bg-white"
          >
            <span className="text-gray-700">{option.label}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

const DropdownInput = ({
  options,
  selectedOption,
  onDropdownClick,
  onSelect,
  isCollapsed,
}) => (
  <div className="relative">
    <button
      type="button"
      className="w-full text-left text-dark bg-white border border-gray-300 rounded-lg px-3 py-3 focus:border-accent focus:ring-4 focus:ring-accent/40 focus:outline-none flex items-center justify-between"
      onClick={onDropdownClick}
    >
      {selectedOption?.label || "Select an option"}
      <ChevronRight
        className={`ml-2 transition-transform ${
          isCollapsed ? "rotate-90" : ""
        }`}
      />
    </button>

    {isCollapsed && (
      <div className="absolute left-0 mt-2 py-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="block w-full px-4 py-3 text-left hover:bg-gray-100"
            onClick={() => onSelect(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

const FileInput = ({ selectedFile, onFileChange, ...props }) => (
  <label className="relative w-full border border-gray-300 rounded-lg bg-white text-dark px-3 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition">
    <Upload className="size-5 text-accent" />
    <input type="file" className="hidden" onChange={onFileChange} {...props} />
    {selectedFile ? selectedFile.name : "Choose a file"}
  </label>
);

const Input = ({ inputType = "text", label, icon, options = [], ...props }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDropdownClick = () => setIsCollapsed((prev) => !prev);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsCollapsed(false);
  };
  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  // Mapping object to return the correct component dynamically
  const inputComponents = {
    text: <TextInput icon={icon} {...props} />,
    textarea: <TextareaInput {...props} />,
    checkbox: <CheckboxInput label={label} options={options} {...props} />,
    dropdown: (
      <DropdownInput
        options={options}
        selectedOption={selectedOption}
        onDropdownClick={handleDropdownClick}
        onSelect={handleOptionClick}
        isCollapsed={isCollapsed}
      />
    ),
    file: (
      <FileInput
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        {...props}
      />
    ),
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}
      {inputComponents[inputType] || inputComponents.text}
    </div>
  );
};

export default Input;

// MARK: - How to use
{
  /* 
  <Input type="number" label="Base Price" placeholder="e.g. 20.000,-" />
      <Input
        inputType="dropdown"
        label="Status"
        options={[
          { value: "Available", label: "Available" },
          { value: "Not Available", label: "Not Available" },
        ]}
      />
      <Input type="number" label="Initial Stock" placeholder="e.g. 200" />
      <Input
        inputType="textarea"
        label="Description"
        placeholder="e.g. Araara coffee beans blend"
      />
      <Input
        inputType="file"
        label="Product Image"
        placeholder="e.g. Araara coffee beans blend"
      /> 
      */
}
