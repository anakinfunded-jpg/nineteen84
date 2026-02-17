export interface OutreachTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: (vars: TemplateVars) => string;
}

interface TemplateVars {
  name: string;
  company: string;
  sendId: string;
  contactId: string;
  appUrl: string;
}

function trackingPixel(appUrl: string, sendId: string) {
  return `<img src="${appUrl}/api/track/open?id=${sendId}" width="1" height="1" style="display:none" alt="" />`;
}

function trackedLink(
  appUrl: string,
  sendId: string,
  url: string,
  label: string
) {
  return `<a href="${appUrl}/api/track/click?id=${sendId}&url=${encodeURIComponent(url)}" style="color:#FEB089;text-decoration:underline">${label}</a>`;
}

function unsubscribeLink(appUrl: string, contactId: string) {
  return `<a href="${appUrl}/api/outreach/unsubscribe?token=${contactId}" style="color:#999;font-size:12px;text-decoration:underline">Odjavi se od sporočil</a>`;
}

function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="sl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#171717;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#171717;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#1e1e1e;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden">
<tr><td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.06)">
<span style="font-size:24px;font-weight:bold;background:linear-gradient(90deg,#EFBC9F,#D797A6,#FF9ED1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">1984</span>
</td></tr>
<tr><td style="padding:32px 40px;color:#E1E1E1;font-size:15px;line-height:1.7">
${content}
</td></tr>
<tr><td style="padding:24px 40px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center">
<p style="margin:0;color:#666;font-size:12px">1984 · AI, ki piše slovensko</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export const outreachTemplates: OutreachTemplate[] = [
  {
    id: "uvodni",
    name: "Uvodni email",
    description: "Prvi kontakt — predstavitev platforme 1984",
    subject: "{{name}}, AI ki piše slovensko — za {{company}}",
    body: (v) =>
      emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${v.name ? ` ${v.name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Sem soustanovitelj platforme <strong style="color:#FEB089">1984</strong> — prve slovenske AI aplikacije za ustvarjanje marketinških vsebin.</p>

<p style="margin:0 0 16px;color:#E1E1E1">Opazil sem, da ${v.company ? `${v.company} deluje` : "delujete"} na slovenskem trgu, in verjamem, da bi Vam 1984 lahko prihranil veliko časa pri pisanju:</p>

<ul style="margin:0 0 16px;padding-left:20px;color:#E1E1E1">
<li style="margin-bottom:8px">Opisi izdelkov in storitev v brezhibni slovenščini</li>
<li style="margin-bottom:8px">Objave za družbena omrežja (Facebook, Instagram, LinkedIn)</li>
<li style="margin-bottom:8px">E-poštna sporočila, blogi, oglasna besedila</li>
<li style="margin-bottom:8px">AI grafika in dokumenti</li>
</ul>

<p style="margin:0 0 24px;color:#E1E1E1">Ponujamo <strong style="color:white">14-dnevno brezplačno preizkusno obdobje</strong> brez obveznosti.</p>

<p style="margin:0 0 24px">
${trackedLink(v.appUrl, v.sendId, `${v.appUrl}/registracija`, "Preizkusite brezplačno →")}
</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>

${trackingPixel(v.appUrl, v.sendId)}
<p style="margin:24px 0 0;text-align:center">${unsubscribeLink(v.appUrl, v.contactId)}</p>
`),
  },

  {
    id: "sledilni",
    name: "Sledilni email",
    description: "Sledenje po prvem kontaktu brez odgovora",
    subject: "Hitro sledenje — brezplačen preizkus 1984",
    body: (v) =>
      emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${v.name ? ` ${v.name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Pred kratkim sem vam pisal glede <strong style="color:#FEB089">1984</strong> — AI platforme za slovensko vsebino. Razumem, da ste zaposleni, zato bom kratek.</p>

<p style="margin:0 0 16px;color:#E1E1E1">Eno vprašanje: <strong style="color:white">Koliko časa na teden porabite za pisanje marketinških besedil?</strong></p>

<p style="margin:0 0 16px;color:#E1E1E1">Naši uporabniki poročajo, da s 1984 prihranijo v povprečju <strong style="color:white">5–10 ur na teden</strong>, kar je čas, ki ga lahko namenijo za rast poslovanja.</p>

<p style="margin:0 0 24px;color:#E1E1E1">Preizkus je brezplačen in traja 14 dni — brez kartice, brez obveznosti.</p>

<p style="margin:0 0 24px">
${trackedLink(v.appUrl, v.sendId, `${v.appUrl}/registracija`, "Začnite brezplačni preizkus →")}
</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>

${trackingPixel(v.appUrl, v.sendId)}
<p style="margin:24px 0 0;text-align:center">${unsubscribeLink(v.appUrl, v.contactId)}</p>
`),
  },

  {
    id: "posebna-ponudba",
    name: "Posebna ponudba",
    description: "Posebna ponudba s popustom za nove uporabnike",
    subject: "{{name}}, posebna ponudba: 30% popust na 1984",
    body: (v) =>
      emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${v.name ? ` ${v.name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Imamo posebno ponudbo za ${v.company ? v.company : "vas"} — <strong style="color:#FEB089">30% popust na prve 3 mesece</strong> uporabe platforme 1984.</p>

<p style="margin:0 0 16px;color:#E1E1E1">Kaj dobite:</p>

<table style="margin:0 0 16px;width:100%;border-collapse:collapse">
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
✓ Do <strong style="color:white">50.000 besed</strong> mesečno v brezhibni slovenščini
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
✓ <strong style="color:white">400 AI slik</strong> za Vaše kampanje
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
✓ AI Chat, vse predloge, prednostna podpora
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:0 0 8px 8px;color:#E1E1E1">
✓ <strong style="color:#FEB089">Namesto &euro;39,90 → samo &euro;27,93/mesec</strong>
</td>
</tr>
</table>

<p style="margin:0 0 24px;color:#E1E1E1">Ponudba velja do konca meseca.</p>

<p style="margin:0 0 24px">
${trackedLink(v.appUrl, v.sendId, `${v.appUrl}/registracija`, "Izkoristite ponudbo →")}
</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>

${trackingPixel(v.appUrl, v.sendId)}
<p style="margin:24px 0 0;text-align:center">${unsubscribeLink(v.appUrl, v.contactId)}</p>
`),
  },
];

