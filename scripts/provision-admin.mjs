#!/usr/bin/env node
/**
 * Administrator Provisioning Script for Vision Giants Admin Panel
 *
 * Usage:
 *   node scripts/provision-admin.mjs
 *   npm run admin:provision
 *
 * Options:
 *   --username <name>     Administrator username
 *   --email <email>       Administrator email address
 *   --password <pass>     Administrator password (min 8 chars)
 *   --emulators           Connect to local Firebase emulators
 *   --service-account <p> Path to service account JSON (defaults to serviceAccountKey.json if present)
 */

import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Load environment variables from .env.local or .env if present
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(projectRoot, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}
loadEnv();

// Parse command line arguments
const args = process.argv.slice(2);
function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}
const hasFlag = (flag) => args.includes(flag);

const argUsername = getArg('--username');
const argEmail = getArg('--email');
const argPassword = getArg('--password');
const useEmulatorsFlag = hasFlag('--emulators') || process.env.VITE_FIREBASE_USE_EMULATORS === 'true';
const argServiceAccount = getArg('--service-account') || process.env.GOOGLE_APPLICATION_CREDENTIALS || (fs.existsSync(path.join(projectRoot, 'serviceAccountKey.json')) ? path.join(projectRoot, 'serviceAccountKey.json') : null);

// Hidden input prompt for passwords
function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const stdin = process.stdin;

    process.stdout.write(question);

    let password = '';
    const onData = (char) => {
      char = char.toString();
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.pause();
          break;
        case '\u0003':
          process.exit();
          break;
        case '\b':
        case '\x7f':
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    };

    if (stdin.isTTY) {
      stdin.setRawMode(true);
      stdin.resume();
      stdin.on('data', onData);
    }

    rl.question('', () => {
      if (stdin.isTTY) {
        stdin.removeListener('data', onData);
        stdin.setRawMode(false);
      }
      process.stdout.write('\n');
      rl.close();
      resolve(password);
    });
  });
}

