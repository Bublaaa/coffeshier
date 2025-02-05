const MenuCardSkeleton = ({ count }) => {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <div
        className="flex flex-col max-w-xs h-full gap-2 bg-gray-300 p-3 rounded-xl"
        key={index}
      >
        <div className="w-full h-40 rounded-lg bg-gray-200"></div>
        <div className="flex flex-col gap-2">
          <div className="flex w-full gap-2 items-center justify-between">
            <div className="bg-gray-200 p-4 rounded-lg w-full"></div>
            <div className="bg-gray-200 p-4 rounded-lg w-[20px]"></div>
          </div>
          <div className="bg-gray-200 p-2 rounded-lg w-full"></div>
          <div className="bg-gray-200 p-2 rounded-lg w-full"></div>
          <div className="bg-gray-200 p-2 rounded-lg w-full"></div>
        </div>
        <button className="w-full py-5 rounded-full bg-gray-200"></button>
      </div>
    ));
};

export default MenuCardSkeleton;
