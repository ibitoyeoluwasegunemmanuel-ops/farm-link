import { Colors } from './colors';
import { FontFamily, FontSize, TextStyles } from './typography';
import { Spacing, Radius, Shadow, Layout } from './spacing';

export const Theme = {
  colors: Colors,
  fonts: FontFamily,
  fontSizes: FontSize,
  textStyles: TextStyles,
  spacing: Spacing,
  radius: Radius,
  shadow: Shadow,
  layout: Layout,
} as const;

export type ThemeType = typeof Theme;

// Naira currency formatter
export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

// Nigerian states for dropdowns
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

// Crop categories matching the marketplace
export const CROP_CATEGORIES = [
  { id: 'crops', label: 'Crops & Produce', icon: 'leaf' },
  { id: 'livestock', label: 'Livestock & Poultry', icon: 'paw' },
  { id: 'fruits', label: 'Fruits', icon: 'nutrition' },
  { id: 'vegetables', label: 'Vegetables', icon: 'plant' },
  { id: 'oils', label: 'Oils & Seeds', icon: 'water' },
  { id: 'fertilizers', label: 'Fertilizers', icon: 'flask' },
  { id: 'equipment', label: 'Farm Equipment', icon: 'construct' },
  { id: 'tools', label: 'Tools & Inputs', icon: 'hammer' },
];

// Product quality grades
export const QUALITY_GRADES = ['Premium', 'Good', 'Average'] as const;
export type QualityGrade = typeof QUALITY_GRADES[number];

// Units of measurement
export const PRODUCT_UNITS = [
  'kg', 'tonnes', 'bags', 'crates', 'litres', 'gallons',
  'pieces', 'bundles', 'sacks', 'drums',
] as const;

// Vehicle types for logistics
export const VEHICLE_TYPES = [
  { id: 'pickup', label: 'Pickup Truck', capacity: '1-2 Tons', basePrice: 25000 },
  { id: 'small', label: 'Small Truck', capacity: '2-5 Tons', basePrice: 45000 },
  { id: 'medium', label: 'Medium Truck', capacity: '5-7 Tons', basePrice: 75000 },
  { id: 'large', label: 'Large Truck', capacity: '10-15 Tons', basePrice: 120000 },
  { id: 'trailer', label: 'Trailer / Articulated', capacity: 'Up to 30 Tons', basePrice: 200000 },
] as const;

// User roles
export const USER_ROLES = {
  FARMER: 'farmer',
  BUYER: 'buyer',
  DRIVER: 'driver',
  EQUIPMENT: 'equipment',
  INVESTOR: 'investor',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Transaction/Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
} as const;

// App-wide config
export const APP_CONFIG = {
  platformFeePercent: 2,        // 2% marketplace commission
  logisticsFeePercent: 5,       // 5% logistics commission
  escrowHoldDays: 7,
  otpExpiryMinutes: 10,
  maxOTPAttempts: 5,
  defaultCurrency: 'NGN',
  countryCode: '+234',
} as const;
