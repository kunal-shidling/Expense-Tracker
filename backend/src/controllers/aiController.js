// import { GoogleGenerativeAI } from "@google/generative-ai";
// import nano from "nano";
// import dotenv from "dotenv";

// dotenv.config();

// const couch = nano(process.env.COUCHDB_URL);
// const expensesDb = couch.db.use("expenses");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const predictExpense = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     console.log("Fetching expenses for user:", userId);

//     const result = await expensesDb.find({
//       selector: { userId },
//       sort: [{ date: "desc" }],
//       limit: 50,
//     });

//     const expenses = result.docs;
//     console.log("Found expenses:", expenses.length);

//     if (expenses.length === 0) {
//       return res.status(400).json({ 
//         error: "No expense history found. Add some expenses first to get predictions." 
//       });
//     }

//     const expenseData = expenses.map(exp => ({
//       amount: exp.amount,
//       category: exp.category,
//       date: exp.date,
//     }));

//     const prompt = `Based on the following expense history, predict the likely expenses for the next month. 
//     Provide predictions by category with estimated amounts.
    
//     Expense History:
//     ${JSON.stringify(expenseData, null, 2)}
    
//     Please respond ONLY with a valid JSON object in this exact format:
//     {
//       "predictions": [
//         {"category": "Food", "amount": 500, "confidence": "high"}
//       ],
//       "totalPredicted": 700,
//       "insights": "Brief analysis"
//     }`;

//     console.log("Calling Gemini API...");

//     // Try gemini-1.5-flash (without -latest)
//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-1.5-flash"
//     });
    
//     const result2 = await model.generateContent(prompt);
//     const response = result2.response;
//     const aiResponse = response.text();
    
//     console.log("AI Response received");
    
//     let prediction;
//     try {
//       const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
//       if (jsonMatch) {
//         prediction = JSON.parse(jsonMatch[0]);
//       } else {
//         prediction = JSON.parse(aiResponse);
//       }
//     } catch (parseError) {
//       prediction = {
//         predictions: [],
//         totalPredicted: 0,
//         insights: aiResponse,
//         note: "Raw AI response"
//       };
//     }

//     res.json(prediction);
//   } catch (error) {
//     console.error("Error predicting expenses:", error.message);
//     res.status(500).json({ 
//       error: "Failed to generate prediction",
//       details: error.message 
//     });
//   }
// };

import nano from "nano";
import dotenv from "dotenv";

dotenv.config();

const couch = nano(process.env.COUCHDB_URL);
const expensesDb = couch.db.use("expenses");

export const predictExpense = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log("Fetching expenses for user:", userId);

    const result = await expensesDb.find({
      selector: { userId },
      sort: [{ date: "desc" }],
      limit: 50,
    });

    const expenses = result.docs;
    console.log("Found expenses:", expenses.length);

    if (expenses.length === 0) {
      return res.status(400).json({ 
        error: "No expense history found. Add some expenses first to get predictions." 
      });
    }

    // Calculate predictions based on historical data
    const categoryTotals = {};
    const categoryCount = {};

    expenses.forEach(expense => {
      const cat = expense.category || "Uncategorized";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + expense.amount;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    // Generate predictions based on averages
    const predictions = Object.keys(categoryTotals).map(category => {
      const avgAmount = Math.round(categoryTotals[category] / categoryCount[category]);
      const predictedAmount = Math.round(avgAmount * 1.1); // Predict 10% increase
      
      return {
        category,
        amount: predictedAmount,
        confidence: categoryCount[category] > 5 ? "high" : categoryCount[category] > 2 ? "medium" : "low"
      };
    });

    const totalPredicted = predictions.reduce((sum, pred) => sum + pred.amount, 0);

    const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    const prediction = {
      predictions,
      totalPredicted,
      insights: `Based on your spending history of ${expenses.length} transactions, your highest expense category is ${topCategory} (₹${Math.round(categoryTotals[topCategory])}). We predict similar patterns next month with a slight increase of 10% across categories.`
    };

    console.log("Prediction generated successfully");
    res.json(prediction);

  } catch (error) {
    console.error("Error predicting expenses:", error.message);
    res.status(500).json({ 
      error: "Failed to generate prediction",
      details: error.message 
    });
  }
};