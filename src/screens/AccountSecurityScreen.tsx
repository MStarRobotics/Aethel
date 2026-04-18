import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Switch, Modal, Pressable, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const SESSIONS = [
  { id: '1', device: 'iPhone 14', os: 'iOS 17', location: 'Mumbai, India', time: 'Active now', current: true },
  { id: '2', device: 'Chrome', os: 'Windows', location: 'New York, USA', time: '2 days ago', current: false },
  { id: '3', device: 'Android', os: 'Samsung', location: 'London, UK', time: '5 days ago', current: false },
];

const LOGIN_HISTORY = [
  { id: '1', device: 'iPhone 14 · Mumbai', time: 'Today, 10:32 AM', suspicious: false },
  { id: '2', device: 'Chrome · New York', time: '2 days ago, 3:15 PM', suspicious: false },
  { id: '3', device: 'Unknown · Singapore', time: '3 days ago, 11:00 PM', suspicious: true },
];

interface Props { onBack: () => void; onChangePassword: () => void; onChangeEmail: () => void; }

export default function AccountSecurityScreen({ onBack, onChangePassword, onChangeEmail }: Props) {
  const insets = useSafeAreaInsets();
  const [twoFA, setTwoFA] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState<'sms' | 'app' | 'email'>('sms');
  const [sessions, setSessions] = useState(SESSIONS);
  const [show2FASetup, setShow2FASetup] = useState(false);

  const signOutSession = (id: string) => setSessions(prev => prev.filter(s => s.id !== id));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Security</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* 2FA */}
        <Text style={styles.sectionLabel}>TWO-FACTOR AUTHENTICATION</Text>
        <View style={styles.twoFACard}>
          <View style={styles.twoFARow}>
            <Text style={styles.twoFAIcon}>\u{1F510}</Text>
            <View style={styles.twoFAInfo}>
              <Text style={styles.twoFATitle}>Two-Factor Auth</Text>
              <Text style={styles.twoFADesc}>Add an extra layer of security to your account</Text>
            </View>
            <Switch value={twoFA} onValueChange={v => { setTwoFA(v); if (v) setShow2FASetup(true); }} trackColor={{ false: colors.surface_container_high, true: colors.secondary_container }} thumbColor={colors.on_surface} ios_backgroundColor={colors.surface_container_high} />
          </View>
        </View>

        {twoFA && (
          <View style={[styles.twoFACard, { marginTop: rh(0.5) }]}>
            <Text style={styles.methodLabel}>2FA METHOD</Text>
            {[{ id: 'sms', label: 'SMS to +91 98765 43210' }, { id: 'app', label: 'Authenticator App' }, { id: 'email', label: 'Email' }].map(m => (
              <TouchableOpacity key={m.id} style={styles.radioRow} onPress={() => setTwoFAMethod(m.id as any)} activeOpacity={0.7}>
                <View style={[styles.radioCircle, twoFAMethod === m.id && styles.radioCircleSelected]}>
                  {twoFAMethod === m.id && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Sessions */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>LOGIN & SESSIONS</Text>
        <View style={styles.sessionList}>
          {sessions.map(s => (
            <View key={s.id} style={styles.sessionCard}>
              <Text style={styles.sessionDevice}>{s.current ? '\u{1F4F1}' : '\u{1F4BB}'} {s.device} · {s.os}</Text>
              <Text style={[s.current && styles.sessionLabelCurrent]}>{s.current ? 'This Device' : ''}</Text>
              <Text style={styles.sessionLocation}>{s.location}</Text>
              <Text style={[styles.sessionTime, s.current && styles.sessionTimeActive]}>{s.time}</Text>
              {!s.current && (
                <TouchableOpacity onPress={() => signOutSession(s.id)}>
                  <Text style={styles.signOutLink}>Sign Out This Device</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.signOutAllBtn} activeOpacity={0.8}>
          <Text style={styles.signOutAllText}>\u{1F6AA} Sign Out All Devices</Text>
        </TouchableOpacity>

        {/* Login history */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>LOGIN HISTORY</Text>
        <View style={styles.historyList}>
          {LOGIN_HISTORY.map(h => (
            <View key={h.id} style={[styles.historyRow, h.suspicious && styles.historyRowSuspicious]}>
              <Text style={styles.historyIcon}>{h.suspicious ? '\u26A0\uFE0F' : '\u2705'}</Text>
              <View style={styles.historyInfo}>
                <Text style={styles.historyDevice}>{h.device}</Text>
                <Text style={styles.historyTime}>{h.time}</Text>
              </View>
              {h.suspicious && (
                <TouchableOpacity>
                  <Text style={styles.notMeLink}>This wasn't me</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Password / email */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>ACCOUNT PASSWORDS</Text>
        <View style={styles.settingList}>
          <TouchableOpacity style={[styles.settingRow, styles.settingDivider]} onPress={onChangePassword} activeOpacity={0.7}>
            <Text style={styles.settingIcon}>\u{1F511}</Text>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Text style={styles.settingArrow}>\u203A</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow} onPress={onChangeEmail} activeOpacity={0.7}>
            <Text style={styles.settingIcon}>\u{1F4E7}</Text>
            <Text style={styles.settingLabel}>Change Email</Text>
            <Text style={styles.settingArrow}>\u203A</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 2FA setup sheet */}
      <Modal visible={show2FASetup} transparent animationType="slide" onRequestClose={() => setShow2FASetup(false)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setShow2FASetup(false)}>
          <Pressable style={[styles.setupSheet, { paddingBottom: insets.bottom + rh(2) }]} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Set Up 2FA</Text>
              <TouchableOpacity onPress={() => setShow2FASetup(false)}><Text style={styles.sheetClose}>\u2715</Text></TouchableOpacity>
            </View>
            <Text style={styles.methodLabel}>CHOOSE METHOD</Text>
            {[{ icon: '\u{1F4F1}', label: 'SMS Verification', desc: 'Code sent to your phone number' }, { icon: '\u{1F510}', label: 'Authenticator App', desc: 'Google Auth, Authy, etc.' }, { icon: '\u{1F4E7}', label: 'Email Verification', desc: 'Code sent to your email' }].map(m => (
              <TouchableOpacity key={m.label} style={styles.methodCard} onPress={() => setShow2FASetup(false)} activeOpacity={0.8}>
                <Text style={styles.methodIcon}>{m.icon}</Text>
                <View>
                  <Text style={styles.methodTitle}>{m.label}</Text>
                  <Text style={styles.methodDesc}>{m.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.continueBtn} onPress={() => setShow2FASetup(false)} activeOpacity={0.85}>
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  scroll: { paddingHorizontal: rw(6.2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  twoFACard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(1.2) },
  twoFARow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  twoFAIcon: { fontSize: rf(1.9) },
  twoFAInfo: { flex: 1 },
  twoFATitle: { ...typography['label-lg'], color: colors.on_surface },
  twoFADesc: { ...typography['body-md'], color: `${colors.on_surface}99` },
  methodLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  radioCircle: { width: rw(5.1), height: rw(5.1), borderRadius: rw(2.6), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: colors.secondary_container, backgroundColor: colors.secondary_container },
  radioDot: { width: rw(2.1), height: rw(2.1), borderRadius: rw(1.1), backgroundColor: '#FFFFFF' },
  radioLabel: { ...typography['body-md'], color: colors.on_surface },
  sessionList: { gap: rh(1) },
  sessionCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(0.4) },
  sessionDevice: { ...typography['label-md'], color: colors.on_surface },
  sessionLabelCurrent: { ...typography['label-sm'], color: colors.secondary_container },
  sessionLocation: { ...typography['label-sm'], color: `${colors.on_surface}80` },
  sessionTime: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  sessionTimeActive: { color: colors.emerald },
  signOutLink: { ...typography['label-sm'], color: colors.primary_container, marginTop: rh(0.5) },
  signOutAllBtn: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), height: rh(6.2), alignItems: 'center', justifyContent: 'center', marginTop: rh(1) },
  signOutAllText: { ...typography['label-lg'], color: colors.primary_container },
  historyList: { gap: rh(0.5) },
  historyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(3.1), padding: rw(4.1), gap: rw(3.1) },
  historyRowSuspicious: { borderLeftWidth: 3, borderLeftColor: colors.secondary_container },
  historyIcon: { fontSize: rf(1.6) },
  historyInfo: { flex: 1 },
  historyDevice: { ...typography['label-md'], color: colors.on_surface },
  historyTime: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  notMeLink: { ...typography['label-sm'], color: colors.primary_container },
  settingList: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', height: rh(6.2), paddingHorizontal: rw(4.1), gap: rw(3.1) },
  settingDivider: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  settingIcon: { fontSize: rf(1.9), width: rw(6.2), textAlign: 'center' },
  settingLabel: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  settingArrow: { ...typography['title-lg'], color: `${colors.on_surface}66` },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  setupSheet: { backgroundColor: `${colors.surface_variant}F2`, borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), paddingHorizontal: rw(6.2) },
  sheetHandle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.4) },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: rh(1.9) },
  sheetTitle: { ...typography['title-md'], color: colors.on_surface },
  sheetClose: { ...typography['title-md'], color: colors.tertiary },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(1) },
  methodIcon: { fontSize: rf(2.4) },
  methodTitle: { ...typography['label-lg'], color: colors.on_surface },
  methodDesc: { ...typography['body-md'], color: `${colors.on_surface}99` },
  continueBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: rh(1.4), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  continueBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
});
