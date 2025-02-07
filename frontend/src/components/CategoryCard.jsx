import { useEffect } from "react";
import { useCategoryStore } from "../store/categoryStore";
import * as LucideIcons from "lucide-react";

const CategoryCardSkeleton = ({ count = 6 }) => {
  return Array.from({ length: count }).map((_, index) => (
    <div className="py-4 px-7 bg-gray-300 rounded-xl" key={index}>
      <div className="p-5 mb-4 bg-gray-200 rounded-full"></div>
      <div className="bg-gray-200 p-2 rounded-lg"></div>
    </div>
  ));
};

function CategoryCard({ activeCategory, setActiveCategory }) {
  const { categories, fetchCategories, isLoading } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (isLoading) {
    return <CategoryCardSkeleton count={categories.length} />;
  }

  if (!categories || categories.length === 0) {
    return <p className="text-gray-500">No categories available</p>;
  }

  return (
    <>
      <div
        onClick={() => setActiveCategory("All")}
        className={`${
          activeCategory === "All"
            ? "text-white bg-accent hover:bg-accent-hover"
            : "text-dark bg-white hover:bg-gray-300"
        } flex flex-col justify-between cursor-pointer py-4 px-7 rounded-lg`}
      >
        <LucideIcons.Blocks className="size-7 mb-4" />
        <p
          className={`${
            activeCategory === "All"
              ? "text-white font-bold"
              : "text-dark font-bold"
          } whitespace-nowrap`}
        >
          All
        </p>
      </div>
      {categories.map((category) => {
        const IconComponent =
          LucideIcons[category.icon] || LucideIcons.GlassWater;
        return (
          <div
            key={category._id}
            onClick={() => setActiveCategory(category.name)}
            className={`${
              activeCategory === category.name
                ? "text-white bg-accent hover:bg-accent-hover"
                : "text-dark bg-white hover:bg-gray-300"
            } flex flex-col justify-between cursor-pointer py-4 px-7 rounded-lg`}
          >
            <IconComponent className="size-7 mb-4" />
            <p
              className={`${
                activeCategory === category.name
                  ? "text-white font-bold"
                  : "text-dark font-bold"
              } whitespace-nowrap`}
            >
              {category.name.replace(/\b\w/g, (char) => char.toUpperCase())}
            </p>
          </div>
        );
      })}
    </>
  );
}

export default CategoryCard;
