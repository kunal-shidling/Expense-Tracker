import express from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth, addCategory);
router.get("/", auth, getCategories);
router.patch("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

export default router;