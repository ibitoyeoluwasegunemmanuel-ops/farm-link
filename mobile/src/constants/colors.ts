export const Colors = {
  // ─── Brand Core ───────────────────────────────────────────────
  // Extracted from FarmLink UI: dark forest green brand identity
  splashBg: '#0D2318',          // Splash screen / dark section backgrounds
  primary: '#1B5E20',           // Main CTA buttons, active states
  primaryMedium: '#2E7D32',     // Hover states, secondary buttons
  primaryLight: '#4CAF50',      // Light accents, icons on dark bg
  primaryLighter: '#81C784',    // Very light green tints
  primaryTint: '#E8F5E9',       // Green tint backgrounds (pills, chips)

  // ─── Brand Accent ─────────────────────────────────────────────
  accent: '#52B788',            // Complementary green accent
  accentLight: '#B7E4C7',       // Light accent

  // ─── Neutrals ─────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  background: '#FFFFFF',        // App background
  surface: '#F8FAF8',           // Surface/card background
  surfaceElevated: '#FFFFFF',   // Elevated cards
  inputBg: '#F5F7F5',           // Input field backgrounds

  // ─── Text ─────────────────────────────────────────────────────
  textPrimary: '#1A1A1A',       // Main text
  textSecondary: '#6B7280',     // Secondary/muted text
  textTertiary: '#9CA3AF',      // Placeholder, disabled text
  textInverse: '#FFFFFF',       // Text on dark backgrounds
  textGreen: '#1B5E20',         // Green text (badges, labels)
  textLink: '#2E7D32',          // Clickable links

  // ─── Borders / Dividers ───────────────────────────────────────
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  divider: '#F0F0F0',

  // ─── Status ───────────────────────────────────────────────────
  success: '#22C55E',
  successBg: '#F0FDF4',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  info: '#3B82F6',
  infoBg: '#EFF6FF',

  // ─── Marketplace / Order Status ───────────────────────────────
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  inTransit: '#8B5CF6',
  delivered: '#22C55E',
  cancelled: '#EF4444',

  // ─── Overlay ──────────────────────────────────────────────────
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.3)',
  overlayDark: 'rgba(0,0,0,0.7)',

  // ─── Social / Engagement ──────────────────────────────────────
  like: '#EF4444',
  share: '#3B82F6',
  comment: '#6B7280',

  // ─── Escrow / Finance ─────────────────────────────────────────
  escrowGold: '#F59E0B',
  escrowGoldBg: '#FFFBEB',

  // ─── Gradients (as arrays for LinearGradient) ─────────────────
  gradientPrimary: ['#1B5E20', '#2E7D32'] as [string, string],
  gradientDark: ['#0D2318', '#1B5E20'] as [string, string],
  gradientLight: ['#E8F5E9', '#F1F8F1'] as [string, string],
  gradientCard: ['#FFFFFF', '#F8FAF8'] as [string, string],

  // ─── Tab / Navigation ─────────────────────────────────────────
  tabActive: '#1B5E20',
  tabInactive: '#9CA3AF',
  tabBackground: '#FFFFFF',

  // ─── Shadows ──────────────────────────────────────────────────
  shadowColor: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
