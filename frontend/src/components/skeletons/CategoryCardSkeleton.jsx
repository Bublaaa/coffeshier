const CategoryCardSkeleton = ({ count }) => {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <div className="py-4 px-7 bg-gray-300 rounded-xl" key={index}>
        <div className="p-5 mb-4 bg-gray-200 rounded-full"></div>
        <div className="bg-gray-200 p-2 rounded-lg"></div>
      </div>
    ));
};
export default CategoryCardSkeleton;
