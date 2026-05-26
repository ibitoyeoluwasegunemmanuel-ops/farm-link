import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = __DEV__
  ? 'http://10.0.2.2:5000/api'   // Android emulator → localhost
  : 'https://api.farmlink.ng/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token on every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@farmlink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['@farmlink_user', '@farmlink_token']);
    }
    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    return data?.message || data?.error || 'Something went wrong. Please try again.';
  }
  return 'Network error. Check your connection.';
};
