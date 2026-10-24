import { getFirestore, type WriteBatch } from 'firebase-admin/firestore';
import { defineBoolean, defineString } from 'firebase-functions/params';

/**
 * Emails are queued as documents in the `mail` collection, in the format used by the official
 * "Trigger Email from Firestore" extension (firebase/firestore-send-email), which delivers them
 * over your SMTP provider. Without the extension installed, submissions still work and the
 * queued documents are simply not sent.
 *
 * Configure in functions/.env (see functions/.env.example).
 */
const notifyEmail = defineString('NOTIFY_EMAIL', { default: '', description: 'Where new inquiries and applications are sent' });
const companyName = defineString('COMPANY_NAME', { default: 'Your Company' });
const sendConfirmations = defineBoolean('SEND_CONFIRMATION_EMAILS', { default: true });

interface Mail {
  to: string;
  replyTo?: string;
  subject: string;
  /** Plain-text body; the HTML version is derived from it. */
  text: string;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function queue(batch: WriteBatch, mail: Mail) {
  batch.set(getFirestore().collection('mail').doc(), {
    to: mail.to,
    ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
    message: {
      subject: mail.subject,
      text: mail.text,
      html: `<div style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(mail.text)}</div>`,
    },
  });
}

/** Queues the internal notification (if NOTIFY_EMAIL is set) and the sender's confirmation. */
export function queueSubmissionMail(
  batch: WriteBatch,
  opts: { kind: string; senderName: string; senderEmail: string; summary: string; confirmation: string },
) {
  const name = companyName.value();
  const to = notifyEmail.value();
  if (to) {
    queue(batch, {
      to,
      replyTo: opts.senderEmail,
      subject: `New ${opts.kind} from ${opts.senderName}`,
      text: `${opts.summary}\n\nOpen the admin dashboard to manage it.`,
    });
  }
  if (sendConfirmations.value()) {
    queue(batch, {
      to: opts.senderEmail,
      ...(to ? { replyTo: to } : {}),
      subject: `We received your ${opts.kind} | ${name}`,
      text: `Hi ${opts.senderName},\n\n${opts.confirmation}\n\nBest regards,\n${name}`,
    });
  }
}
