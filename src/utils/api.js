// src/utils/api.js
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('jwtToken');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
};
