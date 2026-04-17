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

interface Props {
  onBack: () => void;
  onSendCode: () => void;
}

export default function ChangeEmailScreen({ onBack, onSendCode }: Props) {
  const insets = useSafeAreaInsets();
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailsMatch = newEmail === confirmEmail && confirmEmail.length > 0;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
  const canSubmit = isValidEmail && emailsMatch && password.length > 0;

  const ICON_SIZE = rw(16.4);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Email</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Icon */}
        <View style={styles.iconWrapper}>
          <View style={[styles.iconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
            <Text style={styles.iconEmoji}>\u{1F4E7}</Text>
          </View>
        </View>

        <Text style={styles.tag}>UPDATE EMAIL</Text>
        <Text style={styles.headline}>Change Your Email Address</Text>

        {/* Current email (read-only) */}
        <Text style={styles.fieldLabel}>Current Email</Text>
        <Text style={styles.currentEmail}>sarah@oldmail.com</Text>

        {/* New email */}
        <Text style={[styles.fieldLabel, { marginTop: rh(1.9) }]}>New Email Address</Text>
        <View style={[styles.inputWrapper, newEmail.length > 0 && !isValidEmail && styles.inputError]}>
          <TextInput
            style={styles.input}
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="Enter new email"
            placeholderTextColor={`${colors.on_surface}66`}
            keyboardType="email-address"
            autoCapitalize="none"
            selectionColor={colors.secondary}
          />
        </View>

        {/* Confirm email */}
        <Text style={[styles.fieldLabel, { marginTop: rh(1.9) }]}>Confirm New Email</Text>
        <View style={[styles.inputWrapper, confirmEmail.length > 0 && !emailsMatch && styles.inputError]}>
          <TextInput
            style={styles.input}
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            placeholder="Confirm new email"
            placeholderTextColor={`${colors.on_surface}66`}
            keyboardType="email-address"
            autoCapitalize="none"
            selectionColor={colors.secondary}
          />
        </View>
        {confirmEmail.length > 0 && !emailsMatch && (
          <Text style={styles.errorText}>Emails don't match</Text>
        )}

        {/* Password */}
        <Text style={[styles.fieldLabel, { marginTop: rh(1.9) }]}>Password (to confirm)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Enter your password"
            placeholderTextColor={`${colors.on_surface}66`}
            selectionColor={colors.secondary}
          />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.eyeIcon}>{showPassword ? '\u{1F441}\uFE0F' : '\u{1F576}\uFE0F'}</Text>
          </TouchableOpacity>
        </View>

        {/* Warning card */}
        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>\u26A0\uFE0F</Text>
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>Verification required</Text>
            <Text style={styles.warningBody}>You'll need to verify your new email before the change takes effect.</Text>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          disabled={!canSubmit}
          onPress={onSendCode}
          activeOpacity={0.85}
        >
          <Text style={[styles.submitBtnText, !canSubmit && styles.submitBtnTextDisabled]}>Send Verification Code</Text>
        </TouchableOpacity>
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
  currentEmail: { ...typography['body-md'], color: `${colors.on_surface}80`, alignSelf: 'flex-start', marginBottom: rh(0.5) },
  inputWrapper: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(6.6), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26` },
  inputError: { borderBottomColor: colors.primary_container, borderBottomWidth: 2 },
  input: { flex: 1, ...typography['body-md'], color: colors.on_surface },
  eyeIcon: { fontSize: rf(1.9), opacity: 0.6 },
  errorText: { ...typography['label-sm'], color: colors.primary_container, alignSelf: 'flex-start', marginTop: rh(0.5) },
  warningCard: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), marginTop: rh(2.4), marginBottom: rh(2.4) },
  warningIcon: { fontSize: rf(1.9) },
  warningText: { flex: 1 },
  warningTitle: { ...typography['label-sm'], color: colors.secondary_container, marginBottom: rh(0.4) },
  warningBody: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  submitBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  submitBtnDisabled: { backgroundColor: colors.surface_container, ...Platform.select({ ios: { shadowOpacity: 0 }, android: { elevation: 0 } }) },
  submitBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  submitBtnTextDisabled: { color: `${colors.on_surface}4D` },
});
