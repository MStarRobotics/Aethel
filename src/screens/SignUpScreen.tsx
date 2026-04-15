import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Validation rules per spec
const validate = {
  firstName: (v: string) =>
    v.trim().length >= 2 && v.trim().length <= 30
      ? null
      : 'First name must be 2–30 characters',
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
      ? null
      : 'Enter a valid email address',
  password: (v: string) =>
    /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(v)
      ? null
      : 'Min 8 chars, 1 uppercase, 1 number',
  confirmPassword: (v: string, pw: string) =>
    v === pw ? null : 'Passwords do not match',
};

interface Props {
  onBack: () => void;
  onCreateAccount: (data: {
    firstName: string;
    email: string;
    password: string;
  }) => void;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  onLogin: () => void;
  onTerms: () => void;
  onPrivacy: () => void;
}

export default function SignUpScreen({
  onBack,
  onCreateAccount,
  onGoogleLogin,
  onAppleLogin,
  onLogin,
  onTerms,
  onPrivacy,
}: Props) {
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Only show errors after the user has touched a field
  const [touched, setTouched] = useState({
    firstName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const errors = {
    firstName: touched.firstName ? validate.firstName(firstName) : null,
    email: touched.email ? validate.email(email) : null,
    password: touched.password ? validate.password(password) : null,
    confirmPassword: touched.confirmPassword
      ? validate.confirmPassword(confirmPassword, password)
      : null,
  };

  const isFormValid =
    !validate.firstName(firstName) &&
    !validate.email(email) &&
    !validate.password(password) &&
    !validate.confirmPassword(confirmPassword, password) &&
    termsAccepted;

  const handleSubmit = () => {
    // Mark all fields touched to show any remaining errors
    setTouched({ firstName: true, email: true, password: true, confirmPassword: true });
    if (!isFormValid) return;
    onCreateAccount({ firstName, email, password });
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + rh(1.2), paddingBottom: insets.bottom + rh(4) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.6}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.tag}>NEW HERE</Text>
          <Text style={styles.headline}>Create Your Account</Text>
          <Text style={styles.subheadline}>Start finding your match</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
            placeholder="Your first name"
            error={errors.firstName}
            autoCapitalize="words"
          />

          <InputField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="address@example.com"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="••••••••"
            error={errors.password}
            secureTextEntry={!showPassword}
            showToggle
            onToggle={() => setShowPassword((v) => !v)}
            isVisible={showPassword}
          />

          <InputField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
            placeholder="••••••••"
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            showToggle
            onToggle={() => setShowConfirmPassword((v) => !v)}
            isVisible={showConfirmPassword}
          />

          {/* Terms checkbox */}
          <View style={styles.termsRow}>
            <Pressable
              style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
              onPress={() => setTermsAccepted((v) => !v)}
            >
              {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink} onPress={onTerms}>
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text style={styles.termsLink} onPress={onPrivacy}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Primary button */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              !isFormValid && styles.primaryButtonDisabled,
              pressed && isFormValid && styles.primaryButtonPressed,
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </Pressable>
        </View>

        {/* OR divider — no line, just spacing + muted text per design spec */}
        <View style={styles.orRow}>
          <Text style={styles.orText}>OR</Text>
        </View>

        {/* Social login */}
        <View style={styles.socialSection}>
          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.socialButtonPressed,
            ]}
            onPress={onGoogleLogin}
          >
            <Text style={styles.socialIcon}>G</Text>
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
              <Text style={styles.socialIcon}></Text>
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </Pressable>
          )}
        </View>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={onLogin} activeOpacity={0.6}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Input field component ────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  onBlur: () => void;
  placeholder: string;
  error?: string | null;
  secureTextEntry?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
  isVisible?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'words' | 'sentences' | 'characters';
}

