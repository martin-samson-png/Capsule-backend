import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { ProfileController } from ".//profiles.controller.js";
import { ProfileService } from "./profiles.service.js";

const router = Router();
const profileService = new ProfileService();
const profileController = new ProfileController(profileService);

router.get(
  "/me",
  requireAuth,
  (req: Request, res: Response, next: NextFunction) =>
    profileController.getMe(req, res, next),
);

router.get(
  "/accounts",
  requireAuth,
  (req: Request, res: Response, next: NextFunction) =>
    profileController.getAccountByUserId(req, res, next),
);

export default router;
