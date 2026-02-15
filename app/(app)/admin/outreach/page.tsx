"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  Users,
  Mail,
  Plus,
  Upload,
  Send,
  Loader2,
  BarChart3,
  Eye,
  MousePointer,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";

// ─── Types ───

type Contact = {
  id: string;
  email: string;
  name: string;
  company: string;
  tags: string[];
  unsubscribed: boolean;
  created_at: string;
};

type Campaign = {
  id: string;
  name: string;
  subject: string;
  template_id: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  stats: { total: number; sent: number; opened: number; clicked: number };
  created_at: string;
};

const TEMPLATES = [
  { id: "uvodni", name: "Uvodni email" },
  { id: "sledilni", name: "Sledilni email" },
  { id: "posebna-ponudba", name: "Posebna ponudba" },
];

type Tab = "contacts" | "campaigns";

// ─── Helpers ───

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function pct(n: number, total: number) {
  if (total === 0) return "0";
  return ((n / total) * 100).toFixed(1);
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-[#E1E1E1]/10 text-[#E1E1E1]/50 border-white/10",
    scheduled: "bg-[#FEB089]/10 text-[#FEB089] border-[#FEB089]/20",
    sending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    sent: "bg-green-500/10 text-green-400 border-green-500/20",
    paused: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  };
  const labels: Record<string, string> = {
    draft: "Osnutek",
    scheduled: "Načrtovano",
    sending: "Pošiljanje",
    sent: "Poslano",
    paused: "Zaustavljeno",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.draft}`}
    >
      {labels[status] || status}
    </span>
  );
}

// ─── Page ───

export default function OutreachPage() {
  const [tab, setTab] = useState<Tab>("contacts");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Contact form
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactTags, setContactTags] = useState("");
  const [addingContact, setAddingContact] = useState(false);

  // Campaign form
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [campName, setCampName] = useState("");
  const [campSubject, setCampSubject] = useState("");
  const [campTemplate, setCampTemplate] = useState("uvodni");
  const [campSchedule, setCampSchedule] = useState("");
  const [campTags, setCampTags] = useState("");
  const [addingCampaign, setAddingCampaign] = useState(false);

  // CSV import
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [contactsRes, campaignsRes] = await Promise.all([
      fetch("/api/outreach/contacts"),
      fetch("/api/outreach/campaigns"),
    ]);
    if (contactsRes.ok) setContacts(await contactsRes.json());
    if (campaignsRes.ok) setCampaigns(await campaignsRes.json());
    setLoading(false);
  }

  async function handleAddContact(e: FormEvent) {
    e.preventDefault();
    setAddingContact(true);

    const res = await fetch("/api/outreach/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: contactEmail,
        name: contactName,
        company: contactCompany,
        tags: contactTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });

    if (res.ok) {
      setContactEmail("");
      setContactName("");
      setContactCompany("");
      setContactTags("");
      setShowAddContact(false);
      loadData();
    }
    setAddingContact(false);
  }

  async function handleCSVImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult("");

    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    const header = lines[0].toLowerCase();

    // Detect CSV columns
    const hasHeader =
      header.includes("email") ||
      header.includes("ime") ||
      header.includes("name");
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const contacts = dataLines.map((line) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim().replace(/^"|"$/g, ""));
      return {
        email: parts[0] || "",
        name: parts[1] || "",
        company: parts[2] || "",
      };
    }).filter((c) => c.email && c.email.includes("@"));

    if (contacts.length === 0) {
      setImportResult("Ni veljavnih kontaktov v datoteki.");
      setImporting(false);
      return;
    }

    const res = await fetch("/api/outreach/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contacts),
    });

    if (res.ok) {
      const data = await res.json();
      setImportResult(`Uvoženih ${data.imported} kontaktov.`);
      loadData();
    } else {
      setImportResult("Napaka pri uvozu.");
    }
    setImporting(false);
    // Reset file input
    e.target.value = "";
  }

  async function handleAddCampaign(e: FormEvent) {
    e.preventDefault();
    setAddingCampaign(true);

    const res = await fetch("/api/outreach/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: campName,
        subject: campSubject,
        templateId: campTemplate,
        scheduledAt: campSchedule
          ? new Date(campSchedule).toISOString()
          : undefined,
        tagFilter: campTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });

    if (res.ok) {
      setCampName("");
      setCampSubject("");
      setCampTemplate("uvodni");
      setCampSchedule("");
      setCampTags("");
      setShowAddCampaign(false);
      loadData();
    }
    setAddingCampaign(false);
  }

  // Stats
  const activeContacts = contacts.filter((c) => !c.unsubscribed).length;
  const totalSent = campaigns.reduce((s, c) => s + c.stats.sent, 0);
  const totalOpened = campaigns.reduce((s, c) => s + c.stats.opened, 0);
  const totalClicked = campaigns.reduce((s, c) => s + c.stats.clicked, 0);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#E1E1E1]/30" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-white">Email Outreach</h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Upravljajte kontakte, kampanje in spremljajte statistiko
      </p>

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Aktivni kontakti", value: activeContacts },
          { icon: Send, label: "Poslano", value: totalSent },
          { icon: Eye, label: "Odprtih", value: totalOpened },
          { icon: MousePointer, label: "Klikov", value: totalClicked },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-[#FEB089]" />
              <span className="text-xs text-[#E1E1E1]/40">{stat.label}</span>
            </div>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 border-b border-white/[0.06]">
        {(["contacts", "campaigns"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${
              tab === t
                ? "border-[#FEB089] text-white"
                : "border-transparent text-[#E1E1E1]/40 hover:text-[#E1E1E1]/70"
            }`}
          >
            {t === "contacts" ? "Kontakti" : "Kampanje"}
          </button>
        ))}
      </div>

      {/* ─── Contacts Tab ─── */}
      {tab === "contacts" && (
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowAddContact(!showAddContact)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cta-button"
            >
              <Plus className="w-4 h-4" />
              Dodaj kontakt
            </button>

            <label className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1]/70 hover:text-[#E1E1E1] hover:bg-white/[0.08] transition-colors duration-200 cursor-pointer">
              {importing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Uvozi CSV
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleCSVImport}
                className="hidden"
              />
            </label>

            {importResult && (
              <span className="text-sm text-green-400">{importResult}</span>
            )}
          </div>

          {/* Add contact form */}
          {showAddContact && (
            <form
              onSubmit={handleAddContact}
              className="glass-card rounded-xl p-5 mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
            >
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email *"
                required
                className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50"
              />
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ime"
                className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50"
              />
              <input
                type="text"
                value={contactCompany}
                onChange={(e) => setContactCompany(e.target.value)}
                placeholder="Podjetje"
                className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50"
              />
              <input
                type="text"
                value={contactTags}
                onChange={(e) => setContactTags(e.target.value)}
                placeholder="Oznake (ločene z vejico)"
                className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50"
              />
              <button
                type="submit"
                disabled={addingContact}
                className="cta-button py-2 rounded-lg font-medium text-sm disabled:opacity-50"
              >
                {addingContact ? "Dodajam..." : "Dodaj"}
              </button>
            </form>
          )}

          {/* Contact table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Ime
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider hidden md:table-cell">
                    Podjetje
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider hidden lg:table-cell">
                    Oznake
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#E1E1E1]/40 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-[#E1E1E1]/30"
                    >
                      Ni kontaktov. Dodajte jih ročno ali uvozite CSV.
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm text-[#E1E1E1]/80">
                        {c.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#E1E1E1]/60">
                        {c.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#E1E1E1]/60 hidden md:table-cell">
                        {c.company || "—"}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex gap-1 flex-wrap">
                          {c.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-xs bg-white/[0.06] text-[#E1E1E1]/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {c.unsubscribed ? (
                          <span className="inline-flex items-center gap-1 text-xs text-red-400">
                            <XCircle className="w-3 h-3" /> Odjavljen
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400">
                            <CheckCircle2 className="w-3 h-3" /> Aktiven
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Campaigns Tab ─── */}
      {tab === "campaigns" && (
        <div className="mt-6">
          <button
            onClick={() => setShowAddCampaign(!showAddCampaign)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cta-button mb-4"
          >
            <Plus className="w-4 h-4" />
            Nova kampanja
          </button>

          {/* Add campaign form */}
          {showAddCampaign && (
            <form
              onSubmit={handleAddCampaign}
              className="glass-card rounded-xl p-5 mb-6 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#E1E1E1]/40 mb-1">
                    Ime kampanje *
                  </label>
                  <input
                    type="text"
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    placeholder="npr. Januarska kampanja"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#E1E1E1]/40 mb-1">
                    Zadeva (prazno = privzeta iz predloge)
                  </label>
                  <input
                    type="text"
                    value={campSubject}
                    onChange={(e) => setCampSubject(e.target.value)}
                    placeholder="npr. {{name}}, posebna ponudba"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-[#E1E1E1]/40 mb-1">
                    Predloga *
                  </label>
                  <select
                    value={campTemplate}
                    onChange={(e) => setCampTemplate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50 appearance-none"
                  >
                    {TEMPLATES.map((t) => (
                      <option
                        key={t.id}
                        value={t.id}
                        className="bg-[#191919] text-[#E1E1E1]"
                      >
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#E1E1E1]/40 mb-1">
                    Načrtovano pošiljanje
                  </label>
                  <input
                    type="datetime-local"
                    value={campSchedule}
                    onChange={(e) => setCampSchedule(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm focus:outline-none focus:border-[#FEB089]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#E1E1E1]/40 mb-1">
                    Filter oznak (ločene z vejico)
                  </label>
                  <input
                    type="text"
                    value={campTags}
                    onChange={(e) => setCampTags(e.target.value)}
                    placeholder="npr. startup, marketing"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addingCampaign}
                className="cta-button py-2 px-6 rounded-lg font-medium text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {addingCampaign ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                {campSchedule ? "Načrtuj kampanjo" : "Ustvari osnutek"}
              </button>
            </form>
          )}

          {/* Campaign list */}
          <div className="space-y-4">
            {campaigns.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <Mail className="w-8 h-8 text-[#FEB089]/30 mx-auto mb-3" />
                <p className="text-sm text-[#E1E1E1]/30">
                  Ni kampanj. Ustvarite prvo kampanjo.
                </p>
              </div>
            ) : (
              campaigns.map((c) => (
                <div key={c.id} className="glass-card rounded-xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-white">
                          {c.name}
                        </h3>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="mt-1 text-xs text-[#E1E1E1]/40">
                        {TEMPLATES.find((t) => t.id === c.template_id)?.name ||
                          c.template_id}
                        {c.scheduled_at && (
                          <>
                            {" "}
                            ·{" "}
                            <Calendar className="w-3 h-3 inline -mt-0.5" />{" "}
                            {formatDate(c.scheduled_at)}
                          </>
                        )}
                        {c.sent_at && (
                          <>
                            {" "}
                            · Poslano {formatDate(c.sent_at)}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Stats bar */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Send className="w-3.5 h-3.5 text-[#E1E1E1]/30" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {c.stats.sent}
                        </p>
                        <p className="text-xs text-[#E1E1E1]/30">Poslano</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5 text-[#E1E1E1]/30" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {c.stats.opened}{" "}
                          <span className="text-[#E1E1E1]/30 text-xs">
                            ({pct(c.stats.opened, c.stats.sent)}%)
                          </span>
                        </p>
                        <p className="text-xs text-[#E1E1E1]/30">Odprtih</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-3.5 h-3.5 text-[#E1E1E1]/30" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {c.stats.clicked}{" "}
                          <span className="text-[#E1E1E1]/30 text-xs">
                            ({pct(c.stats.clicked, c.stats.sent)}%)
                          </span>
                        </p>
                        <p className="text-xs text-[#E1E1E1]/30">Klikov</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-[#E1E1E1]/30" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {pct(c.stats.clicked, c.stats.opened)}%
                        </p>
                        <p className="text-xs text-[#E1E1E1]/30">CTR</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
