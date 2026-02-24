import { Router } from "express";
import profileRouter from "./profiles.route";

export const router = Router();

router.use("/profile", profileRouter);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
