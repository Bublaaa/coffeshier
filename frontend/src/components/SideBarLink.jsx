import { NavLink, useLocation } from "react-router-dom";

const SideBarLink = ({ label, icon: Icon, href, isCollapsed }) => {
  const location = useLocation();

  return (
    <li className="flex flex-row w-full items-center justify-between">
      <NavLink
        to={href}
        className={({ isActive }) =>
          `flex items-center py-2 pl-2 rounded-lg transition-colors duration-200 ${
            isActive
              ? "text-accent hover:text-accent-hover"
              : "text-gray-500 hover:text-gray-900"
          } group`
        }
      >
        <Icon className="w-5 h-5 transition duration-75 mr-3" />
        {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
      </NavLink>

      {!isCollapsed && location.pathname === href && (
        <div className="w-1 h-6 bg-accent rounded-lg"></div>
      )}
    </li>
  );
};

export default SideBarLink;
