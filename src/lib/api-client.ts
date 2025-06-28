const API_BASE = '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || 'Request failed');
  }

  return response.json();
}

export const apiClient = {
  auth: {
    login: async (username: string, password: string) => {
      const data = await fetchWithAuth(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
      }
      return data;
    },
    
    register: async (username: string, password: string) => {
      const data = await fetchWithAuth(`${API_BASE}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
      }
      return data;
    },
    
    logout: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
    },
  },
  
  connections: {
    list: () => fetchWithAuth(`${API_BASE}/connections`),
    
    create: (name: string, url: string) => 
      fetchWithAuth(`${API_BASE}/connections`, {
        method: 'POST',
        body: JSON.stringify({ name, url }),
      }),
    
    delete: (id: number) => 
      fetchWithAuth(`${API_BASE}/connections?id=${id}`, {
        method: 'DELETE',
      }),
  },
};