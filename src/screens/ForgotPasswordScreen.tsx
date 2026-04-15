import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Design canvas: 390 × 844 (iPhone 14)
// Width%  = (px / 390) * 100
// Height% = (px / 844) * 100
// Font%   = (px / sqrt(390 * 844)) * 100

const ICON_SIZE = rw(20.5);   // 80px / 390 * 100
const RESEND_SECONDS = 60;
const MAX_RESEND_ATTEMPTS = 3;

interface Props {
  onBack: () => void;
  onBackToLogin: () => void;
  onSendReset: (email: string) => Promise<void>;
  onResend: (email: string) => Promise<void>;
}

type ViewState = 'form' | 'success';

export default function ForgotPasswordScreen({
  onBack,
  onBackToLogin,
  onSendReset,
  onResend,
}: Props) {
  const insets = useSafeAreaInsets();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [sending, setSending] = useState(false);

  // ── View state ───────────────────────────────────────────────────────────────
  const [viewState, setViewState] = useState<ViewState>('form');

  // ── Resend state ─────────────────────────────────────────────────────────────
  const [countdown, setCountdown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [resending, setResending] = useState(false);

  // ── Animations ───────────────────────────────────────────────────────────────
  const formOpacity = useRef(new Animated.Value(1)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.88)).current;
  const iconScale = useRef(new Animated.Value(0)).current;

  // Focus animation for email input
  const emailFocused = useRef(new Animated.Value(0)).current;

  const animateFocus = (focused: boolean) => {
    Animated.timing(emailFocused, {
      toValue: focused ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const emailBorderColor = emailFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [
      emailError ? colors.primary_container : 'rgba(89, 64, 65, 0.15)',
      colors.secondary,
    ],
  });

  // ── Countdown timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // ── Transition to success ────────────────────────────────────────────────────
  const transitionToSuccess = useCallback(() => {
    Animated.timing(formOpacity, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setViewState('success');
      Animated.parallel([
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(successScale, {
          toValue: 1,
          tension: 70,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [formOpacity, successOpacity, successScale, iconScale]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSend = async () => {
    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }
    setSending(true);
    try {
      await onSendReset(email.trim());
      setCountdown(RESEND_SECONDS);
      transitionToSuccess();
    } catch {
      setEmailError(true);
    } finally {
      setSending(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending || resendAttempts >= MAX_RESEND_ATTEMPTS) return;
    setResending(true);
    try {
      await onResend(email.trim());
      setResendAttempts((a) => a + 1);
      setCountdown(RESEND_SECONDS);
    } finally {
      setResending(false);
    }
  };

  const handleOpenEmail = () => {
    Linking.openURL('mailto:').catch(() => {
      // Silently fail — no mail app installed
    });
  };

  const resendDisabled =
    countdown > 0 || resending || resendAttempts >= MAX_RESEND_ATTEMPTS;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      {/* Ambient background glows */}
      <View style={styles.glowTopRight} pointerEvents="none" />
      <View style={styles.glowBottomLeft} pointerEvents="none" />

      {/* Back button — always visible */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + rh(1.2) }]}
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* ── FORM STATE ─────────────────────────────────────────────────────── */}
      {viewState === 'form' && (
        <Animated.View style={[styles.flex, { opacity: formOpacity }]}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={insets.top}
          >
            <ScrollView
              contentContainerStyle={[
                styles.scroll,
                { paddingBottom: insets.bottom + rh(4) },
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Lock icon — 80px circle, crimson glow */}
              <View style={styles.iconWrapper}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      width: ICON_SIZE,
                      height: ICON_SIZE,
                      borderRadius: ICON_SIZE / 2,
                    },
                  ]}
                >
                  <Text style={styles.iconEmoji}>🔑</Text>
                </View>
              </View>

              {/* Tag + Headline — asymmetric right margin */}
              <View style={styles.headingBlock}>
                <Text style={styles.tag}>ACCOUNT RECOVERY</Text>
                <Text style={styles.headline}>Forgot Password?</Text>
              </View>

              {/* Subtitle */}
              <Text style={styles.subtitle}>
                Enter your email and we'll send you a reset link.
              </Text>

              {/* Email input */}
              <View style={styles.inputGroup}>
                <Animated.View
                  style={[
                    styles.inputContainer,
                    {
                      borderBottomColor: emailBorderColor,
                      borderBottomWidth: emailError ? 2 : 1,
                    },
                  ]}
                >
                  <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                  <TextInput
                    style={styles.inputText}
                    value={email}
                    onChangeText={(v) => {
                      setEmail(v);
                      if (emailError) setEmailError(false);
                    }}
                    placeholder="your@email.com"
                    placeholderTextColor={`${colors.on_surface}4D`}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="send"
                    onSubmitEditing={handleSend}
                    onFocus={() => animateFocus(true)}
                    onBlur={() => animateFocus(false)}
                    accessibilityLabel="Email address"
                  />
                </Animated.View>
                {emailError && (
                  <Text style={styles.errorText}>
                    Enter a valid email address
                  </Text>
                )}
              </View>

              {/* Send reset link button */}
              <TouchableOpacity
                style={[styles.primaryBtn, sending && styles.primaryBtnLoading]}
                onPress={handleSend}
                disabled={sending}
                activeOpacity={0.85}
                accessibilityLabel="Send reset link"
                accessibilityRole="button"
              >
                <Text style={styles.primaryBtnText}>
                  {sending ? 'Sending…' : 'Send Reset Link'}
                </Text>
              </TouchableOpacity>

              {/* Log in link */}
              <View style={styles.loginRow}>
                <Text style={styles.loginPrompt}>Remember your password? </Text>
                <TouchableOpacity
                  onPress={onBackToLogin}
                  accessibilityLabel="Log in"
                  accessibilityRole="button"
                >
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      )}

      {/* ── SUCCESS STATE ───────────────────────────────────────────────────── */}
      {viewState === 'success' && (
        <Animated.View
          style={[
            styles.flex,
            {
              opacity: successOpacity,
              transform: [{ scale: successScale }],
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={[
              styles.successScroll,
              { paddingBottom: insets.bottom + rh(4) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Success icon — emerald glow */}
            <Animated.View
              style={[
                styles.successIconWrapper,
                { transform: [{ scale: iconScale }] },
              ]}
            >
              <View
                style={[
                  styles.successIconCircle,
                  {
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                    borderRadius: ICON_SIZE / 2,
                  },
                ]}
              >
                <Text style={styles.successIconEmoji}>✓</Text>
              </View>
            </Animated.View>

            {/* Tag + Headline */}
            <View style={styles.headingBlock}>
              <Text style={styles.tag}>EMAIL SENT</Text>
              <Text style={styles.headline}>Check Your Inbox</Text>
            </View>

            {/* Subtitle + email */}
            <View style={styles.successSubtitleBlock}>
              <Text style={styles.subtitle}>
                Check your inbox for the password reset link sent to:
              </Text>
              <Text style={styles.emailHighlight}>{email}</Text>
            </View>

            {/* Open email app button */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleOpenEmail}
              activeOpacity={0.85}
              accessibilityLabel="Open email app"
              accessibilityRole="button"
            >
              <Text style={styles.primaryBtnText}>Open Email App</Text>
            </TouchableOpacity>

            {/* Resend section */}
            <View style={styles.resendBlock}>
              <Text style={styles.resendPrompt}>Didn't receive it? </Text>
              <TouchableOpacity
                onPress={handleResend}
                disabled={resendDisabled}
                accessibilityLabel={
                  countdown > 0
                    ? `Resend available in ${formatCountdown(countdown)}`
                    : resendAttempts >= MAX_RESEND_ATTEMPTS
                    ? 'Maximum resend attempts reached'
                    : 'Resend reset link'
                }
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.resendLink,
                    resendDisabled && styles.resendLinkDisabled,
                  ]}
                >
                  {resending
                    ? 'Sending…'
                    : resendAttempts >= MAX_RESEND_ATTEMPTS
                    ? 'Max attempts reached'
                    : countdown > 0
                    ? `Resend (${formatCountdown(countdown)})`
                    : 'Resend'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Back to login */}
            <TouchableOpacity
              style={styles.backToLoginBtn}
              onPress={onBackToLogin}
              accessibilityLabel="Back to login"
              accessibilityRole="button"
            >
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Ambient glows — non-interactive atmospheric depth
  glowTopRight: {
    position: 'absolute',
    top: -rw(10),
    right: -rw(10),
    width: rw(60),
    height: rw(60),
    borderRadius: rw(30),
    backgroundColor: 'rgba(255, 178, 182, 0.05)',
  },

  glowBottomLeft: {
    position: 'absolute',
    bottom: -rw(10),
    left: -rw(10),
    width: rw(60),
    height: rw(60),
    borderRadius: rw(30),
    backgroundColor: 'rgba(178, 31, 60, 0.08)',
  },

  backBtn: {
    position: 'absolute',
    left: rw(4.6),
    zIndex: 10,
    padding: rw(2),
  },

  backIcon: {
    ...typography['title-lg'],
    color: colors.tertiary,
  },

  scroll: {
    paddingHorizontal: rw(6.2),   // 24px
    paddingTop: rh(9.5),
  },

  successScroll: {
    paddingHorizontal: rw(6.2),
    paddingTop: rh(9.5),
    alignItems: 'flex-start',
  },

  // Lock icon — 80px circle, crimson ambient glow
  iconWrapper: {
    alignSelf: 'center',
    marginBottom: rh(4.3),
    ...Platform.select({
      ios: {
        shadowColor: colors.primary_container,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 40,
      },
      android: { elevation: 8 },
    }),
  },

  iconCircle: {
    backgroundColor: colors.surface_container,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconEmoji: {
    fontSize: rf(4.7),   // ~40px
  },

  // Success icon — emerald glow
  successIconWrapper: {
    alignSelf: 'center',
    marginBottom: rh(4.3),
    ...Platform.select({
      ios: {
        shadowColor: colors.emerald,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 40,
      },
      android: { elevation: 8 },
    }),
  },

  successIconCircle: {
    backgroundColor: 'rgba(46, 139, 87, 0.20)',   // emerald at 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },

  successIconEmoji: {
    fontSize: rf(5.6),   // ~48px — large checkmark
    color: colors.emerald,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  // Tag + Headline — left-aligned, asymmetric right margin per spec
  headingBlock: {
    marginBottom: rh(1.9),
    paddingRight: rw(12.3),   // 48px asymmetric
    alignSelf: 'stretch',
  },

  tag: {
    ...typography['label-sm'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    marginBottom: rh(0.7),
  },

  headline: {
    ...typography['headline-md'],
    color: colors.on_surface,
  },

  subtitle: {
    ...typography['body-md'],
    color: `${colors.on_surface}99`,   // 60% opacity
    marginBottom: rh(3.6),
  },

  successSubtitleBlock: {
    marginBottom: rh(3.6),
    alignSelf: 'stretch',
  },

  emailHighlight: {
    ...typography['body-md'],
    color: colors.on_surface,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginTop: rh(0.5),
  },

  // Input group
  inputGroup: {
    marginBottom: rh(3.6),
  },

  inputContainer: {
    backgroundColor: `${colors.surface_container_highest}66`,   // 40% opacity
    height: rh(7.6),   // 64px — matches other screens
    paddingHorizontal: rw(4.1),
    paddingTop: rh(0.9),
    borderTopLeftRadius: rw(3.1),
    borderTopRightRadius: rw(3.1),
    justifyContent: 'center',
  },

  inputLabel: {
    ...typography['label-sm'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: rh(0.4),
  },

  inputText: {
    ...typography['body-lg'],
    color: colors.on_surface,
    padding: 0,
    margin: 0,
  },

  errorText: {
    ...typography['label-sm'],
    color: colors.primary_container,
    marginTop: rh(0.6),
    paddingHorizontal: rw(1),
  },

  // Primary button — #FD8B00, 56px
  primaryBtn: {
    height: rh(6.6),   // 56px
    backgroundColor: colors.secondary_container,
    borderRadius: rw(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(1.9),
    alignSelf: 'stretch',
    ...Platform.select({
      ios: {
        shadowColor: colors.secondary_container,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },

  primaryBtnLoading: {
    opacity: 0.7,
  },

  primaryBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },

  // Log in link row
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(1.9),
    flexWrap: 'wrap',
  },

  loginPrompt: {
    ...typography['body-md'],
    color: `${colors.on_surface}80`,   // 50% opacity
  },

  loginLink: {
    ...typography['body-md'],
    color: colors.tertiary,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  // Resend block
  resendBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: rh(1.9),
    alignSelf: 'stretch',
  },

  resendPrompt: {
    ...typography['body-md'],
    color: `${colors.on_surface}80`,   // 50% opacity
  },

  resendLink: {
    ...typography['body-md'],
    color: colors.tertiary,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  resendLinkDisabled: {
    color: `${colors.on_surface}4D`,   // 30% opacity
  },

  // Back to login — tertiary text link, centered
  backToLoginBtn: {
    alignSelf: 'center',
    paddingVertical: rh(1.2),
    marginTop: rh(2.4),
  },

  backToLoginText: {
    ...typography['body-md'],
    color: colors.tertiary,
  },
});
