import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Design canvas: 390x844 (iPhone 14)
// All fixed px values converted to percentages:
//   width%  = (px / 390) * 100
//   height% = (px / 844) * 100
//   font%   = (px / sqrt(390 * 844)) * 100

const LOGO_SIZE = rw(30.8);  // 120px / 390 * 100
const LOGO_TOP  = rh(38);    // centered at 38% from top per spec

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const insets = useSafeAreaInsets();

  const logoOpacity    = useRef(new Animated.Value(0)).current;
  const logoScale      = useRef(new Animated.Value(0.8)).current;
  const nameOpacity    = useRef(new Animated.Value(0)).current;
  const nameTranslateY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;
  const screenOpacity  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance — matches animation table in 01-splash-screen.md
    Animated.sequence([
      // Logo: fade-in + scale 0.8→1.0, 400ms ease-out
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // App name: slide up 20px + fade-in, 500ms
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(nameTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Tagline: fade-in, 600ms
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading bar: fill left→right over 2000ms linear
    // useNativeDriver: false — width is a layout property, can't use native driver
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Screen exit: fade out after 2.5s then call onFinish
    const exitTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2500);

    return () => clearTimeout(exitTimer);
  }, []);

  const loadingBarWidth = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.surface_container_lowest}
        translucent
      />

      {/* Radial glow — primary_container at 15% opacity, 200px radius on canvas */}
      <View style={styles.radialGlow} />

      {/* Logo — 120px circle, centered, 38% from top */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          {/*
            Replace this placeholder with your actual logo:
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: LOGO_SIZE / 2 }}
            />
          */}
          <Text style={styles.logoFallback}>A</Text>
        </View>
      </Animated.View>

      {/* App name — Noto Serif display-md, 24px below logo */}
      <Animated.View
        style={[
          styles.appNameWrapper,
          {
            opacity: nameOpacity,
            transform: [{ translateY: nameTranslateY }],
          },
        ]}
      >
        <Text style={styles.appName}>Aethel</Text>
      </Animated.View>

      {/* Tagline — Plus Jakarta Sans label-sm, uppercase, 8px below name */}
      <Animated.View style={[styles.taglineWrapper, { opacity: taglineOpacity }]}>
        <Text style={styles.tagline}>Find Your Person</Text>
      </Animated.View>

      {/* Loading bar — 200px wide on canvas = rw(51.3), bottom 18% */}
      <View style={[styles.loadingTrack, { bottom: rh(18) + insets.bottom }]}>
        <Animated.View style={[styles.loadingFill, { width: loadingBarWidth }]}>
          <LinearGradient
            colors={[colors.primary_container, colors.secondary_container]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* Version — label-sm, on_surface at 30% opacity, 16px below loading bar */}
      <View style={[styles.versionWrapper, { bottom: rh(18) + insets.bottom - rh(4) }]}>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface_container_lowest,
    alignItems: 'center',
  },

  // 200px radius on 390px canvas → rw(51) diameter, centered behind logo
  radialGlow: {
    position: 'absolute',
    top: LOGO_TOP - rw(25.5),
    width: rw(51),
    height: rw(51),
    borderRadius: rw(25.5),
    backgroundColor: 'rgba(178, 31, 60, 0.15)',
    alignSelf: 'center',
  },

  logoWrapper: {
    position: 'absolute',
    top: LOGO_TOP - LOGO_SIZE / 2,
    alignSelf: 'center',
    // iOS: coloured glow via shadow props
    // Android: elevation only — no coloured glow natively without a library
    ...Platform.select({
      ios: {
        shadowColor: colors.primary_container,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 60,   // spec: 60px blur
      },
      android: {
        elevation: 12,
      },
    }),
  },

  logoCircle: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: colors.surface_container,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  logoFallback: {
    ...typography['display-md'],
    color: colors.on_surface,
  },

  // 24px below logo bottom → rh(2.8) ≈ 24px on 844px canvas
  appNameWrapper: {
    position: 'absolute',
    top: LOGO_TOP + LOGO_SIZE / 2 + rh(2.8),
    alignSelf: 'center',
  },

  appName: {
    ...typography['display-md'],
    color: colors.on_surface,
    textAlign: 'center',
  },

  // 8px below app name → rh(0.9) ≈ 8px on 844px canvas
  taglineWrapper: {
    position: 'absolute',
    top: LOGO_TOP + LOGO_SIZE / 2 + rh(2.8) + rh(6.5) + rh(0.9),
    alignSelf: 'center',
  },

  tagline: {
    ...typography['label-sm'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  // 200px wide on 390px canvas = rw(51.3), 4px tall, pill shape
  loadingTrack: {
    position: 'absolute',
    width: rw(51.3),
    height: 4,
    borderRadius: 9999,
    backgroundColor: colors.surface_container,
    overflow: 'hidden',
    alignSelf: 'center',
  },

  loadingFill: {
    height: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
  },

  versionWrapper: {
    position: 'absolute',
    alignSelf: 'center',
  },

  version: {
    ...typography['label-sm'],
    color: colors.on_surface,
    opacity: 0.3,
    textAlign: 'center',
  },
});
