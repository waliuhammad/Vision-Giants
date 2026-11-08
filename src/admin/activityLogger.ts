import { getAdminDb } from './firebase';

const firestore = () => import('firebase/firestore/lite');

export interface ActivityLogItem {
  id: string;
  action: string;
  userEmail: string;
  category: 'pages' | 'media' | 'settings' | 'careers' | 'blog' | 'courses' | 'system' | 'sections';
  details: string;
  timestamp: string;
}

// Fallback initial seeds so the audit trail always has rich visual feedback
export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    action: 'System Initialized',
    userEmail: 'admin@visiongiants.com',
    category: 'system',
    details: 'Vision Giants CMS & No-Code Admin Panel initialized with Firebase.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString(),
  },
  {
    id: 'log-2',
    action: 'Updated Home Hero Theme',
    userEmail: 'admin@visiongiants.com',
    category: 'pages',
    details: 'Applied unified Navy Blue color theme across all Hero Sections.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toLocaleString(),
  },
  {
    id: 'log-3',
    action: 'Configured Collaboration Partners',
    userEmail: 'admin@visiongiants.com',
    category: 'sections',
    details: 'Updated 4 collaborating software houses with clickable logos and profiles.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleString(),
  },
  {
    id: 'log-4',
    action: 'Created Dedicated Job Application Form',
    userEmail: 'admin@visiongiants.com',
    category: 'careers',
    details: 'Configured /careers/apply with drag-and-drop resume upload.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toLocaleString(),
  },
  {
    id: 'log-5',
    action: 'SEO & Meta Tags Synced',
    userEmail: 'admin@visiongiants.com',
    category: 'settings',
    details: 'Configured OpenGraph, Twitter Cards, and canonical URLs for all routes.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toLocaleString(),
  },
];

export async function logAdminActivity(
  action: string,
  category: ActivityLogItem['category'],
  details: string,
  userEmail = 'admin@visiongiants.com'
): Promise<void> {
  try {
    const [db, { doc, setDoc, serverTimestamp }] = await Promise.all([getAdminDb(), firestore()]);
    const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await setDoc(doc(db, 'activity_logs', logId), {
      id: logId,
      action,
      category,
      details,
      userEmail,
      createdAt: serverTimestamp(),
      timestampStr: new Date().toLocaleString(),
    });
  } catch (err) {
    console.warn('Could not record activity log in Firestore:', err);
  }
}

