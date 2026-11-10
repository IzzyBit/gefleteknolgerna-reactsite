/**
 * Pub calendar data access.
 * Without VITE_SUPABASE_* variables, the demo uses browser-local dates only.
 * With Supabase configured, RLS policies in supabase/schema.sql protect edits and signups.
 */
const URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const isSharedCalendar = Boolean(URL && ANON_KEY);

const SHIFTS_KEY = 'gtech-trossen-shifts-v1';
const SESSION_KEY = 'gtech-trossen-admin-session-v1';

const localRead = () => {
  try {
    const data = JSON.parse(localStorage.getItem(SHIFTS_KEY) || '[]');
    return Array.isArray(data) ? data : [];
  } catch { return []; }
};
const localWrite = (items) => localStorage.setItem(SHIFTS_KEY, JSON.stringify(items));
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}
export function hasAdminSession() {
  const session = getSession();
  return Boolean(session?.access_token && session.expires_at > Date.now());
}
export function signOutAdmin() { sessionStorage.removeItem(SESSION_KEY); }

async function request(path, { method = 'GET', data, admin = false, prefer = undefined } = {}) {
  if (!isSharedCalendar) throw new Error('Ingen delad databas har konfigurerats.');
  const session = admin ? getSession() : null;
  if (admin && !hasAdminSession()) throw new Error('Du behöver logga in som administratör.');
  const response = await fetch(`${URL}${path}`, {
    method,
    headers: {
      apikey: ANON_KEY,
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(data !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(prefer ? { Prefer: prefer } : {})
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {})
  });
  if (!response.ok) {
    let message = `Serverfel (${response.status})`;
    try { const payload = await response.json(); message = payload.message || payload.error_description || payload.error || message; } catch { /* use status */ }
    if (response.status === 401 || response.status === 403) message = 'Åtkomst nekad. Kontrollera din inloggning och behörighet.';
    throw new Error(message);
  }
  if (response.status === 204) return null;
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

export async function loadShifts() {
  if (!isSharedCalendar) return localRead().sort((a, b) => a.date.localeCompare(b.date));
  return request('/rest/v1/pub_shifts?select=*&order=date.asc');
}

export async function saveShift(record) {
  const input = {
    date: record.date,
    opens: record.opens,
    closes: record.closes,
    work_from: record.work_from,
    work_to: record.work_to,
    helpers_needed: Number(record.helpers_needed),
    notes: (record.notes || '').trim()
  };
  if (!isSharedCalendar) {
    const shifts = localRead().filter(item => item.id !== record.id && item.date !== input.date);
    shifts.push({ ...input, id: record.id || uid() });
    localWrite(shifts);
    return;
  }
  if (record.id) {
    await request(`/rest/v1/pub_shifts?id=eq.${encodeURIComponent(record.id)}`, {
      method: 'PATCH', data: input, admin: true, prefer: 'return=representation'
    });
  } else {
    await request('/rest/v1/pub_shifts', {
      method: 'POST', data: input, admin: true, prefer: 'return=representation'
    });
  }
}

export async function deleteShift(id) {
  if (!isSharedCalendar) { localWrite(localRead().filter(item => item.id !== id)); return; }
  await request(`/rest/v1/pub_shifts?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', admin: true });
}

export async function submitSignup({ shift_id, name, contact_method, contact_value, consent }) {
  if (!consent) throw new Error('Du måste godkänna behandlingen av kontaktuppgifterna.');
  if (!isSharedCalendar) throw new Error('Lokalt läge använder e-postanmälan.');
  await request('/rest/v1/pub_signups', {
    method: 'POST',
    data: { shift_id, name: name.trim(), contact_method, contact_value: contact_value.trim(), consent: true },
    prefer: 'return=minimal'
  });
}

export async function logInAdmin(email, password) {
  const auth = await request('/auth/v1/token?grant_type=password', {
    method: 'POST', data: { email, password }
  });
  if (!auth?.access_token) throw new Error('Kunde inte logga in.');
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ access_token: auth.access_token, expires_at: Date.now() + (auth.expires_in || 3600) * 1000 - 30000 }));
  try {
    const isAdmin = await request('/rest/v1/rpc/is_pub_admin', { method: 'POST', data: {}, admin: true });
    if (isAdmin !== true) throw new Error('Kontot saknar administratörsbehörighet för kalendern.');
  } catch (err) {
    signOutAdmin();
    throw err;
  }
}

export async function loadSignups(shiftId) {
  if (!isSharedCalendar) return [];
  return request(`/rest/v1/pub_signups?select=id,name,contact_method,contact_value,created_at&shift_id=eq.${encodeURIComponent(shiftId)}&order=created_at.asc`, { admin: true });
}

export async function deleteSignup(id) {
  if (!isSharedCalendar) return;
  await request(`/rest/v1/pub_signups?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', admin: true });
}
