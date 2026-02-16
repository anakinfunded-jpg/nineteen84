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

<p style="margin:0 0 16px;color:#E1E1E1">Opazil sem, da ${v.company ? `${v.company} deluje` : "delujete"} na slovenskem trgu, in verjamem, da bi vam 1984 lahko prihranil veliko časa pri pisanju:</p>

<ul style="margin:0 0 16px;padding-left:20px;color:#E1E1E1">
<li style="margin-bottom:8px">Opisi izdelkov in storitev v brezhibni slovenščini</li>
<li style="margin-bottom:8px">Objave za družbena omrežja (Facebook, Instagram, LinkedIn)</li>
<li style="margin-bottom:8px">E-poštna sporočila, blogi, oglasna besedila</li>
<li style="margin-bottom:8px">AI grafika in dokumenti</li>
</ul>

<p style="margin:0 0 24px;color:#E1E1E1">Ponujamo <strong style="color:white">5-dnevno brezplačno preizkusno obdobje</strong> brez obveznosti.</p>

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

<p style="margin:0 0 24px;color:#E1E1E1">Preizkus je brezplačen in traja 5 dni — brez kartice, brez obveznosti.</p>

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
✓ <strong style="color:white">500 AI slik</strong> za vaše kampanje
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.06);color:#E1E1E1">
✓ AI Chat, vse predloge, prednostna podpora
</td>
</tr>
<tr>
<td style="padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:0 0 8px 8px;color:#E1E1E1">
✓ <strong style="color:#FEB089">Namesto €39,90 → samo €33,92/mesec</strong>
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
