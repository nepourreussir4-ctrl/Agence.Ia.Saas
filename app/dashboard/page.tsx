import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Bot, MessageSquare, TrendingUp, Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user!.id)
    .single();

  const orgId = profile?.organization_id;

  const { data: agents } = await supabase
    .from("agents")
    .select("id")
    .eq("organization_id", orgId);

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, satisfaction")
    .eq("organization_id", orgId);

  const totalAgents = agents?.length || 0;
  const totalConversations = conversations?.length || 0;
  const positiveCount = conversations?.filter((c) => c.satisfaction === "positive").length || 0;
  const satisfactionRate =
    totalConversations > 0 ? Math.round((positiveCount / totalConversations) * 100) : 0;

  const stats = [
    { label: "Agents actifs", value: totalAgents, icon: Bot },
    { label: "Conversations totales", value: totalConversations, icon: MessageSquare },
    { label: "Taux de satisfaction", value: `${satisfactionRate}%`, icon: TrendingUp },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
          <p className="text-gray-500 text-sm mt-1">
            Suivi de tes agents IA et de leurs performances.
          </p>
        </div>
        <Link
          href="/dashboard/agents"
          className="flex items-center gap-2 bg-gradient-to-r from-brand to-brand-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} />
          Nouvel agent
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
                <Icon size={18} className="text-brand" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {totalAgents === 0 && (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
          <Bot size={32} className="text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Aucun agent encore créé</h3>
          <p className="text-gray-500 text-sm mb-5">
            Crée ton premier agent IA pour commencer à automatiser le support client.
          </p>
          <Link
            href="/dashboard/agents"
            className="inline-block bg-gradient-to-r from-brand to-brand-light text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Créer mon premier agent
          </Link>
        </div>
      )}
    </div>
  );
}
