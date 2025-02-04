const SizeButton = ({ icon: Icon, isActive, label, ...props }) => {
  return (
    <div
      {...props}
      className={`${
        isActive
          ? "bg-dark text-white hover:bg-dark-hover"
          : "bg-white text-dark hover:bg-gray-300 border border-gray-400"
      } py-2 px-3 rounded-full justify-center items-center`}
    >
      <h1 className="px-1">{label}</h1>
    </div>
  );
};

export default SizeButton;