export function getOutreachTemplate(id: string) {
  return outreachTemplates.find((t) => t.id === id);
}

export function renderSubject(
  subject: string,
  vars: { name: string; company: string }
) {
  return subject
    .replace(/\{\{name\}\}/g, vars.name || "")
    .replace(/\{\{company\}\}/g, vars.company || "")
    .trim();
}

// ==================== AFFILIATE NOTIFICATION TEMPLATES ====================

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.1984.si";

export function affiliateApprovedEmail(name: string, code: string) {
  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${name ? ` ${name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Vaša prijava v partnerski program <strong style="color:#FEB089">1984</strong> je bila <strong style="color:#4ade80">odobrena</strong>!</p>

<p style="margin:0 0 16px;color:#E1E1E1">Vaša partnerska koda: <strong style="color:white;background:rgba(255,255,255,0.06);padding:4px 12px;border-radius:6px">${code}</strong></p>

<p style="margin:0 0 16px;color:#E1E1E1">Vaša partnerska povezava:</p>
<p style="margin:0 0 24px;color:#FEB089;word-break:break-all">${appUrl}/?ref=${code}</p>

<p style="margin:0 0 16px;color:#E1E1E1">Kaj zdaj?</p>
<ul style="margin:0 0 16px;padding-left:20px;color:#E1E1E1">
<li style="margin-bottom:8px">Delite povezavo na družbenih omrežjih, blogu ali neposredno</li>
<li style="margin-bottom:8px">Zaslužite <strong style="color:white">20% provizije</strong> za vsakega plačljivega uporabnika</li>
<li style="margin-bottom:8px">Vaši sledilci dobijo <strong style="color:white">21-dnevni brezplačni preizkus</strong></li>
<li style="margin-bottom:8px">Spremljajte statistiko na <a href="${appUrl}/partnerji" style="color:#FEB089">partnerski nadzorni plošči</a></li>
</ul>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>
`);
}

export function affiliateRejectedEmail(name: string) {
  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${name ? ` ${name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Zahvaljujemo se Vam za zanimanje za partnerski program <strong style="color:#FEB089">1984</strong>.</p>

<p style="margin:0 0 16px;color:#E1E1E1">Žal Vaše prijave trenutno ne moremo odobriti. To lahko pomeni, da Vaš profil trenutno ne ustreza našim kriterijem, ali da nimamo prostih mest.</p>

<p style="margin:0 0 16px;color:#E1E1E1">Če menite, da gre za napako, nas kontaktirajte na <a href="mailto:info@1984.si" style="color:#FEB089">info@1984.si</a>.</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>
`);
}

export function payoutCreatedEmail(name: string, amount: number, period: string) {
  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${name ? ` ${name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Ustvarjeno je bilo izplačilo v okviru partnerskega programa <strong style="color:#FEB089">1984</strong>:</p>

<table style="margin:0 0 24px;width:100%;border-collapse:collapse">
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
Znesek: <strong style="color:white">&euro;${amount.toFixed(2)}</strong>
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:0 0 8px 8px;color:#E1E1E1">
Obdobje: <strong style="color:white">${period}</strong>
</td>
</tr>
</table>

<p style="margin:0 0 16px;color:#E1E1E1">Izplačilo bo obdelano v najkrajšem možnem času. O statusu Vas bomo obvestili.</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>
`);
}

