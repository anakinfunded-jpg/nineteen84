export default function MarketingLoading() {
  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
        <div className="h-3 w-24 bg-white/[0.04] rounded-lg" />
      </div>
    </div>
  );
}