function InputField({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  secureTextEntry,
  showToggle,
  onToggle,
  isVisible,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.primary_container          // crimson on error
    : focused
    ? colors.secondary                  // #FFB77D on focus
    : 'rgba(89, 64, 65, 0.15)';        // outline_variant at 15%

  return (
    <View style={inputStyles.wrapper}>
      <Text style={inputStyles.label}>{label}</Text>
      <View
        style={[
          inputStyles.field,
          { borderBottomColor: borderColor, borderBottomWidth: focused || error ? 2 : 1 },
        ]}
      >
        <TextInput
          style={inputStyles.input}
          value={value}
          onChangeText={onChangeText}
          onBlur={() => { setFocused(false); onBlur(); }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor="rgba(237, 220, 255, 0.4)"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
        {showToggle && (
          <TouchableOpacity onPress={onToggle} activeOpacity={0.6} style={inputStyles.eyeButton}>
            <Text style={inputStyles.eyeIcon}>{isVisible ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={inputStyles.errorText}>{error}</Text>}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: {
    marginBottom: rh(2.4),
  },
  label: {
    ...typography['label-md'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    marginBottom: rh(0.7),
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: rh(6.6),          // 56px / 844 * 100
    backgroundColor: colors.surface_container_highest,
    borderTopLeftRadius: rw(3.1),   // 12px / 390 * 100
    borderTopRightRadius: rw(3.1),
    paddingHorizontal: rw(4.1),
  },
  input: {
    flex: 1,
    ...typography['body-lg'],
    color: colors.on_surface,
    height: '100%',
  },
  eyeButton: {
    padding: rw(2),
  },
  eyeIcon: {
    fontSize: rf(1.9),
    opacity: 0.6,
  },
  errorText: {
    ...typography['label-sm'],
    color: colors.primary_container,
    marginTop: rh(0.5),
  },
});

// ─── Screen styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: rw(6.2),   // 24px
  },

  backButton: {
    width: rw(10.3),   // ~40px
    height: rw(10.3),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(1.2),
  },

  backIcon: {
    fontSize: rf(2.4),
    color: colors.tertiary,
  },

  header: {
    marginBottom: rh(3.6),
    paddingRight: rw(12.3),   // asymmetric: extra right margin per spec
  },

  tag: {
    ...typography['label-sm'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    marginBottom: rh(0.9),
  },

  headline: {
    ...typography['headline-md'],
    color: colors.on_surface,
    marginBottom: rh(0.7),
  },

  subheadline: {
    ...typography['body-md'],
    color: 'rgba(237, 220, 255, 0.6)',
  },

  form: {
    marginBottom: rh(1.2),
  },

  // Terms checkbox row
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: rw(3.1),
    marginBottom: rh(2.8),
  },

  checkbox: {
    width: rw(4.6),    // ~18px
    height: rw(4.6),
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(89, 64, 65, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  checkboxChecked: {
    backgroundColor: colors.secondary_container,
    borderColor: colors.secondary_container,
  },

  checkmark: {
    fontSize: rf(1.3),
    color: colors.on_secondary,
    fontWeight: '700',
  },

  termsText: {
    flex: 1,
    ...typography['body-md'],
    color: 'rgba(237, 220, 255, 0.6)',
    lineHeight: rf(2.2),
  },

  termsLink: {
    color: colors.tertiary,
  },

  // Primary button
  primaryButton: {
    width: '100%',
    height: rh(6.6),
    backgroundColor: colors.secondary_container,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonDisabled: {
    opacity: 0.5,
  },

  primaryButtonPressed: {
    opacity: 0.85,
    transform: [{ translateY: -2 }],
  },

  primaryButtonText: {
    ...typography['label-lg'],
    color: colors.on_secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // OR divider — no lines (design spec "No-Line" rule), just vertical spacing
  orRow: {
    alignItems: 'center',
    marginVertical: rh(3.8),   // 32px gap above and below
  },

  orText: {
    ...typography['label-sm'],
    color: 'rgba(237, 220, 255, 0.3)',
    letterSpacing: 3,
  },

  // Social buttons
  socialSection: {
    gap: rh(1.4),
    marginBottom: rh(4.7),
  },

  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: rh(6.2),   // 52px
    backgroundColor: colors.surface_container,
    borderRadius: 12,
    gap: rw(3.1),
  },

  socialButtonPressed: {
    backgroundColor: colors.surface_container_high,
  },

  socialIcon: {
    ...typography['label-lg'],
    color: colors.on_surface,
  },

  socialButtonText: {
    ...typography['label-md'],
    color: colors.on_surface,
  },

  // Login link
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  loginText: {
    ...typography['body-md'],
    color: 'rgba(237, 220, 255, 0.6)',
  },

  loginLink: {
    ...typography['body-md'],
    color: colors.tertiary,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});
