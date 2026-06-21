import { createClient } from "@/lib/supabase-server";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(*)")
    .eq("id", user!.id)
    .single();

  const org = (profile as any)?.organizations;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Paramètres</h1>
      <p className="text-gray-500 text-sm mb-8">Informations de ton organisation et de ton compte.</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg space-y-4">
        <div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
            Organisation
          </div>
          <div className="text-sm font-medium">{org?.name}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
            Plan
          </div>
          <div className="text-sm font-medium capitalize">{org?.plan}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
            Email du compte
          </div>
          <div className="text-sm font-medium">{profile?.email}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
            Rôle
          </div>
          <div className="text-sm font-medium capitalize">{profile?.role}</div>
        </div>
      </div>
    </div>
  );
}
