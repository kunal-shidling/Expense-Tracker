import nano from "nano";
import dotenv from "dotenv";

dotenv.config();

const couch = nano(process.env.COUCHDB_URL);
const categoriesDb = couch.db.use("categories");
const expensesDb = couch.db.use("expenses");

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Check if category already exists
    const existingResult = await categoriesDb.find({
      selector: { userId, name },
    });

    if (existingResult.docs.length > 0) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = {
      userId,
      name,
      createdAt: new Date().toISOString(),
    };

    const response = await categoriesDb.insert(category);

    res.status(201).json({
      message: "Category created successfully",
      category: { ...category, _id: response.id },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await categoriesDb.find({
      selector: { userId },
      sort: [{ createdAt: "desc" }],
    });

    // 🔥 Get expense count for each category
    const expensesResult = await expensesDb.find({
      selector: { userId },
    });

    const categoriesWithCount = result.docs.map((cat) => {
      const expenseCount = expensesResult.docs.filter(
        (exp) => exp.category === cat.name
      ).length;

      return {
        ...cat,
        expenseCount,
      };
    });

    res.json(categoriesWithCount);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name: newName } = req.body;
    const userId = req.user.userId;

    if (!newName) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Get old category
    const oldCategory = await categoriesDb.get(id);
    
    if (oldCategory.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const oldName = oldCategory.name;

    // Check if new name already exists
    const existingResult = await categoriesDb.find({
      selector: { userId, name: newName },
    });

    if (existingResult.docs.length > 0 && existingResult.docs[0]._id !== id) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    // Update category
    const updated = await categoriesDb.insert({
      ...oldCategory,
      name: newName,
      updatedAt: new Date().toISOString(),
    });

    // 🔥 CASCADE UPDATE: Update all expenses with this category
    const expensesResult = await expensesDb.find({
      selector: { userId, category: oldName },
    });

    console.log(`Cascading update: ${expensesResult.docs.length} expenses found with category "${oldName}"`);

    // Update each expense
    const updatePromises = expensesResult.docs.map((expense) =>
      expensesDb.insert({
        ...expense,
        category: newName,
        updatedAt: new Date().toISOString(),
      })
    );

    await Promise.all(updatePromises);

    res.json({
      message: "Category updated successfully",
      category: { ...oldCategory, name: newName, _id: id, _rev: updated.rev },
      expensesUpdated: expensesResult.docs.length,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const category = await categoriesDb.get(id);

    if (category.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 🔥 CHECK CASCADE: Check if category is used in expenses
    const expensesResult = await expensesDb.find({
      selector: { userId, category: category.name },
    });

    if (expensesResult.docs.length > 0) {
      return res.status(400).json({
        error: `Cannot delete category "${category.name}". It is used in ${expensesResult.docs.length} expense(s). Please reassign or delete those expenses first.`,
        expenseCount: expensesResult.docs.length,
      });
    }

    // Delete category
    await categoriesDb.destroy(id, category._rev);

    res.json({ 
      message: "Category deleted successfully",
      category: category.name 
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};