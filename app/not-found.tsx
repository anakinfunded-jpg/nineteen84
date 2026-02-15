import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-serif logo-gradient">404</h1>
        <p className="mt-4 text-lg text-[#E1E1E1]/70">
          Stran, ki jo iščete, ne obstaja.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block cta-button px-8 py-3 rounded-xl font-semibold text-sm"
        >
          Nazaj na začetno stran
        </Link>
      </div>
    </div>
  );
}
