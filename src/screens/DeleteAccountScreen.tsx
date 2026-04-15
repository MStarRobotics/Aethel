import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Step = 1 | 2 | 3;

const REASONS = [
  'Found someone special \u{1F495}',
  'Taking a break',
  'Too many notifications',
  'Privacy concerns',
  'App not working well',
  'Not enough matches',
  'Other',
];

interface Props {
  onBack: () => void;
  onPauseInstead: () => void;
  onDeleted: () => void;
}

export default function DeleteAccountScreen({ onBack, onPauseInstead, onDeleted }: Props) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(1);
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={step === 1 ? onBack : () => setStep(s => (s - 1) as Step)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* ── STEP 1: Warning ── */}
        {step === 1 && (
          <>
            {/* Warning icon */}
            <View style={styles.iconWrapper}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>\u26A0\uFE0F</Text>
              </View>
            </View>

            <Text style={styles.dangerTag}>PERMANENT ACTION</Text>
            <Text style={styles.headline}>Are You Sure?</Text>

            {/* Consequences card */}
            <View style={styles.consequencesCard}>
              <Text style={styles.consequencesTitle}>Deleting your account will permanently:</Text>
              {[
                'Delete your profile and photos',
                'Delete all matches and conversations',
                'Remove all your data',
              ].map(item => (
                <View key={item} style={styles.bulletRow}>
                  <Text style={styles.bullet}>\u2022</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
              <View style={styles.bulletRow}>
                <Text style={styles.bullet}>\u2022</Text>
                <Text style={[styles.bulletText, styles.bulletDanger]}>This cannot be undone</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.pauseBtn} onPress={onPauseInstead} activeOpacity={0.8}>
              <Text style={styles.pauseBtnText}>\u23F8\uFE0F  Pause Account Instead</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.destructiveBtn} onPress={() => setStep(2)} activeOpacity={0.85}>
              <Text style={styles.destructiveBtnText}>Continue to Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelLink} onPress={onBack}>
              <Text style={styles.cancelLinkText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── STEP 2: Reason ── */}
        {step === 2 && (
          <>
            <Text style={styles.dangerTag}>WHY ARE YOU LEAVING?</Text>
            <Text style={styles.headline}>Help Us Improve</Text>
            <Text style={styles.optionalLabel}>(Optional)</Text>

            <View style={styles.reasonList}>
              {REASONS.map(r => (
                <TouchableOpacity key={r} style={styles.radioRow} onPress={() => setReason(r)} activeOpacity={0.7}>
                  <View style={[styles.radioCircle, reason === r && styles.radioCircleSelected]}>
                    {reason === r && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.textarea}
              placeholder="Tell us more (optional)"
              placeholderTextColor={`${colors.on_surface}66`}
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={4}
              selectionColor={colors.secondary}
            />

            <TouchableOpacity style={styles.destructiveBtn} onPress={() => setStep(3)} activeOpacity={0.85}>
              <Text style={styles.destructiveBtnText}>Delete My Account</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── STEP 3: OTP ── */}
        {step === 3 && (
          <>
            <Text style={[styles.dangerTag, { color: colors.primary_container }]}>FINAL CONFIRMATION</Text>
            <Text style={styles.headline}>Confirm Deletion</Text>
            <Text style={styles.otpSubtitle}>Enter the code sent to{'\n'}user@email.com</Text>

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
                  selectionColor={colors.primary_container}
                  textAlign="center"
                />
              ))}
            </View>

            <TouchableOpacity style={styles.destructiveBtn} onPress={onDeleted} activeOpacity={0.85}>
              <Text style={styles.destructiveBtnText}>Confirm Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelLink} onPress={() => setStep(2)}>
              <Text style={styles.cancelLinkText}>Back</Text>
            </TouchableOpacity>
          </>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  scroll: { paddingHorizontal: rw(6.2), alignItems: 'center' },
  iconWrapper: { alignItems: 'center', marginTop: rh(2.4), marginBottom: rh(2.8) },
  iconCircle: {
    width: rw(20.5), height: rw(20.5), borderRadius: rw(10.3),
    backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 30 },
      android: { elevation: 10 },
    }),
  },
  iconEmoji: { fontSize: rf(4.7) },
  dangerTag: { ...typography['label-sm'], color: colors.primary_container, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.9), textAlign: 'center' },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center', marginBottom: rh(2.8) },
  optionalLabel: { ...typography['body-md'], color: `${colors.on_surface}80`, textAlign: 'center', marginBottom: rh(2.4) },
  consequencesCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), marginBottom: rh(2.4), gap: rh(1) },
  consequencesTitle: { ...typography['label-md'], color: colors.on_surface, marginBottom: rh(0.5) },
  bulletRow: { flexDirection: 'row', gap: rw(2.1) },
  bullet: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  bulletText: { ...typography['body-md'], color: `${colors.on_surface}B3`, flex: 1 },
  bulletDanger: { color: colors.primary_container },
  pauseBtn: { width: '100%', height: rh(6.6), borderRadius: rw(1.5), borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  pauseBtnText: { ...typography['label-lg'], color: colors.primary },
  destructiveBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.primary_container, borderRadius: rw(1.5), alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  destructiveBtnText: { ...typography['label-lg'], color: '#FFFFFF', letterSpacing: 1 },
  cancelLink: { paddingVertical: rh(1.4) },
  cancelLinkText: { ...typography['label-md'], color: colors.tertiary },
  reasonList: { width: '100%', gap: rh(1.9), marginBottom: rh(2.4) },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  radioCircle: { width: rw(5.1), height: rw(5.1), borderRadius: rw(2.6), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: colors.secondary_container, backgroundColor: colors.secondary_container },
  radioDot: { width: rw(2.1), height: rw(2.1), borderRadius: rw(1.1), backgroundColor: '#FFFFFF' },
  radioLabel: { ...typography['body-md'], color: colors.on_surface },
  textarea: { width: '100%', backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26`, padding: rw(4.1), ...typography['body-md'], color: colors.on_surface, minHeight: rh(9.5), textAlignVertical: 'top', marginBottom: rh(2.4) },
  otpSubtitle: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center', marginBottom: rh(3.6) },
  otpRow: { flexDirection: 'row', gap: rw(2.6), marginBottom: rh(3.6) },
  otpBox: { width: rw(12.8), height: rh(7.1), backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), borderBottomWidth: 2, borderBottomColor: `${colors.outline_variant}26`, ...typography['headline-sm'], color: colors.on_surface, textAlign: 'center' },
  otpBoxFilled: { borderBottomColor: colors.primary_container },
});
