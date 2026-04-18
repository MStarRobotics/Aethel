import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Image, Platform, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type DateState = 'propose' | 'incoming' | 'confirmed';

const VIBES = [
  { emoji: '\u2615', label: 'Coffee' }, { emoji: '\u{1F37D}\uFE0F', label: 'Dinner' },
  { emoji: '\u{1F3AC}', label: 'Movie' }, { emoji: '\u{1F6B6}', label: 'Walk' },
  { emoji: '\u{1F3AE}', label: 'Games' }, { emoji: '\u{1F379}', label: 'Drinks' },
];

interface Props {
  onBack: () => void;
  onMessage: () => void;
  initialState?: DateState;
}

export default function DatePlannerScreen({ onBack, onMessage, initialState = 'propose' }: Props) {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<DateState>(initialState);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === 'confirmed') {
      Animated.timing(confettiAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }
  }, [state]);

  const PHOTO_SIZE = rw(12.3);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan a Date</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {state === 'propose' && (
          <>
            {/* Match card */}
            <View style={styles.matchCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }} style={[styles.matchPhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
              <View>
                <Text style={styles.matchName}>Sarah, 26</Text>
                <Text style={styles.matchCompat}>92% Compatible</Text>
              </View>
            </View>

            {/* Vibe chips */}
            <Text style={styles.sectionLabel}>SUGGEST A VIBE</Text>
            <View style={styles.vibeGrid}>
              {VIBES.map(v => (
                <TouchableOpacity key={v.label} style={[styles.vibeChip, selectedVibe === v.label && styles.vibeChipSelected]} onPress={() => setSelectedVibe(v.label)} activeOpacity={0.75}>
                  <Text style={[styles.vibeChipText, selectedVibe === v.label && styles.vibeChipTextSelected]}>{v.emoji} {v.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Date/time */}
            <Text style={[styles.sectionLabel, { marginTop: rh(2.4) }]}>PICK A TIME</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownIcon}>\u{1F4C5}</Text>
              <Text style={styles.dropdownLabel}>Date</Text>
              <Text style={styles.dropdownValue}>Sat, May 10 \u25BE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dropdown, { marginTop: rh(0.5) }]}>
              <Text style={styles.dropdownIcon}>\u{1F550}</Text>
              <Text style={styles.dropdownLabel}>Time</Text>
              <Text style={styles.dropdownValue}>7:00 PM \u25BE</Text>
            </TouchableOpacity>

            {/* Note */}
            <Text style={[styles.sectionLabel, { marginTop: rh(2.4) }]}>ADD A NOTE (optional)</Text>
            <TextInput style={styles.noteInput} placeholder="How about that new coffee place on 5th?" placeholderTextColor={`${colors.on_surface}66`} value={note} onChangeText={setNote} multiline selectionColor={colors.secondary} />

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setState('incoming')} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>\u{1F4C5}  Send Date Proposal</Text>
            </TouchableOpacity>
          </>
        )}

        {state === 'incoming' && (
          <View style={styles.proposalCard}>
            <Text style={styles.proposalTag}>\u{1F4C5} DATE PROPOSAL</Text>
            <Text style={styles.proposalTitle}>Sarah wants to meet!</Text>
            <Text style={styles.proposalVibe}>\u2615 Coffee</Text>
            <Text style={styles.proposalDate}>Saturday, May 10 · 7:00 PM</Text>
            <Text style={styles.proposalNote}>"How about that new coffee place on 5th?"</Text>
            <View style={styles.proposalActions}>
              <TouchableOpacity style={styles.acceptBtn} onPress={() => setState('confirmed')} activeOpacity={0.85}>
                <Text style={styles.acceptBtnText}>\u2713 Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.passBtn} onPress={onBack} activeOpacity={0.8}>
                <Text style={styles.passBtnText}>\u2715 Pass</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setState('propose')}>
              <Text style={styles.suggestLink}>Suggest Different Time</Text>
            </TouchableOpacity>
          </View>
        )}

        {state === 'confirmed' && (
          <>
            <Animated.Text style={[styles.confetti, { opacity: confettiAnim }]}>\u{1F389} \u2728 \u{1F38A}</Animated.Text>
            <Text style={styles.confirmedTag}>DATE CONFIRMED!</Text>
            <Text style={styles.confirmedTitle}>It's happening! \u{1F389}</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>\u2615 Coffee with Sarah</Text>
              <Text style={styles.summaryDate}>Saturday, May 10 · 7 PM</Text>
              <TouchableOpacity><Text style={styles.addLocation}>\u{1F4CD} Add a location</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>\u{1F4C5}  Add to Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={onMessage} activeOpacity={0.8}>
              <Text style={styles.ghostBtnText}>\u{1F4AC}  Message Sarah</Text>
            </TouchableOpacity>
            <Text style={styles.safetyTip}>Always meet in a public place first. \u{1F6E1}\uFE0F</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  scroll: { paddingHorizontal: rw(6.2) },
  matchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(2.4) },
  matchPhoto: { borderWidth: 2, borderColor: colors.primary_container, backgroundColor: colors.surface_container_high },
  matchName: { ...typography['title-md'], color: colors.on_surface },
  matchCompat: { ...typography['label-sm'], color: colors.emerald },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  vibeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  vibeChip: { height: rh(5.2), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  vibeChipSelected: { backgroundColor: colors.primary_container },
  vibeChipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  vibeChipTextSelected: { color: colors.on_surface },
  dropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(6.6), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26`, gap: rw(2.6) },
  dropdownIcon: { fontSize: rf(1.9) },
  dropdownLabel: { ...typography['label-md'], color: colors.tertiary, flex: 1 },
  dropdownValue: { ...typography['body-md'], color: colors.on_surface },
  noteInput: { backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26`, padding: rw(4.1), ...typography['body-md'], color: colors.on_surface, minHeight: rh(9.5), textAlignVertical: 'top', marginBottom: rh(2.4) },
  primaryBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  primaryBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  ghostBtn: { height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  ghostBtnText: { ...typography['label-lg'], color: colors.primary },
  proposalCard: { backgroundColor: colors.primary_container, borderRadius: rw(5.1), padding: rw(5.1), gap: rh(1.2) },
  proposalTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  proposalTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface },
  proposalVibe: { ...typography['label-md'], color: colors.on_surface },
  proposalDate: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  proposalNote: { ...typography['body-md'], color: `${colors.on_surface}99`, fontStyle: 'italic' },
  proposalActions: { flexDirection: 'row', gap: rw(3.1) },
  acceptBtn: { flex: 1, height: rh(5.2), backgroundColor: colors.emerald, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  acceptBtnText: { ...typography['label-lg'], color: '#FFFFFF' },
  passBtn: { flex: 1, height: rh(5.2), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  passBtnText: { ...typography['label-lg'], color: colors.primary },
  suggestLink: { ...typography['label-md'], color: colors.tertiary, textAlign: 'center' },
  confetti: { fontSize: rf(3.3), textAlign: 'center', marginBottom: rh(1.4) },
  confirmedTag: { ...typography['label-sm'], color: colors.emerald, textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center', marginBottom: rh(0.7) },
  confirmedTitle: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center', marginBottom: rh(2.4) },
  summaryCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), gap: rh(0.7), marginBottom: rh(2.4) },
  summaryTitle: { ...typography['title-md'], color: colors.on_surface },
  summaryDate: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  addLocation: { ...typography['label-md'], color: colors.tertiary },
  safetyTip: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'center', marginTop: rh(1.4) },
});
