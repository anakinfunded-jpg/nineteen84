"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  FilePenLine,
  Languages,
  CreditCard,
  LogOut,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { label: "Nadzorna plošča", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Chat", href: "/ai-chat", icon: MessageSquare },
  { label: "AI Besedila", href: "/ai-besedila", icon: FileText },
  { label: "AI Grafika", href: "/ai-grafika", icon: ImageIcon },
  { label: "AI Dokumenti", href: "/ai-dokumenti", icon: FilePenLine },
  { label: "AI Prevajalnik", href: "/ai-prevajalnik", icon: Languages },
  { label: "Naročnina", href: "/narocnina", icon: CreditCard },
];

export function AppSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Uporabnik";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-64 h-screen flex flex-col bg-[#191919] border-r border-white/[0.06] shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
        <Link
          href="/dashboard"
          className="text-2xl font-serif tracking-[0.01em] logo-gradient"
        >
          1984
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-200 ${
                    isActive
                      ? "bg-white/[0.06] text-white"
                      : "text-[#E1E1E1]/50 hover:text-[#E1E1E1] hover:bg-white/[0.03]"
                  }`}
                >
                  <item.icon
                    className={`w-[18px] h-[18px] shrink-0 ${
                      isActive ? "text-[#FEB089]" : ""
                    }`}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full cta-gradient flex items-center justify-center text-xs font-bold text-[#171717] shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{displayName}</p>
            <p className="text-xs text-[#E1E1E1]/30 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Odjava"
            className="p-1.5 rounded-lg text-[#E1E1E1]/30 hover:text-[#E1E1E1]/70 hover:bg-white/[0.04] transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
