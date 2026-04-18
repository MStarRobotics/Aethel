import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, Pressable, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Gender = 'men' | 'women' | 'nonbinary' | 'everyone';
type Intent = 'casual' | 'serious' | 'friendship' | 'anything';

const GENDERS: { id: Gender; label: string }[] = [
  { id: 'men', label: 'Men' }, { id: 'women', label: 'Women' },
  { id: 'nonbinary', label: 'Non-Binary' }, { id: 'everyone', label: 'Everyone' },
];

const INTENTS: { id: Intent; label: string }[] = [
  { id: 'casual', label: 'Casual' }, { id: 'serious', label: 'Serious' },
  { id: 'friendship', label: 'Friendship' }, { id: 'anything', label: 'Anything' },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
}

export default function DiscoverySettingsModal({ visible, onClose, onApply }: Props) {
  const insets = useSafeAreaInsets();
  const [gender, setGender] = useState<Gender>('everyone');
  const [intent, setIntent] = useState<Intent>('anything');
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(35);
  const [distance, setDistance] = useState(50);
  const [worldwide, setWorldwide] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [withPhotos, setWithPhotos] = useState(false);
  const [activeRecently, setActiveRecently] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + rh(2) }]} onPress={() => {}}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Discovery Settings</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeBtn}>\u2715</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Show me */}
            <Text style={styles.sectionLabel}>SHOW ME</Text>
            <View style={styles.chipGrid}>
              {GENDERS.map(g => (
                <TouchableOpacity key={g.id} style={[styles.chip, gender === g.id && styles.chipSelected]} onPress={() => setGender(g.id)} activeOpacity={0.75}>
                  <Text style={[styles.chipText, gender === g.id && styles.chipTextSelected]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Age range */}
            <Text style={[styles.sectionLabel, { marginTop: rh(2.4) }]}>AGE RANGE</Text>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { left: `${((ageMin - 18) / 62) * 100}%`, right: `${((65 - ageMax) / 62) * 100}%` }]} />
            </View>
            <Text style={styles.rangeLabel}>Showing ages {ageMin} – {ageMax}</Text>

            {/* Distance */}
            <Text style={[styles.sectionLabel, { marginTop: rh(2.4) }]}>MAXIMUM DISTANCE</Text>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { left: 0, right: `${((200 - distance) / 200) * 100}%` }]} />
            </View>
            <Text style={styles.rangeLabel}>Within {distance} km</Text>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setWorldwide(v => !v)} activeOpacity={0.7}>
              <View style={[styles.checkbox, worldwide && styles.checkboxChecked]}>
                {worldwide && <Text style={styles.checkmark}>\u2713</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Show worldwide</Text>
            </TouchableOpacity>

            {/* Looking for */}
            <Text style={[styles.sectionLabel, { marginTop: rh(2.4) }]}>LOOKING FOR</Text>
            <View style={styles.chipGrid}>
              {INTENTS.map(i => (
                <TouchableOpacity key={i.id} style={[styles.chip, intent === i.id && styles.chipSelected]} onPress={() => setIntent(i.id)} activeOpacity={0.75}>
                  <Text style={[styles.chipText, intent === i.id && styles.chipTextSelected]}>{i.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Only show */}
            <Text style={[styles.sectionLabel, { marginTop: rh(2.4) }]}>ONLY SHOW</Text>
            {[
              { label: 'Verified profiles only', value: verifiedOnly, set: setVerifiedOnly },
              { label: 'With photos only', value: withPhotos, set: setWithPhotos },
              { label: 'Active in last 7 days', value: activeRecently, set: setActiveRecently },
            ].map(item => (
              <TouchableOpacity key={item.label} style={styles.checkboxRow} onPress={() => item.set(v => !v)} activeOpacity={0.7}>
                <View style={[styles.checkbox, item.value && styles.checkboxChecked]}>
                  {item.value && <Text style={styles.checkmark}>\u2713</Text>}
                </View>
                <Text style={styles.checkboxLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.applyBtn} onPress={() => { onApply(); onClose(); }} activeOpacity={0.85}>
              <Text style={styles.applyBtnText}>\u2713  Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetLink}>
              <Text style={styles.resetLinkText}>Reset to Defaults</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: `${colors.surface_variant}F2`, borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), maxHeight: rh(85) },
  handle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.4) },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), marginBottom: rh(1.4) },
  title: { ...typography['title-md'], color: colors.on_surface },
  closeBtn: { ...typography['title-md'], color: colors.tertiary, paddingLeft: rw(4.1) },
  content: { paddingHorizontal: rw(6.2), paddingBottom: rh(2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  chip: { height: rh(5.2), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipSelected: { backgroundColor: colors.primary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextSelected: { color: colors.on_surface },
  sliderTrack: { height: 4, backgroundColor: colors.surface_container, borderRadius: 9999, position: 'relative', overflow: 'hidden', marginBottom: rh(0.7) },
  sliderFill: { position: 'absolute', top: 0, bottom: 0, backgroundColor: colors.secondary_container },
  rangeLabel: { ...typography['label-sm'], color: colors.emerald, marginBottom: rh(0.5) },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1), paddingVertical: rh(0.9) },
  checkbox: { width: rw(5.1), height: rw(5.1), borderRadius: rw(1.3), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.secondary_container, borderColor: colors.secondary_container },
  checkmark: { fontSize: rf(1.6), color: colors.on_secondary, fontWeight: '700' },
  checkboxLabel: { ...typography['body-md'], color: colors.on_surface },
  applyBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: rh(2.4), marginBottom: rh(1.4), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  applyBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  resetLink: { alignItems: 'center', paddingVertical: rh(0.9) },
  resetLinkText: { ...typography['label-md'], color: colors.tertiary },
});
