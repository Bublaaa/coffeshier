const CategoryCard = ({ icon: Icon, isActive, label, ...props }) => {
  return (
    <div
      {...props}
      className={`${
        isActive
          ? "text-white bg-accent hover:bg-accent-hover"
          : "text-dark bg-white hover:bg-gray-300"
      } flex flex-col justify-between cursor-pointer py-4 px-7 rounded-lg`}
    >
      <Icon className="size-7 mb-4" />
      <p
        className={`${
          isActive ? "text-white font-bold" : "text-dark font-bold"
        } whitespace-nowrap`}
      >
        {label}
      </p>
    </div>
  );
};
export default CategoryCard;
