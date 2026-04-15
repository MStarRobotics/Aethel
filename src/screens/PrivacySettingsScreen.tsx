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

type VisibilityOption = 'everyone' | 'matches' | 'nobody';
type DistanceOption = 'exact' | 'approximate' | 'hidden';
type AgeOption = 'exact' | 'range' | 'hidden';

interface RadioGroupProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (v: T) => void;
}

function RadioGroup<T extends string>({ options, selected, onSelect }: RadioGroupProps<T>) {
  return (
    <View style={radioStyles.group}>
      {options.map(opt => (
        <TouchableOpacity key={opt.value} style={radioStyles.row} onPress={() => onSelect(opt.value)} activeOpacity={0.7}>
          <View style={[radioStyles.circle, selected === opt.value && radioStyles.circleSelected]}>
            {selected === opt.value && <View style={radioStyles.dot} />}
          </View>
          <Text style={radioStyles.label}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const radioStyles = StyleSheet.create({
  group: { gap: rh(1.9) },
  row: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  circle: { width: rw(5.1), height: rw(5.1), borderRadius: rw(2.6), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  circleSelected: { borderColor: colors.secondary_container, backgroundColor: colors.secondary_container },
  dot: { width: rw(2.1), height: rw(2.1), borderRadius: rw(1.1), backgroundColor: '#FFFFFF' },
  label: { ...typography['body-md'], color: colors.on_surface },
});

interface Props {
  onBack: () => void;
  onBlockedUsers: () => void;
  onSafetyCenter: () => void;
}

export default function PrivacySettingsScreen({ onBack, onBlockedUsers, onSafetyCenter }: Props) {
  const insets = useSafeAreaInsets();
  const [visibility, setVisibility] = useState<VisibilityOption>('everyone');
  const [distance, setDistance] = useState<DistanceOption>('exact');
  const [age, setAge] = useState<AgeOption>('exact');
  const [toggles, setToggles] = useState({
    onlineStatus: true, lastActive: true, readReceipts: true,
    searchResults: true, visitorsList: true, profileSharing: true,
  });

  const toggle = (key: keyof typeof toggles) =>
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Profile visibility */}
        <Text style={styles.sectionLabel}>PROFILE VISIBILITY</Text>
        <View style={styles.card}>
          <Text style={styles.groupLabel}>Show My Profile To:</Text>
          <RadioGroup
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'matches', label: 'Matches Only' },
              { value: 'nobody', label: 'Nobody (Pause Mode)' },
            ]}
            selected={visibility}
            onSelect={setVisibility}
          />
        </View>

        <View style={[styles.card, { marginTop: rh(1.4) }]}>
          <Text style={styles.groupLabel}>Show My Distance</Text>
          <RadioGroup
            options={[
              { value: 'exact', label: 'Exact distance' },
              { value: 'approximate', label: 'Approximate (within 10km)' },
              { value: 'hidden', label: 'Hide distance' },
            ]}
            selected={distance}
            onSelect={setDistance}
          />
        </View>

        <View style={[styles.card, { marginTop: rh(1.4) }]}>
          <Text style={styles.groupLabel}>Show My Age</Text>
          <RadioGroup
            options={[
              { value: 'exact', label: 'Show exact age' },
              { value: 'range', label: 'Show age range (\u00B12 years)' },
              { value: 'hidden', label: 'Hide age' },
            ]}
            selected={age}
            onSelect={setAge}
          />
        </View>

        {/* Activity status */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>ACTIVITY STATUS</Text>
        <View style={styles.rowGroup}>
          {([
            { key: 'onlineStatus', label: 'Show Online Status' },
            { key: 'lastActive',   label: 'Show Last Active' },
            { key: 'readReceipts', label: 'Show Read Receipts' },
          ] as { key: keyof typeof toggles; label: string }[]).map((row, i, arr) => (
            <View key={row.key} style={[styles.toggleRow, i < arr.length - 1 && styles.divider]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Switch
                value={toggles[row.key]}
                onValueChange={() => toggle(row.key)}
                trackColor={{ false: colors.surface_container_high, true: colors.secondary_container }}
                thumbColor={colors.on_surface}
                ios_backgroundColor={colors.surface_container_high}
              />
            </View>
          ))}
        </View>

        {/* Profile discovery */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>PROFILE DISCOVERY</Text>
        <View style={styles.rowGroup}>
          {([
            { key: 'searchResults', label: 'Appear in Search Results' },
            { key: 'visitorsList',  label: 'Appear in Visitors List' },
            { key: 'profileSharing', label: 'Allow Profile Sharing' },
          ] as { key: keyof typeof toggles; label: string }[]).map((row, i, arr) => (
            <View key={row.key} style={[styles.toggleRow, i < arr.length - 1 && styles.divider]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Switch
                value={toggles[row.key]}
                onValueChange={() => toggle(row.key)}
                trackColor={{ false: colors.surface_container_high, true: colors.secondary_container }}
                thumbColor={colors.on_surface}
                ios_backgroundColor={colors.surface_container_high}
              />
            </View>
          ))}
        </View>

        {/* Data & privacy */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>DATA & PRIVACY</Text>
        <View style={styles.rowGroup}>
          {[
            { icon: '\u{1F4E5}', label: 'Download My Data', danger: false },
            { icon: '\u{1F5D1}\uFE0F', label: 'Delete My Data', danger: true },
            { icon: '\u{1F4CB}', label: 'View Data Usage', danger: false },
          ].map((row, i, arr) => (
            <TouchableOpacity key={row.label} style={[styles.navRow, i < arr.length - 1 && styles.divider]} activeOpacity={0.7}>
              <Text style={styles.rowIcon}>{row.icon}</Text>
              <Text style={[styles.rowLabel, row.danger && styles.rowLabelDanger]}>{row.label}</Text>
              <Text style={styles.rowArrow}>\u203A</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>SAFETY</Text>
        <View style={styles.rowGroup}>
          <TouchableOpacity style={[styles.navRow, styles.divider]} onPress={onBlockedUsers} activeOpacity={0.7}>
            <Text style={styles.rowIcon}>\u{1F6AB}</Text>
            <Text style={styles.rowLabel}>Blocked Users</Text>
            <Text style={styles.rowArrow}>\u203A</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navRow} onPress={onSafetyCenter} activeOpacity={0.7}>
            <Text style={styles.rowIcon}>\u{1F6A8}</Text>
            <Text style={styles.rowLabel}>Safety Center</Text>
            <Text style={styles.rowArrow}>\u203A</Text>
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
  scroll: { paddingHorizontal: rw(6.2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  card: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), padding: rw(4.1), gap: rh(1.4) },
  groupLabel: { ...typography['label-md'], color: `${colors.on_surface}B3`, marginBottom: rh(0.5) },
  rowGroup: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), overflow: 'hidden' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: rh(6.2), paddingHorizontal: rw(4.1) },
  navRow: { flexDirection: 'row', alignItems: 'center', height: rh(6.2), paddingHorizontal: rw(4.1), gap: rw(3.1) },
  divider: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  rowIcon: { fontSize: rf(1.9), width: rw(6.2), textAlign: 'center' },
  rowLabel: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  rowLabelDanger: { color: colors.primary_container },
  rowArrow: { ...typography['title-lg'], color: `${colors.on_surface}66` },
});
