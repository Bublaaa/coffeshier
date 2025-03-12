import { NavLink, useLocation } from "react-router-dom";

const SideBarLink = ({ label, icon: Icon, href, isCollapsed }) => {
  const location = useLocation();

  return (
    <li className="flex flex-row w-full items-center justify-between hover:bg-gray-100 rounded-l-lg">
      <NavLink
        to={href}
        className={({ isActive }) =>
          `flex w-full items-center py-2 pl-2 transition-colors duration-200 ${
            isActive
              ? "text-accent hover:text-accent-hover"
              : "text-gray-500 hover:text-gray-900"
          } group`
        }
      >
        <Icon className="w-5 h-5  group-hover:scale-110 transition duration-75 mr-3" />
        {!isCollapsed && <h6 className=" text-sm font-medium">{label}</h6>}
      </NavLink>

      {!isCollapsed && location.pathname === href && (
        <div className="w-1 h-6 bg-accent rounded-lg"></div>
      )}
    </li>
  );
};

export default SideBarLink;
