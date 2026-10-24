import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { asInput, email, invalid, requireConsent, text, url, type Input } from './validation.js';
import { clientIp, enforceRateLimit } from './rateLimit.js';
import { queueSubmissionMail } from './mail.js';
import { callableOptions, HOUR } from './options.js';

/** Must match MAX_CV_BYTES in src/components/ui/ApplicationForm.tsx. */
const MAX_CV_BYTES = 5 * 1024 * 1024;

/** Allowed CV formats, checked by extension and by the file's leading bytes. */
const CV_TYPES: Record<string, { mime: string; magic: number[] }> = {
  pdf: { mime: 'application/pdf', magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  docx: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', magic: [0x50, 0x4b, 0x03, 0x04] }, // ZIP
  doc: { mime: 'application/msword', magic: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE2
};

function readCv(input: Input) {
  const cv = input.cv;
  if (!cv || typeof cv !== 'object') return invalid('cv');
  const { name, data } = cv as Input;
  if (typeof name !== 'string' || typeof data !== 'string' || name.length > 200) return invalid('cv');
  // Reject oversized payloads before decoding them.
  if (data.length > Math.ceil(MAX_CV_BYTES / 3) * 4) throw new HttpsError('invalid-argument', 'CV must be 5 MB or smaller', { field: 'cv' });

  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const type = CV_TYPES[ext];
  const bytes = Buffer.from(data, 'base64');
  if (!type || bytes.length === 0 || !type.magic.every((b, i) => bytes[i] === b)) {
    throw new HttpsError('invalid-argument', 'CV must be a PDF or Word document', { field: 'cv' });
  }
  const safeName = name.replace(/[^\w.\- ]+/g, '_').slice(-100);
  return { bytes, ext, mime: type.mime, fileName: safeName };
}

/** Public careers endpoint. Validates the CV, stores it privately and records the application. */
export const submitApplication = onCall({ ...callableOptions, memory: '512MiB', timeoutSeconds: 60 }, async (req) => {
  const input = asInput(req.data);
  if (text(input, 'website', 500)) return { ok: true };

  const application = {
    name: text(input, 'name', 120, 2),
    email: email(input, 'email'),
    phone: text(input, 'phone', 40),
    portfolioUrl: url(input, 'portfolioUrl'),
    linkedinUrl: url(input, 'linkedinUrl'),
    message: text(input, 'message', 5000),
  };
  const positionId = text(input, 'positionId', 120);
  requireConsent(input);
  const cv = readCv(input);
  await enforceRateLimit(clientIp(req.rawRequest), 'application', 3, HOUR);

  const db = getFirestore();
  let positionTitle = 'General application';
  if (positionId) {
    const position = await db.collection('positions').doc(positionId).get();
    if (!position.exists || position.get('published') !== true) return invalid('positionId');
    positionTitle = String(position.get('title'));
  }

  const ref = db.collection('applications').doc();
  const cvPath = `applications/${ref.id}/cv.${cv.ext}`;
  await getStorage()
    .bucket()
    .file(cvPath)
    .save(cv.bytes, {
      contentType: cv.mime,
      metadata: { contentDisposition: `attachment; filename="${cv.fileName}"` },
    });

  const batch = db.batch();
  batch.set(ref, {
    ...application,
    positionId,
    positionTitle,
    cvPath,
    cvFileName: cv.fileName,
    consent: true,
    status: 'new',
    notes: '',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  queueSubmissionMail(batch, {
    kind: 'application',
    senderName: application.name,
    senderEmail: application.email,
    summary: [
      `Position: ${positionTitle}`,
      `Name: ${application.name}`,
      `Email: ${application.email}`,
      application.phone && `Phone: ${application.phone}`,
      application.portfolioUrl && `Portfolio: ${application.portfolioUrl}`,
      application.linkedinUrl && `LinkedIn: ${application.linkedinUrl}`,
      `CV: ${cv.fileName}`,
      application.message && `\n${application.message}`,
    ]
      .filter(Boolean)
      .join('\n'),
    confirmation: `Thank you for applying (${positionTitle}). We have received your application and CV, and will be in touch if there is a suitable match.`,
  });
  try {
    await batch.commit();
  } catch (err) {
    // Don't leave an orphaned CV behind if the record could not be written.
    await getStorage().bucket().file(cvPath).delete({ ignoreNotFound: true });
    throw err;
  }
  return { ok: true };
});
