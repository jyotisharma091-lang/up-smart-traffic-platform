import axiosInstance from '../apis/axiosInstance';
import type { User, Violation, Vehicle, Hotspot, Notification } from '../types';

export const ApiService = {
  login: async (identifier: string, passwordPlain: string) => {
    const response = await axiosInstance.post('/auth/login', {
      identifier,
      password: passwordPlain
    });
    return response.data; // expects { success, token, user }
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await axiosInstance.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },

  submitViolation: async (payload: { district: string, location: string, imageBase64: string | null, vehicleNumber?: string, violationType?: string, violatorMobile?: string }) => {
    const response = await axiosInstance.post('/violations', payload);
    return response.data;
  },

  analyzeImage: async (imageBase64: string) => {
    const response = await axiosInstance.post('/violations/analyze-image', { base64Image: imageBase64.split(',')[1] || imageBase64 });
    return response.data;
  },

  getViolations: async () => {
    const response = await axiosInstance.get('/violations');
    return response.data.data;
  },

  getVerificationQueue: async () => {
    const response = await axiosInstance.get(`/violations/verification-queue?_t=${Date.now()}`);
    return response.data.data;
  },

  updateViolationStatus: async (id: string, status: string, violationType?: string) => {
    const response = await axiosInstance.put(`/violations/${id}/status`, { status, violationType });
    return response.data;
  },

  searchVehicle: async (regNumber: string) => {
    try {
      const response = await axiosInstance.get(`/vehicles/${regNumber}`);
      return response.data.data;
    } catch (e) {
      return null;
    }
  },

  getDashboardMetrics: async () => {
    try {
      const response = await axiosInstance.get('/analytics/dashboard');
      return response.data.data;
    } catch (e) {
      return { todaysViolations: 0, pendingReviews: 0, activeOfficers: 0 };
    }
  },

  getOfficerActivity: async () => {
    try {
      const response = await axiosInstance.get('/analytics/officer-activity');
      return response.data.data;
    } catch (e) {
      return [];
    }
  },

  getHeatmapData: async () => {
    const response = await axiosInstance.get('/analytics/heatmap');
    return response.data.data;
  },

  // Missing methods re-added for frontend compatibility
  registerUser: async (user: any) => {
    const response = await axiosInstance.post('/users', user);
    return response.data.data;
  },
  
  getHotspots: async () => {
    return Promise.resolve([]);
  },

  getNotifications: async (): Promise<Notification[]> => {
    return Promise.resolve([]);
  },
};
