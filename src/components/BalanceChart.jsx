import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFinance } from "../context/FinanceContext";
import { cardStyle } from "../utils/theme";

const BalanceChart = () => {
  const { transactions, darkMode } = useFinance();

  const dataMap = {};

  transactions.forEach((t) => {
    if (!dataMap[t.date]) dataMap[t.date] = 0;
    dataMap[t.date] += t.type === "income" ? t.amount : -t.amount;
  });

  let runningBalance = 0;

  const data = Object.keys(dataMap)
    .sort()
    .map((date) => {
      // eslint-disable-next-line react-hooks/immutability
      runningBalance += dataMap[date];
      return { date, balance: runningBalance };
    });

  return (
    <div className={`${cardStyle} p-6 h-[320px]`}>
      <h2 className="text-xl font-semibold mb-4">Balance Trend</h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke={darkMode ? "#111010" : "#020918"} />
          <YAxis stroke={darkMode ? "#111010" : "#020918"} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#1f2937" : "#ffffff",
              border: "none",
              borderRadius: "10px",
            }}
          />
          <Line dataKey="balance" stroke="#4f46e5" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;