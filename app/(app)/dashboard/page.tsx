import { createClient } from "@/lib/supabase/server";
import { InviteFriends } from "@/components/dashboard/invite-friends";
import {
  MessageSquare,
  FileText,
  Image as ImageIcon,
  FilePenLine,
  Languages,
  Headphones,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { allPrompts } from "@/lib/prompts/prompt-library";

const tools = [
  {
    title: "AI Chat",
    desc: "Pogovarjajte se z AI v slovenščini",
    icon: MessageSquare,
    href: "/ai-chat",
  },
  {
    title: "AI Besedila",
    desc: "Ustvarite marketinška besedila",
    icon: FileText,
    href: "/ai-besedila",
  },
  {
    title: "AI Grafika",
    desc: "Generirajte profesionalne slike",
    icon: ImageIcon,
    href: "/ai-grafika",
  },
  {
    title: "AI Dokumenti",
    desc: "Urejajte in izboljšajte dokumente",
    icon: FilePenLine,
    href: "/ai-dokumenti",
  },
  {
    title: "AI Prevajalnik",
    desc: "Prevajajte med 6 jeziki",
    icon: Languages,
    href: "/ai-prevajalnik",
  },
  {
    title: "AI Zvok",
    desc: "Pretvorite besedilo v govor",
    icon: Headphones,
    href: "/ai-zvok",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Uporabnik";

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Dobrodošli nazaj, {displayName}
        </h1>
        <p className="mt-1 text-sm text-[#E1E1E1]/50">
          Vaša nadzorna plošča za ustvarjanje vsebin z AI
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Besede ta mesec", value: "0 / 20.000" },
          { label: "Generirane slike", value: "0 / 200" },
          { label: "AI pogovori", value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-xl p-5"
          >
            <p className="text-xs text-[#E1E1E1]/40 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Orodja</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="glass-card group rounded-xl p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(254,176,137,0.06)] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center mb-4 group-hover:bg-white/[0.06] transition-colors duration-300">
                <tool.icon className="w-5 h-5 text-[#FEB089]" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                {tool.title}
              </h3>
              <p className="mt-1 text-xs text-[#E1E1E1]/40">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Prompt Library Teaser */}
      <div className="mt-10">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#FEB089]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Knjižnica predlog
              </h2>
              <p className="text-xs text-[#E1E1E1]/40">
                {allPrompts.length}+ pripravljenih predlog za vse priložnosti
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {allPrompts
              .filter((_, i) => [3, 15, 42].includes(i))
              .map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                >
                  <p className="text-xs font-medium text-white mb-1">
                    {prompt.title}
                  </p>
                  <p className="text-xs text-[#E1E1E1]/40 line-clamp-2">
                    {prompt.prompt}
                  </p>
                </div>
              ))}
          </div>

          <Link
            href="/predloge"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#FEB089] hover:text-[#FEB089]/80 transition-colors duration-200"
          >
            Poglej vse predloge
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Invite Friends */}
      <InviteFriends />
    </div>
  );
}
