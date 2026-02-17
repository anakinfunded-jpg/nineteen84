import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | 1984 — AI, ki piše slovensko",
  description: "Impressum in pravne informacije platforme 1984.",
};

export default function ImpressumPage() {
  return (
    <>
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif text-white">Impressum</h1>
          <p className="mt-2 text-sm text-[#E1E1E1]/40">
            Zadnja posodobitev: 17. februar 2026
          </p>

          <div className="mt-10 space-y-8 text-sm text-[#E1E1E1]/70 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                1. Ponudnik
              </h2>
              <p>
                <strong className="text-white">1984</strong>
                <br />
                Grobelno del 151
                <br />
                3231 Grobelno
                <br />
                Slovenija
              </p>
              <p className="mt-3">
                Davčna številka (DŠ): 68174390
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                2. Kontakt
              </h2>
              <p>
                E-pošta:{" "}
                <a
                  href="mailto:info@1984.si"
                  className="text-[#FEB089] hover:underline"
                >
                  info@1984.si
                </a>
              </p>
              <p className="mt-2">
                Odzivni čas: do 1 delovnega dne.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                3. Odgovorna oseba
              </h2>
              <p>
                Luka Horvat, direktor
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                4. Gostovanje
              </h2>
              <p>
                Spletna platforma gostuje pri:
              </p>
              <p className="mt-2">
                <strong className="text-white">Vercel Inc.</strong>
                <br />
                440 N Barranca Ave #4133
                <br />
                Covina, CA 91723
                <br />
                Združene države Amerike
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                5. Vsebina
              </h2>
              <p>
                Vsebine na tej spletni strani so bile pripravljene z največjo
                skrbnostjo. Vendar ne moremo prevzeti jamstva za pravilnost,
                popolnost in aktualnost vsebin. Kot ponudnik storitev smo v
                skladu z zakonodajo odgovorni za lastne vsebine na teh straneh.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                6. Avtorske pravice
              </h2>
              <p>
                Vsebine in dela na teh straneh, ki jih je ustvaril ponudnik, so
                zaščitene z avtorskim pravom. Razmnoževanje, obdelava,
                distribucija in kakršna koli uporaba zunaj okvirov avtorskega
                prava zahtevajo pisno soglasje ponudnika.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                7. Reševanje sporov
              </h2>
              <p>
                Evropska komisija zagotavlja platformo za spletno reševanje
                sporov (OS):{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FEB089] hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="mt-2">
                K sodelovanju v postopku reševanja sporov pred potrošniško
                arbitražno komisijo nismo zavezani in tudi nismo pripravljeni.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
