import { ServerClient } from "postmark";

let cachedClient: ServerClient | null = null;

function getClient(): ServerClient {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) {
    throw new Error("POSTMARK_API_KEY environment variable is required to send email");
  }
  cachedClient = new ServerClient(apiKey);
  return cachedClient;
}

function getFromAddress(): string {
  return process.env.POSTMARK_FROM ?? "InTalentMatch <no-reply@intalentmatch.local>";
}

export interface SendEmailInput {
  to: string;
  subject: string;
  textBody: string;
  htmlBody?: string;
}

export async function sendEmail({ to, subject, textBody, htmlBody }: SendEmailInput): Promise<void> {
  await getClient().sendEmail({
    From: getFromAddress(),
    To: to,
    Subject: `InTalentMatch | ${subject}`,
    TextBody: textBody,
    HtmlBody: htmlBody ?? `<p>${textBody.replace(/\n/g, "<br/>")}</p>`,
    TrackOpens: true,
    MessageStream: "outbound",
  });
}
