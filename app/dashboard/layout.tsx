import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organizations(name)")
    .eq("id", user!.id)
    .single();

  const orgName = (profile as any)?.organizations?.name || "Mon organisation";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar orgName={orgName} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
