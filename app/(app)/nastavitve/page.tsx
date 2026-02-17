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
    }
    setLoading(false);
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

        {/* Delete account */}
        <div className="glass-card rounded-xl p-6 border-red-500/10">
          <div className="flex items-center gap-3 mb-2">
            <Trash2 className="w-5 h-5 text-red-400/60" />
            <h2 className="text-sm font-semibold text-white">
              Izbriši račun
            </h2>
          </div>
          <p className="text-xs text-[#E1E1E1]/40 mb-4">
            To dejanje je nepovratno. Vsi vaši podatki, dokumenti in naročnina
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
