// API utility to fetch sales data from backend
const BASE_URL = 'http://localhost:5000/api/sales';

/*
params = {
  search: string,
  regions: array of string,
  genders: array of string,
  ageMin: number,
  ageMax: number,
  categories: array of string,
  tags: array of string,
  paymentMethods: array of string,
  dateFrom: string,
  dateTo: string,
  sortField: string,
  sortDir: string ('asc'|'desc'),
  page: number
}
*/
export async function fetchSales(params = {}) {
  const query = {...params};
  // Convert arrays to comma-separated for backend
  ['regions','genders','categories','tags','paymentMethods'].forEach(f => {
    if (Array.isArray(query[f])) query[f] = query[f].join(',');
  });
  const searchParams = new URLSearchParams();
  for (const k in query) {
    if (query[k]!==undefined && query[k]!==null && query[k]!=="") {
      searchParams.append(k, query[k]);
    }
  }
  const url = `${BASE_URL}?${searchParams.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch sales data');
  return await res.json();
}
