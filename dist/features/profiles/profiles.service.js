import { createSupabaseUserClient } from "../../config/supabase.js";
import { AppError } from "../../error/AppError.js";
export class ProfileService {
    getProfileByUserId = async (userId, accessToken) => {
        const supabaseUser = createSupabaseUserClient(accessToken);
        const { data, error } = await supabaseUser
            .from("profiles")
            .select("id, display_name, avatar_url, theme")
            .eq("id", userId)
            .single();
        if (error)
            throw AppError.internalServer("Erreur lors de la récupération des données");
        if (!data)
            throw AppError.notFound("Données introuvable");
        return data;
    };
    async getAccountByUserId(userId, accessToken) {
        const supabaseUser = createSupabaseUserClient(accessToken);
        const { data, error } = await supabaseUser
            .from("accounts")
            .select("id, type, balance_cents")
            .eq("user_id", userId);
        if (error)
            throw AppError.internalServer("Erreur lors de la récupération des données");
        if (!data?.length)
            throw AppError.notFound("Données introuvable");
        return data;
    }
}
//# sourceMappingURL=profiles.service.js.map