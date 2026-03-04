import { Router } from "express";
import profileRouter from "../features/profiles/profiles.route";
import transactionRouter from "../features/transactions/transactions.route";

export const router = Router();

router.use("/profile", profileRouter);

router.use("/transaction", transactionRouter);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
