import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TransactionsTable from "../components/TransactionsTable";
import AddTransaction from "../components/AddTransaction";
import { useFinance } from "../context/FinanceContext";
import { useState } from "react";
import { exportToCSV } from "../utils/exportCSV";

const TransactionsPage = () => {
  const { role, transactions, darkMode } = useFinance();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 via-white to-purple-100 text-gray-900"
      }`}
    >
      <Sidebar />

      <div className="flex-1 p-4 pt-16 md:p-6">
        <Header />

        <div className="flex flex-wrap gap-3 justify-end mb-4">
          <button
            onClick={() => exportToCSV(transactions)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Export CSV
          </button>

          {role === "admin" && (
            <button
              onClick={() => setOpen(true)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
            >
              Add
            </button>
          )}
        </div>

        <AddTransaction isOpen={open} onClose={() => setOpen(false)} />

        <TransactionsTable />
      </div>
    </div>
  );
};

export default TransactionsPage;