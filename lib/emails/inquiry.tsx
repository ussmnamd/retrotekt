import type { ContactInput } from '@/lib/schemas/contact';

export function inquiryEmailHtml(data: ContactInput): string {
  const row = (label: string, value: string | undefined) =>
    value
      ? `<tr><td style="padding:8px 0;color:#8C6E4B;font-size:12px;font-family:sans-serif;text-transform:uppercase;letter-spacing:0.1em;width:140px;vertical-align:top">${label}</td><td style="padding:8px 0;color:#2C1F14;font-size:15px;font-family:sans-serif;vertical-align:top">${value}</td></tr>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F7F0E3;font-family:sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F0E3;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr>
          <td style="padding:32px 40px;background:#2C1F14;border-radius:4px 4px 0 0">
            <p style="margin:0;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#C4A882;font-family:sans-serif">New Inquiry · Retrotekt</p>
            <h1 style="margin:12px 0 0;font-size:28px;font-weight:300;color:#F7F0E3;font-family:sans-serif;line-height:1.1">
              ${esc(data.name)}${data.company ? `<br/><span style="font-size:16px;color:#F7F0E3;opacity:0.5">${esc(data.company)}</span>` : ''}
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;background:#ffffff;border-left:1px solid #EDE3CE;border-right:1px solid #EDE3CE">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row('Email', `<a href="mailto:${esc(data.email)}" style="color:#2C1F14">${esc(data.email)}</a>`)}
              ${row('Project Type', data.projectType ? esc(data.projectType) : undefined)}
              ${row('Budget', data.budget ? esc(data.budget) : undefined)}
            </table>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:24px 40px 32px;background:#ffffff;border-left:1px solid #EDE3CE;border-right:1px solid #EDE3CE;border-top:1px solid #EDE3CE">
            <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8C6E4B;font-family:sans-serif">Message</p>
            <p style="margin:0;font-size:15px;color:#2C1F14;line-height:1.7;font-family:sans-serif;white-space:pre-wrap">${esc(data.message)}</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;background:#EDE3CE;border-radius:0 0 4px 4px">
            <p style="margin:0;font-size:11px;color:#8C6E4B;font-family:sans-serif">
              Sent from <a href="https://www.retrotekt.com/consulting" style="color:#8C6E4B">retrotekt.com/consulting</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
