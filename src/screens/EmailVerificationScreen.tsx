import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
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

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

// OTP box: 52×60px on canvas
const BOX_W = rw(13.3);  // 52 / 390 * 100
const BOX_H = rh(7.1);   // 60 / 844 * 100
const BOX_GAP = rw(2.1); // 8 / 390 * 100

// Icon circle: 80px on canvas
const ICON_SIZE = rw(20.5); // 80 / 390 * 100

type VerifyState = 'idle' | 'loading' | 'error' | 'success';

interface Props {
  email: string;
  onBack: () => void;
  onVerified: () => void;
  onResend: () => Promise<void>;
  onChangeEmail: () => void;
}

export default function EmailVerificationScreen({
  email,
  onBack,
  onVerified,
  onResend,
  onChangeEmail,
}: Props) {
  const insets = useSafeAreaInsets();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));

  // Success checkmark scale animation
  const checkScale = useRef(new Animated.Value(0)).current;

  // Auto-focus first box on mount
  useEffect(() => {
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const isComplete = digits.every((d) => d !== '');
  const isEnabled = isComplete && verifyState !== 'loading';

  const formatCountdown = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Handle single-digit input
  const handleChange = useCallback((text: string, index: number) => {
    // Support paste — if text length > 1, distribute across boxes
    if (text.length > 1) {
      const cleaned = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
      const next = [...digits];
      for (let i = 0; i < OTP_LENGTH; i++) {
        next[i] = cleaned[i] ?? '';
      }
      setDigits(next);
      setVerifyState('idle');
      const lastFilled = Math.min(cleaned.length, OTP_LENGTH - 1);
      inputRefs.current[lastFilled]?.focus();
      return;
    }

    const digit = text.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setVerifyState('idle');

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits]);

  // Handle backspace
  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        if (digits[index] === '' && index > 0) {
          const next = [...digits];
          next[index - 1] = '';
          setDigits(next);
          inputRefs.current[index - 1]?.focus();
        } else {
          const next = [...digits];
          next[index] = '';
          setDigits(next);
        }
        setVerifyState('idle');
      }
    },
    [digits]
  );

  const handleVerify = async () => {
    if (!isEnabled) return;
    setVerifyState('loading');
    try {
      // Simulate API call — replace with real POST /verify-email
      await new Promise((res) => setTimeout(res, 1200));
      const code = digits.join('');
      // Simulate wrong code for demo — remove in production
      if (code === '000000') {
        setVerifyState('error');
        return;
      }
      setVerifyState('success');
      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 6,
      }).start(() => setTimeout(onVerified, 600));
    } catch {
      setVerifyState('error');
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    try {
      await onResend();
      setCountdown(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(''));
      setVerifyState('idle');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setResending(false);
    }
  };

  // Box border color per state
  const boxBorderColor = (index: number): string => {
    if (verifyState === 'error') return colors.primary_container;
    if (verifyState === 'success') return colors.emerald;
    if (focusedIndex === index) return colors.secondary;
    return 'transparent';
  };

  const boxBorderWidth = (index: number): number => {
    if (verifyState === 'error') return 2;
    if (verifyState === 'success') return 2;
    if (focusedIndex === index) return 2;
    return 0;
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      {/* Ambient background glows */}
      <View style={styles.glowTopLeft} pointerEvents="none" />
      <View style={styles.glowBottomRight} pointerEvents="none" />

      {/* Back button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + rh(1.2) }]}
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

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
          {/* Email icon — 80px circle, crimson glow */}
          <View style={styles.iconWrapper}>
            <View style={[styles.iconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
              <Text style={styles.iconEmoji}>✉️</Text>
            </View>
          </View>

          {/* Tag + Headline */}
          <View style={styles.headingBlock}>
            <Text style={styles.tag}>VERIFY YOUR EMAIL</Text>
            <Text style={styles.headline}>Check Your Inbox</Text>
          </View>

          {/* Subtitle */}
          <View style={styles.subtitleBlock}>
            <Text style={styles.subtitleText}>We sent a 6-digit code to:</Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* OTP boxes */}
          <View style={styles.otpRow} accessibilityLabel="Enter 6-digit verification code">
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.otpBox,
                  {
                    borderBottomColor: boxBorderColor(i),
                    borderBottomWidth: boxBorderWidth(i),
                  },
                ]}
              >
                <TextInput
                  ref={(r) => { inputRefs.current[i] = r; }}
                  style={styles.otpInput}
                  value={digits[i]}
                  onChangeText={(t) => handleChange(t, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  onFocus={() => setFocusedIndex(i)}
                  onBlur={() => setFocusedIndex(-1)}
                  keyboardType="number-pad"
                  maxLength={OTP_LENGTH} // allows paste
                  textAlign="center"
                  selectTextOnFocus
                  caretHidden
                  accessibilityLabel={`Digit ${i + 1}`}
                />
              </View>
            ))}
          </View>

          {/* Error message */}
          {verifyState === 'error' && (
            <Text style={styles.errorText}>Invalid code. Please try again.</Text>
          )}

          {/* Verify button */}
          <TouchableOpacity
            style={[
              styles.verifyBtn,
              !isEnabled && styles.verifyBtnDisabled,
            ]}
            onPress={handleVerify}
            disabled={!isEnabled}
            activeOpacity={0.85}
            accessibilityLabel="Verify email"
            accessibilityRole="button"
          >
            {verifyState === 'loading' ? (
              <Text style={[styles.verifyBtnText, { opacity: 0.7 }]}>Verifying…</Text>
            ) : verifyState === 'success' ? (
              <Animated.Text
                style={[styles.verifyBtnText, { transform: [{ scale: checkScale }] }]}
              >
                ✓ Verified
              </Animated.Text>
            ) : (
              <Text style={styles.verifyBtnText}>Verify Email</Text>
            )}
          </TouchableOpacity>

          {/* Resend section */}
          <View style={styles.resendRow}>
            <Text style={styles.resendPrompt}>Didn't receive the code? </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={countdown > 0 || resending}
              accessibilityLabel={
                countdown > 0
                  ? `Resend available in ${formatCountdown(countdown)}`
                  : 'Resend code'
              }
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.resendLink,
                  countdown > 0 && styles.resendLinkDisabled,
                ]}
              >
                {resending
                  ? 'Sending…'
                  : countdown > 0
                  ? `Resend Code (${formatCountdown(countdown)})`
                  : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Change email */}
          <TouchableOpacity
            style={styles.changeEmailBtn}
            onPress={onChangeEmail}
            accessibilityLabel="Change email address"
            accessibilityRole="button"
          >
            <Text style={styles.changeEmailText}>Wrong email? Change it</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // Ambient background glows — non-interactive
  glowTopLeft: {
    position: 'absolute',
    top: -rw(10),
    left: -rw(10),
    width: rw(50),
    height: rw(50),
    borderRadius: rw(25),
    backgroundColor: 'rgba(178, 31, 60, 0.10)',
    // blur not available in RN without a library — use opacity instead
  },

  glowBottomRight: {
    position: 'absolute',
    bottom: -rw(5),
    right: -rw(5),
    width: rw(40),
    height: rw(40),
    borderRadius: rw(20),
    backgroundColor: 'rgba(253, 139, 0, 0.05)',
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
    paddingHorizontal: rw(6.2),  // 24px
    paddingTop: rh(9.5),
  },

  // Email icon — 80px circle, crimson ambient glow
  iconWrapper: {
    alignSelf: 'center',
    marginBottom: rh(4.3),  // ~36px
    ...Platform.select({
      ios: {
        shadowColor: colors.primary_container,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 40,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  iconCircle: {
    backgroundColor: colors.surface_container,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconEmoji: {
    fontSize: rf(4.7),  // ~40px on canvas
  },

  // Tag + Headline — left-aligned, asymmetric right margin
  headingBlock: {
    marginBottom: rh(1.9),
    paddingRight: rw(12.3),  // 48px asymmetric
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

  // Subtitle — body-md, 60% opacity
  subtitleBlock: {
    marginBottom: rh(4.3),
  },

  subtitleText: {
    ...typography['body-md'],
    color: `${colors.on_surface}99`,  // 60% opacity
  },

  emailText: {
    ...typography['body-md'],
    color: colors.on_surface,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginTop: rh(0.4),
  },

  // OTP row — 6 boxes, 8px gap, centered
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: BOX_GAP,
    marginBottom: rh(1.2),
  },

  // Individual OTP box — 52×60px, surface_container_highest bg, rounded top
  otpBox: {
    width: BOX_W,
    height: BOX_H,
    backgroundColor: colors.surface_container_highest,
    borderTopLeftRadius: rw(3.1),   // 12px
    borderTopRightRadius: rw(3.1),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  otpInput: {
    width: '100%',
    height: '100%',
    ...typography['title-lg'],
    color: colors.on_surface,
    textAlign: 'center',
    padding: 0,
    margin: 0,
    // Transparent background — box handles the bg
    backgroundColor: 'transparent',
  },

  errorText: {
    ...typography['label-sm'],
    color: colors.primary_container,
    textAlign: 'center',
    marginBottom: rh(1.9),
  },

  // Verify button — 56px, orange, disabled state
  verifyBtn: {
    height: rh(6.6),  // 56px
    backgroundColor: colors.secondary_container,
    borderRadius: rw(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rh(2.8),
    marginBottom: rh(1.9),
    ...Platform.select({
      ios: {
        shadowColor: colors.secondary_container,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  verifyBtnDisabled: {
    backgroundColor: colors.surface_container,
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
    }),
  },

  verifyBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },

  // Resend row
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: rh(1.9),
  },

  resendPrompt: {
    ...typography['body-md'],
    color: `${colors.on_surface}80`,  // 50% opacity
  },

  resendLink: {
    ...typography['body-md'],
    color: colors.tertiary,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  resendLinkDisabled: {
    color: `${colors.on_surface}4D`,  // 30% opacity during countdown
  },

  // Change email — tertiary text link, centered
  changeEmailBtn: {
    alignSelf: 'center',
    paddingVertical: rh(1.2),
    marginTop: rh(1.2),
  },

  changeEmailText: {
    ...typography['body-md'],
    color: colors.tertiary,
  },
});
