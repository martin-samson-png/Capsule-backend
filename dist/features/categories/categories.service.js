import { createSupabaseUserClient } from "../../config/supabase.js";
import { AppError } from "../../error/AppError.js";
export class CategoriesService {
    async create(input) {
        const supabaseUser = createSupabaseUserClient(input.accessToken);
        const { data, error } = await supabaseUser
            .from("categories")
            .insert({
            user_id: input.userId,
            label: input.label,
            icon: input.icon ?? null,
            color: input.color,
        })
            .select("id, label, icon, color, created_at")
            .single();
        if (error)
            throw AppError.internalServer("Erreur lors de l'insertion des données");
        if (!data)
            throw AppError.internalServer("Catégorie créée mais resultat absent");
        return data;
    }
    async getByUserId(userId, accessToken) {
        const supabaseUser = createSupabaseUserClient(accessToken);
        const { data, error } = await supabaseUser
            .from("categories")
            .select("id, label, icon, color, created_at")
            .eq("user_id", userId);
        if (error)
            throw AppError.internalServer("Erreur lors de la récuperation des objectifs");
        return { data: data ?? [] };
    }
    async update(input) {
        const supabaseUser = createSupabaseUserClient(input.accessToken);
        const patch = {};
        if (Object.hasOwn(input, "label"))
            patch.label = input.label;
        if (Object.hasOwn(input, "color"))
            patch.color = input.color;
        if (Object.hasOwn(input, "icon"))
            patch.icon = input.icon;
        if (Object.keys(patch).length === 0)
            throw AppError.badRequest("Aucun champ à mettre à jour");
        const { data, error } = await supabaseUser
            .from("categories")
            .update(patch)
            .eq("id", input.categoryId)
            .eq("user_id", input.userId)
            .select("id, label, icon, color")
            .maybeSingle();
        if (error)
            throw AppError.internalServer("Erreur lors de la mise à jour des données");
        if (!data)
            throw AppError.internalServer("Catégorie introuvable");
        return data;
    }
    async delete(userId, accessToken, categoryId) {
        const supabaseUser = createSupabaseUserClient(accessToken);
        const { data, error } = await supabaseUser
            .from("categories")
            .delete()
            .eq("id", categoryId)
            .eq("user_id", userId)
            .select()
            .maybeSingle();
        if (error)
            throw AppError.internalServer("Erreur lors de la suppression des données");
        if (!data)
            throw AppError.internalServer("Catégorie introuvable");
        return { ok: true };
    }
}
//# sourceMappingURL=categories.service.js.map