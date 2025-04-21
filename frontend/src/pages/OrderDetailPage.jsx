import { useParams } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";
import { useIngredientStore } from "../store/ingredientStore";
import { useProductStore } from "../store/productStore";
import { useAuthStore } from "../store/authStore";
import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import clsx from "clsx";
import { formatDate, formatTime } from "../utils/date";
import toast from "react-hot-toast";

const OrderDetailPage = () => {
  const { id } = useParams();
  const {
    fetchOrderDetail,
    isLoading: isOrderLoading,
    order,
  } = useOrderStore();
  const { fetchAllUsers, users } = useAuthStore();
  const {
    fetchProducts,
    isLoading: isProductsLoading,
    products,
  } = useProductStore();
  const {
    fetchAllIngredients,
    isLoading: isIngredientsLoading,
    ingredients,
  } = useIngredientStore();
  useEffect(() => {
    const handleFetchInitialData = async () => {
      try {
        await Promise.all([
          fetchOrderDetail(id),
          fetchAllIngredients(),
          fetchProducts(),
          fetchAllUsers(),
        ]);
      } catch (error) {
        toast.error("Data fetching failed:,", error);
      }
    };
    handleFetchInitialData();
  }, [id]);
  const [items, setItems] = useState([]);
  const isMenu =
    order && Array.isArray(order.products) && order.products.length > 0;
  useEffect(() => {
    if (order) {
      if (isMenu) {
        setItems(order.products || []);
      } else {
        setItems(order.ingredients || []);
      }
    }
  }, [order]);
  const Skeleton = () => (
    <div className="animate-[pulse_1s_ease-in-out_infinite] flex flex-col h-[95vh] md:gap-5 gap-2 p-3 md:my-5 my-2 rounded-lg">
      <div className="w-10 p-6 rounded-lg bg-gray-300"></div>
      <div className=" flex md:flex-row flex-col md:gap-5 gap-2 h-full">
        <div className="bg-gray-300 rounded-lg md:absolute lg:inset-x-100 md:inset-x-60 lg:mt-35 md:mt-15 flex items-center md:justify-end w-full md:w-1/2 z-0 p-2 lg:py-40 md:py-30 py-20 "></div>
        <div className="flex flex-col md:w-1/3 w-full h-fit mt-auto p-5 rounded-lg gap-5 bg-gray-200 md:order-1 order-2 z-30">
          <div className="flex flex-row h-10 gap-2 md:justify-between items-center">
            <div className="rounded-lg bg-gray-300 h-full w-md"></div>
            <div className="flex bg-gray-300 gap-2 px-3 py-2 bg-accent rounded-lg h-full w-md"></div>
            <div className="rounded-lg bg-gray-300 h-full w-35"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="w-full rounded-lg h-12 bg-gray-100"></div>
            <div className="w-full rounded-lg h-12 bg-gray-100"></div>
            <div className="w-full rounded-lg h-12 bg-gray-100"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="w-full rounded-lg h-7 bg-gray-300"></div>
            <div className="w-full rounded-lg h-7 bg-gray-300"></div>
            <div className="w-full rounded-lg h-7 bg-gray-300"></div>
            <div className="w-full rounded-lg h-7 bg-gray-300"></div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="w-full rounded-lg h-7 bg-gray-100"></div>
            <div className="w-full rounded-lg h-7 bg-gray-100"></div>
            <div className="w-full rounded-lg h-7 bg-gray-100"></div>
            <div className="w-full rounded-lg h-7 bg-gray-100"></div>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-2 md:w-1/3 w-full h-fit mt-auto justify-end items-end md:order-2 order-1">
          <div className="w-full bg-gray-300 rounded-lg py-5"></div>
          <div className="w-full bg-gray-300 rounded-lg py-5"></div>
        </div>
        <div className="md:w-1/3 w-full z-10 flex flex-col gap-2 md:gap-5 mt-auto h-fit order-3">
          <div className="flex flex-row gap-2 md:gap-5 justify-end md:pb-0 pb-2">
            <div className="rounded-lg bg-gray-200 py-5 w-full"></div>
            <div className="rounded-lg bg-gray-200 py-5 w-full"></div>
          </div>
          {isMenu && (
            <div className="flex flex-col gap-2 md:gap-5 bg-gray-200 rounded-lg p-5">
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="rounded-lg bg-gray-300 py-5 w-full"></div>
                <div className="rounded-lg bg-gray-300 py-5 w-full"></div>
                <div className="rounded-lg bg-gray-300 py-5 w-full"></div>
                <div className="rounded-lg bg-gray-300 py-5 w-40"></div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row bg-gray-100 rounded-lg p-4"></div>
                <div className="flex flex-row bg-gray-100 rounded-lg p-4"></div>
                <div className="flex flex-row bg-gray-100 rounded-lg p-4"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  const statusClass = clsx(
    "px-3 py-1 rounded-lg w-fit items-center",
    order.status === "paid" && "bg-green-200 text-green-400",
    order.status === "pending" && "bg-yellow-200 text-yellow-400",
    order.status === "canceled" && "bg-red-200 text-red-400",
    order.status === "shipped" && "bg-blue-200 text-blue-400"
  );
  const paymentStatusClass = clsx(
    "px-3 py-1 rounded-lg w-fit items-center",
    order.payment?.status === "completed" && "bg-green-200 text-green-400",
    order.payment?.status === "pending" && "bg-yellow-200 text-yellow-400",
    order.payment?.status === "failed" && "bg-red-200 text-red-400"
  );
  if (isOrderLoading || isProductsLoading || isIngredientsLoading) {
    return <Skeleton />;
  }
  console.log(users);
  console.log(order.userId);

  return (
    <div className="md:gap-5 gap-2 md:my-5 my-2 md:mr-5 mr-2 transition-all ease-in-out duration-300 h-[95vh]">
      <h3>
        Order ID : <span className="font-semibold"># {id.slice(-5)}</span>
      </h3>
      <div className="flex flex-col md:gap-5 gap-2 h-full">
        <div className="grid grid-cols-3 md:gap-5 gap-2">
          {/* Order Detail */}
          <div className="flex flex-col gap-1">
            <h4>Order Detail</h4>
            <div className="grid grid-cols-2 rounded-lg bg-white space-y-3 p-3 h-fit">
              <p>Status : </p>
              <div className={statusClass}>
                {order.status?.toUpperCase() || "No Status Available"}
              </div>
              <p>Total : </p>
              <p className="font-semibold">
                IDR {order.totalAmount?.toLocaleString("id-ID") || "0"}
              </p>
              <p>Created : </p>
              <p>
                {formatDate(order.createdAt)} {formatTime(order.createdAt)}
              </p>
            </div>
          </div>
          {/* Payment Detail */}
          <div className="flex flex-col gap-1">
            <h4>Payment Detail</h4>
            <div className="flex flex-col md:gap-3 gap-2 rounded-lg bg-white p-4 h-fit">
              {order.payment ? (
                <>
                  <p>
                    Method :{" "}
                    <span className="font-semibold">
                      {order.payment.method?.toUpperCase()}
                    </span>
                  </p>
                  <div className="flex flex-row gap-2">
                    <p>Status : </p>
                    <div className={paymentStatusClass}>
                      {order.payment.status?.toUpperCase() ||
                        "No Status Available"}
                    </div>
                  </div>
                  <p>
                    Paid At :{" "}
                    <span className="font-semibold">
                      {formatDate(order.payment?.paidAt)}
                    </span>
                  </p>
                </>
              ) : (
                <p className="italic text-gray-400">
                  No payment data available
                </p>
              )}
            </div>
          </div>
          {/* Server Detail */}
          <div className="flex flex-col gap-1">
            <h4>Server</h4>
            <div className="flex flex-col md:gap-3 gap-2 rounded-lg bg-white p-3 h-fit">
              <p>
                Name:{" "}
                <span className="font-semibold">
                  {users.find(
                    (user) => String(user._id) === String(order.userId)
                  )?.name || "Unknown"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <h5>Ordered Items</h5>
        <div className="flex flex-col bg-white rounded-lg md:px-5 px-2">
          {items.map((item, index) => {
            const itemId = String(item.ingredientId || item.productId);
            const selectedItem = isMenu
              ? products.find((product) => String(product._id) === itemId)
              : ingredients.find(
                  (ingredient) => String(ingredient._id) === itemId
                );
            return (
              <div
                key={isMenu ? item.productId : item.ingredientId}
                className={`md:py-3 py-2 grid ${
                  isMenu ? "grid-cols-6" : "grid-cols-4"
                } ${
                  index < items.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <p>
                  {selectedItem?.name.replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  ) || "Unknown Item"}
                </p>
                {isMenu && <p>{item.customization?.size}</p>}
                <p>{item.quantity}</p>
                {!isMenu && <p>{item.unit}</p>}
                {isMenu && <p>{selectedItem.basePrice}</p>}
                {isMenu && <p>{item.customization?.note}</p>}
                <p className="text-end">{item.subtotal.toLocaleString("id")}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
