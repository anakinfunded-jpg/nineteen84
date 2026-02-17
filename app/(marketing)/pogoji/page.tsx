import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pogoji uporabe | 1984 — AI, ki piše slovensko",
  description: "Pogoji uporabe platforme 1984.",
};

export default function PogojiPage() {
  return (
    <>
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif text-white">Pogoji uporabe</h1>
          <p className="mt-2 text-sm text-[#E1E1E1]/40">
            Zadnja posodobitev: 15. februar 2026
          </p>

          <div className="mt-10 space-y-8 text-sm text-[#E1E1E1]/70 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                1. Splošno
              </h2>
              <p>
                Ti pogoji uporabe urejajo uporabo platforme 1984 (v nadaljevanju
                &ldquo;platforma&rdquo;), ki jo upravlja 1984 (v nadaljevanju
                &ldquo;ponudnik&rdquo;). Z uporabo platforme se strinjate s temi
                pogoji.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                2. Opis storitve
              </h2>
              <p>
                Platforma 1984 omogoča ustvarjanje vsebin z umetno inteligenco,
                vključno z generiranjem besedil, slik, prevajanjem in obdelavo
                dokumentov. Storitev je na voljo v različnih naročniških
                paketih.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                3. Registracija in račun
              </h2>
              <p>
                Za uporabo platforme morate ustvariti uporabniški račun.
                Odgovorni ste za varnost svojih prijavnih podatkov. O morebitni
                nepooblaščeni uporabi računa nas nemudoma obvestite.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                4. Naročnina in plačila
              </h2>
              <p>
                Naročniški paketi se obračunavajo mesečno. Plačila obdeluje
                Stripe, Inc. Naročnino lahko kadarkoli prekličete v nastavitvah
                svojega računa. Ob preklicu ohranite dostop do konca
                obračunskega obdobja.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                5. Dovoljene vsebine
              </h2>
              <p>
                Platforma ne sme biti uporabljena za ustvarjanje vsebin, ki so
                nezakonite, žaljive, diskriminatorne ali kršijo pravice tretjih
                oseb. Ponudnik si pridržuje pravico do odstranitve vsebin in
                blokade računov, ki kršijo te pogoje.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                6. Intelektualna lastnina
              </h2>
              <p>
                Vsebine, ustvarjene z Vašim računom na platformi, so Vaša last.
                Platforma 1984 in njena programska oprema, oblikovanje in
                blagovne znamke so last ponudnika.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                7. Omejitev odgovornosti
              </h2>
              <p>
                Platforma je zagotovljena &ldquo;takšna, kot je&rdquo;. Ponudnik
                ne jamči za popolno natančnost AI-generiranih vsebin. Odgovornost
                ponudnika je omejena na znesek, ki ste ga plačali za storitev v
                zadnjih 12 mesecih.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                8. Spremembe pogojev
              </h2>
              <p>
                Ponudnik si pridržuje pravico do spremembe teh pogojev. O
                bistvenih spremembah bomo uporabnike obvestili po e-pošti ali z
                obvestilom na platformi.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                9. Kontakt
              </h2>
              <p>
                Za vprašanja glede teh pogojev nas kontaktirajte na{" "}
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
