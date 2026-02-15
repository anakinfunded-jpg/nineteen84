import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
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
      </body>
    </html>
  );
}
