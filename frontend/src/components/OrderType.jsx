const OrderType = ({ label, isActive, ...props }) => {
  return (
    <div
      {...props}
      className={`flex px-4 py-2 items-center rounded-full whitespace-nowrap mx-2 cursor-pointer ${
        isActive
          ? "bg-dark hover:bg-dark-hover text-white"
          : "bg-white text-dark hover:bg-gray-100 border border-gray-300"
      }`}
    >
      <h2>{label}</h2>
    </div>
  );
};
export default OrderType;
