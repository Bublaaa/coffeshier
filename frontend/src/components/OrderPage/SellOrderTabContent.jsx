import * as LucideIcons from "lucide-react";
import Button from "../Button";
import { useState } from "react";

const SellOrderTabContent = ({ activeTab, orders, products }) => {
  const [collapsedRows, setCollapsedRows] = useState({});
  const toggleCollapse = (id) => {
    setCollapsedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-row h-fit md:gap-5 gap-2 md:pb-5 pb-2 items-center">
        <Button className="mx-1 " buttonType="primary" buttonSize="icon">
          <LucideIcons.Plus />
        </Button>
        <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
      </div>
      <div className="flex flex-col md:gap-5 gap-2">
        {orders.map((order) => {
          const isCollapsed = collapsedRows[order._id] || false;
          return (
            <div
              key={order._id}
              className="flex flex-col w-full md:p-3 p-2 md:gap-5 gap-2 bg-white rounded-lg hover:border-2 border-accent hover:bg-gray-100 hover:cursor-pointer"
              onClick={() => toggleCollapse(order._id)}
            >
              <p className="truncate font-semibold">
                <span>OrderID #</span>
                {order._id}
              </p>
              {order.products.map((product) => {
                const selectedProduct = products.find(
                  (productInList) => productInList._id === product.productId
                );
                if (isCollapsed) {
                  return (
                    <div key={product.productId} className="grid grid-cols-3">
                      <p>{selectedProduct?.name || "No Available Name"}</p>
                      <p>{product.quantity}</p>
                      <p>{product.subtotal}</p>
                      <p>{product.customization.size}</p>
                      <p>{product.customization.note}</p>
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellOrderTabContent;
