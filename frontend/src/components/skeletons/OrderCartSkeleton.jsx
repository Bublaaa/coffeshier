const OrderCartSkeleton = () => {
  return (
    <div className="relative top-0 right-0 h-[calc(100vh-40px)] bg-gray-300 rounded-xl flex flex-col">
      <div className="w-full p-4 space-y-5">
        <div className="flex flex-row w-full justify-between items-center border-b border-gray-200">
          {/* User Info */}
          <div className="w-full h-fit p-2">
            <div className="bg-gray-200 rounded-lg p-3"></div>
            <div className="bg-gray-200 rounded-lg p-2 mt-2"></div>
          </div>
          <div className="p-5 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Cart */}
        <div className="flex flex-row gap-5 items-center h-fit">
          <div className="bg-gray-200 rounded-lg p-3 w-full"></div>
          <div className="bg-gray-200 rounded-lg p-4"></div>
        </div>

        {/* Order Types */}
        <div className="flex h-fit flex-row w-full overflow-x-auto space-x-4 scrollbar-hide">
          <div className="flex w-full py-5 rounded-full  bg-gray-200"></div>
          <div className="flex w-full py-5 rounded-full  bg-gray-200"></div>
          <div className="flex w-full py-5 rounded-full  bg-gray-200"></div>
        </div>
      </div>

      {/* Order Detail (fills remaining space) */}
      <div className="flex-1 overflow-y-auto space-y-5 scrollbar-hidden mx-4"></div>

      {/* Order Summary & Button (placed at the bottom) */}
      <div className=" space-y-2 p-4 mt-auto">
        <div className="w-full flex gap-5 items-center">
          <div className="bg-gray-200 rounded-full px-7 py-3 w-full"></div>
          <div className="bg-gray-200 rounded-full px-7 py-3"></div>
        </div>
        {/* <hr className="bg-gray-200" /> */}
        <div className="w-full flex gap-5 items-center">
          <div className="bg-gray-200 rounded-full px-7 py-3 w-full"></div>
          <div className="bg-gray-200 rounded-full px-7 py-3"></div>
        </div>
        <div className="w-full rounded-full bg-gray-100 py-6"></div>
      </div>
    </div>
  );
};

export default OrderCartSkeleton;
