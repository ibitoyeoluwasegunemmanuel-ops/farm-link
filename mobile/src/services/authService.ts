import { api } from './api';
import { UserRole } from '../navigation/types';

export const authService = {
  sendOTP: (phone: string) =>
    api.post('/auth/send-otp', { phone }),

  verifyOTP: (phone: string, otp: string) =>
    api.post<{ token: string; userId: string; isNewUser: boolean }>('/auth/verify-otp', { phone, otp }),

  setRole: (userId: string, role: UserRole) =>
    api.post('/auth/set-role', { userId, role }),

  createProfile: (userId: string, data: {
    name: string;
    email?: string;
    state: string;
    farmName?: string;
    bio?: string;
    avatarBase64?: string;
  }) =>
    api.post('/auth/create-profile', { userId, ...data }),

  submitKYC: (userId: string, data: {
    ninNumber?: string;
    bvnNumber?: string;
    docType: string;
    docFrontBase64: string;
    docBackBase64?: string;
    selfieBase64: string;
  }) =>
    api.post('/auth/kyc', { userId, ...data }),

  getProfile: () =>
    api.get('/auth/profile'),

  updateProfile: (data: Partial<{
    name: string;
    email: string;
    state: string;
    bio: string;
    farmName: string;
    avatarBase64: string;
  }>) =>
    api.put('/auth/profile', data),
};
