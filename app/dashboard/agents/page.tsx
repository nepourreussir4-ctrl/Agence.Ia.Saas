"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import type { Agent } from "@/types/database";
import { Plus, Copy, Check, Trash2, ExternalLink, X, Pencil } from "lucide-react";

const DEFAULT_PROMPT = `Tu es {agentName}, l'assistante support client IA de {shopName}.
Tu es chaleureuse, efficace, professionnelle.

POLITIQUE DE LA BOUTIQUE :
- Retours acceptés sous 30 jours, produit non ouvert
- Livraison standard : 3 à 5 jours ouvrés
- Remboursements traités sous 5 à 7 jours ouvrés

TES RÈGLES :
- Sois concise (2-3 phrases max)
- Pour toute commande : demande le numéro de commande
- Si problème complexe : propose de transférer à un humain
- Ne promets jamais ce que tu ne peux pas garantir`;

export default function AgentsPage() {
  const supabase = createClient();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "Aria",
    shop_name: "",
    welcome_message: "Bonjour ! Comment puis-je vous aider ?",
    primary_color: "#00B09B",
    system_prompt: "",
  });

  const loadAgents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false });
    setAgents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const resetForm = () => {
    setForm({
      name: "Aria",
      shop_name: "",
      welcome_message: "Bonjour ! Comment puis-je vous aider ?",
      primary_color: "#00B09B",
      system_prompt: "",
    });
    setEditingAgent(null);
    setShowForm(false);
  };

  const openEdit = (agent: Agent) => {
    setForm({
      name: agent.name,
      shop_name: agent.shop_name,
      welcome_message: agent.welcome_message,
      primary_color: agent.primary_color,
      system_prompt: agent.system_prompt,
    });
    setEditingAgent(agent);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const prompt =
      form.system_prompt ||
      DEFAULT_PROMPT
        .replace("{agentName}", form.name)
        .replace("{shopName}", form.shop_name);

    if (editingAgent) {
      await supabase
        .from("agents")
        .update({
          name: form.name,
          shop_name: form.shop_name,
          welcome_message: form.welcome_message,
          primary_color: form.primary_color,
          system_prompt: prompt,
        })
        .eq("id", editingAgent.id);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user!.id)
        .single();

      await supabase.from("agents").insert({
        organization_id: profile!.organization_id,
        name: form.name,
        shop_name: form.shop_name,
        welcome_message: form.welcome_message,
        primary_color: form.primary_color,
        system_prompt: prompt,
      });
    }

    setSaving(false);
    resetForm();
    loadAgents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet agent ?")) return;
    await supabase.from("agents").delete().eq("id", id);
    loadAgents();
  };

  const toggleActive = async (agent: Agent) => {
    await supabase
      .from("agents")
      .update({ is_active: !agent.is_active })
      .eq("id", agent.id);
    loadAgents();
  };

  const copyWidgetLink = (token: string, id: string) => {
    const url = `${window.location.origin}/widget/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mes agents</h1>
          <p className="text-gray-500 text-sm mt-1">
            Cree et gere les agents IA de tes clients.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-brand to-brand-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} />
          Nouvel agent
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Chargement...</p>
      ) : agents.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500 text-sm">
          Aucun agent. Cree le premier avec le bouton ci-dessus.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                    style={{ background: agent.primary_color }}
                  >
                    AI
                  </div>
                  <div>
                    <div className="font-semibold">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.shop_name}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(agent)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    agent.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {agent.is_active ? "Actif" : "Inactif"}
                </button>
              </div>

              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => openEdit(agent)}
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  <Pencil size={14} />
                  Modifier
                </button>
                <button
                  onClick={() => copyWidgetLink(agent.widget_token, agent.id)}
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  {copiedId === agent.id ? <Check size={14} /> : <Copy size={14} />}
                  {copiedId === agent.id ? "Copie !" : "Copier lien"}
                </button>
                <a
                  href={`/widget/${agent.widget_token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  <ExternalLink size={14} />
                  Tester
                </a>
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="flex items-center border border-gray-300 text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingAgent ? "Modifier l'agent" : "Nouvel agent"}
              </h2>
              <button onClick={resetForm}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Prenom de l'agent</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Nom de la boutique</label>
                <input
                  required
                  value={form.shop_name}
                  onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Message d'accueil</label>
                <input
                  required
                  value={form.welcome_message}
                  onChange={(e) => setForm({ ...form, welcome_message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Couleur principale</label>
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                  className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Instructions de l'agent (System Prompt)
                </label>
                <textarea
                  value={form.system_prompt}
                  onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
                  rows={8}
                  placeholder="Decris le comportement de l'agent..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Laisse vide pour le template par defaut.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-brand to-brand-light text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {saving ? "Sauvegarde..." : editingAgent ? "Sauvegarder" : "Creer l'agent"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
          }
