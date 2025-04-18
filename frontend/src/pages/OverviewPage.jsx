import Button from "../components/Button";
import * as LucideIcons from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useOrderStore } from "../store/orderStore";
import { useIngredientStore } from "../store/ingredientStore";
import { motion } from "framer-motion";
import { useEffect } from "react";

const SectionWrapper = ({ sectionTitle, sectionContent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col bg-white p-5 gap-3 rounded-lg h-fit"
    >
      <h6>{sectionTitle}</h6>
      <div className="w-full flex flex-col">{sectionContent}</div>
    </motion.div>
  );
};
const MonthlyRevenue = ({}) => {
  const currentMonth = new Date().getMonth(); // 0-based (Jan = 0)
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const shift = (12 + currentMonth - 5) % 12;
  const rotatedMonths = [...months.slice(shift), ...months.slice(0, shift)];
  return (
    <div className="grid grid-cols-12 gap-3 items-end">
      {rotatedMonths.map((month, index) => {
        const currentMonth = new Date().getMonth();
        const shift = (12 + currentMonth - 5) % 12;
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const rotatedMonths = [
          ...months.slice(shift),
          ...months.slice(0, shift),
        ];

        const realIndex = (shift + index) % 12;
        const isThisMonth = realIndex === currentMonth;

        const isFuture = realIndex > currentMonth;

        const randomNumberInRange = (min, max) =>
          Math.floor(Math.random() * (max - min + 1)) + min;

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: index / 24 }}
            key={month}
            className="flex flex-col items-center"
          >
            <div
              className={`
          ${
            isThisMonth
              ? "bg-accent shadow shadow-accent"
              : isFuture
              ? "bg-gray-100"
              : "bg-gray-300"
          }
          h-${randomNumberInRange(5, 20)} p-1 w-full rounded-lg
        `}
            ></div>
            <p className="font-semibold">{month}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

const TotalOrders = ({ orders }) => {
  const sellOrders = orders.filter(
    (order) =>
      Array.isArray(order.ingredients) && order.ingredients.length === 0
  );
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex flex-row items-center gap-5">
        <LucideIcons.ShoppingBag size={45} className="text-accent" />
        <h5>{sellOrders.length} Orders</h5>
      </div>
    </div>
  );
};

const AlmostEmptyIngredients = ({ ingredients }) => {
  const isLowStock = (ingredient) => {
    const { stockQuantity, unit } = ingredient;
    switch (unit) {
      case "kg":
      case "li":
        return stockQuantity <= 2;
      case "gr":
        return stockQuantity < 1000;
      case "mg":
        return stockQuantity < 1000;
      case "ml":
        return stockQuantity < 200;
      default:
        return false;
    }
  };
  const lowStock = ingredients.filter(isLowStock);
  if (lowStock.length === 0) {
    return <p className="text-gray-500">All ingredients are well stocked.</p>;
  }

  return (
    <div className="flex flex-col ">
      {lowStock.map((ingredient) => (
        <div
          key={ingredient._id}
          className="grid grid-cols-3 rounded-lg p-2 hover:scale-105 hover:bg-gray-100 hover:cursor-pointer"
        >
          <p className="font-semibold">
            {ingredient.name.replace(/\b\w/g, (char) => char.toUpperCase())}
          </p>
          <p className="text-center">{ingredient.stockQuantity}</p>
          <p className="text-end">{ingredient.unit}</p>
        </div>
      ))}
    </div>
  );
};

const OrderToComplete = ({ orders }) => {
  const pendingOrders = orders.filter(
    (order) => order.status === "pending" || order.payment.status === "pending"
  );
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2 items-center text-center font-semibold">
        <p>Order Id</p>
        <p>Order Status</p>
        <p>Payment Status</p>
      </div>
      {pendingOrders.map((order) => (
        <div
          key={order._id}
          className="grid grid-cols-3 md:gap-5 gap-2 items-center hover:bg-gray-100 px-2 py-1 rounded-lg hover:cursor-pointer"
        >
          <p className="truncate">{order._id}</p>
          {/* Order Status */}
          <div
            className={`${
              order.status === "paid" ? "bg-green-200" : "bg-yellow-200"
            } rounded-lg p-2 text-center`}
          >
            <p
              className={`${
                order.payment.status === "paid"
                  ? "text-green-600"
                  : "text-yellow-600"
              } font-semibold`}
            >
              {order.status.toUpperCase()}
            </p>
          </div>
          {/* Payment Status */}
          <div
            className={`${
              order.payment.status === "completed"
                ? "bg-green-200"
                : "bg-yellow-200"
            } rounded-lg p-2 text-center`}
          >
            <p
              className={`${
                order.payment.status === "completed"
                  ? "text-green-600"
                  : "text-yellow-600"
              } font-semibold`}
            >
              {order.payment.status.toUpperCase()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
const OverviewPage = ({}) => {
  const { user } = useAuthStore();
  const { fetchOrders, orders } = useOrderStore();
  const { fetchIngredients, ingredients } = useIngredientStore();

  useEffect(() => {
    fetchOrders();
    fetchIngredients();
  }, []);
  return (
    <div className="md:gap-5 gap-2 md:my-5 my-2 md:mr-5 mr-2 transition-all ease-in-out duration-300 h-[95vh]">
      <div className="flex flex-col md:gap-5 gap-2 w-full">
        <div className="flex flex-row w-full justify-between rounded-lg">
          <h1>Overview</h1>
          <div className="flex flex-row md:gap-5 gap-2 items-center">
            <Button
              className="h-fit"
              buttonSize="icon"
              buttonType="secondary"
              icon={LucideIcons.Bell}
            ></Button>
            <Button
              buttonSize="medium"
              buttonType="primary"
              icon={LucideIcons.User2}
            >
              {user.name}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:gap-5 gap-2">
          {/* Monthly revenue */}
          <div className="grid grid-cols-1 md:gap-5 gap-2">
            <SectionWrapper
              sectionTitle={"Monthly Revenue"}
              sectionContent={<MonthlyRevenue />}
            ></SectionWrapper>
            <SectionWrapper
              sectionTitle={"Pending Order"}
              sectionContent={<OrderToComplete orders={orders} />}
            ></SectionWrapper>
          </div>
          <div className="grid grid-cols-2 md:gap-5 gap-2">
            <SectionWrapper
              sectionTitle={"Total Order"}
              sectionContent={<TotalOrders orders={orders} />}
            ></SectionWrapper>
            <SectionWrapper
              sectionTitle={"Need To Restock"}
              sectionContent={
                <AlmostEmptyIngredients ingredients={ingredients} />
              }
            ></SectionWrapper>
          </div>
        </div>
        <div className="flex flex-row h-fit overflow-x-auto md:gap-5 gap-2 p-1 scrollbar-hidden"></div>
      </div>
    </div>
  );
};
export default OverviewPage;
