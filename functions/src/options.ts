import type { CallableOptions } from 'firebase-functions/v2/https';

/** Must match FUNCTIONS_REGION in src/config/firebase.ts. */
export const REGION = 'us-central1';

export const HOUR = 60 * 60 * 1000;

export const callableOptions: CallableOptions = {
  region: REGION,
  cors: true,
  maxInstances: 10,
  memory: '256MiB',
};
