import { Router } from "express";
import profileRouter from "../features/profiles/profiles.route";
import transactionRouter from "../features/transactions/transactions.route";
import goalRouter from "../features/goals/goals.route";
import categoryRouter from "../features/categories/categories.routes";

export const router = Router();

router.use("/profile", profileRouter);

router.use("/transaction", transactionRouter);

router.use("/goal", goalRouter);

router.use("/category", categoryRouter);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
