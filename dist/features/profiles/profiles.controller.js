import { AppError } from "../../error/AppError.js";
import { toCamelCase } from "../../utils/formatters.js";
export class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    getMe = async (req, res, next) => {
        try {
            const userId = req.userId;
            const accessToken = req.accessToken;
            if (!userId || !accessToken) {
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            }
            const me = await this.profileService.getProfileByUserId(userId, accessToken);
            const response = toCamelCase(me);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    };
    getAccountByUserId = async (req, res, next) => {
        try {
            const userId = req.userId;
            const accessToken = req.accessToken;
            if (!userId || !accessToken) {
                return next(AppError.unauthorized("Utilisateur non authentifié"));
            }
            const accounts = await this.profileService.getAccountByUserId(userId, accessToken);
            const response = toCamelCase(accounts);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    };
}
//# sourceMappingURL=profiles.controller.js.map