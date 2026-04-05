import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SummaryCard from "../components/SummaryCard";
import BalanceChart from "../components/BalanceChart";
import ExpenseChart from "../components/ExpenseChart";
import { useFinance } from "../context/FinanceContext";
import {
  getTotalIncome,
  getTotalExpense,
  getBalance,
} from "../utils/calculations";

const Dashboard = () => {
  const { transactions } = useFinance();

  const income = getTotalIncome(transactions);
  const expense = getTotalExpense(transactions);
  const balance = getBalance(transactions);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-200 via-white to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <Sidebar />

      <div className="flex-1 p-6">
        <Header />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Balance" value={balance} type="balance" />
          <SummaryCard title="Income" value={income} type="income" />
          <SummaryCard title="Expense" value={expense} type="expense" />
          <SummaryCard title="Savings" value={balance} type="savings" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <BalanceChart />
          <ExpenseChart />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;