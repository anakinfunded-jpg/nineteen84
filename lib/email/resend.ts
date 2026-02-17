import { Resend } from "resend";

let _client: Resend | null = null;

export function getResendClient() {
  if (!_client) {
    _client = new Resend(process.env.RESEND_API_KEY);
  }
  return _client;
}

const FROM_EMAIL = "1984 <noreply@1984.si>";

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  contactId: string;
}) {
  const resend = getResendClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.1984.si";
  const unsubscribeUrl = `${appUrl}/api/outreach/unsubscribe?token=${options.contactId}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/** Send a transactional notification email (no unsubscribe header needed). */
export async function sendNotification(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
