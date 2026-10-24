import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';
import { asInput, email, requireConsent, text } from './validation.js';
import { clientIp, enforceRateLimit } from './rateLimit.js';
import { queueSubmissionMail } from './mail.js';
import { callableOptions, HOUR } from './options.js';

/** Public contact-form endpoint. Stores the inquiry and queues notification emails. */
export const submitInquiry = onCall(callableOptions, async (req) => {
  const input = asInput(req.data);
  // Honeypot: bots that fill the hidden field get a normal-looking response and nothing is stored.
  if (text(input, 'website', 500)) return { ok: true };

  const inquiry = {
    name: text(input, 'name', 120, 2),
    email: email(input, 'email'),
    company: text(input, 'company', 200),
    projectType: text(input, 'projectType', 80, 1),
    budget: text(input, 'budget', 80),
    message: text(input, 'message', 5000, 20),
  };
  requireConsent(input);
  await enforceRateLimit(clientIp(req.rawRequest), 'inquiry', 5, HOUR);

  const db = getFirestore();
  const ref = db.collection('inquiries').doc();
  const batch = db.batch();
  batch.set(ref, {
    ...inquiry,
    consent: true,
    status: 'new',
    notes: '',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  queueSubmissionMail(batch, {
    kind: 'inquiry',
    senderName: inquiry.name,
    senderEmail: inquiry.email,
    summary: [
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      inquiry.company && `Company: ${inquiry.company}`,
      `Project type: ${inquiry.projectType}`,
      inquiry.budget && `Budget: ${inquiry.budget}`,
      '',
      inquiry.message,
    ]
      .filter((line) => line !== '')
      .join('\n'),
    confirmation: 'Thank you for getting in touch. We have received your message and will get back to you as soon as possible.',
  });
  await batch.commit();
  return { ok: true };
});
