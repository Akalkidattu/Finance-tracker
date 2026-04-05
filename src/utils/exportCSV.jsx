export const exportToCSV = (transactions) => {
  if (!transactions.length) return;

  const headers = ["Date", "Description", "Category", "Type", "Amount"];

  const rows = transactions.map((t) => [
    t.date,
    t.description,
    t.category,
    t.type,
    t.amount,
  ]);

  const csv =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((r) => r.join(",")).join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = "transactions.csv";
  link.click();
};