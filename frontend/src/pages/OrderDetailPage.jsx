import { useParams } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";
import { useEffect } from "react";
import Button from "../components/Button";
import clsx from "clsx";
import { formatDate, formatTime } from "../utils/date";

const OrderDetailPage = () => {
  const { id } = useParams();
  const {
    fetchOrderDetail,
    isLoading: isOrderLoading,
    order,
  } = useOrderStore();
  useEffect(() => {
    const handleFetchInitialData = async () => {
      try {
        await Promise.all([fetchOrderDetail(id)]);
      } catch (error) {
        console.error("Data fetching failed:,", error);
      }
    };
  }, [id]);
  const isMenu =
    Array.isArray(order.ingredients) && order.ingredients.length > 0;
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
  if (isOrderLoading) {
    return <Skeleton />;
  }
  return (
    <div className="md:gap-5 gap-2 md:my-5 my-2 md:mr-5 mr-2 transition-all ease-in-out duration-300 h-[95vh]">
      <div className="flex flex-col md:gap-5 gap-2 h-full">
        <div className="grid grid-cols-3 md:gap-5 gap-2">
          {/* Order Detail */}
          <div className="flex flex-col md:gap-3 gap-2 rounded-lg bg-white p-3">
            <h5 className="border-b border-gray-200 pb-2">Order Detail</h5>
            <p>
              Order ID : <span className="font-semibold"># {id.slice(-5)}</span>
            </p>
            <div className="flex flex-row gap-2">
              <p>Status : </p>
              <div className={statusClass}>
                {order.status?.toUpperCase() || "No Status Available"}
              </div>
            </div>
          </div>
          {/* Payment Detail */}
          <div className="flex flex-col md:gap-3 gap-2 rounded-lg bg-white p-3">
            <h5 className="border-b border-gray-200 pb-2">Payment Detail</h5>
            <p>
              Method :{" "}
              <span className="font-semibold">
                {order.payment?.method.toUpperCase()}
              </span>
            </p>
            <div className="flex flex-row gap-2">
              <p>Status : </p>
              <div className={paymentStatusClass}>
                {order.payment.status?.toUpperCase() || "No Status Available"}
              </div>
            </div>
            <p>
              Paid At :{" "}
              <span className="font-semibold">
                {formatDate(order.payment?.paidAt)}
              </span>
              <span className="font-semibold">
                {formatDate(order.payment?.paidAt)}
              </span>
            </p>
          </div>
          {/* Server Detail */}
          <div className="flex flex-col md:gap-3 gap-2 rounded-lg bg-white p-3">
            <h5 className="border-b border-gray-200 pb-2">Server</h5>
            <p>
              Name :{" "}
              <span className="font-semibold">
                {order.payment?.method.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      </div>
      {order.status}
      {id}
    </div>
  );
};

export default OrderDetailPage;
