// import { useState } from "react";
// import { post } from "../components/api/apiClient";

// export default function Predict() {
//   const [result, setResult] = useState("");

//   const predict = async () => {
//     const res = await post("/ai/predict", {});
//     setResult(res.message);
//   };

//   return (
//     <div>
//       <h2>AI Prediction</h2>
//       <button onClick={predict}>Predict Spending</button>
//       <p>{result}</p>
//     </div>
//   );
// }
import { useState } from "react";
import { post } from "../components/api/apiClient";
import "../styles/Predict.css";

function Predict() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predict = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await post("/ai/predict", {});
      setPrediction(data);
    } catch (err) {
      setError(err.message || "Failed to generate prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-container">
      <h2>AI Expense Prediction</h2>
      
      <button 
        className="predict-button" 
        onClick={predict}
        disabled={loading}
      >
        {loading ? "Generating Prediction..." : "Generate Prediction"}
      </button>

      {error && <div className="error-message">{error}</div>}

      {prediction && (
        <div className="prediction-results">
          <div className="prediction-summary">
            <h3>Predicted Total for Next Month</h3>
            <div className="total-amount">₹{prediction.totalPredicted}</div>
          </div>

          <div className="predictions-list">
            <h3>Category-wise Predictions</h3>
            {prediction.predictions.map((pred, index) => (
              <div key={index} className="prediction-item">
                <div className="prediction-category">{pred.category}</div>
                <div className="prediction-amount">₹{pred.amount}</div>
                <div className={`prediction-confidence ${pred.confidence}`}>
                  {pred.confidence} confidence
                </div>
              </div>
            ))}
          </div>

          <div className="prediction-insights">
            <h3>Insights</h3>
            <p>{prediction.insights}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Predict;