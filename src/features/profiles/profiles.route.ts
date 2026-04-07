import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { ProfileController } from ".//profiles.controller";
import { ProfileService } from "./profiles.service";

const router = Router();
const profileService = new ProfileService();
const profileRouter = new ProfileController(profileService);

router.get("/me", requireAuth, profileRouter.getMe);

router.get("/accounts", requireAuth, profileRouter.getAccountByUserId);

export default router;
