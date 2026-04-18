import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type PauseState = 'setup' | 'paused';
type Duration = '1w' | '2w' | '1m' | 'indefinite';

const DURATIONS: { id: Duration; label: string }[] = [
  { id: '1w', label: '1 Week' }, { id: '2w', label: '2 Weeks' },
  { id: '1m', label: '1 Month' }, { id: 'indefinite', label: 'Indefinite' },
];

const REASONS = ['Taking a mental break', 'Seeing someone', 'Too busy right now', 'Travelling', 'Other'];

const PRESERVED = ['All your matches', 'All conversations', 'Your profile & photos', 'Your Q&A answers', 'Your Gold subscription'];
const WHILE_PAUSED = ['Message your matches', 'View your profile', 'Answer Q&A questions', 'Update your photos'];

interface Props {
  onBack: () => void;
  onDeleteAccount: () => void;
}

export default function PauseAccountScreen({ onBack, onDeleteAccount }: Props) {
  const insets = useSafeAreaInsets();
  const [pauseState, setPauseState] = useState<PauseState>('setup');
  const [duration, setDuration] = useState<Duration | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const ICON_SIZE = rw(20.5);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pauseState === 'paused' ? 'Account Paused' : 'Pause Account'}</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {pauseState === 'setup' ? (
          <>
            <View style={styles.iconWrapper}>
              <View style={[styles.iconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
                <Text style={styles.iconEmoji}>\u23F8\uFE0F</Text>
              </View>
            </View>
            <Text style={styles.tag}>TAKE A BREAK</Text>
            <Text style={styles.headline}>Pause Without Losing{'\n'}Anything</Text>

            <View style={styles.preservedCard}>
              <Text style={styles.preservedTitle}>While paused, you keep:</Text>
              {PRESERVED.map(item => (
                <View key={item} style={styles.checkRow}>
                  <Text style={styles.checkIcon}>\u2705</Text>
                  <Text style={styles.checkText}>{item}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>HOW LONG?</Text>
            <View style={styles.durationGrid}>
              {DURATIONS.map(d => (
                <TouchableOpacity key={d.id} style={[styles.durationChip, duration === d.id && styles.durationChipSelected]} onPress={() => setDuration(d.id)} activeOpacity={0.75}>
                  <Text style={[styles.durationChipText, duration === d.id && styles.durationChipTextSelected]}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { marginTop: rh(2.4) }]}>REASON (optional)</Text>
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

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setPauseState('paused')} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>\u23F8\uFE0F  Pause My Account</Text>
            </TouchableOpacity>

            <View style={styles.deleteRow}>
              <Text style={styles.deleteLabel}>Want to leave permanently? </Text>
              <TouchableOpacity onPress={onDeleteAccount}>
                <Text style={styles.deleteLink}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.pausedCard}>
              <Text style={styles.pausedTag}>\u23F8\uFE0F ACCOUNT PAUSED</Text>
              <Text style={styles.pausedBody}>You're hidden from discovery</Text>
              <Text style={styles.pausedDate}>Paused on: May 7, 2026</Text>
              <Text style={styles.pausedResume}>Resumes: May 14, 2026</Text>
            </View>

            <Text style={styles.sectionLabel}>WHILE PAUSED YOU CAN STILL:</Text>
            {WHILE_PAUSED.map(item => (
              <View key={item} style={styles.checkRow}>
                <Text style={styles.checkIcon}>\u2705</Text>
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}

            <TouchableOpacity style={[styles.primaryBtn, { marginTop: rh(2.4) }]} onPress={() => setPauseState('setup')} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>\u25B6\uFE0F  Resume My Account</Text>
            </TouchableOpacity>

            <View style={styles.pausedLinks}>
              <TouchableOpacity onPress={() => setPauseState('setup')}>
                <Text style={styles.extendLink}>Extend Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDeleteAccount}>
                <Text style={styles.deleteLink}>Delete Account</Text>
              </TouchableOpacity>
            </View>
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
  iconWrapper: { alignItems: 'center', marginTop: rh(2.4), marginBottom: rh(2.4) },
  iconCircle: { backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.tertiary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 30 }, android: { elevation: 4 } }) },
  iconEmoji: { fontSize: rf(4.7) },
  tag: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.7) },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center', marginBottom: rh(2.4) },
  preservedCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(0.9), marginBottom: rh(2.4) },
  preservedTitle: { ...typography['label-md'], color: colors.on_surface, marginBottom: rh(0.5) },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: rw(2.6) },
  checkIcon: { fontSize: rf(1.6) },
  checkText: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2), alignSelf: 'flex-start' },
  durationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1), width: '100%', marginBottom: rh(0.5) },
  durationChip: { height: rh(5.2), paddingHorizontal: rw(5.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  durationChipSelected: { backgroundColor: colors.primary_container },
  durationChipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  durationChipTextSelected: { color: colors.on_surface },
  reasonList: { width: '100%', gap: rh(1.4), marginBottom: rh(2.4) },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  radioCircle: { width: rw(5.1), height: rw(5.1), borderRadius: rw(2.6), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: colors.secondary_container, backgroundColor: colors.secondary_container },
  radioDot: { width: rw(2.1), height: rw(2.1), borderRadius: rw(1.1), backgroundColor: '#FFFFFF' },
  radioLabel: { ...typography['body-md'], color: colors.on_surface },
  primaryBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.9), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  primaryBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  deleteRow: { flexDirection: 'row', alignItems: 'center' },
  deleteLabel: { ...typography['body-md'], color: `${colors.on_surface}80` },
  deleteLink: { ...typography['label-md'], color: colors.primary_container },
  pausedCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), gap: rh(0.7), marginBottom: rh(2.4) },
  pausedTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  pausedBody: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  pausedDate: { ...typography['label-sm'], color: `${colors.on_surface}80` },
  pausedResume: { ...typography['label-sm'], color: colors.emerald },
  pausedLinks: { flexDirection: 'row', gap: rw(6.2), marginTop: rh(1.4) },
  extendLink: { ...typography['label-md'], color: colors.tertiary },
});
