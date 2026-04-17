import React, { useState } from 'react';
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

interface Requirement { label: string; test: (pw: string) => boolean; }

const REQUIREMENTS: Requirement[] = [
  { label: 'At least 8 characters',  test: pw => pw.length >= 8 },
  { label: 'One uppercase letter',   test: pw => /[A-Z]/.test(pw) },
  { label: 'One number',             test: pw => /\d/.test(pw) },
  { label: 'One special character',  test: pw => /[^A-Za-z0-9]/.test(pw) },
];

interface Props {
  onBack: () => void;
  onForgotPassword: () => void;
}

export default function ChangePasswordScreen({ onBack, onForgotPassword }: Props) {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const allMet = REQUIREMENTS.every(r => r.test(newPw));
  const passwordsMatch = newPw === confirm && confirm.length > 0;
  const canSubmit = current.length > 0 && allMet && passwordsMatch;

  const ICON_SIZE = rw(16.4);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Icon */}
        <View style={styles.iconWrapper}>
          <View style={[styles.iconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
            <Text style={styles.iconEmoji}>\u{1F511}</Text>
          </View>
        </View>

        <Text style={styles.tag}>UPDATE PASSWORD</Text>
        <Text style={styles.headline}>Keep Your Account Secure</Text>

        {/* Current password */}
        <Text style={styles.fieldLabel}>Current Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={current}
            onChangeText={setCurrent}
            secureTextEntry={!showCurrent}
            placeholder="Enter current password"
            placeholderTextColor={`${colors.on_surface}66`}
            selectionColor={colors.secondary}
          />
          <TouchableOpacity onPress={() => setShowCurrent(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.eyeIcon}>{showCurrent ? '\u{1F441}\uFE0F' : '\u{1F576}\uFE0F'}</Text>
          </TouchableOpacity>
        </View>

        {/* New password */}
        <Text style={[styles.fieldLabel, { marginTop: rh(1.9) }]}>New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={newPw}
            onChangeText={setNewPw}
            secureTextEntry={!showNew}
            placeholder="Enter new password"
            placeholderTextColor={`${colors.on_surface}66`}
            selectionColor={colors.secondary}
          />
          <TouchableOpacity onPress={() => setShowNew(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.eyeIcon}>{showNew ? '\u{1F441}\uFE0F' : '\u{1F576}\uFE0F'}</Text>
          </TouchableOpacity>
        </View>

        {/* Requirements */}
        {newPw.length > 0 && (
          <View style={styles.requirementsList}>
            <Text style={styles.requirementsTitle}>PASSWORD REQUIREMENTS</Text>
            {REQUIREMENTS.map(req => {
              const met = req.test(newPw);
              return (
                <View key={req.label} style={styles.requirementRow}>
                  <Text style={[styles.requirementIcon, met ? styles.metIcon : styles.unmetIcon]}>
                    {met ? '\u2705' : '\u274C'}
                  </Text>
                  <Text style={[styles.requirementText, met ? styles.metText : styles.unmetText]}>
                    {req.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Confirm password */}
        <Text style={[styles.fieldLabel, { marginTop: rh(1.9) }]}>Confirm New Password</Text>
        <View style={[styles.inputWrapper, confirm.length > 0 && !passwordsMatch && styles.inputError]}>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showConfirm}
            placeholder="Confirm new password"
            placeholderTextColor={`${colors.on_surface}66`}
            selectionColor={colors.secondary}
          />
          <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.eyeIcon}>{showConfirm ? '\u{1F441}\uFE0F' : '\u{1F576}\uFE0F'}</Text>
          </TouchableOpacity>
        </View>
        {confirm.length > 0 && !passwordsMatch && (
          <Text style={styles.mismatchText}>Passwords don't match</Text>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          <Text style={[styles.submitBtnText, !canSubmit && styles.submitBtnTextDisabled]}>Update Password</Text>
        </TouchableOpacity>

        <View style={styles.forgotRow}>
          <Text style={styles.forgotLabel}>Forgot your current password? </Text>
          <TouchableOpacity onPress={onForgotPassword}>
            <Text style={styles.forgotLink}>Reset via email</Text>
          </TouchableOpacity>
        </View>
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
  iconWrapper: { alignItems: 'center', marginTop: rh(2.4), marginBottom: rh(2.4) },
  iconCircle: { backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: rf(3.8) },
  tag: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.7) },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, textAlign: 'center', marginBottom: rh(2.8) },
  fieldLabel: { ...typography['label-md'], color: colors.tertiary, alignSelf: 'flex-start', marginBottom: rh(0.7) },
  inputWrapper: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(6.6), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26` },
  inputError: { borderBottomColor: colors.primary_container, borderBottomWidth: 2 },
  input: { flex: 1, ...typography['body-md'], color: colors.on_surface },
  eyeIcon: { fontSize: rf(1.9), opacity: 0.6 },
  requirementsList: { width: '100%', marginTop: rh(1.4), gap: rh(0.7) },
  requirementsTitle: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.5) },
  requirementRow: { flexDirection: 'row', alignItems: 'center', gap: rw(2.6) },
  requirementIcon: { fontSize: rf(1.6) },
  metIcon: {},
  unmetIcon: {},
  requirementText: { ...typography['label-sm'] },
  metText: { color: colors.emerald },
  unmetText: { color: colors.primary_container },
  mismatchText: { ...typography['label-sm'], color: colors.primary_container, alignSelf: 'flex-start', marginTop: rh(0.5) },
  submitBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: rh(2.8), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  submitBtnDisabled: { backgroundColor: colors.surface_container, ...Platform.select({ ios: { shadowOpacity: 0 }, android: { elevation: 0 } }) },
  submitBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  submitBtnTextDisabled: { color: `${colors.on_surface}4D` },
  forgotRow: { flexDirection: 'row', alignItems: 'center', marginTop: rh(1.9) },
  forgotLabel: { ...typography['body-md'], color: `${colors.on_surface}80` },
  forgotLink: { ...typography['label-md'], color: colors.tertiary },
});
