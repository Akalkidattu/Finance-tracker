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
    if (editData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        type: editData.type,
        description: editData.description || "",
        category: editData.category || "",
        amount: editData.amount || "",
        date: editData.date || "",
      });
    } else {
      setForm({
        type: "expense",
        description: "",
        category: "",
        amount: "",
        date: new Date().toISOString().split('T')[0], // Today's date
      });
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.description.trim() || !form.category.trim() || !form.amount || !form.date) {
      alert("Please fill all fields");
      return;
    }

    if (editData) {
      setTransactions(
        transactions.map((t) =>
          t.id === editData.id 
            ? { ...form, id: t.id, amount: Number(form.amount) }
            : t
        )
      );
    } else {
      addTransaction({ 
        ...form, 
        id: Date.now(), 
        amount: Number(form.amount),
        description: form.description.trim(),
        category: form.category.trim()
      });
    }

    onClose();
  };

  if (!isOpen) return null;

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

          <input
            className={inputStyle}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          
          <input
            className={inputStyle}
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          
          <input
            className={inputStyle}
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          
          <input
            className={inputStyle}
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <div className="flex gap-3">
            <button type="submit" className={`flex-1 ${buttonPrimary}`}>
              Save
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className={`flex-1 ${buttonSecondary}`}
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