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
  CartesianGrid,
  Legend,
} from "recharts";
import { useMemo, useState } from "react";
import { cardStyle } from "../utils/theme";

const InsightsPage = () => {
  const { transactions, darkMode } = useFinance();
  const [range, setRange] = useState("all");

  const parseLocalDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return null;

    const normalized = dateStr.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      const [year, month, day] = normalized.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    const fallback = new Date(normalized);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  };

  const startOfDay = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const filtered = useMemo(() => {
    const today = startOfDay(new Date());

    return transactions.filter((t) => {
      const txDate = parseLocalDate(t.date);
      if (!txDate) return false;

      const txDay = startOfDay(txDate);

      if (range === "7") {
        const last7 = new Date(today);
        last7.setDate(today.getDate() - 6);
        return txDay >= last7 && txDay <= today;
      }

      if (range === "30") {
        const last30 = new Date(today);
        last30.setDate(today.getDate() - 29);
        return txDay >= last30 && txDay <= today;
      }

      return true;
    });
  }, [transactions, range]);

  const income = filtered.filter((t) => t.type === "income");
  const expense = filtered.filter((t) => t.type === "expense");

  const totalIncome = income.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalExpense = expense.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome
    ? Math.round((savings / totalIncome) * 100)
    : 0;

  const categoryMap = {};
  expense.forEach((t) => {
    const category = t.category || "Other";
    categoryMap[category] =
      (categoryMap[category] || 0) + Number(t.amount || 0);
  });

  const topCategory =
    Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || null;

  const monthlyMap = {};

  filtered.forEach((t) => {
    const date = parseLocalDate(t.date);
    if (!date) return;

    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = {
        monthKey,
        label: date.toLocaleString("en-IN", {
          month: "short",
          year: "2-digit",
        }),
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

  const chartData = Object.values(monthlyMap).sort((a, b) =>
    a.monthKey.localeCompare(b.monthKey)
  );

  return (
    <div
      className={`flex min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 via-white to-purple-100 text-gray-900"
      }`}
    >
      <Sidebar />

      <div className="flex-1 p-6">
        <Header />

        <div className="flex gap-3 mb-6">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`${cardStyle} p-5`}>
            <h3 className="text-sm opacity-70">Top Spending Category</h3>
            <p className="text-xl font-bold">{topCategory?.[0] || "N/A"}</p>
            <p>{formatCurrency(topCategory?.[1] || 0)} spent</p>
          </div>

          <div className={`${cardStyle} p-5`}>
            <h3 className="text-sm opacity-70">Savings Rate</h3>
            <p className="text-xl font-bold">{savingsRate}%</p>
          </div>

          <div className={`${cardStyle} p-5`}>
            <h3 className="text-sm opacity-70">Net Savings</h3>
            <p className="text-xl font-bold">{formatCurrency(savings)}</p>
          </div>
        </div>

        <div className={`${cardStyle} mt-8 h-[340px] p-6`}>
          <h3 className="mb-4 font-semibold">Monthly Comparison</h3>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: darkMode ? "#d1d5db" : "#374151", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: darkMode ? "#d1d5db" : "#374151", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(value),
                    name === "income" ? "Income" : "Expense",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="income"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="expense"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[85%] flex items-center justify-center text-sm opacity-70">
              No transaction data available for the selected range.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;