import { useState } from "react";
import * as LucideIcons from "lucide-react";
import Modal from "../Modal.jsx";
import ProductCard from "../ProductCard.jsx";
import Button from "../Button.jsx";
const MerchandiseTabContent = ({
  activeTab,
  orders,
  merchandises,
  isLoadingProducts,
  isLoadingOrders,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row h-fit md:gap-5 gap-2 items-center">
        <Button className="mx-1 " buttonType="primary" buttonSize="icon">
          <LucideIcons.Plus />
        </Button>
        <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
      </div>
      <div className="h-[73vh] grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-5 gap-2 p-2 overflow-y-auto scrollbar-hidden">
        {merchandises?.length > 0 ? (
          merchandises.map((merchandise) => (
            <ProductCard
              product={merchandise}
              buttonLabel={"Edit"}
              key={merchandise._id}
              data-id={merchandise._id}
              isLoading={isLoadingProducts}
            ></ProductCard>
          ))
        ) : (
          <p>No merchandises available</p>
        )}
      </div>
    </div>
  );
};

export default MerchandiseTabContent;
