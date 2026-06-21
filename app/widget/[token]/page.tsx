import { createAdminClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ChatWidget from "@/components/dashboard/ChatWidget";

export default async function WidgetPage({ params }: { params: { token: string } }) {
  const supabase = createAdminClient();

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("widget_token", params.token)
    .eq("is_active", true)
    .single();

  if (!agent) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-4">
      <ChatWidget
        widgetToken={agent.widget_token}
        agentName={agent.name}
        shopName={agent.shop_name}
        welcomeMessage={agent.welcome_message}
        primaryColor={agent.primary_color}
      />
    </div>
  );
}
