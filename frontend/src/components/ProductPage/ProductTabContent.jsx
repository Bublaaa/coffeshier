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
  products,
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

    const productId = card.getAttribute("data-id");
    const product = products.find((p) => p._id === productId);

    if (product) {
      setSelectedProduct(product);
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
        {products?.length > 0 ? (
          products.map((product) => (
            <ProductCard
              product={product}
              buttonLabel={"Edit"}
              key={product._id}
              data-id={product._id}
              isLoading={isLoadingProducts}
            ></ProductCard>
          ))
        ) : (
          <p>No products available</p>
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
