import { Minus, Plus } from "lucide-react";

const OrderDetail = () => {
  return (
    <div className="flex flex-row gap-5 items-center">
      <img
        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png"
        alt="Placeholder"
        className="w-30 h-30 rounded-lg"
      />
      <div className="w-full">
        <h2 className="font-semibold w-full text-dark ">Menu Name</h2>
        <p className="text-gray-500">small</p>
        <p className="text-gray-500">Note: </p>
        <div className="flex flex-row w-full justify-between mt-5">
          <p className="font-bold text-lg text-dark">$ 4.50</p>
          <div className="flex flex-row gap-3 items-center ">
            <button className="bg-white hover:bg-gray-300 hover:text-dark-hover p-1 rounded-full border border-gray-300 text-dark">
              <Minus size={15} />
            </button>
            <p className="text-dark text-md">2</p>
            <button className="bg-white hover:bg-gray-300 hover:text-dark-hover  p-1 rounded-full border border-gray-300 text-dark">
              <Plus size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;
