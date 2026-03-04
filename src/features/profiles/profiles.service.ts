import { createSupabaseUserClient } from "../../config/supabase";
import { AppError } from "../../error/AppError";

export class ProfileService {
  getProfileByUserId = async (userId: string, accessToken: string) => {
    const supabaseUser = createSupabaseUserClient(accessToken);

    const { data, error } = await supabaseUser
      .from("profiles")
      .select("id, display_name, avatar_url, theme")
      .eq("id", userId)
      .single();

    if (error)
      throw AppError.internalServer(
        "Erreur lors de la récupération des données",
      );

    if (!data) throw AppError.notFound("Données introuvable");

    return data;
  };

  async getAccountByUserId(userId: string, accessToken: string) {
    const supabaseUser = createSupabaseUserClient(accessToken);

    const { data, error } = await supabaseUser
      .from("accounts")
      .select("type, balance_cents")
      .eq("user_id", userId);

    if (error)
      throw AppError.internalServer(
        "Erreur lors de la récupération des données",
      );

    if (!data?.length) throw AppError.notFound("Données introuvable");

    const mainAccount = data.find((a) => a.type === "main");
    const savingAccount = data.find((a) => a.type === "savings");
    const totalAccount =
      (mainAccount?.balance_cents ?? 0) + (savingAccount?.balance_cents ?? 0);

    return { mainAccount, savingAccount, totalAccount };
  }

  async getMe(userId: string, accessToken: string) {
    const profile = await this.getProfileByUserId(userId, accessToken);
    const accounts = await this.getAccountByUserId(userId, accessToken);

    return {
      profile,
      accounts: {
        main: accounts.mainAccount?.balance_cents,
        savings: accounts.savingAccount?.balance_cents,
        total: accounts.totalAccount,
      },
    };
  }
}
