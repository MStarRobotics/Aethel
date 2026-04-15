import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Platform,
  Pressable,
  ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Design canvas: 390x844
// Hero height: 380px on canvas = rh(45)

const SLIDES = [
  {
    id: '1',
    tag: 'PERSONALITY MATCHING',
    headline: 'Meet People Who Get You',
    body: 'Answer fun questions and match with people who share your vibe.',
  },
  {
    id: '2',
    tag: '2000+ QUESTIONS',
    headline: 'The More You Answer, The Better',
    body: 'Our algorithm gets smarter with every question you answer.',
  },
  {
    id: '3',
    tag: 'FREE FOREVER',
    headline: 'Real Conversations, Zero Pressure',
    body: 'Message anyone you match with — completely free.',
  },
];

// Google logo SVG path data — rendered via View shapes to avoid SVG dependency
function GoogleIcon() {
  return (
    <View style={googleIconStyles.container}>
      <Text style={googleIconStyles.text}>G</Text>
    </View>
  );
}

function AppleIcon() {
  return (
    <View style={googleIconStyles.container}>
      <Text style={googleIconStyles.text}></Text>
    </View>
  );
}

const googleIconStyles = StyleSheet.create({
  container: {
    width: rw(5.1),   // ~20px
    height: rw(5.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: rf(1.9),
    color: colors.on_surface,
  },
});

interface Props {
  onCreateAccount: () => void;
  onLogin: () => void;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  onSkip: () => void;
  onTerms: () => void;
  onPrivacy: () => void;
}

export default function WelcomeScreen({
  onCreateAccount,
  onLogin,
  onGoogleLogin,
  onAppleLogin,
  onSkip,
  onTerms,
  onPrivacy,
}: Props) {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const activeSlide = SLIDES[activeIndex];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>

      {/* Background radial glow — primary_container at 8% opacity, top-center */}
      <View style={styles.radialGlow} />

      {/* Hero carousel — full width, rh(45) height, bleeds edge to edge */}
      <View style={styles.heroContainer}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={() => (
            <View style={styles.heroSlide}>
              {/*
                Replace this placeholder with your actual illustration:
                <Image
                  source={require('../../assets/illustrations/welcome-hero.png')}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />
              */}
              <LinearGradient
                colors={['rgba(178,31,60,0.25)', 'rgba(21,6,41,0.9)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
            </View>
          )}
        />

        {/* Gradient fade from hero into background */}
        <LinearGradient
          colors={['transparent', colors.surface_container_lowest]}
          style={styles.heroFade}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          pointerEvents="none"
        />
      </View>

      {/* Skip button — top right, overlays hero */}
      <TouchableOpacity
        style={[styles.skipButton, { top: insets.top + rh(1.2) }]}
        onPress={onSkip}
        activeOpacity={0.6}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Content area — below hero */}
      <View style={styles.content}>

        {/* Page indicator dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Curated tag — label-sm, tertiary, uppercase */}
        <Text style={styles.tag}>{activeSlide.tag}</Text>

        {/* Headline — Noto Serif headline-lg, asymmetric margins */}
        <Text style={styles.headline}>{activeSlide.headline}</Text>

        {/* Body text — body-md, on_surface at 70% opacity */}
        <Text style={styles.body}>{activeSlide.body}</Text>

        {/* Primary button — Create Account */}
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={onCreateAccount}
        >
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </Pressable>

        {/* Secondary ghost button — Log In */}
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.secondaryButtonPressed,
          ]}
          onPress={onLogin}
        >
          <Text style={styles.secondaryButtonText}>Log In</Text>
        </Pressable>

        {/* Social login buttons */}
        <View style={styles.socialRow}>
          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.socialButtonPressed,
            ]}
            onPress={onGoogleLogin}
          >
            <GoogleIcon />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </Pressable>

          {Platform.OS === 'ios' && (
            <Pressable
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.socialButtonPressed,
              ]}
              onPress={onAppleLogin}
            >
              <AppleIcon />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </Pressable>
          )}
        </View>

        {/* Terms & Privacy */}
        <View style={styles.termsRow}>
          <TouchableOpacity onPress={onTerms} activeOpacity={0.6}>
            <Text style={styles.termsText}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.termsDot}> · </Text>
          <TouchableOpacity onPress={onPrivacy} activeOpacity={0.6}>
            <Text style={styles.termsText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const SCREEN_WIDTH = rw(100);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface_container_lowest,
  },

  // Radial glow top-center: primary_container at 8% opacity
  radialGlow: {
    position: 'absolute',
    top: -rw(20),
    alignSelf: 'center',
    width: rw(80),
    height: rw(80),
    borderRadius: rw(40),
    backgroundColor: 'rgba(178, 31, 60, 0.08)',
  },

  // Hero: full width, 380px on 844px canvas = rh(45)
  heroContainer: {
    width: SCREEN_WIDTH,
    height: rh(45),
    overflow: 'hidden',
  },

  heroSlide: {
    width: SCREEN_WIDTH,
    height: rh(45),
    backgroundColor: colors.surface_container,
  },

  // Gradient that fades the hero into the background below
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: rh(15),
  },

  // Skip — top right, overlays hero
  skipButton: {
    position: 'absolute',
    right: rw(6.2),   // 24px / 390 * 100
    zIndex: 20,
  },

  skipText: {
    ...typography['label-md'],
    color: colors.tertiary,
  },

  content: {
    flex: 1,
    paddingHorizontal: rw(6.2),   // 24px horizontal margin
  },

  // Page dots — active: #FD8B00 10px, inactive: #EDDCFF@30% 8px, gap 8px
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: rh(1.9),
    marginBottom: rh(1.4),
    gap: rw(2.1),   // 8px
  },

  dot: {
    borderRadius: 9999,
  },

  dotActive: {
    width: rw(2.6),    // 10px
    height: rw(2.6),
    backgroundColor: colors.secondary_container,
  },

  dotInactive: {
    width: rw(2.1),    // 8px
    height: rw(2.1),
    backgroundColor: 'rgba(237, 220, 255, 0.3)',
  },

  // Curated tag — label-sm, tertiary, uppercase, 32px above headline
  tag: {
    ...typography['label-sm'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    marginBottom: rh(0.9),   // ~8px spacing before headline
  },

  // Headline — Noto Serif headline-lg, left-aligned, right margin 48px
  headline: {
    ...typography['headline-lg'],
    color: colors.on_surface,
    paddingRight: rw(6.2),   // asymmetric: extra right margin
    marginBottom: rh(1.2),
  },

  // Body — body-md, on_surface at 70% opacity
  body: {
    ...typography['body-md'],
    color: 'rgba(237, 220, 255, 0.7)',
    marginBottom: rh(2.8),
  },

  // Primary button — #FD8B00 bg, 56px height, full width
  primaryButton: {
    width: '100%',
    height: rh(6.6),   // 56px / 844 * 100
    backgroundColor: colors.secondary_container,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(1.4),
  },

  primaryButtonPressed: {
    opacity: 0.85,
    transform: [{ translateY: -2 }],
  },

  primaryButtonText: {
    ...typography['label-lg'],
    color: colors.on_secondary,
  },

  // Secondary ghost button — transparent, pink border
  secondaryButton: {
    width: '100%',
    height: rh(6.6),
    backgroundColor: 'transparent',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 178, 182, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(1.9),
  },

  secondaryButtonPressed: {
    backgroundColor: 'rgba(255, 178, 182, 0.05)',
  },

  secondaryButtonText: {
    ...typography['label-lg'],
    color: colors.primary,
  },

  // Social login buttons — surface_container bg, 52px height, 12px radius
  socialRow: {
    gap: rh(1.2),
    marginBottom: rh(1.9),
  },

  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: rh(6.2),   // 52px / 844 * 100
    backgroundColor: colors.surface_container,
    borderRadius: 12,
    gap: rw(2.6),
  },

  socialButtonPressed: {
    backgroundColor: colors.surface_container_high,
  },

  socialButtonText: {
    ...typography['label-md'],
    color: colors.on_surface,
  },

  // Terms & Privacy — label-sm, tertiary, centered
  termsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  termsText: {
    ...typography['label-sm'],
    color: colors.tertiary,
  },

  termsDot: {
    ...typography['label-sm'],
    color: colors.tertiary,
  },
});
