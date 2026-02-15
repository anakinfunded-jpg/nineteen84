import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { Sparkles, Target, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nas | 1984 — AI, ki piše slovensko",
  description:
    "Spoznajte ekipo za platformo 1984 — prvo slovensko AI platformo za ustvarjanje vsebin.",
};

const team = [
  {
    name: "Luka Horvat",
    role: "Ustanovitelj in direktor",
    bio: "Vizionar za platformo 1984. Več kot 10 let izkušenj v tehnologiji in digitalnem marketingu. Prepričan, da mora AI služiti ljudem — ne obratno.",
    image: "/images/team/luka-horvat.webp",
  },
  {
    name: "Ana Krajnc",
    role: "Tehnična vodja",
    bio: "Odgovorna za arhitekturo platforme in integracijo AI modelov. Specialistka za strojno učenje in naravno obdelavo jezika. Prej pri Googlu in Outbrainu.",
    image: "/images/team/ana-krajnc.webp",
  },
  {
    name: "Matej Zupan",
    role: "Produktni vodja",
    bio: "Skrbi za uporabniško izkušnjo in razvoj novih funkcij. 8 let izkušenj v produktnem vodenju pri vodilnih SaaS podjetjih. Perfekcijonist z očesom za detajle.",
    image: "/images/team/matej-zupan.webp",
  },
];

export default function ONasPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimateOnScroll>
            <span className="inline-block text-[#FEB089] text-sm font-semibold tracking-widest uppercase">
              O nas
            </span>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <h1 className="mt-6 text-5xl md:text-6xl font-serif tracking-[0.01em] leading-[1.1]">
              Zgradili smo AI,
              <br />
              ki razume <span className="logo-gradient">slovenščino.</span>
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <p className="mt-6 text-lg text-[#E1E1E1]/60 max-w-2xl mx-auto leading-relaxed">
              1984 je prva slovenska AI platforma za ustvarjanje marketinških
              vsebin. Naša misija je demokratizirati dostop do napredne AI
              tehnologije za vse slovenske podjetnike, marketinške strokovnjake
              in ustvarjalce.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimateOnScroll>
            <div className="glass-card rounded-2xl p-8 h-full">
              <Target className="w-8 h-8 text-[#FEB089] mb-4" />
              <h3 className="text-lg font-semibold text-white">Naša misija</h3>
              <p className="mt-3 text-sm text-[#E1E1E1]/50 leading-relaxed">
                Vsak slovenski podjetnik si zasluži dostop do orodij, ki mu
                pomagajo ustvarjati profesionalne vsebine — hitro, enostavno in
                v materinem jeziku.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <div className="glass-card rounded-2xl p-8 h-full">
              <Sparkles className="w-8 h-8 text-[#FEB089] mb-4" />
              <h3 className="text-lg font-semibold text-white">Naša vizija</h3>
              <p className="mt-3 text-sm text-[#E1E1E1]/50 leading-relaxed">
                Postati vodilna AI platforma za slovensko govoreče trge in
                razširiti naše orodje na vse manjše evropske jezike.
              </p>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <div className="glass-card rounded-2xl p-8 h-full">
              <Heart className="w-8 h-8 text-[#FEB089] mb-4" />
              <h3 className="text-lg font-semibold text-white">
                Naše vrednote
              </h3>
              <p className="mt-3 text-sm text-[#E1E1E1]/50 leading-relaxed">
                Preprostost, kakovost in zasebnost. Vaši podatki so vaša last.
                Gradimo orodja, ki so enostavna za uporabo in dajejo odlične
                rezultate.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Why 1984? */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <h2 className="text-3xl font-serif text-white text-center mb-8">
              Zakaj ime 1984?
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <div className="glass-card rounded-2xl p-8">
              <p className="text-[#E1E1E1]/60 leading-relaxed">
                Ime 1984 je poklon Orwellovemu romanu — a z obratnim sporočilom.
                Medtem ko roman opozarja na nevarnosti nadzora nad jezikom in
                mislijo, mi verjamemo v ravno nasprotno: tehnologija mora služiti
                ljudem, ne obratno. Naša AI ne nadzira — pomaga. Pomaga
                slovenskim podjetjem komunicirati jasno, profesionalno in v
                svojem materinem jeziku. Ime je tudi opomnik: v svetu velikih
                tehnoloških korporacij, ki pogosto zanemarjajo manjše jezike,
                smo se odločili zgraditi orodje, ki slovenščino postavlja na
                prvo mesto.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <h2 className="text-3xl font-serif text-white text-center mb-8">
              Naša zgodba
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <div className="glass-card rounded-2xl p-8 space-y-4 text-[#E1E1E1]/60 leading-relaxed">
              <p>
                Vse se je začelo konec leta 2025, ko je Luka Horvat — takrat
                vodja digitalnega marketinga pri slovenskem startupu — opazil
                ponavljajoč problem: vsak teden je porabil ure za pisanje
                marketinških besedil, objav za družabna omrežja in e-poštnih
                kampanj. Obstoječa AI orodja so delovala odlično v angleščini,
                a v slovenščini so rezultati bili neuporabni — polni tujk,
                čudnih stavčnih struktur in očitno strojno prevedenih fraz.
              </p>
              <p>
                &ldquo;Zakaj ne bi imeli orodja, ki slovenščino razume tako
                dobro kot angleščino?&rdquo; je vprašal. Odgovor je bil
                preprost: ker ga nihče ni zgradil. Zato ga je zgradil sam.
              </p>
              <p>
                S pomočjo Ane Krajnc, ki je prinesla globoke izkušnje v strojnem
                učenju, in Mateja Zupana, ki je poskrbel za intuitivno
                uporabniško izkušnjo, je v začetku leta 2026 nastala platforma
                1984 — prva slovenska AI platforma za ustvarjanje marketinških
                vsebin.
              </p>
              <p>
                Danes 1984 ponuja 11 AI orodij — od besedil in slik do zvoka,
                prevajanja in analize dokumentov. Vse v brezhibni slovenščini.
                In to je šele začetek.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimateOnScroll>
            <h2 className="text-3xl font-serif text-white text-center mb-12">
              Naša ekipa
            </h2>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <AnimateOnScroll key={i} delay={i * 100}>
                <div className="glass-card rounded-2xl p-6 text-center h-full">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-white/[0.06]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#FEB089] mt-1">{member.role}</p>
                  <p className="text-sm text-[#E1E1E1]/40 mt-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Company info */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <div className="glass-card rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold text-white mb-4">
                Podatki o podjetju
              </h3>
              <div className="text-sm text-[#E1E1E1]/50 space-y-1">
                <p>1984</p>
                <p>Grobelno del 151, 3231 Grobelno</p>
                <p>Slovenija</p>
                <p className="mt-2">
                  DŠ: 68174390
                </p>
                <p className="mt-2">
                  <a
                    href="mailto:info@1984.si"
                    className="text-[#FEB089] hover:underline"
                  >
                    info@1984.si
                  </a>
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateOnScroll>
            <h2 className="text-4xl font-serif tracking-[0.01em] leading-tight">
              Pridružite se
              <br />
              <span className="logo-gradient">slovenskim ustvarjalcem.</span>
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <Link
              href="/registracija"
              className="cta-button px-8 py-3.5 rounded-full font-semibold text-base inline-block mt-8"
            >
              Začni brezplačno
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
