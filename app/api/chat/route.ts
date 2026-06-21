import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase-server";
import type { ChatMessage } from "@/types/database";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { widgetToken, messages, conversationId, visitorId } = body as {
      widgetToken: string;
      messages: ChatMessage[];
      conversationId?: string;
      visitorId?: string;
    };

    if (!widgetToken || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "widgetToken et messages[] sont requis" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("widget_token", widgetToken)
      .eq("is_active", true)
      .single();

    if (agentError || !agent) {
      return NextResponse.json({ error: "Agent introuvable ou inactif" }, { status: 404 });
    }

    let convoId = conversationId;
    if (!convoId) {
      const { data: newConvo, error: convoError } = await supabase
        .from("conversations")
        .insert({
          agent_id: agent.id,
          organization_id: agent.organization_id,
          visitor_id: visitorId || null,
        })
        .select("id")
        .single();

      if (convoError || !newConvo) {
        return NextResponse.json({ error: "Erreur de création de conversation" }, { status: 500 });
      }
      convoId = newConvo.id;
    }

    const lastUserMessage = messages[messages.length - 1];
    await supabase.from("messages").insert({
      conversation_id: convoId,
      role: "user",
      content: lastUserMessage.content,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: agent.system_prompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const replyText =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    const needsEscalation = /conseiller|humain|transférer|escalad/i.test(replyText);
    if (needsEscalation) {
      await supabase
        .from("conversations")
        .update({ status: "escalated" })
        .eq("id", convoId);
    }

    await supabase.from("messages").insert({
      conversation_id: convoId,
      role: "assistant",
      content: replyText,
    });

    return NextResponse.json({
      reply: replyText,
      conversationId: convoId,
      escalated: needsEscalation,
    });
  } catch (err) {
    console.error("Erreur /api/chat:", err);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
