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
  Eye,
  Volume2,
  Paintbrush,
  Replace,
  Brain,
  ArrowRightLeft,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

type NavItem = { label: string; href: string; icon: LucideIcon };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "Besedila",
    items: [
      { label: "AI Chat", href: "/ai-chat", icon: MessageSquare },
      { label: "AI Besedila", href: "/ai-besedila", icon: FileText },
      { label: "AI Dokumenti", href: "/ai-dokumenti", icon: FilePenLine },
      { label: "AI Prevajalnik", href: "/ai-prevajalnik", icon: Languages },
    ],
  },
  {
    title: "Grafika",
    items: [
      { label: "AI Grafika", href: "/ai-grafika", icon: ImageIcon },
      { label: "AI Inpainting", href: "/ai-inpainting", icon: Paintbrush },
      { label: "Najdi in spremeni", href: "/ai-zamenjava", icon: Replace },
    ],
  },
  {
    title: "Zvok",
    items: [
      { label: "AI Zvok", href: "/ai-zvok", icon: Volume2 },
    ],
  },
  {
    title: "Analiza",
    items: [
      { label: "Računalniški vid", href: "/ai-vid", icon: Eye },
      { label: "AI Spomin", href: "/ai-spomin", icon: Brain },
    ],
  },
  {
    title: "Orodja",
    items: [
      { label: "Pretvorniki", href: "/pretvorniki", icon: ArrowRightLeft },
    ],
  },
  {
    title: "Račun",
    items: [
      { label: "Nadzorna plošča", href: "/dashboard", icon: LayoutDashboard },
      { label: "Naročnina", href: "/narocnina", icon: CreditCard },
    ],
  },
];

export function AppSidebar({ user, isAffiliate = false }: { user: User; isAffiliate?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  // Conditionally add Partnerji group for affiliates
  const allGroups = isAffiliate
    ? [
        ...navGroups.slice(0, -1), // all except Račun
        {
          title: "Partnerji",
          items: [
            { label: "Partnerska plošča", href: "/partnerji", icon: Handshake },
          ],
        },
        navGroups[navGroups.length - 1], // Račun
      ]
    : navGroups;

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
      <nav className="flex-1 py-3 px-3 overflow-y-auto">
        {allGroups.map((group) => (
          <div key={group.title} className="mb-3">
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#E1E1E1]/25">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors duration-200 ${
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
          </div>
        ))}
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
