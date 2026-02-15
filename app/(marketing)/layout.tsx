import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#171717] text-[#E1E1E1]">
      {/* SVG gradient definition for accent-icon class */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFB288" />
            <stop offset="50%" stopColor="#FEB089" />
            <stop offset="100%" stopColor="#EE94B0" />
          </linearGradient>
        </defs>
      </svg>
      <MarketingNavbar />
      <main className="pt-16">{children}</main>
      <MarketingFooter />
    </div>
  );
}
