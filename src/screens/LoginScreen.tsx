import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
  useResponsiveWidth,
  useResponsiveHeight,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Design canvas: 390 × 844 (iPhone 14)
// Width%  = (px / 390) * 100
// Height% = (px / 844) * 100
// Font%   = (px / sqrt(390 * 844)) * 100

const LOGO_SIZE = rw(12.3); // 48px / 390 * 100

interface Props {
  onBack: () => void;
  onLogin: (data: { email: string; password: string }) => void;
  onForgotPassword: () => void;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  onSignUp: () => void;
  onBiometric?: () => void;
}

export default function LoginScreen({
  onBack,
  onLogin,
  onForgotPassword,
  onGoogleLogin,
  onAppleLogin,
  onSignUp,
  onBiometric,
}: Props) {
  const insets = useSafeAreaInsets();

  // Hooks for responsive values that need to react to orientation/fold changes
  const screenWidth = useResponsiveWidth(100);
  const screenHeight = useResponsiveHeight(100);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Animated bottom-border focus states
  const emailFocused = useRef(new Animated.Value(0)).current;
  const passwordFocused = useRef(new Animated.Value(0)).current;

  const animateFocus = (anim: Animated.Value, focused: boolean) => {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const handleLogin = () => {
    const emailInvalid = !email.trim();
    const passwordInvalid = !password.trim();
    setEmailError(emailInvalid);
    setPasswordError(passwordInvalid);
    if (emailInvalid || passwordInvalid) return;
    onLogin({ email: email.trim(), password });
  };

  // Animated border colors — error overrides idle, focus overrides both
  const emailBorderColor = emailFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [
      emailError ? colors.primary_container : `rgba(89, 64, 65, 0.15)`,
      colors.secondary,
    ],
  });

  const passwordBorderColor = passwordFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [
      passwordError ? colors.primary_container : `rgba(89, 64, 65, 0.15)`,
      colors.secondary,
    ],
  });

  // Responsive input height — 64px on 844px canvas, scales with screen height
  const inputHeight = Math.max(rh(7.6), 56); // min 56px, scales up on larger screens

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      {/* Back button — absolute, above scroll */}
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
          {/* Logo — 48px circle, centered, crimson ambient glow */}
          <View style={styles.logoWrapper}>
            <View style={[styles.logoCircle, { width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: LOGO_SIZE / 2 }]}>
              {/* Replace with <Image source={require('../../assets/logo.png')} /> */}
              <Text style={styles.logoFallback}>A</Text>
            </View>
          </View>

          {/* Tag + Headline — asymmetric left 24px, right 48px per spec */}
          <View style={styles.headingBlock}>
            <Text style={styles.tag}>WELCOME BACK</Text>
            <Text style={styles.headline}>Sign In to Aethel</Text>
          </View>

          {/* Email input */}
          <View style={styles.inputGroup}>
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  height: inputHeight,
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
                returnKeyType="next"
                onFocus={() => animateFocus(emailFocused, true)}
                onBlur={() => animateFocus(emailFocused, false)}
                accessibilityLabel="Email address"
              />
            </Animated.View>
            {emailError && (
              <Text style={styles.errorText}>Incorrect email or password</Text>
            )}
          </View>

          {/* Password input */}
          <View style={styles.inputGroup}>
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  height: inputHeight,
                  borderBottomColor: passwordBorderColor,
                  borderBottomWidth: passwordError ? 2 : 1,
                },
              ]}
            >
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.inputText, styles.passwordInput]}
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (passwordError) setPasswordError(false);
                  }}
                  placeholder="••••••••"
                  placeholderTextColor={`${colors.on_surface}4D`}
                  secureTextEntry={!passwordVisible}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  onFocus={() => animateFocus(passwordFocused, true)}
                  onBlur={() => animateFocus(passwordFocused, false)}
                  accessibilityLabel="Password"
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                >
                  <Text style={styles.eyeIcon}>{passwordVisible ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            {passwordError && (
              <Text style={styles.errorText}>Incorrect email or password</Text>
            )}
          </View>

          {/* Forgot password — right-aligned, 8px below password field */}
          <TouchableOpacity
            style={styles.forgotWrapper}
            onPress={onForgotPassword}
            accessibilityLabel="Forgot password"
            accessibilityRole="button"
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Primary CTA — #FD8B00, 56px height */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.85}
            accessibilityLabel="Log in"
            accessibilityRole="button"
          >
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>

          {/* Biometric — only shown if handler provided */}
          {onBiometric && (
            <TouchableOpacity
              style={styles.biometricBtn}
              onPress={onBiometric}
              accessibilityLabel="Use Face ID or Fingerprint"
              accessibilityRole="button"
            >
              <Text style={styles.biometricIcon}>👆</Text>
              <Text style={styles.biometricText}>Use Face ID / Fingerprint</Text>
            </TouchableOpacity>
          )}

          {/* OR — 32px gap, no divider line per design spec */}
          <View style={styles.orWrapper}>
            <Text style={styles.orText}>OR</Text>
          </View>

          {/* Social buttons — full width, stacked, 52px height */}
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={onGoogleLogin}
            activeOpacity={0.8}
            accessibilityLabel="Continue with Google"
            accessibilityRole="button"
          >
            <Text style={styles.socialIcon}>G</Text>
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Apple login — shown on iOS only */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.socialBtn, styles.socialBtnSpaced]}
              onPress={onAppleLogin}
              activeOpacity={0.8}
              accessibilityLabel="Continue with Apple"
              accessibilityRole="button"
            >
              <Text style={styles.socialIcon}></Text>
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>
          )}

          {/* Sign up footer */}
          <View style={styles.signupRow}>
            <Text style={styles.signupPrompt}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={onSignUp}
              accessibilityLabel="Sign up"
              accessibilityRole="button"
            >
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  backBtn: {
    position: 'absolute',
    left: rw(4.6),   // 18px / 390 * 100
    zIndex: 10,
    padding: rw(2),
  },

  backIcon: {
    ...typography['title-lg'],
    color: colors.tertiary,
  },

  scroll: {
    paddingHorizontal: rw(6.2),   // 24px / 390 * 100
    paddingTop: rh(9.5),          // clears back button + breathing room
  },

  // Logo — 48px circle, centered, crimson ambient glow
  logoWrapper: {
    alignSelf: 'center',
    marginBottom: rh(3.6),   // ~30px
    ...Platform.select({
      ios: {
        shadowColor: colors.primary_container,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  logoCircle: {
    backgroundColor: colors.surface_container,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  logoFallback: {
    ...typography['headline-sm'],
    color: colors.on_surface,
  },

  // Asymmetric heading block — left 0, right 48px per spec
  headingBlock: {
    marginBottom: rh(3.6),
    paddingRight: rw(12.3),   // 48px / 390 * 100
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

  // Input group — wraps container + error text
  inputGroup: {
    marginBottom: rh(1.9),   // ~16px
  },

  // surface_container_highest bg, rounded top corners, ghost bottom border
  // Height is set dynamically via inputHeight variable
  inputContainer: {
    backgroundColor: `${colors.surface_container_highest}66`,   // 40% opacity
    paddingHorizontal: rw(4.1),
    paddingTop: rh(0.9),
    borderTopLeftRadius: rw(3.1),    // 12px / 390 * 100
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

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
  },

  eyeIcon: {
    fontSize: rf(2.1),
    opacity: 0.6,
  },

  errorText: {
    ...typography['label-sm'],
    color: colors.primary_container,
    marginTop: rh(0.6),
    paddingHorizontal: rw(1),
  },

  // Forgot password — right-aligned, 8px below password field
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginBottom: rh(3.6),
    marginTop: rh(0.9),
  },

  forgotText: {
    ...typography['label-md'],
    color: colors.tertiary,
  },

  // Primary button — secondary_container (#FD8B00), 56px height
  loginBtn: {
    height: rh(6.6),   // 56px / 844 * 100
    backgroundColor: colors.secondary_container,
    borderRadius: rw(1),
    alignItems: 'center',
    justifyContent: 'center',
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

  loginBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },

  // Biometric — tertiary text + icon, centered
  biometricBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rw(2),
    paddingVertical: rh(1.2),
    marginBottom: rh(1.2),
  },

  biometricIcon: {
    fontSize: rf(2.1),
  },

  biometricText: {
    ...typography['body-md'],
    color: colors.tertiary,
  },

  // OR — 32px gap above and below, NO divider line (design spec rule)
  orWrapper: {
    alignItems: 'center',
    marginVertical: rh(3.8),   // 32px / 844 * 100
  },

  orText: {
    ...typography['label-sm'],
    color: `${colors.on_surface}66`,   // muted 40% opacity
    textTransform: 'uppercase',
    letterSpacing: 2,
  },

  // Social buttons — full width, 52px height, surface_container bg
  socialBtn: {
    height: rh(6.2),   // 52px / 844 * 100
    backgroundColor: colors.surface_container,
    borderRadius: rw(2.1),   // 8px / 390 * 100
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rw(2.6),
    // Ghost border — outline_variant at 15% opacity
    borderWidth: 1,
    borderColor: `${colors.outline_variant}26`,
  },

  socialBtnSpaced: {
    marginTop: rh(1.4),
  },

  socialIcon: {
    ...typography['title-md'],
    color: colors.on_surface,
    width: rw(5.1),
    textAlign: 'center',
  },

  socialText: {
    ...typography['body-md'],
    color: colors.on_surface,
  },

  // Sign up footer
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: rh(3.6),
  },

  signupPrompt: {
    ...typography['body-md'],
    color: `${colors.on_surface}99`,   // 60% opacity
  },

  signupLink: {
    ...typography['body-md'],
    color: colors.tertiary,
    fontWeight: '600',
  },
});
