import { Platform } from 'react-native';

// FarmLink uses Poppins throughout the app (matches the design system)
export const FontFamily = {
  thin: 'Poppins_100Thin',
  extraLight: 'Poppins_200ExtraLight',
  light: 'Poppins_300Light',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
  black: 'Poppins_900Black',
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 36,
  '7xl': 40,
} as const;

export const LineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
  loose: 2,
} as const;

export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
} as const;

// Pre-built text styles matching FarmLink designs
export const TextStyles = {
  // Display
  displayLarge: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['6xl'],
    lineHeight: FontSize['6xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  displayMedium: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['5xl'],
    lineHeight: FontSize['5xl'] * LineHeight.tight,
  },
  displaySmall: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['4xl'],
    lineHeight: FontSize['4xl'] * LineHeight.snug,
  },

  // Headline
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    lineHeight: FontSize['3xl'] * LineHeight.snug,
  },
  h2: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.snug,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.normal,
  },
  h4: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.normal,
  },

  // Body
  bodyLarge: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.normal,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
  },
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
  },

  // Label
  labelLarge: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.snug,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.snug,
  },
  labelSmall: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.snug,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase' as const,
  },

  // Button
  buttonLarge: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.tight,
    letterSpacing: LetterSpacing.wide,
  },
  button: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.tight,
  },
  buttonSmall: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.tight,
  },

  // Price / Numbers
  priceXL: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['5xl'],
  },
  priceLarge: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
  },
  price: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
  },
  priceSmall: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
  },

  // Caption
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.normal,
  },
} as const;

export type TextStyleKey = keyof typeof TextStyles;
