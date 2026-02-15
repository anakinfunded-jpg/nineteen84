import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "1984 | AI, ki piše slovensko",
  description:
    "Prva slovenska AI platforma za ustvarjanje marketinških vsebin. Opisi izdelkov, objave za družbena omrežja, e-maili, blogi — vse v brezhibni slovenščini.",
  metadataBase: new URL("https://1984.si"),
  openGraph: {
    title: "1984 | AI, ki piše slovensko",
    description:
      "Prva slovenska AI platforma za ustvarjanje marketinških vsebin. Opisi izdelkov, objave za družbena omrežja, e-maili, blogi — vse v brezhibni slovenščini.",
    url: "https://1984.si",
    siteName: "1984",
    locale: "sl_SI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "1984 | AI, ki piše slovensko",
    description:
      "Prva slovenska AI platforma za ustvarjanje marketinških vsebin.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl" className="dark">
      <body
        className={`${instrumentSerif.variable} ${plusJakarta.variable} font-sans antialiased`}
      >
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
