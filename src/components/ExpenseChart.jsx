import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFinance } from "../context/FinanceContext";
import { cardStyle } from "../utils/theme";

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];

const ExpenseChart = () => {
  const { transactions } = useFinance();

  const categoryMap = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + t.amount;
    });

  const data = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  return (
    <div className={`${cardStyle} p-6 h-[320px]`}>
      <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={90} label>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;