import { useState } from "react";
import * as LucideIcons from "lucide-react";
import Modal from "../Modal.jsx";
import ProductCard from "../ProductCard.jsx";
import AddMenuForm from "../Forms/AddMenuForm.jsx";
import Button from "../Button.jsx";

const ProductTabContent = ({
  categories,
  activeTab,
  ingredients,
  menus,
  isLoadingProducts,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalBody, setModalBody] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (title, body) => {
    setModalTitle(title);
    setModalBody(body);
    setModalOpen(true);
  };

  const handleProductClick = (event) => {
    const card = event.target.closest("[data-id]");
    if (!card) return;

    const menuId = card.getAttribute("data-id");
    const menu = menus.find((p) => p._id === menuId);

    if (menu) {
      setSelectedProduct(menu);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row h-fit md:gap-5 gap-2 md:pb-5 pb-2 items-center">
        <Button
          className="mx-1 "
          buttonType="primary"
          buttonSize="icon"
          onClick={() =>
            openModal(
              "Add New Menu",
              <AddMenuForm categories={categories} ingredients={ingredients} />
            )
          }
        >
          <LucideIcons.Plus />
        </Button>
        <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        body={modalBody}
      />
      <div
        className="h-[73vh] grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-5 gap-2 p-2 overflow-y-auto scrollbar-hidden"
        onClick={handleProductClick}
      >
        {menus?.length > 0 ? (
          menus.map((menu) => (
            <ProductCard
              product={menu}
              buttonLabel={"Edit"}
              key={menu._id}
              data-id={menu._id}
              isLoading={isLoadingProducts}
            ></ProductCard>
          ))
        ) : (
          <p>No menus available</p>
        )}
      </div>
      {selectedProduct && (
        <Modal onClose={() => setSelectedProduct(null)}>
          <h2>{selectedProduct.name}</h2>
          <p>{selectedProduct.description}</p>
          <img src={selectedProduct.image} alt={selectedProduct.name} />
        </Modal>
      )}
    </div>
  );
};

export default ProductTabContent;
