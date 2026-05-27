import { api } from './api';

export interface Transaction {
  id: string;
  buyerId: string;
  farmerId?: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  platformFee: number;
  logisticsFee: number;
  farmerAmount: number;
  deliveryLocation?: object;
  status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  escrowStatus: 'holding' | 'held' | 'released' | 'refunded';
  paymentReference?: string;
  paymentUrl?: string;
  createdAt?: string;
  timeline?: { status: string; timestamp: string; note: string }[];
}

export const transactionService = {
  initiate: (data: {
    buyerId: string;
    productId: string;
    quantity: number;
    deliveryLocation: object;
    totalAmount: number;
  }) =>
    api.post<{ success: boolean; transactionId: string; paymentUrl: string | null }>('/transactions/initiate', data),

  verify: (reference: string) =>
    api.post('/transactions/verify', { reference }),

  releaseEscrow: (transactionId: string) =>
    api.post(`/transactions/release/${transactionId}`),

  getUserTransactions: (userId: string) =>
    api.get<{ success: boolean; transactions: Transaction[] }>(`/transactions/user/${userId}`),
};
