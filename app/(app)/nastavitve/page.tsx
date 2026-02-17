"use client";

import { useState, useEffect, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Settings,
  Loader2,
  Check,
  Shield,
  Trash2,
  Mail,
  Key,
  Copy,
  Plus,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

export default function NastavitvePage() {
  const supabase = createClient();
  const [user, setUser] = useState<{
    email: string;
    fullName: string;
    provider: string;
    createdAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // API keys (Poslovno only)
  const [isPoslovno, setIsPoslovno] = useState(false);
  const [apiKeys, setApiKeys] = useState<{ id: string; key_prefix: string; name: string; created_at: string; last_used_at: string | null }[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatingKey, setGeneratingKey] = useState(false);
  const [newRawKey, setNewRawKey] = useState("");
  const [keyCopied, setKeyCopied] = useState(false);
  const [keyError, setKeyError] = useState("");
  const [showRawKey, setShowRawKey] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    if (u) {
      const provider =
        u.app_metadata?.provider === "google" ? "Google" : "E-pošta";
      setUser({
        email: u.email || "",
        fullName: u.user_metadata?.full_name || "",
        provider,
        createdAt: u.created_at,
      });
      setFullName(u.user_metadata?.full_name || "");

      // Check if user has Poslovno plan
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan_id")
        .eq("user_id", u.id)
        .eq("status", "active")
        .single();
      if (sub?.plan_id === "poslovno") {
        setIsPoslovno(true);
        loadApiKeys();
      }
    }
    setLoading(false);
  }

  async function loadApiKeys() {
    setLoadingKeys(true);
    try {
      const res = await fetch("/api/api-keys");
      const data = await res.json();
      if (data.success) setApiKeys(data.data);
    } catch { /* ignore */ }
    setLoadingKeys(false);
  }

  async function handleGenerateKey(e: FormEvent) {
    e.preventDefault();
    if (generatingKey || !newKeyName.trim()) return;
    setGeneratingKey(true);
    setKeyError("");
    setNewRawKey("");

    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewRawKey(data.data.key);
        setNewKeyName("");
        loadApiKeys();
      } else {
        setKeyError(data.error?.message || "Napaka pri ustvarjanju ključa.");
      }
    } catch {
      setKeyError("Napaka pri ustvarjanju ključa.");
    }
    setGeneratingKey(false);
  }

  async function handleRevokeKey(keyId: string) {
    try {
      const res = await fetch("/api/api-keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyId }),
      });
      const data = await res.json();
      if (data.success) loadApiKeys();
    } catch { /* ignore */ }
  }

  function copyKey() {
    navigator.clipboard.writeText(newRawKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  }

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setProfileError("");
    setSaved(false);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim() },
    });

    if (error) {
      setProfileError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setSaving(false);
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    if (changingPassword) return;

    if (newPassword.length < 8) {
      setPasswordError("Geslo mora imeti vsaj 8 znakov");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Gesli se ne ujemata");
      return;
    }

    setChangingPassword(true);
    setPasswordError("");
    setPasswordChanged(false);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordChanged(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordChanged(false), 3000);
    }

    setChangingPassword(false);
  }

  async function handleDeleteAccount() {
    if (deleteText !== "IZBRIŠI" || deleting) return;
    setDeleting(true);

    // Sign out and redirect — actual deletion requires admin action
    // We mark the request and the user can contact support
    try {
      await fetch("/api/account/delete", { method: "POST" });
    } catch {
      // Continue with signout regardless
    }

    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-[#E1E1E1]/30" />
      </div>
    );
  }

  if (!user) return null;

  const isGoogleAuth = user.provider === "Google";

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
        <Settings className="w-6 h-6 text-[#FEB089]" />
        Nastavitve
      </h1>
      <p className="mt-1 text-sm text-[#E1E1E1]/50">
        Upravljajte svoj profil in nastavitve računa
      </p>

      <div className="mt-8 space-y-6">
        {/* Profile section */}
        <form
          onSubmit={handleSaveProfile}
          className="glass-card rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <User className="w-5 h-5 text-[#FEB089]/60" />
            <h2 className="text-sm font-semibold text-white">Profil</h2>
          </div>

          <div>
            <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
              Ime in priimek
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Vaše ime"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
              E-pošta
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-sm">
              <Mail className="w-4 h-4 text-[#E1E1E1]/30" />
              <span className="text-[#E1E1E1]/50">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-[#E1E1E1]/30">
              Prijava z: {user.provider} &middot; Član od{" "}
              {new Date(user.createdAt).toLocaleDateString("sl-SI")}
            </p>
            <button
              type="submit"
              disabled={saving || !fullName.trim()}
              className="cta-button px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saved ? (
                <Check className="w-3.5 h-3.5" />
              ) : null}
              {saved ? "Shranjeno" : "Shrani"}
            </button>
          </div>

          {profileError && (
            <p className="text-sm text-red-400">{profileError}</p>
          )}
        </form>

        {/* Password section — only for email auth */}
        {!isGoogleAuth && (
          <form
            onSubmit={handleChangePassword}
            className="glass-card rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-[#FEB089]/60" />
              <h2 className="text-sm font-semibold text-white">
                Spremeni geslo
              </h2>
            </div>

            <div>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Novo geslo
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Vsaj 8 znakov"
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#E1E1E1]/60 mb-1.5">
                Potrdi geslo
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ponovite geslo"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors"
              />
            </div>

            {passwordError && (
              <p className="text-sm text-red-400">{passwordError}</p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  changingPassword || !newPassword || !confirmPassword
                }
                className="cta-button px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {changingPassword ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : passwordChanged ? (
                  <Check className="w-3.5 h-3.5" />
                ) : null}
                {passwordChanged ? "Spremenjeno" : "Spremeni geslo"}
              </button>
            </div>
          </form>
        )}

        {/* API Keys — Poslovno only */}
        {isPoslovno && (
          <div className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-[#FEB089]/60" />
              <h2 className="text-sm font-semibold text-white">API ključi</h2>
            </div>
            <p className="text-xs text-[#E1E1E1]/40">
              Uporabite API ključe za programski dostop do vseh AI storitev. Največ 3 ključi.
            </p>

            {/* New key modal */}
            {newRawKey && (
              <div className="p-4 rounded-xl bg-[#FEB089]/5 border border-[#FEB089]/20 space-y-3">
                <div className="flex items-center gap-2 text-[#FEB089]">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Shranite ta ključ — prikazan bo samo enkrat!</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] text-sm text-[#E1E1E1] font-mono overflow-hidden text-ellipsis">
                    {showRawKey ? newRawKey : newRawKey.slice(0, 10) + "••••••••••••••••••••••••••••••••"}
                  </code>
                  <button
                    onClick={() => setShowRawKey(!showRawKey)}
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-[#E1E1E1]/60"
                  >
                    {showRawKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={copyKey}
                    className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-[#E1E1E1]/60"
                  >
                    {keyCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => { setNewRawKey(""); setShowRawKey(false); }}
                  className="text-xs text-[#E1E1E1]/40 hover:text-[#E1E1E1]/60 transition-colors"
                >
                  Zapri
                </button>
              </div>
            )}

            {/* Generate new key */}
            <form onSubmit={handleGenerateKey} className="flex gap-2">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Ime ključa (npr. Produkcija)"
                maxLength={50}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-[#FEB089]/50 transition-colors"
              />
              <button
                type="submit"
                disabled={generatingKey || !newKeyName.trim() || apiKeys.length >= 3}
                className="cta-button px-4 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {generatingKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Ustvari
              </button>
            </form>

            {keyError && <p className="text-sm text-red-400">{keyError}</p>}

            {/* Keys list */}
            {loadingKeys ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-[#E1E1E1]/30" />
              </div>
            ) : apiKeys.length > 0 ? (
              <div className="space-y-2">
                {apiKeys.map((k) => (
                  <div key={k.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="min-w-0">
                      <p className="text-sm text-[#E1E1E1] font-medium truncate">{k.name}</p>
                      <p className="text-xs text-[#E1E1E1]/30 font-mono">{k.key_prefix}••••••••</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-[#E1E1E1]/30">
                          Ustvarjen {new Date(k.created_at).toLocaleDateString("sl-SI")}
                        </p>
                        <p className="text-xs text-[#E1E1E1]/20">
                          {k.last_used_at ? `Zadnja uporaba ${new Date(k.last_used_at).toLocaleDateString("sl-SI")}` : "Še ni bil uporabljen"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="p-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Prekliči ključ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#E1E1E1]/30 text-center py-3">Nimate še API ključev.</p>
            )}
          </div>
        )}

        {/* Delete account */}
        <div className="glass-card rounded-xl p-6 border-red-500/10">
          <div className="flex items-center gap-3 mb-2">
            <Trash2 className="w-5 h-5 text-red-400/60" />
            <h2 className="text-sm font-semibold text-white">
              Izbriši račun
            </h2>
          </div>
          <p className="text-xs text-[#E1E1E1]/40 mb-4">
            To dejanje je nepovratno. Vsi Vaši podatki, dokumenti in naročnina
            bodo trajno odstranjeni.
          </p>

          {showDeleteConfirm ? (
            <div className="space-y-3">
              <p className="text-sm text-red-400">
                Vpišite <span className="font-bold">IZBRIŠI</span> za potrditev:
              </p>
              <input
                type="text"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="IZBRIŠI"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-red-500/20 text-[#E1E1E1] text-sm placeholder:text-[#E1E1E1]/20 focus:outline-none focus:border-red-500/50 transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteText("");
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-[#E1E1E1]/50 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
                >
                  Prekliči
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteText !== "IZBRIŠI" || deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500/80 hover:bg-red-500 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                >
                  {deleting && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  Trajno izbriši
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 rounded-xl text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              Izbriši moj račun
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
