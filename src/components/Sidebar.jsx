import { Link, useLocation } from "react-router-dom";
import { FiHome, FiList, FiBarChart2 } from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();

  const items = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Transactions", path: "/transactions", icon: <FiList /> },
    { name: "Insights", path: "/insights", icon: <FiBarChart2 /> },
  ];

  return (
    <div className="w-64 min-h-screen p-6 bg-white/70 dark:bg-white/10 backdrop-blur-lg">

      <h2 className="text-xl font-bold mb-6 dark:text-white">
        Finance UI
      </h2>

      {items.map((item) => {
        const active = location.pathname === item.path;

        return (
          <Link key={item.path} to={item.path}>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition ${
                active
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {item.icon}
              {item.name}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;