"use client";

import { useState, useRef, useEffect } from "react";

interface ChatWidgetProps {
  widgetToken: string;
  agentName: string;
  shopName: string;
  welcomeMessage: string;
  primaryColor: string;
}

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

export default function ChatWidget({
  widgetToken,
  agentName,
  shopName,
  welcomeMessage,
  primaryColor,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { id: "0", role: "assistant", content: welcomeMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);

  const visitorIdRef = useRef<string>(
    typeof window !== "undefined"
      ? sessionStorage.getItem("visitor_id") ||
        (() => {
          const id = `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          sessionStorage.setItem("visitor_id", id);
          return id;
        })()
      : ""
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: DisplayMessage = { id: Date.now().toString(), role: "user", content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const apiMessages = updated.map(({ role, content }) => ({ role, content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetToken,
          messages: apiMessages,
          conversationId,
          visitorId: visitorIdRef.current,
        }),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      const data = await res.json();
      if (data.conversationId) setConversationId(data.conversationId);
      if (data.escalated) setEscalated(true);

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "⚠️ Erreur de connexion. Réessayez dans un instant.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div
        className="p-4 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, #96C93D)` }}
      >
        <div className="w-11 h-11 bg-white/25 rounded-full flex items-center justify-center text-xl">
          🤖
        </div>
        <div>
          <div className="text-white font-bold text-sm">{agentName}</div>
          <div className="text-white/85 text-xs">Support {shopName} · 24h/24</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-[320px]">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                m.role === "user"
                  ? "text-white rounded-br-sm"
                  : m.error
                    ? "bg-red-50 text-red-600 rounded-bl-sm"
                    : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
              }`}
              style={m.role === "user" ? { background: primaryColor } : {}}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}

        {escalated && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs text-center rounded-xl p-3">
            👤 Un conseiller humain va vous rejoindre sous peu.
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-gray-100 flex gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send(input);
          }}
          placeholder="Écrivez votre message..."
          disabled={loading}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          style={{ background: primaryColor }}
          className="w-10 h-10 rounded-full text-white flex items-center justify-center disabled:opacity-40 flex-shrink-0"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
