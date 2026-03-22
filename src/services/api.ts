import { DailyMenuResponse } from "../types";

// API client for self-hosted backend
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

// Auth User type
export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

// Get auth token from localStorage
function getToken(): string | null {
  return localStorage.getItem('xcook_token');
}

// API Error with code
export class ApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '请求失败' }));
    throw new ApiError(error.error || `HTTP ${response.status}`, error.code);
  }

  // Handle empty response
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    fetchApi<{ token: string; user: { uid: string; email: string; displayName?: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    }),

  login: (email: string, password: string) =>
    fetchApi<{ token: string; user: { uid: string; email: string; displayName?: string; photoURL?: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getCurrentUser: () =>
    fetchApi<{ uid: string; email: string; displayName?: string; photoURL?: string }>('/auth/me'),

  logout: () => {
    localStorage.removeItem('xcook_token');
    localStorage.removeItem('xcook_user');
  },

  setToken: (token: string) => {
    localStorage.setItem('xcook_token', token);
  },
};

// Recipes API
export const recipesApi = {
  getAll: () =>
    fetchApi<any[]>('/recipes'),

  getPublic: () =>
    fetchApi<any[]>('/recipes/public'),

  getById: (id: string) =>
    fetchApi<any>(`/recipes/${id}`),

  create: (recipe: any) =>
    fetchApi<any>('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipe),
    }),

  update: (id: string, updates: any) =>
    fetchApi<any>(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (id: string) =>
    fetchApi<void>(`/recipes/${id}`, {
      method: 'DELETE',
    }),

  rate: (id: string, rating: number) =>
    fetchApi<{ success: boolean; rating: number; ratingCount: number; userRating: number }>(`/recipes/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    }),

  getUserRating: (id: string) =>
    fetchApi<{ userRating: number | null }>(`/recipes/${id}/rating`),

  toggleFavorite: (id: string) =>
    fetchApi<{ success: boolean; isFavorite: boolean }>(`/recipes/${id}/favorite`, {
      method: 'POST',
    }),
};

// Nutrition API
export const nutritionApi = {
  getAll: () =>
    fetchApi<any[]>('/nutrition'),

  search: (query: string) =>
    fetchApi<any[]>(`/nutrition/search?q=${encodeURIComponent(query)}`),

  add: (name: string, nutrients: any) =>
    fetchApi<any>('/nutrition', {
      method: 'POST',
      body: JSON.stringify({ name, nutrients }),
    }),

  update: (name: string, nutrients: any) =>
    fetchApi<any>(`/nutrition/${encodeURIComponent(name)}`, {
      method: 'PUT',
      body: JSON.stringify({ nutrients }),
    }),

  delete: (name: string) =>
    fetchApi<void>(`/nutrition/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    }),

  adminLogin: (password: string) =>
    fetchApi<{ success: boolean }>('/nutrition/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
};

// Daily Menu API
export const dailyMenuApi = {
  get: (date?: string) =>
    fetchApi<DailyMenuResponse>(`/daily-menu${date ? `?date=${date}` : ''}`),

  save: (date: string, recipeIds: string[]) =>
    fetchApi<{ success: boolean; date: string; recipeIds: string[] }>(`/daily-menu`, {
      method: 'POST',
      body: JSON.stringify({ date, recipeIds }),
    }),

  delete: (date?: string) =>
    fetchApi<{ success: boolean }>(`/daily-menu${date ? `?date=${date}` : ''}`, {
      method: 'DELETE',
    }),
};

// Upload API
export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const url = `${API_BASE_URL}/upload/image`;
    const formData = new FormData();
    formData.append('image', file);

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: '上传失败' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return `${API_BASE_URL.replace('/api', '')}${data.url}`;
  },
};

export default {
  auth: authApi,
  recipes: recipesApi,
  nutrition: nutritionApi,
  upload: uploadApi,
};
