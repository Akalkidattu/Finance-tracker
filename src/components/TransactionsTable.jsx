import { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import AddTransaction from "./AddTransaction";

const TransactionsTable = () => {
  const { transactions, deleteTransaction, role } = useFinance();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);

  const filtered = transactions.filter((t) =>
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card text-gray-800 dark:text-white">

      <input
        placeholder="Search category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
      />

      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-3">Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {filtered.length > 0 ? (
            filtered.map((t) => (
              <tr
                key={t.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="py-3">{t.date}</td>
                <td>{t.description || t.category}</td>
                <td>{t.category}</td>
                <td className="capitalize">{t.type}</td>
                <td>₹{t.amount}</td>

                {role === "admin" && (
                  <td className="flex gap-2 py-2">

                    <button
                      onClick={() => setEditData(t)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteId(t.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>

                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-400">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <AddTransaction
        isOpen={!!editData}
        editData={editData}
        onClose={() => setEditData(null)}
      />

      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[999]">

          <div className="card text-center animate-scaleIn">

            <p className="mb-4">Delete this transaction?</p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  deleteTransaction(deleteId);
                  setDeleteId(null);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Yes, Delete!
              </button>

              <button
                onClick={() => setDeleteId(null)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;