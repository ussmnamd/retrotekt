import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/schemas/contact';
import { inquiryEmailHtml } from '@/lib/emails/inquiry';
import { rateLimit } from '@/lib/rate-limit';
import { checkSpam } from '@/lib/spam';

const RATE_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 }; // 3 per IP per 10 minutes

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  if (!(await rateLimit(`contact:${ip}`, RATE_LIMIT))) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed.', issues: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { website, startedAt, ...data } = result.data;

  const verdict = checkSpam({ website, startedAt });
  if (verdict !== 'ok') {
    // Pretend it worked so bots get no signal to adapt to.
    console.warn(`[api/contact] Dropped likely spam (${verdict}) from ${ip}`);
    return NextResponse.json({ ok: true });
  }

  const to = process.env.CONTACT_EMAIL_TO ?? 'shahan@retrotekt.com';
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error: sendError } = await resend.emails.send({
      from: 'Retrotekt <no-reply@retrotekt.com>',
      to,
      replyTo: data.email,
      subject: `New Inquiry — ${data.name}${data.company ? ` (${data.company})` : ''}`,
      html: inquiryEmailHtml(data),
    });

    if (sendError) {
      console.error('[api/contact] Resend rejected:', sendError);
      return NextResponse.json(
        {
          error: 'Failed to send. Please email shahan@retrotekt.com directly.',
          ...(process.env.NODE_ENV !== 'production' ? { debug: sendError.message ?? String(sendError) } : {}),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[api/contact] Resend send failed:', message, err);
    return NextResponse.json(
      {
        error: 'Failed to send. Please email shahan@retrotekt.com directly.',
        ...(process.env.NODE_ENV !== 'production' ? { debug: message } : {}),
      },
      { status: 500 }
    );
  }
}
