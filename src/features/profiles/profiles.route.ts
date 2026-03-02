import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { ProfileController } from ".//profiles.controller";
import { ProfileService } from "./profiles.service";

const router = Router();
const profileService = new ProfileService();
const profileRouter = new ProfileController(profileService);

router.get("/me", requireAuth, profileRouter.getMe);

export default router;
