/**
 * frontend/src/services/api.js
 * API utility to fetch sales data from backend
 *
 * Uses Vite env var VITE_API_BASE_URL (set in Vercel)
 * Fallback to http://localhost:5000 for local development
 */

/** Base URL — use Vite env var when deployed */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetch paginated / filtered sales from backend
 * @param {Object} params - query parameters
 * @param {string} params.search
 * @param {string[]} params.regions
 * @param {string[]} params.genders
 * @param {number} params.ageMin
 * @param {number} params.ageMax
 * @param {string[]} params.categories
 * @param {string[]} params.tags
 * @param {string[]} params.paymentMethods
 * @param {string} params.dateFrom - YYYY-MM-DD
 * @param {string} params.dateTo - YYYY-MM-DD
 * @param {string} params.sortField
 * @param {'asc'|'desc'} params.sortDir
 * @param {number} params.page
 * @param {number} params.pageSize
 * @returns {Promise<Object>} { results: [...], total: number }
 */
export async function fetchSales(params = {}) {
  // shallow copy so we can normalize
  const q = { ...params };

  // Convert arrays into comma-separated strings expected by the backend
  const arrayFields = ['regions', 'genders', 'categories', 'tags', 'paymentMethods'];
  arrayFields.forEach((f) => {
    if (Array.isArray(q[f])) {
      q[f] = q[f].join(',');
    }
  });

  // Remove undefined / null / empty-string entries
  Object.keys(q).forEach((k) => {
    if (q[k] === undefined || q[k] === null || q[k] === '') {
      delete q[k];
    }
  });

  const searchParams = new URLSearchParams();
  for (const key of Object.keys(q)) {
    // ensure numbers are stringified
    searchParams.append(key, String(q[key]));
  }

  const url = `${API_BASE.replace(/\/+$/, '')}/api/sales${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    credentials: 'same-origin'
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch sales data: ${res.status} ${res.statusText} ${text}`);
  }

  return res.json();
}