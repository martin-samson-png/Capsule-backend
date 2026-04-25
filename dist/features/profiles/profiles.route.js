import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { ProfileController } from ".//profiles.controller.js";
import { ProfileService } from "./profiles.service.js";
const router = Router();
const profileService = new ProfileService();
const profileRouter = new ProfileController(profileService);
router.get("/me", requireAuth, profileRouter.getMe);
router.get("/accounts", requireAuth, profileRouter.getAccountByUserId);
export default router;
//# sourceMappingURL=profiles.route.js.map