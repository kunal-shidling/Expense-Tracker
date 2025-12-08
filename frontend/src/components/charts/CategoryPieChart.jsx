import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart({ data }) {
  const labels = Object.keys(data);
  const amounts = Object.values(data);

  return (
    <div style={{ width: "350px", margin: "auto" }}>
      <h3>Category-wise Breakdown</h3>
      <Pie
        data={{
          labels,
          datasets: [
            {
              label: "Expenses",
              data: amounts,
              backgroundColor: [
                "#ff6384",
                "#36a2eb",
                "#ffcd56",
                "#4bc0c0",
                "#9966ff",
                "#ff9f40",
              ],
            },
          ],
        }}
      />
    </div>
  );
}
