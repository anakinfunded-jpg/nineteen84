"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Users } from "lucide-react";

interface ReferralData {
  inviteCode: string;
  used: number;
  remaining: number;
  maxInvites: number;
  link: string;
}

export function InviteFriends() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  async function copyLink() {
    if (!data) return;
    await navigator.clipboard.writeText(data.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!data) return null;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-white">Povabi prijatelje</h2>
      <div className="mt-4 glass-card rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#FEB089]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#E1E1E1]/70">
              Delite svojo povezavo s prijatelji — ob prvi naročnini prejmejo{" "}
              <span className="text-white font-medium">5% popust</span>.
            </p>
            <p className="mt-1 text-xs text-[#E1E1E1]/40">
              {data.used} / {data.maxInvites} povabil uporabljenih
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-[#E1E1E1]/60 truncate">
            {data.link}
          </div>
          <button
            onClick={copyLink}
            className="shrink-0 px-4 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-sm text-white flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                Kopirano
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Kopiraj
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
