import SearchInputSkeleton from "../../components/skeletons/SearchInputSkeleton";
import CategoryCardSkeleton from "../../components/skeletons/CategoryCardSkeleton";
import MenuCard from "../../components/MenuCard";
import MenuCardSkeleton from "../../components/skeletons/MenuCardSkeleton";

const MenuPageSkeleton = () => {
  return (
    <div className="animate-[pulse_0.8s_ease-in-out_infinite] flex flex-row gap-5 my-5 mr-5">
      <div className="flex flex-col gap-5 w-4/6">
        <SearchInputSkeleton />
        {/* Category Card */}
        <div className="flex flex-row h-fit overflow-x-auto gap-5 scrollbar-hidden">
          <CategoryCardSkeleton count={7} />
        </div>
        {/* Menu Card */}
        <div className="flex flex-col flex-1 gap-5 min-h-0">
          <div className="p-5 rounded-lg bg-gray-200"></div>
          <div className="h-[62vh] grid grid-cols-3 gap-5 overflow-y-auto scrollbar-hidden">
            {/* <MenuCard /> */}
            <MenuCardSkeleton count={8} />
          </div>
        </div>
      </div>
      <div className="w-2/6">{/* <OrderCart /> */}</div>
    </div>
  );
};
export default MenuPageSkeleton;
