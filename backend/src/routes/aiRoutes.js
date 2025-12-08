// import express from "express";
// import { predictExpense } from "../controllers/aiController.js";
// import { auth } from "../middlewares/auth.js"; // Changed from default import

// const router = express.Router();

// router.post("/predict", auth, predictExpense);

// export default router;
import express from "express";
import auth from "../middlewares/auth.js";  // ✔ CORRECT default import
import { predictExpense } from "../controllers/aiController.js";

const router = express.Router();

router.post("/predict", auth, predictExpense);

export default router;
