import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useFinance } from "../context/FinanceContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { pageStyle, cardStyle } from "../utils/theme";

const InsightsPage = () => {
  const { transactions, darkMode } = useFinance();
  const [range, setRange] = useState("all");

  const today = new Date();

  const filtered = transactions.filter((t) => {
    const txDate = new Date(t.date);

    if (range === "7") {
      const last7 = new Date();
      last7.setDate(today.getDate() - 7);
      return txDate >= last7;
    }

    if (range === "30") {
      const last30 = new Date();
      last30.setDate(today.getDate() - 30);
      return txDate >= last30;
    }

    return true;
  });

  const income = filtered.filter((t) => t.type === "income");
  const expense = filtered.filter((t) => t.type === "expense");

  const totalIncome = income.reduce((a, b) => a + b.amount, 0);
  const totalExpense = expense.reduce((a, b) => a + b.amount, 0);

  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome
    ? ((savings / totalIncome) * 100).toFixed(0)
    : 0;

  const categoryMap = {};
  expense.forEach((t) => {
    categoryMap[t.category] =
      (categoryMap[t.category] || 0) + t.amount;
  });

  const topCategory = Object.entries(categoryMap).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const monthlyMap = {};

  transactions.forEach((t) => {
    const month = t.date.slice(0, 7);

    if (!monthlyMap[month]) {
      monthlyMap[month] = { income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyMap[month].income += t.amount;
    } else {
      monthlyMap[month].expense += t.amount;
    }
  });

  const chartData = Object.keys(monthlyMap).map((m) => ({
    month: m,
    income: monthlyMap[m].income,
    expense: monthlyMap[m].expense,
  }));

  return (
    <div className={`flex min-h-screen ${darkMode
        ? "bg-gray-900 text-white"
        : "bg-gradient-to-br from-indigo-100 via-white to-purple-100 text-gray-900"
      }`}>
      <Sidebar />

      <div className="flex-1 p-6">
        <Header />

        <div className="flex gap-3 mb-6">
          {["all", "7", "30"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg ${range === r
                  ? "bg-indigo-500 text-white "
                  : " bg-gray-700 text-white"
                }`}
            >
              {r === "all" ? "All" : `${r} Days`}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`${cardStyle} p-4`}>
            <h3>Top Spending Category</h3>
            <p className="text-xl font-bold">{topCategory?.[0]}</p>
            <p>₹{topCategory?.[1]} spent</p>
          </div>

          <div className={`${cardStyle} p-4`}>
            <h3>Savings Rate</h3>
            <p className="text-xl font-bold">{savingsRate}%</p>
          </div>

          <div className={`${cardStyle} p-4`}>
            <h3>Net Savings</h3>
            <p className="text-xl font-bold">₹{savings}</p>
          </div>
        </div>

        <div className={`${cardStyle} mt-8 h-[320px] p-6`}>
          <h3 className="mb-4">Monthly Comparison</h3>

          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type = "monotone" dataKey="income" stroke="#22c55e" strokeWidth={3}/>
              <Line type = "monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;