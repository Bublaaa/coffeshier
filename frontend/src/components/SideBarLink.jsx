import { useLocation } from "react-router-dom";

const SideBarLink = ({ label, icon: Icon, href }) => {
  // Get current location (current route)
  const location = useLocation();

  // Check if the current href matches the current location.pathname
  const isActive = location.pathname === href;

  return (
    <li>
      <a
        href={href}
        className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white ${
          isActive
            ? "bg-gray-100 dark:bg-gray-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        } group`}
      >
        <Icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        <span className="ms-3">{label}</span>
      </a>
    </li>
  );
};

export default SideBarLink;
