import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Switch, Platform, StatusBar, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface SettingRow {
  icon: string; label: string; type: 'nav' | 'toggle'; key?: string; danger?: boolean;
}

const SECTIONS: { title: string; danger?: boolean; rows: SettingRow[] }[] = [
  {
    title: 'ACCOUNT',
    rows: [
      { icon: '\u{1F464}', label: 'Edit Profile',     type: 'nav' },
      { icon: '\u{1F4E7}', label: 'Change Email',     type: 'nav' },
      { icon: '\u{1F511}', label: 'Change Password',  type: 'nav' },
      { icon: '\u{1F4F1}', label: 'Phone Number',     type: 'nav' },
      { icon: '\u2705',    label: 'Verify Account',   type: 'nav' },
      { icon: '\u{1F510}', label: 'Account Security', type: 'nav' },
    ],
  },
  {
    title: 'DISCOVERY',
    rows: [
      { icon: '\u{1F3AF}', label: 'Match Preferences',       type: 'nav' },
      { icon: '\u{1F4CD}', label: 'Location Settings',       type: 'nav' },
      { icon: '\u{1F441}\uFE0F', label: 'Show Me On Discovery', type: 'toggle', key: 'discovery' },
    ],
  },
  {
    title: 'PRIVACY',
    rows: [
      { icon: '\u{1F512}', label: 'Privacy Settings',       type: 'nav' },
      { icon: '\u{1F440}', label: 'Who Can See My Profile', type: 'nav' },
      { icon: '\u{1F6AB}', label: 'Blocked Users',          type: 'nav' },
      { icon: '\u{1F4CA}', label: 'Data & Privacy',         type: 'nav' },
    ],
  },
  {
    title: 'NOTIFICATIONS',
    rows: [
      { icon: '\u{1F514}', label: 'Push Notifications',  type: 'nav' },
      { icon: '\u{1F4E7}', label: 'Email Notifications', type: 'nav' },
    ],
  },
  {
    title: 'APPEARANCE',
    rows: [
      { icon: '\u{1F319}', label: 'Dark Mode',        type: 'toggle', key: 'darkMode' },
      { icon: '\u{1F3A8}', label: 'Theme Color',      type: 'nav' },
      { icon: '\u{1F310}', label: 'Language & Region', type: 'nav' },
    ],
  },
  {
    title: 'SUPPORT',
    rows: [
      { icon: '\u2753',    label: 'Help & FAQ',      type: 'nav' },
      { icon: '\u{1F4AC}', label: 'Contact Support', type: 'nav' },
      { icon: '\u2B50',    label: 'Rate Aethel',     type: 'nav' },
    ],
  },
  {
    title: 'LEGAL',
    rows: [
      { icon: '\u{1F4C4}', label: 'Terms of Service', type: 'nav' },
      { icon: '\u{1F510}', label: 'Privacy Policy',   type: 'nav' },
    ],
  },
  {
    title: 'DANGER ZONE',
    danger: true,
    rows: [
      { icon: '\u23F8\uFE0F', label: 'Pause Account',  type: 'nav' },
      { icon: '\u{1F5D1}\uFE0F', label: 'Delete Account', type: 'nav', danger: true },
    ],
  },
];

interface Props {
  onBack: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export default function SettingsScreen({ onBack, onEditProfile, onLogout, onDeleteAccount }: Props) {
  const insets = useSafeAreaInsets();
  const [toggles, setToggles] = useState<Record<string, boolean>>({ discovery: true, darkMode: true });
  const [showLogout, setShowLogout] = useState(false);

  const toggle = (key: string) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Profile summary card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }} style={styles.profilePhoto} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sarah Johnson</Text>
            <Text style={styles.profileEmail}>sarah@email.com</Text>
            <TouchableOpacity onPress={onEditProfile}>
              <Text style={styles.editLink}>Edit Profile \u2192</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sections */}
        {SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionLabel, section.danger && styles.sectionLabelDanger]}>
              {section.title}
            </Text>
            <View style={styles.rowGroup}>
              {section.rows.map((row, i) => (
                <TouchableOpacity
                  key={row.label}
                  style={[styles.settingRow, i < section.rows.length - 1 && styles.settingRowBorder]}
                  onPress={() => {
                    if (row.label === 'Delete Account') onDeleteAccount();
                    else if (row.type === 'nav') { /* navigate */ }
                  }}
                  activeOpacity={row.type === 'toggle' ? 1 : 0.7}
                >
                  <Text style={styles.rowIcon}>{row.icon}</Text>
                  <Text style={[styles.rowLabel, row.danger && styles.rowLabelDanger]}>{row.label}</Text>
                  {row.type === 'nav' && (
                    <Text style={styles.rowArrow}>\u203A</Text>
                  )}
                  {row.type === 'toggle' && row.key && (
                    <Switch
                      value={toggles[row.key] ?? false}
                      onValueChange={() => toggle(row.key!)}
                      trackColor={{ false: colors.surface_container_high, true: colors.secondary_container }}
                      thumbColor={colors.on_surface}
                      ios_backgroundColor={colors.surface_container_high}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Log out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogout(true)} activeOpacity={0.8}>
          <Text style={styles.logoutText}>\u{1F6AA} Log Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      {/* Logout confirmation */}
      <Modal visible={showLogout} transparent animationType="fade" onRequestClose={() => setShowLogout(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log Out?</Text>
            <Text style={styles.modalBody}>You'll need to sign in again to access your account.</Text>
            <TouchableOpacity style={styles.modalDestructiveBtn} onPress={() => { setShowLogout(false); onLogout(); }} activeOpacity={0.85}>
              <Text style={styles.modalDestructiveBtnText}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLogout(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(4.1), gap: rw(4.1), marginBottom: rh(3.6) },
  profilePhoto: { width: rw(13.3), height: rw(13.3), borderRadius: rw(6.7), backgroundColor: colors.surface_container_high },
  profileInfo: { flex: 1 },
  profileName: { ...typography['title-md'], color: colors.on_surface, marginBottom: rh(0.3) },
  profileEmail: { ...typography['body-md'], color: `${colors.on_surface}99`, marginBottom: rh(0.5) },
  editLink: { ...typography['label-md'], color: colors.tertiary },
  section: { marginBottom: rh(3.6) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  sectionLabelDanger: { color: colors.primary_container },
  rowGroup: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', height: rh(6.2), paddingHorizontal: rw(4.1), gap: rw(3.1) },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  rowIcon: { fontSize: rf(1.9), width: rw(6.2), textAlign: 'center' },
  rowLabel: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  rowLabelDanger: { color: colors.primary_container },
  rowArrow: { ...typography['title-lg'], color: `${colors.on_surface}66` },
  logoutBtn: { height: rh(6.2), alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  logoutText: { ...typography['label-lg'], color: colors.primary_container },
  version: { ...typography['label-sm'], color: `${colors.on_surface}40`, textAlign: 'center', marginBottom: rh(2) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.88)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(6.2) },
  modalCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(6.2), padding: rw(6.2), alignItems: 'center' },
  modalTitle: { ...typography['title-lg'], color: colors.on_surface, marginBottom: rh(0.9) },
  modalBody: { ...typography['body-md'], color: `${colors.on_surface}B3`, textAlign: 'center', marginBottom: rh(2.8) },
  modalDestructiveBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.primary_container, borderRadius: rw(1), alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  modalDestructiveBtnText: { ...typography['title-md'], color: '#FFFFFF', letterSpacing: 1 },
  modalCancelText: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(1.2) },
});
