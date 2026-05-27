import { NavigatorScreenParams } from '@react-navigation/native';

// Auth stack
export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  OTP: { phone: string; purpose: 'signup' | 'login' | 'reset' };
  RoleSelection: { userId: string };
  CreateProfile: { userId: string; role: UserRole };
  KYC: { userId: string };
  AccountCreated: { role: UserRole; userId: string };
};

// Bottom tab navigator
export type MainTabParamList = {
  Home: undefined;
  Marketplace: undefined;
  Logistics: undefined;
  Wallet: undefined;
  Profile: undefined;
};

// Home stack (inside Home tab)
export type HomeStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
  Stories: { initialIndex?: number };
  Explore: undefined;
  Notifications: undefined;
  Messages: undefined;
  Chat: { userId: string; userName: string; avatarUri?: string };
  FarmerDashboard: undefined;
  BuyerDashboard: undefined;
  DriverDashboard: undefined;
};

// Marketplace stack
export type MarketplaceStackParamList = {
  MarketplaceHome: undefined;
  Category: { categoryId: string; categoryName: string };
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  OrderDetail: { orderId: string };
  Orders: undefined;
  Search: { initialQuery?: string };
};

// Logistics stack
export type LogisticsStackParamList = {
  LogisticsHome: undefined;
  BookTruck: undefined;
  BookingConfirmed: { bookingId: string };
  LiveTracking: { bookingId: string };
  DeliveryCompleted: { bookingId: string };
  DeliveryDetail: { deliveryId: string };
};

// Wallet stack
export type WalletStackParamList = {
  WalletHome: undefined;
  AddMoney: undefined;
  SendMoney: undefined;
  ScanPay: undefined;
  Withdraw: undefined;
  TransactionHistory: undefined;
  TransactionDetail: { transactionId: string };
};

// Profile stack
export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  Settings: undefined;
  NotificationSettings: undefined;
  PrivacySettings: undefined;
  SecuritySettings: undefined;
  AccountSettings: undefined;
  HelpSupport: undefined;
  FAQ: undefined;
  ContactUs: undefined;
  LiveChat: undefined;
  ReportIssue: undefined;
  Tickets: undefined;
  // AI screens
  AIAssistant: undefined;
  CropScanner: undefined;
  // Feature screens
  MarketPrices: undefined;
  Weather: undefined;
  Knowledge: undefined;
  Equipment: undefined;
  Finance: undefined;
  Investors: undefined;
  Fleet: undefined;
};

// Root navigator — wraps Auth and Main
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Convenience role type (mirrors theme.ts)
export type UserRole = 'farmer' | 'buyer' | 'transporter' | 'equipment_owner' | 'investor';

// Typed navigation/route hooks
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootNavProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

export type HomeNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>;
