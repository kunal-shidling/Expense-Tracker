import nano from "nano";
import dotenv from "dotenv";

dotenv.config();

const couch = nano(process.env.COUCHDB_URL);
const expensesDb = couch.db.use("expenses");

export const addExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const userId = req.user.userId;

    if (!amount || !category) {
      return res.status(400).json({ error: "Amount and category are required" });
    }

    const expense = {
      userId,
      amount: parseFloat(amount),
      category,
      description: description || "",
      date: date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const response = await expensesDb.insert(expense);
    res.status(201).json({ id: response.id, ...expense });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Failed to add expense" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await expensesDb.find({
      selector: { userId },
      sort: [{ date: "desc" }],
    });

    res.json(result.docs);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    const userId = req.user.userId;

    // Get the existing document
    const doc = await expensesDb.get(id);

    // Verify ownership
    if (doc.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update fields
    const updatedDoc = {
      ...doc,
      amount: amount !== undefined ? parseFloat(amount) : doc.amount,
      category: category || doc.category,
      description: description !== undefined ? description : doc.description,
      date: date || doc.date,
      updatedAt: new Date().toISOString(),
    };

    const response = await expensesDb.insert(updatedDoc);
    res.json({ id: response.id, ...updatedDoc });
  } catch (error) {
    console.error("Error updating expense:", error);
    if (error.statusCode === 404) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(500).json({ error: "Failed to update expense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Get the document to verify ownership
    const doc = await expensesDb.get(id);

    if (doc.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await expensesDb.destroy(id, doc._rev);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    if (error.statusCode === 404) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(500).json({ error: "Failed to delete expense" });
  }
};