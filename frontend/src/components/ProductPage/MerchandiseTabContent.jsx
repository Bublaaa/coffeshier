import Button from "../Button";
import * as LucideIcons from "lucide-react";
const MerchandiseTabContent = ({
  activeTab,
  orders,
  merchandises,
  isLoadingProducts,
  isLoadingOrders,
}) => {
  return (
    <div className="flex flex-row h-fit md:gap-5 gap-2 items-center">
      <Button className="mx-1 " buttonType="primary" buttonSize="icon">
        <LucideIcons.Plus />
      </Button>
      <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
    </div>
  );
};

export default MerchandiseTabContent;
