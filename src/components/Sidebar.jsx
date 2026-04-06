import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiList, FiBarChart2, FiMenu, FiX } from "react-icons/fi";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const items = [
    { name: "Dashboard", path: "/", icon: <FiHome size={18} /> },
    { name: "Transactions", path: "/transactions", icon: <FiList size={18} /> },
    { name: "Insights", path: "/insights", icon: <FiBarChart2 size={18} /> },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-lg shadow-lg"
        aria-label="Open menu"
      >
        <FiMenu size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 z-50 h-screen w-64 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        bg-white/90 dark:bg-gray-900 backdrop-blur-lg
        text-gray-800 dark:text-white
        shadow-lg md:shadow-none`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Finance UI</h2>

            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close menu"
            >
              <FiX size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {items.map((item) => {
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    active
                      ? "bg-indigo-500 text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;