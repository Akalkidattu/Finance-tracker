import { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";

const AddTransaction = ({ isOpen, onClose, editData }) => {
  const { addTransaction, setTransactions, transactions } = useFinance();

  const [form, setForm] = useState({
    type: "expense",
    description: "",
    category: "",
    amount: "",
    date: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (editData) setForm(editData);
    else {
      setForm({
        type: "expense",
        description: "",
        category: "",
        amount: "",
        date: "",
      });
    }
  }, [editData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editData) {
      const updated = transactions.map((t) =>
        t.id === editData.id ? { ...form, id: t.id } : t
      );
      setTransactions(updated);
    } else {
      addTransaction({ ...form, amount: Number(form.amount) });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md animate-scaleIn shadow-xl">

        <h2 className="text-lg font-semibold mb-4">
          {editData ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            className="w-full border px-3 py-2 rounded-lg"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-500 text-white py-2 rounded-lg"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-lg"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddTransaction;