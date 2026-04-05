import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFinance } from "../context/FinanceContext";

const BalanceChart = () => {
  const { transactions } = useFinance();

  // Group by date
  const dataMap = {};

  transactions.forEach((t) => {
    const date = t.date;

    if (!dataMap[date]) {
      dataMap[date] = 0;
    }

    dataMap[date] += t.type === "income" ? t.amount : -t.amount;
  });

  const data = Object.keys(dataMap).map((date) => ({
    date,
    balance: dataMap[date],
  }));

  return (
    <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg h-[320px]">
      <h2 className="text-xl font-semibold mb-4">Balance Trend</h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#4f46e5"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;