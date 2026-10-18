import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types/workout';

export interface ProfileDoc {
  email?: string;
  username?: string;
  full_name?: string;
  current_week?: number;
  program_start_date?: string;
  days_per_week?: number;
  language_preference?: string;
  created_at?: string;
  updated_at?: unknown;
}

function toProfile(id: string, data: ProfileDoc): UserProfile {
  const created = data.created_at ? new Date(data.created_at) : new Date();
  return {
    id,
    email: data.email,
    username: data.username,
    fullName: data.full_name,
    createdAt: created,
    currentWeek: data.current_week ?? 1,
    programStartDate: data.program_start_date ? new Date(data.program_start_date) : created,
    daysPerWeek: data.days_per_week ?? undefined,
  };
}

export async function fetchProfileDoc(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'profiles', userId));
  if (!snap.exists()) return null;
  return toProfile(userId, snap.data() as ProfileDoc);
}

export async function ensureProfileDoc(
  userId: string,
  seed: {
    email?: string | null;
    fullName?: string;
    daysPerWeek?: number;
  }
): Promise<UserProfile> {
  const existing = await fetchProfileDoc(userId);
  if (existing) return existing;

  const days =
    seed.daysPerWeek === 3 || seed.daysPerWeek === 4 || seed.daysPerWeek === 5
      ? seed.daysPerWeek
      : 5;
  const now = new Date().toISOString();
  const payload: ProfileDoc = {
    email: seed.email ?? undefined,
    full_name: seed.fullName || seed.email?.split('@')[0] || 'Athlete',
    username: seed.email?.split('@')[0],
    current_week: 1,
    program_start_date: now.slice(0, 10),
    days_per_week: days,
    language_preference: localStorage.getItem('language_preference') || 'en',
    created_at: now,
    updated_at: serverTimestamp(),
  };

  await setDoc(doc(db, 'profiles', userId), payload, { merge: true });
  return toProfile(userId, payload);
}

export async function updateProfileDoc(
  userId: string,
  updates: Partial<{
    username: string;
    fullName: string;
    currentWeek: number;
    programStartDate: Date;
    languagePreference: string;
  }>
): Promise<void> {
  const patch: Record<string, unknown> = { updated_at: serverTimestamp() };
  if (updates.username !== undefined) patch.username = updates.username;
  if (updates.fullName !== undefined) patch.full_name = updates.fullName;
  if (updates.currentWeek !== undefined) patch.current_week = updates.currentWeek;
  if (updates.programStartDate !== undefined) {
    patch.program_start_date = updates.programStartDate.toISOString().slice(0, 10);
  }
  if (updates.languagePreference !== undefined) {
    patch.language_preference = updates.languagePreference;
  }
  await updateDoc(doc(db, 'profiles', userId), patch);
}

export async function getLanguagePreference(userId: string): Promise<string | null> {
  const snap = await getDoc(doc(db, 'profiles', userId));
  if (!snap.exists()) return null;
  return (snap.data() as ProfileDoc).language_preference ?? null;
}
