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
import { cardStyle } from "../utils/theme";

const InsightsPage = () => {
  const { transactions, darkMode } = useFinance();
  const [range, setRange] = useState("all");

  const today = new Date();

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;

    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;

    const [year, month, day] = parts.map(Number);
    if (!year || !month || !day) return null;

    const parsed = new Date(year, month - 1, day);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const normalizeDate = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const filtered = transactions.filter((t) => {
    const txDate = parseLocalDate(t.date);
    if (!txDate) return false;

    const normalizedTxDate = normalizeDate(txDate);

    if (range === "7") {
      const last7 = new Date();
      last7.setDate(today.getDate() - 7);
      return normalizedTxDate >= normalizeDate(last7);
    }

    if (range === "30") {
      const last30 = new Date();
      last30.setDate(today.getDate() - 30);
      return normalizedTxDate >= normalizeDate(last30);
    }

    return true;
  });

  const income = filtered.filter((t) => t.type === "income");
  const expense = filtered.filter((t) => t.type === "expense");

  const totalIncome = income.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalExpense = expense.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome
    ? ((savings / totalIncome) * 100).toFixed(0)
    : 0;

  const categoryMap = {};

  expense.forEach((t) => {
    categoryMap[t.category] =
      (categoryMap[t.category] || 0) + Number(t.amount || 0);
  });

  const topCategory = Object.entries(categoryMap).sort(
    (a, b) => b[1] - a[1]
  )[0];

  let chartData = [];

  if (range === "all") {
    const monthlyMap = {};

    filtered.forEach((t) => {
      const date = parseLocalDate(t.date);
      if (!date) return;

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          label: monthKey,
          income: 0,
          expense: 0,
        };
      }

      const amount = Number(t.amount || 0);

      if (t.type === "income") {
        monthlyMap[monthKey].income += amount;
      } else if (t.type === "expense") {
        monthlyMap[monthKey].expense += amount;
      }
    });

    chartData = Object.entries(monthlyMap)
      .map(([month, values]) => ({
        month,
        label: month.slice(5),
        income: values.income,
        expense: values.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  } else {
    const dailyMap = {};

    filtered.forEach((t) => {
      const date = parseLocalDate(t.date);
      if (!date) return;

      const dayKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          label: String(date.getDate()).padStart(2, "0"),
          income: 0,
          expense: 0,
        };
      }

      const amount = Number(t.amount || 0);

      if (t.type === "income") {
        dailyMap[dayKey].income += amount;
      } else if (t.type === "expense") {
        dailyMap[dayKey].expense += amount;
      }
    });

    chartData = Object.entries(dailyMap)
      .map(([day, values]) => ({
        day,
        label: values.label,
        income: values.income,
        expense: values.expense,
      }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 via-white to-purple-100 text-gray-900"
      }`}
    >
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 min-w-0 p-4 pt-16 sm:p-6">
          <Header />

          <div className="flex flex-wrap gap-3 mb-6">
            {["all", "7", "30"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-lg transition ${
                  range === r
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {r === "all" ? "All" : `${r} Days`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`${cardStyle} p-5`}>
              <h3 className="text-sm opacity-70">Top Spending Category</h3>
              <p className="text-xl font-bold break-words">
                {topCategory?.[0] || "N/A"}
              </p>
              <p>₹{topCategory?.[1] || 0}</p>
            </div>

            <div className={`${cardStyle} p-5`}>
              <h3 className="text-sm opacity-70">Savings Rate</h3>
              <p className="text-xl font-bold">{savingsRate}%</p>
            </div>

            <div className={`${cardStyle} p-5`}>
              <h3 className="text-sm opacity-70">Net Savings</h3>
              <p className="text-xl font-bold break-words">₹{savings}</p>
            </div>
          </div>

          <div className={`${cardStyle} mt-8 p-4 sm:p-6`}>
            <h3 className="mb-4 font-semibold">
              {range === "all" ? "Monthly Comparison" : "Daily Comparison"}
            </h3>

            <div className="w-full h-[280px] sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;