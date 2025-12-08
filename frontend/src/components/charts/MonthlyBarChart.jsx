import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MonthlyBarChart({ monthlyTotals }) {
  const months = Object.keys(monthlyTotals);
  const amounts = Object.values(monthlyTotals);

  return (
    <div style={{ width: "600px", margin: "auto" }}>
      <h3>Monthly Spending Trend</h3>
      <Bar
        data={{
          labels: months,
          datasets: [
            {
              label: "Monthly Expenses",
              data: amounts,
              backgroundColor: "#36a2eb",
            },
          ],
        }}
      />
    </div>
  );
}
