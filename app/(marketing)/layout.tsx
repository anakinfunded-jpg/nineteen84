import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#171717] text-[#E1E1E1]">
      <MarketingNavbar />
      <main className="pt-16">{children}</main>
      <MarketingFooter />
    </div>
  );
}
