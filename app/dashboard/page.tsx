"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
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
    welcome_message: "Bonjour 👋 Comment puis-je vous aider ?",
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
      welcome_message: "Bonjour 👋 Comment puis-je vous aider ?",
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
