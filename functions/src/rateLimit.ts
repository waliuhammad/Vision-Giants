import { createHash } from 'node:crypto';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { HttpsError, type Request } from 'firebase-functions/v2/https';

/**
 * The caller's IP. Google's front end appends the real client address to X-Forwarded-For,
 * so the last entry is used (earlier entries can be supplied by the client).
 */
export function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const header = Array.isArray(forwarded) ? forwarded.join(',') : forwarded;
  const last = header?.split(',').map((s) => s.trim()).filter(Boolean).pop();
  return last ?? req.ip ?? 'unknown';
}

/**
 * Sliding-window limit of `limit` hits per `windowMs` for one IP and bucket.
 * IPs are stored only as hashes. Documents carry `expiresAt`, so a Firestore TTL policy on
 * `rateLimits.expiresAt` can clean them up automatically.
 */
export async function enforceRateLimit(ip: string, bucket: string, limit: number, windowMs: number): Promise<void> {
  const db = getFirestore();
  const id = createHash('sha256').update(`${bucket}:${ip}`).digest('hex');
  const ref = db.collection('rateLimits').doc(id);
  await db.runTransaction(async (tx) => {
    const now = Date.now();
    const snap = await tx.get(ref);
    const hits = ((snap.get('hits') as number[] | undefined) ?? []).filter((t) => now - t < windowMs);
    if (hits.length >= limit) {
      throw new HttpsError('resource-exhausted', 'Too many submissions. Please try again later.');
    }
    hits.push(now);
    tx.set(ref, { hits, expiresAt: Timestamp.fromMillis(now + windowMs) });
  });
}
