// src/lib/api.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getToken() {
  return localStorage.getItem('token') || '';
}

export async function apiFetch(
  path,
  { method = 'GET', body, isForm = false, token } = {}
) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';

  const auth = token ?? getToken();
  if (auth) headers['Authorization'] = `Bearer ${auth}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get('content-type') || '';
  const parsed = ct.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = parsed?.error || parsed?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return parsed;
}

// Auth
export async function login(username, password) {
  return apiFetch('/login', { method: 'POST', body: { username, password } });
}
export async function register(username, password) {
  return apiFetch('/register', { method: 'POST', body: { username, password } });
}

// Perfis
export async function fetchProfiles({ page = 1, pageSize = 60 } = {}) {
  return apiFetch(`/profiles?page=${page}&pageSize=${pageSize}`);
}
export async function createProfile(profile) {
  return apiFetch('/profiles', { method: 'POST', body: profile });
}

// IA
export async function aiSuggest({ skills = [], area = '', city = '', k = 6 }) {
  return apiFetch('/ai/suggest', { method: 'POST', body: { skills, area, city, k } });
}
export async function aiExtract(text) {
  return apiFetch('/ai/extract', { method: 'POST', body: { text } });
}
export async function aiSummary(profile) {
  return apiFetch('/ai/summary', { method: 'POST', body: { profile } });
}

// Upload
export async function uploadPhoto(file) {
  const fd = new FormData();
  fd.append('photo', file);
  return apiFetch('/upload/photo', { method: 'POST', body: fd, isForm: true });
}

// Recomendações
export async function recommendProfile(payload) {
  // payload: { toId, message, from }
  return apiFetch('/recommend', { method: 'POST', body: payload });
}