export function payoutPaidEmail(name: string, amount: number, period: string) {
  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${name ? ` ${name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Vaše partnersko izplačilo je bilo <strong style="color:#4ade80">izvedeno</strong>!</p>

<table style="margin:0 0 24px;width:100%;border-collapse:collapse">
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
Znesek: <strong style="color:white">&euro;${amount.toFixed(2)}</strong>
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:0 0 8px 8px;color:#E1E1E1">
Obdobje: <strong style="color:white">${period}</strong>
</td>
</tr>
</table>

<p style="margin:0 0 16px;color:#E1E1E1">Znesek bo viden na Vašem bančnem računu v 1–3 delovnih dneh.</p>

<p style="margin:0 0 16px;color:#E1E1E1">Podrobnosti najdete na <a href="${appUrl}/partnerji" style="color:#FEB089">partnerski nadzorni plošči</a>.</p>

<p style="margin:0 0 8px;color:#E1E1E1">Hvala za Vaše partnerstvo!</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>
`);
}

// ==================== USER LIFECYCLE TEMPLATES ====================

export function welcomeEmail(name: string) {
  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${name ? ` ${name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Dobrodošli v <strong style="color:#FEB089">1984</strong>! Vaša naročnina je aktivna in pripravljeni ste na začetek.</p>

<p style="margin:0 0 16px;color:#E1E1E1">Tukaj je nekaj predlogov za začetek:</p>

<table style="margin:0 0 24px;width:100%;border-collapse:collapse">
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
<strong style="color:white">1.</strong> <a href="${appUrl}/ai-chat" style="color:#FEB089">AI Chat</a> — pogovarjajte se z AI v slovenščini
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
<strong style="color:white">2.</strong> <a href="${appUrl}/ai-dokumenti" style="color:#FEB089">AI Dokumenti</a> — naložite datoteko za izboljšavo ali lekturo
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
<strong style="color:white">3.</strong> <a href="${appUrl}/predloge" style="color:#FEB089">Predloge</a> — izberite med 120+ pripravljenimi predlogami
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:0 0 8px 8px;color:#E1E1E1">
<strong style="color:white">4.</strong> <a href="${appUrl}/ai-prevajalnik" style="color:#FEB089">AI Prevajalnik</a> — prevajajte dokumente med 40+ jeziki
</td>
</tr>
</table>

<p style="margin:0 0 24px;text-align:center">
<a href="${appUrl}/ai-chat" style="display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#FFB288,#FEB089,#EE94B0);color:#171717;font-weight:600;text-decoration:none;border-radius:999px;font-size:14px">Začnite z AI Chatom</a>
</p>

<p style="margin:0 0 16px;color:#E1E1E1">Imate vprašanja? Pišite nam na <a href="mailto:info@1984.si" style="color:#FEB089">info@1984.si</a>.</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>
`);
}

export function paymentFailedEmail(name: string, planName: string) {
  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${name ? ` ${name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Plačilo za Vaš paket <strong style="color:white">${planName}</strong> ni uspelo. Vaš račun je trenutno v zaostanku.</p>

<p style="margin:0 0 16px;color:#E1E1E1">Prosimo, posodobite plačilno sredstvo, da preprečite prekinitev dostopa do AI orodij:</p>

<p style="margin:0 0 24px;text-align:center">
<a href="${appUrl}/narocnina" style="display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#FFB288,#FEB089,#EE94B0);color:#171717;font-weight:600;text-decoration:none;border-radius:999px;font-size:14px">Posodobite plačilno sredstvo</a>
</p>

<p style="margin:0 0 16px;color:#E1E1E1;font-size:13px;opacity:0.7">Če je bila to začasna težava (npr. nezadostno stanje), bo Stripe samodejno ponovil plačilo v naslednjih dneh.</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>
`);
}

export function subscriptionCanceledEmail(name: string, planName: string) {
  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${name ? ` ${name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Vaša naročnina <strong style="color:white">${planName}</strong> je bila preklicana.</p>

<p style="margin:0 0 16px;color:#E1E1E1">Vaš račun je bil preklopljen na brezplačni paket. Še vedno imate dostop do osnovnih funkcij z omejenimi krediti.</p>

<p style="margin:0 0 16px;color:#E1E1E1">Če ste si premislili ali imate vprašanja, se lahko kadarkoli ponovno naročite:</p>

<p style="margin:0 0 24px;text-align:center">
<a href="${appUrl}/cenik" style="display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#FFB288,#FEB089,#EE94B0);color:#171717;font-weight:600;text-decoration:none;border-radius:999px;font-size:14px">Oglejte si pakete</a>
</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>
`);
}

