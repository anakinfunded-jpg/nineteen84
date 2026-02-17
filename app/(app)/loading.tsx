export default function AppLoading() {
  return (
    <div className="p-8 max-w-4xl animate-pulse">
      {/* Title skeleton */}
      <div className="h-7 w-48 bg-white/[0.06] rounded-lg" />
      <div className="h-4 w-72 bg-white/[0.04] rounded-lg mt-2" />

      {/* Content skeleton */}
      <div className="mt-8 space-y-4">
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-4">
          <div className="h-4 w-full bg-white/[0.06] rounded-lg" />
          <div className="h-4 w-3/4 bg-white/[0.04] rounded-lg" />
          <div className="h-32 w-full bg-white/[0.04] rounded-xl" />
          <div className="h-11 w-full bg-white/[0.06] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
