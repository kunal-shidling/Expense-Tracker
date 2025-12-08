import { useEffect, useState } from "react";
import { get } from "../components/api/apiClient";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [summary, setSummary] = useState({
    total: 0,
    last7days: 0,
    avgWeek: 0,
  });

  const load = async () => {
    const data = await get("/expenses");
    setExpenses(data);

    calculateSummary(data);
    calculateCategoryTotals(data);
    calculateMonthlyTotals(data);
  };

  const calculateSummary = (list) => {
    const total = list.reduce((sum, e) => sum + Number(e.amount), 0);

    // last 7 days
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const last7 = list
      .filter((e) => new Date(e.createdAt).getTime() >= weekAgo)
      .reduce((s, e) => s + Number(e.amount), 0);

    setSummary({
      total,
      last7days: last7,
      avgWeek: Math.round(total / 4),
    });
  };

  const calculateCategoryTotals = (list) => {
    const totals = {};
    list.forEach((e) => {
      if (!totals[e.category]) totals[e.category] = 0;
      totals[e.category] += Number(e.amount);
    });
    setCategoryTotals(totals);
  };

  const calculateMonthlyTotals = (list) => {
    const months = {};
    list.forEach((e) => {
      const date = new Date(e.createdAt);
      const label = date.toLocaleString("default", { month: "short" });

      if (!months[label]) months[label] = 0;
      months[label] += Number(e.amount);
    });

    setMonthlyTotals(months);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Summary */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
      }}>
        <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
          <h3>Total Spent</h3>
          <p>₹{summary.total}</p>
        </div>

        <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
          <h3>Last 7 Days</h3>
          <p>₹{summary.last7days}</p>
        </div>

        <div style={{ padding: 20, background: "#eee", borderRadius: 10 }}>
          <h3>Avg Weekly Spend</h3>
          <p>₹{summary.avgWeek}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <CategoryPieChart data={categoryTotals} />
        <MonthlyBarChart monthlyTotals={monthlyTotals} />
      </div>
    </div>
  );
}