export function planChangedEmail(name: string, newPlanName: string, newPriceEur: string) {
  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${name ? ` ${name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Vaš paket je bil spremenjen na <strong style="color:#FEB089">${newPlanName}</strong> (&euro;${newPriceEur}/mesec).</p>

<p style="margin:0 0 16px;color:#E1E1E1">Sprememba je takoj aktivna. Vaše nove omejitve in funkcije so že na voljo.</p>

<p style="margin:0 0 24px;text-align:center">
<a href="${appUrl}/ai-chat" style="display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#FFB288,#FEB089,#EE94B0);color:#171717;font-weight:600;text-decoration:none;border-radius:999px;font-size:14px">Nadaljujte z delom</a>
</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>
`);
}

export function trialExpiringEmail(name: string, daysLeft: number) {
  const urgency = daysLeft <= 0
    ? `Vaše preizkusno obdobje se je <strong style="color:#ef4444">končalo</strong>.`
    : daysLeft === 1
      ? `Vaše preizkusno obdobje se konča <strong style="color:#f59e0b">jutri</strong>.`
      : `Vaše preizkusno obdobje se konča čez <strong style="color:#f59e0b">${daysLeft} dni</strong>.`;

  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${name ? ` ${name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">${urgency}</p>

<p style="margin:0 0 16px;color:#E1E1E1">Nadgradite na plačljivi paket, da ohranite dostop do vseh 13 AI orodij — besedila, prevodi, grafika, povzetki, učno gradivo in več.</p>

<table style="margin:0 0 24px;width:100%;border-collapse:collapse">
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
<strong style="color:white">Osnovno</strong> — &euro;16,90/mesec (20.000 besed, 200 slik)
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
<strong style="color:white">Profesionalno</strong> — &euro;39,90/mesec (50.000 besed, 400 slik)
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:0 0 8px 8px;color:#E1E1E1">
<strong style="color:white">Poslovno</strong> — &euro;84,90/mesec (150.000 besed, 800 slik)
</td>
</tr>
</table>

<p style="margin:0 0 24px;text-align:center">
<a href="${appUrl}/cenik" style="display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#FFB288,#FEB089,#EE94B0);color:#171717;font-weight:600;text-decoration:none;border-radius:999px;font-size:14px">Izberite paket</a>
</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>
`);
}

export function usageWarningEmail(name: string, percent: number, wordsUsed: number, wordsLimit: number, imagesUsed: number, imagesLimit: number) {
  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Pozdravljeni${name ? ` ${name}` : ""},</p>

<p style="margin:0 0 16px;color:#E1E1E1">Porabili ste <strong style="color:#f59e0b">${percent}%</strong> mesečnih kreditov.</p>

<table style="margin:0 0 24px;width:100%;border-collapse:collapse">
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
Besede: <strong style="color:white">${wordsUsed.toLocaleString("sl")}</strong> / ${wordsLimit.toLocaleString("sl")}
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:0 0 8px 8px;color:#E1E1E1">
Slike: <strong style="color:white">${imagesUsed}</strong> / ${imagesLimit}
</td>
</tr>
</table>

<p style="margin:0 0 16px;color:#E1E1E1">Če potrebujete več kreditov, nadgradite svoj paket:</p>

<p style="margin:0 0 24px;text-align:center">
<a href="${appUrl}/narocnina" style="display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#FFB288,#FEB089,#EE94B0);color:#171717;font-weight:600;text-decoration:none;border-radius:999px;font-size:14px">Nadgradite paket</a>
</p>

<p style="margin:0 0 8px;color:#E1E1E1">Lep pozdrav,</p>
<p style="margin:0;color:#E1E1E1"><strong>Ekipa 1984</strong></p>
`);
}

export function newAffiliateApplicationEmail(affiliateName: string, code: string, email: string) {
  return emailWrapper(`
<p style="margin:0 0 16px;color:#E1E1E1">Nova prijava v partnerski program:</p>

<table style="margin:0 0 24px;width:100%;border-collapse:collapse">
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:8px 8px 0 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
Ime: <strong style="color:white">${affiliateName || "Ni podano"}</strong>
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
E-pošta: <strong style="color:white">${email}</strong>
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:0 0 8px 8px;color:#E1E1E1">
Koda: <strong style="color:white">${code}</strong>
</td>
</tr>
</table>

<p style="margin:0 0 24px;text-align:center">
<a href="${appUrl}/admin/affiliates" style="display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#FFB288,#FEB089,#EE94B0);color:#171717;font-weight:600;text-decoration:none;border-radius:999px;font-size:14px">Preglej prijavo</a>
</p>
`);
}
