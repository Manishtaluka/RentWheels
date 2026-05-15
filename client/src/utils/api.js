

const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || "";

// ✅ Use this to prefix all API calls
export const apiUrl = (path) => `${BASE_URL}${path}`;

// Base API call function with token support
export const apiCall = async (url, method = "GET", body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const data = await res.json();

  return { res, data };
};