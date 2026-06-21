"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Bot, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export default function Sidebar({ orgName }: { orgName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const links = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
    { href: "/dashboard/agents", label: "Mes agents", icon: Bot },
    { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="font-bold text-lg">
          <span className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">
            AgenceIA
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1 truncate">{orgName}</div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-brand/15 text-brand"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition w-full"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
