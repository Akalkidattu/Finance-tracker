import { createContext, useContext, useEffect, useState } from "react";
import { mockTransactions } from "../data/mockData";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("transactions")) ?? mockTransactions;
  } catch {
    return mockTransactions;
  }
});

  const [role, setRole] = useState("viewer");

  const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem("darkMode");
  return saved ? JSON.parse(saved) : false;
});

useEffect(() => {
  const root = document.documentElement;

  if (darkMode) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem("darkMode", JSON.stringify(darkMode));
}, [darkMode]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (data) => {
    setTransactions((prev) => [
      ...prev,
      { id: Date.now(), ...data },
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        setTransactions,
        addTransaction,
        deleteTransaction,
        role,
        setRole,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFinance = () => useContext(FinanceContext);