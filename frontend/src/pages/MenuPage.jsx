import CategoryCard from "../components/CategoryCard.jsx";
import MenuCard from "../components/MenuCard.jsx";
import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import OrderCart from "../components/OrderCart.jsx";

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  return (
    <div className="flex flex-row gap-5 my-5 mr-5">
      <div className="flex flex-col gap-5 w-4/6">
        <Navbar />
        {/* Category Card */}
        <div className="flex flex-row h-fit overflow-x-auto gap-5 scrollbar-hidden">
          <CategoryCard
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
        {/* Menu Card */}
        <div className="flex flex-col flex-1 gap-5 min-h-0">
          <h1 className="text-dark font-bold text-3xl">
            {activeCategory.replace(/\b\w/g, (char) => char.toUpperCase())}
          </h1>
          <div className="h-[62vh] grid grid-cols-3 gap-5 overflow-y-auto scrollbar-hidden">
            <MenuCard />
            <MenuCard />
            <MenuCard />
            <MenuCard />
            <MenuCard />
            <MenuCard />
            <MenuCard />
            <MenuCard />
            <MenuCard />
            <MenuCard />
            <MenuCard />
          </div>
        </div>
      </div>
      <div className="w-2/6">
        <OrderCart />
      </div>
    </div>
  );
};
export default MenuPage;
