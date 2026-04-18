import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Platform, StatusBar, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Step = 'phone' | 'otp';

interface Props {
  onBack: () => void;
  onVerified: () => void;
  onUseEmail: () => void;
}

export default function PhoneOTPScreen({ onBack, onVerified, onUseEmail }: Props) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const ICON_SIZE = rw(20.5);

  const handleOtpChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (next.every(d => d.length === 1)) onVerified();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
      <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.backText}>\u2190 Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
        <View style={styles.iconWrapper}>
          <View style={[styles.iconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
            <Text style={styles.iconEmoji}>\u{1F4F1}</Text>
          </View>
        </View>

        {step === 'phone' ? (
          <>
            <Text style={styles.tag}>PHONE LOGIN</Text>
            <Text style={styles.headline}>Enter Your Number</Text>
            <Text style={styles.subtitle}>We'll send you a one-time code to verify.</Text>

            <View style={styles.phoneRow}>
              <TouchableOpacity style={styles.countryPicker}>
                <Text style={styles.countryFlag}>\u{1F1EE}\u{1F1F3}</Text>
                <Text style={styles.countryCode}>+91 \u25BE</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.phoneInput}
                placeholder="Phone number"
                placeholderTextColor={`${colors.on_surface}66`}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                selectionColor={colors.secondary}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, phone.length < 8 && styles.primaryBtnDisabled]}
              disabled={phone.length < 8}
              onPress={() => setStep('otp')}
              activeOpacity={0.85}
            >
              <Text style={[styles.primaryBtnText, phone.length < 8 && styles.primaryBtnTextDisabled]}>Send OTP Code</Text>
            </TouchableOpacity>

            <Text style={styles.termsNote}>By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms</Text> &{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
            <TouchableOpacity onPress={onUseEmail}>
              <Text style={styles.emailLink}>Use email instead</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.tag}>VERIFY YOUR NUMBER</Text>
            <Text style={styles.headline}>Check Your Messages</Text>
            <Text style={styles.subtitle}>We sent a 6-digit code to:</Text>
            <Text style={styles.phoneDisplay}>+91 {phone}</Text>

            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={ref => { otpRefs.current[i] = ref; }}
                  style={[styles.otpBox, digit.length > 0 && styles.otpBoxFilled]}
                  value={digit}
                  onChangeText={val => handleOtpChange(val, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectionColor={colors.secondary}
                  textAlign="center"
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, !otp.every(d => d.length === 1) && styles.primaryBtnDisabled]}
              disabled={!otp.every(d => d.length === 1)}
              onPress={onVerified}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Verify Number</Text>
            </TouchableOpacity>

            <View style={styles.resendRow}>
              <Text style={styles.resendLabel}>Didn't receive the code? </Text>
              <TouchableOpacity disabled={countdown > 0}>
                <Text style={[styles.resendLink, countdown > 0 && styles.resendLinkDisabled]}>
                  Resend Code {countdown > 0 ? `(00:${String(countdown).padStart(2, '0')})` : ''}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setStep('phone')}>
              <Text style={styles.changeLink}>Wrong number? Change it</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  backBtn: { paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  scroll: { paddingHorizontal: rw(6.2), alignItems: 'center' },
  iconWrapper: { alignItems: 'center', marginTop: rh(1.4), marginBottom: rh(2.4) },
  iconCircle: { backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 30 }, android: { elevation: 6 } }) },
  iconEmoji: { fontSize: rf(4.7) },
  tag: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.7) },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center', marginBottom: rh(0.7) },
  subtitle: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center', marginBottom: rh(2.4) },
  phoneRow: { flexDirection: 'row', width: '100%', gap: rw(2.1), marginBottom: rh(2.4) },
  countryPicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(3.1), height: rh(6.6), gap: rw(1.5), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26` },
  countryFlag: { fontSize: rf(2.1) },
  countryCode: { ...typography['body-md'], color: colors.on_surface },
  phoneInput: { flex: 1, backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(6.6), ...typography['body-md'], color: colors.on_surface, borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26` },
  primaryBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.9), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  primaryBtnDisabled: { backgroundColor: colors.surface_container, ...Platform.select({ ios: { shadowOpacity: 0 }, android: { elevation: 0 } }) },
  primaryBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  primaryBtnTextDisabled: { color: `${colors.on_surface}4D` },
  termsNote: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'center', marginBottom: rh(1.4) },
  termsLink: { color: colors.tertiary },
  emailLink: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(0.9) },
  phoneDisplay: { ...typography['body-md'], color: colors.on_surface, fontFamily: 'PlusJakartaSans-SemiBold', marginBottom: rh(2.4) },
  otpRow: { flexDirection: 'row', gap: rw(2.6), marginBottom: rh(2.8) },
  otpBox: { width: rw(12.8), height: rh(7.1), backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), borderBottomWidth: 2, borderBottomColor: `${colors.outline_variant}26`, ...typography['headline-sm'], color: colors.on_surface, textAlign: 'center' },
  otpBoxFilled: { borderBottomColor: colors.secondary },
  resendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: rh(0.9) },
  resendLabel: { ...typography['body-md'], color: `${colors.on_surface}80` },
  resendLink: { ...typography['label-md'], color: colors.tertiary },
  resendLinkDisabled: { opacity: 0.4 },
  changeLink: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(0.9) },
});
