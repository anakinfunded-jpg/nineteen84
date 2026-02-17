import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika zasebnosti | 1984 — AI, ki piše slovensko",
  description: "Politika zasebnosti platforme 1984.",
};

export default function ZasebnostPage() {
  return (
    <>
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif text-white">
            Politika zasebnosti
          </h1>
          <p className="mt-2 text-sm text-[#E1E1E1]/40">
            Zadnja posodobitev: 15. februar 2026
          </p>

          <div className="mt-10 space-y-8 text-sm text-[#E1E1E1]/70 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                1. Uvod
              </h2>
              <p>
                Platforma 1984 (v nadaljevanju &ldquo;mi&rdquo;,
                &ldquo;naš&rdquo;) spoštuje Vašo zasebnost. Ta politika
                pojasnjuje, katere podatke zbiramo, kako jih uporabljamo in
                kakšne so Vaše pravice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                2. Podatki, ki jih zbiramo
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-[#E1E1E1]/90">
                    Podatki o računu:
                  </strong>{" "}
                  e-poštni naslov, ime (neobvezno), način prijave.
                </li>
                <li>
                  <strong className="text-[#E1E1E1]/90">
                    Podatki o uporabi:
                  </strong>{" "}
                  število generiranih besed in slik, zgodovina pogovorov.
                </li>
                <li>
                  <strong className="text-[#E1E1E1]/90">
                    Plačilni podatki:
                  </strong>{" "}
                  plačilne podatke obdeluje Stripe, Inc. Mi ne shranjujemo
                  podatkov o kreditnih karticah.
                </li>
                <li>
                  <strong className="text-[#E1E1E1]/90">Piškotki:</strong>{" "}
                  uporabljamo nujne piškotke za delovanje platforme in
                  avtentikacijo.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                3. Uporaba podatkov
              </h2>
              <p>Vaše podatke uporabljamo za:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Zagotavljanje in izboljšanje naše storitve</li>
                <li>Upravljanje Vašega računa in naročnine</li>
                <li>Komunikacijo z vami (podpora, obvestila)</li>
                <li>Preprečevanje zlorab</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                4. Deljenje podatkov
              </h2>
              <p>
                Vaših podatkov ne prodajamo. Podatke delimo le z naslednjimi
                ponudniki storitev, ki so potrebni za delovanje platforme:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong className="text-[#E1E1E1]/90">Supabase</strong> —
                  gostovanje podatkovne baze in avtentikacija
                </li>
                <li>
                  <strong className="text-[#E1E1E1]/90">Stripe</strong> —
                  obdelava plačil
                </li>
                <li>
                  <strong className="text-[#E1E1E1]/90">
                    Anthropic / OpenAI
                  </strong>{" "}
                  — obdelava AI-zahtev
                </li>
                <li>
                  <strong className="text-[#E1E1E1]/90">Vercel</strong> —
                  gostovanje aplikacije
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                5. Vaše pravice (GDPR)
              </h2>
              <p>Skladno z Uredbo GDPR imate pravico do:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Dostopa do svojih osebnih podatkov</li>
                <li>Popravka netočnih podatkov</li>
                <li>Izbrisa podatkov (&ldquo;pravica do pozabe&rdquo;)</li>
                <li>Omejitve obdelave</li>
                <li>Prenosljivosti podatkov</li>
                <li>Ugovora obdelavi</li>
              </ul>
              <p className="mt-2">
                Za uveljavljanje teh pravic nas kontaktirajte na{" "}
                <a
                  href="mailto:info@1984.si"
                  className="accent-gradient hover:opacity-80 transition-opacity"
                >
                  info@1984.si
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                6. Hramba podatkov
              </h2>
              <p>
                Vaše podatke hranimo, dokler imate aktiven račun. Ob izbrisu
                računa bodo Vaši podatki izbrisani v roku 30 dni, razen če
                zakonodaja zahteva daljšo hrambo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                7. Varnost
              </h2>
              <p>
                Uporabljamo standardne varnostne ukrepe za zaščito vaših
                podatkov, vključno s šifriranjem podatkov v prenosu (TLS) in v
                mirovanju.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                8. Spremembe
              </h2>
              <p>
                To politiko zasebnosti lahko posodobimo. O bistvenih spremembah
                Vas bomo obvestili po e-pošti.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                9. Kontakt
              </h2>
              <p>
                Za vprašanja glede zasebnosti nas kontaktirajte na{" "}
                <a
                  href="mailto:info@1984.si"
                  className="accent-gradient hover:opacity-80 transition-opacity"
                >
                  info@1984.si
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
