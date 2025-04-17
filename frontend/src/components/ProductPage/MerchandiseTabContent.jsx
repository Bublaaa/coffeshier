import { useReducer } from "react";
import * as LucideIcons from "lucide-react";
import Modal from "../Modal.jsx";
import ProductCard from "../ProductCard.jsx";
import Button from "../Button.jsx";
import AddMerchandiseForm from "../Forms/AddMerchandiseForm.jsx";
import { NavLink } from "react-router-dom";
const MerchandiseTabContent = ({
  categories,
  activeTab,
  merchandises,
  isLoadingProducts,
  onChangeTab,
}) => {
  const initialState = {
    isModalOpen: false,
    modalBody: null,
    modalTitle: "",
    modalSize: "medium",
  };

  const merchandiseReducer = (state, action) => {
    switch (action.type) {
      case "SET_MODAL_OPEN":
        return { ...state, isModalOpen: action.payload };
      case "SET_MODAL_BODY":
        return { ...state, modalBody: action.payload };
      case "SET_MODAL_TITLE":
        return { ...state, modalTitle: action.payload };
      case "SET_MODAL_SIZE":
        return { ...state, modalSize: action.payload };
      default:
        return state;
    }
  };

  const handleOpenModal = (title, body, size) => {
    dispatch({ type: "SET_MODAL_TITLE", payload: title });
    dispatch({ type: "SET_MODAL_BODY", payload: body });
    dispatch({ type: "SET_MODAL_SIZE", payload: size });
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
  };

  const [state, dispatch] = useReducer(merchandiseReducer, initialState);

  return (
    <div className="flex flex-col">
      <Modal
        isOpen={state.isModalOpen}
        title={state.modalTitle}
        body={state.modalBody}
        size={state.modalSize}
        onClose={() => dispatch({ type: "SET_MODAL_OPEN", payload: false })}
      />
      <div className="flex flex-row h-fit md:gap-5 gap-2 md:pb-5 pb-2 items-center">
        <Button
          className="mx-1 "
          buttonType="primary"
          buttonSize="icon"
          onClick={() =>
            handleOpenModal(
              "Add New Merchandise",
              <AddMerchandiseForm
                categories={categories}
                onChangeTab={onChangeTab}
                onClose={() =>
                  dispatch({ type: "SET_MODAL_OPEN", payload: false })
                }
              />
            )
          }
        >
          <LucideIcons.Plus />
        </Button>
        <h2>{activeTab.replace(/\b\w/g, (char) => char.toUpperCase())}</h2>
      </div>
      <div className="h-[73vh] grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-5 gap-2 p-2 overflow-y-auto scrollbar-hidden">
        {merchandises?.length > 0 ? (
          merchandises.map((merchandise) => (
            <NavLink
              key={merchandise._id}
              to={`/owner/product/${merchandise._id}`}
            >
              <ProductCard
                product={merchandise}
                buttonLabel={"Edit"}
                data-id={merchandise._id}
                isLoading={isLoadingProducts}
              ></ProductCard>
            </NavLink>
          ))
        ) : (
          <p>No merchandises available</p>
        )}
      </div>
    </div>
  );
};

export default MerchandiseTabContent;
