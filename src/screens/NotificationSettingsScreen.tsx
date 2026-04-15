import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Switch, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface ToggleItem { key: string; label: string; master?: boolean; }

const PUSH_MASTER: ToggleItem = { key: 'pushEnabled', label: 'Enable Push Notifications', master: true };
const PUSH_ROWS: ToggleItem[] = [
  { key: 'newMatches',   label: 'New Matches' },
  { key: 'newMessages',  label: 'New Messages' },
  { key: 'likesReceived', label: 'Likes Received' },
  { key: 'superLikes',   label: 'Super Likes' },
  { key: 'profileViews', label: 'Profile Views' },
  { key: 'qaReminders',  label: 'Q&A Reminders' },
  { key: 'profileIncomplete', label: 'Profile Incomplete' },
];

const EMAIL_MASTER: ToggleItem = { key: 'emailEnabled', label: 'Enable Email Notifications', master: true };
const EMAIL_ROWS: ToggleItem[] = [
  { key: 'weeklyMatchSummary', label: 'Weekly Match Summary' },
  { key: 'messageDigest',      label: 'New Message Digest' },
  { key: 'appUpdates',         label: 'App Updates & News' },
  { key: 'tips',               label: 'Tips & Suggestions' },
];

const STYLE_ROWS: ToggleItem[] = [
  { key: 'sound',     label: 'Sound' },
  { key: 'vibration', label: 'Vibration' },
  { key: 'badge',     label: 'Badge Count' },
];

const QUIET_MASTER: ToggleItem = { key: 'quietHours', label: 'Enable Quiet Hours', master: true };

interface Props { onBack: () => void; }

export default function NotificationSettingsScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    pushEnabled: true, newMatches: true, newMessages: true, likesReceived: true,
    superLikes: true, profileViews: false, qaReminders: true, profileIncomplete: true,
    emailEnabled: false, weeklyMatchSummary: false, messageDigest: false, appUpdates: false, tips: false,
    quietHours: false, sound: true, vibration: true, badge: true,
  });

  const toggle = (key: string) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const pushDisabled = !toggles.pushEnabled;
  const emailDisabled = !toggles.emailEnabled;
  const quietDisabled = !toggles.quietHours;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Push notifications */}
        <Text style={styles.sectionLabel}>PUSH NOTIFICATIONS</Text>
        <View style={styles.rowGroup}>
          <ToggleRow item={PUSH_MASTER} value={toggles.pushEnabled} onToggle={() => toggle('pushEnabled')} />
        </View>
        <View style={[styles.rowGroup, { marginTop: rh(0.5), opacity: pushDisabled ? 0.3 : 1 }]}>
          {PUSH_ROWS.map((row, i) => (
            <ToggleRow
              key={row.key} item={row}
              value={toggles[row.key]}
              onToggle={() => !pushDisabled && toggle(row.key)}
              divider={i < PUSH_ROWS.length - 1}
            />
          ))}
        </View>

        {/* Email notifications */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>EMAIL NOTIFICATIONS</Text>
        <View style={styles.rowGroup}>
          <ToggleRow item={EMAIL_MASTER} value={toggles.emailEnabled} onToggle={() => toggle('emailEnabled')} />
        </View>
        <View style={[styles.rowGroup, { marginTop: rh(0.5), opacity: emailDisabled ? 0.3 : 1 }]}>
          {EMAIL_ROWS.map((row, i) => (
            <ToggleRow
              key={row.key} item={row}
              value={toggles[row.key]}
              onToggle={() => !emailDisabled && toggle(row.key)}
              divider={i < EMAIL_ROWS.length - 1}
            />
          ))}
        </View>

        {/* Quiet hours */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>QUIET HOURS</Text>
        <View style={styles.rowGroup}>
          <ToggleRow item={QUIET_MASTER} value={toggles.quietHours} onToggle={() => toggle('quietHours')} />
        </View>
        <View style={[styles.rowGroup, { marginTop: rh(0.5), opacity: quietDisabled ? 0.3 : 1 }]}>
          <View style={[styles.toggleRow, styles.divider]}>
            <Text style={styles.rowLabel}>From</Text>
            <TouchableOpacity style={styles.timeDropdown} disabled={quietDisabled}>
              <Text style={styles.timeText}>10:00 PM</Text>
              <Text style={styles.chevron}>\u203A</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.rowLabel}>To</Text>
            <TouchableOpacity style={styles.timeDropdown} disabled={quietDisabled}>
              <Text style={styles.timeText}>8:00 AM</Text>
              <Text style={styles.chevron}>\u203A</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification style */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>NOTIFICATION STYLE</Text>
        <View style={styles.rowGroup}>
          {STYLE_ROWS.map((row, i) => (
            <ToggleRow
              key={row.key} item={row}
              value={toggles[row.key]}
              onToggle={() => toggle(row.key)}
              divider={i < STYLE_ROWS.length - 1}
            />
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

function ToggleRow({ item, value, onToggle, divider = false }: {
  item: ToggleItem; value: boolean; onToggle: () => void; divider?: boolean;
}) {
  return (
    <View style={[item.master ? styles.masterRow : styles.toggleRow, divider && styles.divider]}>
      <Text style={[item.master ? styles.masterLabel : styles.rowLabel]}>{item.label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.surface_container_high, true: colors.secondary_container }}
        thumbColor={colors.on_surface}
        ios_backgroundColor={colors.surface_container_high}
      />
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
  rowGroup: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), overflow: 'hidden' },
  masterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: rh(6.2), paddingHorizontal: rw(4.1), backgroundColor: colors.surface_container_high },
  masterLabel: { ...typography['label-lg'], color: colors.on_surface, flex: 1 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: rh(6.2), paddingHorizontal: rw(4.1) },
  divider: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  rowLabel: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  timeDropdown: { flexDirection: 'row', alignItems: 'center', gap: rw(2.1), backgroundColor: colors.surface_container_highest, paddingHorizontal: rw(3.1), height: rh(4.3), borderRadius: rw(2.1) },
  timeText: { ...typography['label-md'], color: colors.on_surface },
  chevron: { ...typography['title-md'], color: `${colors.on_surface}80` },
});
