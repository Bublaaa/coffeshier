const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative ">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-accent" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-50 rounded-lg border border-accent focus:border-accent focus:ring-accent text-dark placeholder-gray-400 transition duration-200"
      />
    </div>
  );
};
export default Input;
