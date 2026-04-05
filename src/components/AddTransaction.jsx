import { useState, useEffect } from "react";
import { useFinance } from "../context/FinanceContext";
import { cardStyle, inputStyle, buttonPrimary, buttonSecondary } from "../utils/theme";

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
  }, [editData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editData) {
      setTransactions(
        transactions.map((t) =>
          t.id === editData.id ? { ...form, id: t.id, amount: Number(form.amount) } : t
        )
      );
    } else {
      addTransaction({ ...form, amount: Number(form.amount) });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className={`${cardStyle} p-6 w-full max-w-md`}>
        <h2 className="text-lg font-semibold mb-4">
          {editData ? "Edit Transaction" : "Add Transaction"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputStyle}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input className={inputStyle} placeholder="Description" />
          <input className={inputStyle} placeholder="Category" />
          <input className={inputStyle} type="number" placeholder="Amount" />
          <input className={inputStyle} type="date" />

          <div className="flex gap-3">
            <button type="submit" className={`flex-1 ${buttonPrimary}`}>
              Save
            </button>
            <button type="button" onClick={onClose} className={`flex-1 ${buttonSecondary}`}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;