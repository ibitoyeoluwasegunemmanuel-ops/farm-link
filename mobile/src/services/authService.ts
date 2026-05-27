import { api } from './api';
import { UserRole } from '../navigation/types';

export const authService = {
  sendOTP: (phoneNumber: string) =>
    api.post('/auth/send-otp', { phoneNumber }),

  verifyOTP: (phoneNumber: string, otp: string) =>
    api.post<{
      success: boolean;
      userId: string;
      token: string;
      isNewUser: boolean;
      user: Record<string, any>;
    }>('/auth/verify-otp', { phoneNumber, otp }),

  setRole: (userId: string, role: UserRole) =>
    api.post('/auth/set-role', { userId, role }),

  createProfile: (userId: string, data: {
    fullName: string;
    email?: string;
    state: string;
    farmName?: string;
    bio?: string;
    avatar?: string;
  }) =>
    api.post('/auth/profile', { userId, ...data }),

  getProfile: (userId: string) =>
    api.get<{ success: boolean; user: Record<string, any> }>(`/auth/profile/${userId}`),

  updateProfile: (userId: string, data: Partial<{
    fullName: string;
    email: string;
    state: string;
    bio: string;
    farmName: string;
    avatar: string;
  }>) =>
    api.post('/auth/profile', { userId, ...data }),
};
