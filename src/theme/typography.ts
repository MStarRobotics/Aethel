// Aethel design system — typography tokens
// Source: pages/00-design-system.md
// Font sizes use responsiveFontSize from react-native-responsive-dimensions
// Design canvas: 390x844 (iPhone 14)
// Formula: (designPx / sqrt(390 * 844)) * 100

import { responsiveFontSize as rf } from 'react-native-responsive-dimensions';

export const fonts = {
  serif: 'NotoSerif',
  sans: 'PlusJakartaSans',
  sansMedium: 'PlusJakartaSans-Medium',
  sansSemiBold: 'PlusJakartaSans-SemiBold',
} as const;

export const typography = {
  'display-lg': {
    fontFamily: fonts.serif,
    fontSize: rf(6.7),   // 57px
    fontWeight: '400' as const,
    letterSpacing: -1.14,
    lineHeight: rf(7.5),
  },
  'display-md': {
    fontFamily: fonts.serif,
    fontSize: rf(5.3),   // 45px
    fontWeight: '400' as const,
    letterSpacing: -0.9,
    lineHeight: rf(6.1),
  },
  'headline-lg': {
    fontFamily: fonts.serif,
    fontSize: rf(3.8),   // 32px
    fontWeight: '400' as const,
    letterSpacing: -0.48,
    lineHeight: rf(4.7),
  },
  'headline-md': {
    fontFamily: fonts.serif,
    fontSize: rf(3.3),   // 28px
    fontWeight: '400' as const,
    letterSpacing: -0.28,
    lineHeight: rf(4.2),
  },
  'headline-sm': {
    fontFamily: fonts.serif,
    fontSize: rf(2.8),   // 24px
    fontWeight: '400' as const,
    letterSpacing: -0.12,
    lineHeight: rf(3.8),
  },
  'title-lg': {
    fontFamily: fonts.sansSemiBold,
    fontSize: rf(2.6),   // 22px
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: rf(3.3),
  },
  'title-md': {
    fontFamily: fonts.sansSemiBold,
    fontSize: rf(1.9),   // 16px
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: rf(2.8),
  },
  'body-lg': {
    fontFamily: fonts.sans,
    fontSize: rf(1.9),   // 16px
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    lineHeight: rf(2.8),
  },
  'body-md': {
    fontFamily: fonts.sans,
    fontSize: rf(1.6),   // 14px
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: rf(2.4),
  },
  'label-lg': {
    fontFamily: fonts.sansSemiBold,
    fontSize: rf(1.6),   // 14px
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: rf(2.4),
  },
  'label-md': {
    fontFamily: fonts.sansSemiBold,
    fontSize: rf(1.4),   // 12px
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: rf(1.9),
  },
  'label-sm': {
    fontFamily: fonts.sansMedium,
    fontSize: rf(1.3),   // 11px
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    lineHeight: rf(1.9),
  },
} as const;
