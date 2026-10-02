import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const RSVP_TO_EMAILS = (
  process.env.RSVP_TO_EMAIL ||
  'bradleydimande@gmail.com,sepokonayuma@gmail.com'
)
  .split(',')
  .map(email => email.trim())
  .filter(Boolean);
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'A Special Invitation <rsvp@sepokonayuma.me>';
const ALLOWED_RESPONSES = new Set(['yes', 'absolutely', 'waiting']);
const MAX_SIGNATURE_LENGTH = 500_000;

interface RsvpRequest {
  invitationTitle?: unknown;
  recipientName?: unknown;
  selectedOptions?: unknown;
  note?: unknown;
  signatureType?: unknown;
  signatureData?: unknown;
  eventDate?: unknown;
  eventTime?: unknown;
  submissionId?: unknown;
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    character =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#039;',
        '"': '&quot;',
      })[character] || character
  );

const cleanText = (value: unknown, maximumLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maximumLength) : '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RSVP email is unavailable because RESEND_API_KEY is missing.');
    return res.status(503).json({ error: 'RSVP email is not configured yet.' });
  }

  const body = (req.body || {}) as RsvpRequest;
  const invitationTitle = cleanText(body.invitationTitle, 160);
  const recipientName = cleanText(body.recipientName, 100);
  const note = cleanText(body.note, 1_000);
  const eventDate = cleanText(body.eventDate, 100);
  const eventTime = cleanText(body.eventTime, 100);
  const signatureData = cleanText(body.signatureData, MAX_SIGNATURE_LENGTH + 1);
  const signatureType = body.signatureType;
  const selectedOptions = Array.isArray(body.selectedOptions)
    ? body.selectedOptions.filter(
        (option): option is string =>
          typeof option === 'string' && ALLOWED_RESPONSES.has(option)
      )
    : [];
  const submissionId = cleanText(body.submissionId, 100);

  if (!invitationTitle || !recipientName || selectedOptions.length === 0) {
    return res.status(400).json({ error: 'The RSVP details are incomplete.' });
  }

  if (
    (signatureType !== 'type' && signatureType !== 'draw') ||
    !signatureData ||
    signatureData.length > MAX_SIGNATURE_LENGTH
  ) {
    return res.status(400).json({ error: 'A valid signature is required.' });
  }

  if (signatureType === 'draw' && !signatureData.startsWith('data:image/png;base64,')) {
    return res.status(400).json({ error: 'The drawn signature is invalid.' });
  }

  const responseLabels: Record<string, string> = {
    yes: 'Yes',
    absolutely: 'Absolutely',
    waiting: 'Been waiting for this!',
  };
  const responseText = selectedOptions.map(option => responseLabels[option]).join(', ');
  const submittedAt = new Intl.DateTimeFormat('en-ZM', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Africa/Lusaka',
  }).format(new Date());

  const attachments =
    signatureType === 'draw'
      ? [
          {
            filename: 'rsvp-signature.png',
            content: Buffer.from(signatureData.split(',')[1], 'base64'),
            contentType: 'image/png',
          },
        ]
      : undefined;

  const signatureMarkup =
    signatureType === 'type'
      ? `<p style="font-size: 26px; color: #9f1239; font-style: italic; margin: 6px 0 0;">${escapeHtml(signatureData)}</p>`
      : '<p style="margin: 6px 0 0;">The drawn signature is attached as a PNG.</p>';

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send(
    {
      from: RESEND_FROM_EMAIL,
      to: RSVP_TO_EMAILS,
      subject: `RSVP accepted: ${invitationTitle}`,
      text: [
        `${recipientName} accepted your invitation.`,
        `Response: ${responseText}`,
        `Sweet note: ${note || 'No note included.'}`,
        `Date: ${eventDate}`,
        `Time: ${eventTime}`,
        `Signature: ${signatureType === 'type' ? signatureData : 'Attached as a PNG.'}`,
        `Submitted: ${submittedAt}`,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #292524;">
          <div style="background: #fff1f2; border: 1px solid #fecdd3; border-radius: 18px; padding: 28px;">
            <p style="color: #be123c; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">A Special Invitation</p>
            <h1 style="color: #881337; margin: 8px 0 20px;">It’s officially a date ❤️</h1>
            <p><strong>${escapeHtml(recipientName)}</strong> accepted your invitation.</p>
            <p><strong>Response:</strong> ${escapeHtml(responseText)}</p>
            <p><strong>Sweet note:</strong> ${note ? escapeHtml(note) : '<em>No note included.</em>'}</p>
            <p><strong>Date:</strong> ${escapeHtml(eventDate)}</p>
            <p><strong>Time:</strong> ${escapeHtml(eventTime)}</p>
            <div style="margin-top: 22px; padding-top: 18px; border-top: 1px solid #fecdd3;">
              <strong>Signed by:</strong>
              ${signatureMarkup}
            </div>
            <p style="color: #78716c; font-size: 12px; margin-top: 24px;">Submitted ${escapeHtml(submittedAt)}</p>
          </div>
        </div>
      `,
      attachments,
    },
    submissionId ? { idempotencyKey: `rsvp/${submissionId}` } : undefined
  );

  if (error) {
    console.error('Resend rejected the RSVP email:', error.name, error.message);
    return res.status(502).json({ error: 'The RSVP could not be delivered. Please try again.' });
  }

  return res.status(200).json({ delivered: true, emailId: data?.id });
}
