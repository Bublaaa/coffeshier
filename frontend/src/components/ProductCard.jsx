import * as LucideIcons from "lucide-react";
import { placeholder } from "../assets/index.js";
import Button from "./Button.jsx";
import { motion } from "framer-motion";

const Skeleton = () => (
  <div className="animate-pulse flex flex-col max-w-xs h-full gap-2 bg-gray-300 p-3 rounded-xl">
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
);

const ProductCard = ({ product, buttonLabel, isLoading }) => {
  if (isLoading || !product) {
    return <Skeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
      className="transition-all ease-in-out group flex flex-col w-full h-fit gap-2 bg-white cursor-pointer p-3 rounded-xl hover:border-2 border-accent"
    >
      <div className="overflow-hidden rounded-lg">
        <img
          src={product.image || placeholder}
          alt={product.name || "Placeholder"}
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h6 className="line-clamp-2 max-w-3xs">
          {product.name.replace(/\b\w/g, (char) => char.toUpperCase()) ||
            "No Name Added"}
        </h6>

        <p className="text-gray-500 max-w-full line-clamp-3">
          {product.description || "No description available"}
        </p>
        <h5 className="whitespace-nowrap w-fit text-accent font-bold text-end">
          {product.basePrice ? product.basePrice.toLocaleString("id-ID") : "0"}
        </h5>
      </div>
      {/* <Button
        buttonType="primary"
        buttonSize="medium"
        icon={LucideIcons.Pencil}
      >
        {buttonLabel || "Edit"}
      </Button> */}
    </motion.div>
  );
};

export default ProductCard;
