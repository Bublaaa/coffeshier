import { useLocation } from "react-router-dom";

const SideBarLink = ({ label, icon: Icon, href, isCollapsed }) => {
  const location = useLocation();

  const isActive = location.pathname === href;

  return (
    <li className="flex flex-row w-full items-center justify-between">
      <a
        href={href}
        className={`flex items-center py-2 pl-2 rounded-lg ${
          isActive
            ? "text-accent hover:text-accent-hover"
            : "text-gray-500 hover:text-gray-900"
        } group`}
      >
        <Icon
          className={`w-5 h-5 transition duration-75  ${
            isCollapsed ? "mr-5" : ""
          }`}
        />
        {!isCollapsed && (
          <span className="ms-3 text-sm font-medium">{label}</span>
        )}
      </a>

      {!isCollapsed && isActive && (
        <div className="w-1 h-6 bg-accent rounded-lg"></div>
      )}
    </li>
  );
};

export default SideBarLink;
