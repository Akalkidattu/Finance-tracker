import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { GiPayMoney, GiPiggyBank } from "react-icons/gi";

const SummaryCard = ({ title, value, type }) => {
  const styles = {
    income: "from-green-400 to-green-600",
    expense: "from-red-400 to-red-600",
    balance: "from-blue-400 to-indigo-600",
    savings: "from-purple-400 to-pink-600",
  };

  const icons = {
    balance: <GiPayMoney size={22} />,
    income: <FiTrendingUp size={22} />,
    expense: <FiTrendingDown size={22} />,
    savings: <GiPiggyBank size={22} />,
  };

  return (
    <div
      className={`p-6 rounded-2xl text-white shadow-lg bg-gradient-to-r ${styles[type]} hover:scale-105 transition`}
    >
      <div className="flex justify-between items-center">
        <p>{title}</p>
        {icons[type]}
      </div>

      <h2 className="text-2xl font-bold mt-4">₹{value}</h2>
    </div>
  );
};

export default SummaryCard;