import { api } from './api';

export interface Harvest {
  id: string;
  farmerId: string;
  cropType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  quality: string;
  description?: string;
  harvestDate?: string;
  location?: { state?: string; town?: string; address?: string };
  images?: string[];
  status: string;
  views?: number;
  createdAt?: string;
  farmer?: { id: string; fullName?: string; farmName?: string; rating?: number };
}

export const harvestService = {
  getListings: (params?: { cropType?: string; state?: string; limit?: number }) =>
    api.get<{ success: boolean; count: number; data: Harvest[] }>('/harvests', { params }),

  getListing: (harvestId: string) =>
    api.get<{ success: boolean; data: Harvest & { farmer: any } }>(`/harvests/${harvestId}`),

  getFarmerListings: (farmerId: string) =>
    api.get<{ success: boolean; data: Harvest[] }>(`/harvests/farmer/${farmerId}`),

  createListing: (data: {
    farmerId: string;
    cropType: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    quality: string;
    description?: string;
    harvestDate?: string;
    location?: object;
    images?: string[];
  }) => api.post<{ success: boolean; harvestId: string }>('/harvests/create', data),

  updateListing: (harvestId: string, data: Partial<Harvest>) =>
    api.put(`/harvests/${harvestId}`, data),
};
