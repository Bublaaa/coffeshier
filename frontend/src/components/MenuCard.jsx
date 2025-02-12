import { useEffect } from "react";
import { useProductStore } from "../store/productStore";

const MenuCardSkeleton = ({ count }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            className="animate-[pulse_0.8s_ease-in-out_infinite] flex flex-col max-w-xs h-full gap-2 bg-gray-300 p-3 rounded-xl"
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
        ))}
    </>
  );
};

function MenuCard({ activeCategoryId }) {
  const { products, fetchProducts, fetchProductsByCategory, isLoading, error } =
    useProductStore();

  useEffect(() => {
    if (activeCategoryId === "") {
      fetchProducts();
    } else {
      fetchProductsByCategory(activeCategoryId);
    }
  }, [activeCategoryId, fetchProducts, fetchProductsByCategory]);

  if (isLoading) {
    return <MenuCardSkeleton count={products?.length || 6} />;
  }
  if (!products || products.length < 1) {
    return <p className="text-gray-500">{error}</p>;
  }

  return (
    <>
      {products.map((product) => (
        <div
          key={product._id}
          className="flex flex-col max-w-xs h-fit gap-2 bg-white cursor-pointer p-3 rounded-xl"
        >
          <img
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/content-gallery-3.png"
            alt="Placeholder"
            className="w-full h-40 rounded-lg"
          />
          <div className="flex flex-col justify-between">
            <div className="flex w-full gap-2 items-center justify-between">
              <h2 className="text-dark font-bold text-lg">{product.name}</h2>
              <h3 className="whitespace-nowrap text-accent font-bold text-2xl">
                $ {product.basePrice}
              </h3>
            </div>
            <p className="text-gray-500 max-w-full line-clamp-3">
              {product.description || product.name}
            </p>
          </div>
          <button className="w-full h-fit py-2 text-accent border border-accent rounded-full bg-white font-bold hover:bg-gray-100 hover:border-accent-hover hover:text-accent-hover">
            Add to Cart
          </button>
        </div>
      ))}
    </>
  );
}

export default MenuCard;