function promptText(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function resolveFirebaseAdmin() {
  const { createRequire } = await import('node:module');
  const req = createRequire(path.join(projectRoot, 'functions', 'package.json'));
  try {
    const app = req('firebase-admin/app');
    const authMod = req('firebase-admin/auth');
    const firestoreMod = req('firebase-admin/firestore');
    return {
      initializeApp: app.initializeApp,
      cert: app.cert,
      getAuth: authMod.getAuth,
      getFirestore: firestoreMod.getFirestore,
      FieldValue: firestoreMod.FieldValue,
    };
  } catch (err) {
    throw new Error('Could not load firebase-admin modules from functions: ' + err.message);
  }
}

async function main() {
  console.log('\n======================================================');
  console.log('   VISION GIANTS - FIRST ADMINISTRATOR PROVISIONING   ');
  console.log('======================================================\n');

  let adminSdk;
  try {
    adminSdk = await resolveFirebaseAdmin();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }

  const { initializeApp, cert, getAuth, getFirestore, FieldValue } = adminSdk;

  // Determine Project ID
  let projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    try {
      const firebaserc = JSON.parse(fs.readFileSync(path.join(projectRoot, '.firebaserc'), 'utf8'));
      projectId = firebaserc?.projects?.default;
    } catch {
      // ignore
    }
  }
  if (!projectId) {
    projectId = 'visiongiants-4d74d';
  }

  let app;
  // Configure Emulators or Service Account
  if (useEmulatorsFlag) {
    console.log('[MODE] Using local Firebase Emulators (Auth :9099, Firestore :8080)');
    process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
    process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
    app = initializeApp({ projectId });
  } else if (argServiceAccount && fs.existsSync(argServiceAccount)) {
    console.log(`[MODE] Using Firebase Service Account credentials: ${argServiceAccount}`);
    const serviceAccount = JSON.parse(fs.readFileSync(argServiceAccount, 'utf8'));
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || projectId,
    });
  } else {
    // Check if application default credentials work
    try {
      app = initializeApp({ projectId });
    } catch {
      app = null;
    }
  }

  if (!app) {
    console.log('ℹ️  No local service account key (serviceAccountKey.json) or active emulators detected.');
    console.log('\nYou have 3 secure options to provision your administrator account:\n');
    console.log('--- Option 1 (Recommended for Local Dev): Firebase Emulators ---');
    console.log('  1. Start emulators: npm run emulators');
    console.log('  2. Run this command with --emulators:');
    console.log('     node scripts/provision-admin.mjs --emulators\n');
    console.log('--- Option 2 (Recommended for Production via Script): Service Account ---');
    console.log('  1. Open Firebase Console: https://console.firebase.google.com/project/' + projectId + '/settings/serviceaccounts/adminsdk');
    console.log('  2. Click "Generate new private key" and save as "serviceAccountKey.json" in project root.');
    console.log('  3. Run: npm run admin:provision\n');
    console.log('--- Option 3 (Direct in Firebase Console - Fastest for Production): ---');
    console.log('  1. Open Firebase Authentication: https://console.firebase.google.com/project/' + projectId + '/authentication/users');
    console.log('  2. Click "Add user", enter your email & secure password.');
    console.log('  3. Copy the created User UID.');
    console.log('  4. Open Firestore: https://console.firebase.google.com/project/' + projectId + '/firestore');
    console.log('  5. In the "admins" collection, add a document with Document ID = [User UID].');
    console.log('  6. Add fields: username (string), email (string), role: "admin".\n');
    console.log('======================================================\n');
    process.exit(0);
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  // 1. Gather Username
  let username = argUsername;
  while (!username) {
    username = await promptText('Enter Administrator Username [e.g. admin]: ');
    if (!username) username = 'admin';
  }

  // 2. Gather Email
  let email = argEmail;
  while (!email) {
    email = await promptText('Enter Administrator Email Address: ');
    if (!email || !email.includes('@')) {
      console.log('⚠️  Please enter a valid email address.');
      email = null;
    }
  }

  // 3. Gather Password & Confirmation
  let password = argPassword;
  if (!password) {
    let confirm = '';
    while (!password || password.length < 8 || password !== confirm) {
      password = await promptHidden('Enter Administrator Password (min 8 chars): ');
      if (password.length < 8) {
        console.log('⚠️  Password must be at least 8 characters long.');
        password = '';
        continue;
      }
      confirm = await promptHidden('Confirm Administrator Password: ');
      if (password !== confirm) {
        console.log('⚠️  Passwords do not match. Please try again.\n');
        password = '';
        confirm = '';
      }
    }
  } else if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  console.log('\nProvisioning administrator account...');

  try {
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log(`ℹ️  Existing Firebase Auth user found (UID: ${user.uid}). Updating credentials...`);
      await auth.updateUser(user.uid, {
        password,
        displayName: username,
        emailVerified: true,
      });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        user = await auth.createUser({
          email,
          password,
          displayName: username,
          emailVerified: true,
        });
        console.log(`✅ User created in Firebase Authentication (UID: ${user.uid}).`);
      } else {
        throw err;
      }
    }

    // Set document in Firestore admins collection
    await db.collection('admins').doc(user.uid).set(
      {
        username,
        email,
        role: 'admin',
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`✅ Firestore authorization document set: admins/${user.uid}`);

    console.log('\n======================================================');
    console.log('   ADMINISTRATOR ACCOUNT CONFIGURED & VERIFIED        ');
    console.log('======================================================');
    console.log(`Admin Username:  ${username}`);
    console.log(`Admin Email:     ${email}`);
    console.log(`Admin UID:       ${user.uid}`);
    console.log(`Admin Role:      admin`);
    console.log(`Status:          Active and authorized`);
    console.log('\nLogin at:        /admin or /admin/login');
    console.log('Security Note:   Passwords are never stored in plaintext and are securely hashed by Firebase Auth.');
    console.log('======================================================\n');
  } catch (err) {
    if (err.message && err.message.includes('Could not load the default credentials')) {
      console.log('\n❌ Authentication Note: No Google Cloud / Firebase service credentials found on this machine.\n');
      console.log('To complete your administrator account setup, please choose one of these simple methods:\n');
      console.log('────────────────────────────────────────────────────────────────────────');
      console.log(' METHOD 1: Firebase Console (Fastest & 100% Secure for Production)');
      console.log('────────────────────────────────────────────────────────────────────────');
      console.log(` 1. Open Firebase Authentication:`);
      console.log(`    https://console.firebase.google.com/project/${projectId}/authentication/users`);
      console.log(` 2. Click "Add user", enter your email (${email || 'your-admin@example.com'}) and your secure password.`);
      console.log(` 3. Copy the created User UID.`);
      console.log(` 4. Open Firestore Database:`);
      console.log(`    https://console.firebase.google.com/project/${projectId}/firestore`);
      console.log(` 5. In the "admins" collection, create a document with Document ID = [User UID].`);
      console.log(` 6. Add fields:`);
      console.log(`    - username (string): "${username || 'admin'}"`);
      console.log(`    - email (string):    "${email || 'your-admin@example.com'}"`);
      console.log(`    - role (string):     "admin"`);
      console.log(` 7. Open the Admin Panel at /admin and log in!\n`);
      console.log('────────────────────────────────────────────────────────────────────────');
      console.log(' METHOD 2: CLI Provisioning with Service Account Key');
      console.log('────────────────────────────────────────────────────────────────────────');
      console.log(` 1. Open Firebase Console Service Accounts:`);
      console.log(`    https://console.firebase.google.com/project/${projectId}/settings/serviceaccounts/adminsdk`);
      console.log(` 2. Click "Generate new private key" and save as "serviceAccountKey.json" in this project's root folder.`);
      console.log(` 3. Run: npm run admin:provision`);
      console.log(`    (It will automatically detect the key and configure your account)\n`);
      console.log('────────────────────────────────────────────────────────────────────────');
      console.log(' METHOD 3: Local Development with Firebase Emulators');
      console.log('────────────────────────────────────────────────────────────────────────');
      console.log(` 1. Start local emulators: npm run emulators`);
      console.log(` 2. Run: npm run admin:provision -- --emulators\n`);
      console.log('======================================================\n');
      process.exit(1);
    }
    console.error('\n❌ Provisioning failed:', err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
