import React from "react";
import SideBarLink from "./SideBarLink.jsx";
import { Home, Utensils } from "lucide-react";

const Sidebar = () => {
  return (
    <>
      <div
        id="cta-button-sidebar"
        className="relative top-0 left-0 w-96 h-full transition-transform -translate-x-full sm:translate-x-0 bg-white rounded-xl"
        aria-label="Sidebar"
      >
        <div className="h-full rounded-xl px-3 py-4 overflow-y-auto bg-white shadow-lg">
          <h2>Cart</h2>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
