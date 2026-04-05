import { useFinance } from "../context/FinanceContext";
import { FiMoon, FiSun } from "react-icons/fi";

const Header = () => {
  const { role, setRole, darkMode, setDarkMode } = useFinance();

  return (
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Finance Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Smart financial insights at a glance
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-indigo-100 dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 rounded-lg border dark:bg-gray-800 dark:text-white"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

      </div>
    </div>
  );
};

export default Header;