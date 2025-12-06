// Central API URL used by the frontend.
// Prefer Vite env `VITE_API_URL`, then fallback to CRA-style `REACT_APP_API_URL`, then localhost.
export const API_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_URL) ||
  "http://localhost:4000";

export default API_URL;
