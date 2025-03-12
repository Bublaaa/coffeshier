import React, { useState, useEffect } from "react";
import SideBarLink from "./SideBarLink.jsx";
import * as LucideIcons from "lucide-react";

const Sidebar = ({ links }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1024);
    };
    handleResize(); // Set initial state based on width
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`md:m-5 m-2 relative top-0 left-0 transition-all ease-in-out duration-300 bg-white rounded-xl ${
        isCollapsed ? "w-fit" : "w-full sm:w-fit  md:max-w-md"
      }`}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between p-3 md:p-4">
        <a href="/" className="flex w-fit items-center space-x-3">
          <img src="../public/Logo.svg" className="h-10" alt="Flowbite Logo" />
          {!isCollapsed && (
            <h3 className="font-semibold hidden lg:block">Puch Coffee</h3>
          )}
        </a>
        {/* Toggle button hidden on small screens */}
        <button
          type="button"
          className="md:block hidden absolute -right-5 top-1/2 transform -translate-y-1/2 p-2 text-sm text-white bg-accent rounded-full hover:bg-accent-hover focus:outline-none focus:ring-4 focus:ring-accent/40 cursor-pointer"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Toggle sidebar</span>
          {isCollapsed ? <LucideIcons.ArrowRight /> : <LucideIcons.ArrowLeft />}
        </button>
      </div>
      <div className="h-full pl-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {links.map(({ label, icon, href }) => {
            const IconComponent = LucideIcons[icon] || LucideIcons.Menu;
            return (
              <SideBarLink
                key={label}
                label={label}
                icon={IconComponent}
                href={href}
                isCollapsed={isCollapsed}
              />
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
