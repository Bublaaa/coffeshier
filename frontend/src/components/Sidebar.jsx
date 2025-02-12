import React, { useState } from "react";
import SideBarLink from "./SideBarLink.jsx";
import { Home, Utensils, ArrowLeft, ArrowRight } from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      id="cta-button-sidebar"
      className={`m-5 relative top-0 left-0 transition-transform bg-white rounded-xl ${
        isCollapsed ? "w-fit" : "w-1/6"
      }`}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between p-4">
        <a
          href="/"
          className="flex w-fit items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          {!isCollapsed && <h1 className="text-2xl font-semibold">Flowbite</h1>}
        </a>
        <button
          type="button"
          className="absolute -right-5 top-1/2 transform -translate-y-1/2 p-2 text-sm text-white bg-accent rounded-full  hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-gray-200"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Toggle sidebar</span>
          {isCollapsed ? <ArrowRight /> : <ArrowLeft />}
        </button>
      </div>
      <div className="h-full pl-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          <SideBarLink
            label={"Menu"}
            icon={Utensils}
            href={"/menu"}
            isCollapsed={isCollapsed}
          />
          <SideBarLink
            label={"Profile"}
            icon={Home}
            href={"/profile"}
            isCollapsed={isCollapsed}
          />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
