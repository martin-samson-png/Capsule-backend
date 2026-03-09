import { Router } from "express";
import profileRouter from "../features/profiles/profiles.route";
import transactionRouter from "../features/transactions/transactions.route";
import goalRouter from "../features/goals/goals.route";

export const router = Router();

router.use("/profile", profileRouter);

router.use("/transaction", transactionRouter);

router.use("/goal", goalRouter);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
