export const getTotalIncome = (transactions) =>
  transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

export const getTotalExpense = (transactions) =>
  transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

export const getBalance = (transactions) =>
  getTotalIncome(transactions) - getTotalExpense(transactions);