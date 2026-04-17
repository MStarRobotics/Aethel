import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Modal, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const MAX = 10;

const CATEGORIES: { label: string; items: { emoji: string; name: string }[] }[] = [
  { label: 'HOBBIES', items: [
    { emoji: '\u{1F3AE}', name: 'Gaming' }, { emoji: '\u{1F3B5}', name: 'Music' },
    { emoji: '\u{1F4DA}', name: 'Books' }, { emoji: '\u{1F3A8}', name: 'Art' },
    { emoji: '\u{1F4F7}', name: 'Photography' }, { emoji: '\u270D\uFE0F', name: 'Writing' },
  ]},
  { label: 'ENTERTAINMENT', items: [
    { emoji: '\u{1F3AC}', name: 'Movies' }, { emoji: '\u{1F4FA}', name: 'TV Shows' },
    { emoji: '\u{1F3CC}\uFE0F', name: 'Anime' }, { emoji: '\u{1F399}\uFE0F', name: 'Podcasts' },
  ]},
  { label: 'SPORTS & FITNESS', items: [
    { emoji: '\u{1F3CB}\uFE0F', name: 'Gym' }, { emoji: '\u{1F3C3}', name: 'Running' },
    { emoji: '\u26BD', name: 'Football' }, { emoji: '\u{1F3CA}', name: 'Swimming' },
    { emoji: '\u{1F9D8}', name: 'Yoga' }, { emoji: '\u{1F6B4}', name: 'Cycling' },
  ]},
  { label: 'LIFESTYLE', items: [
    { emoji: '\u2708\uFE0F', name: 'Travel' }, { emoji: '\u{1F355}', name: 'Food' },
    { emoji: '\u{1F377}', name: 'Wine' }, { emoji: '\u{1F375}', name: 'Tea' },
    { emoji: '\u{1F33F}', name: 'Nature' }, { emoji: '\u{1F436}', name: 'Pets' },
  ]},
  { label: 'TECHNOLOGY', items: [
    { emoji: '\u{1F4BB}', name: 'Coding' }, { emoji: '\u{1F916}', name: 'AI' },
    { emoji: '\u{1F3AE}', name: 'Esports' }, { emoji: '\u{1F4F1}', name: 'Gadgets' },
  ]},
];

interface Props {
  visible: boolean;
  initialSelected?: string[];
  onClose: () => void;
  onDone: (selected: string[]) => void;
}

export default function InterestPickerModal({ visible, initialSelected = [], onClose, onDone }: Props) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [search, setSearch] = useState('');

  const toggle = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(name)) { next.delete(name); }
      else if (next.size < MAX) { next.add(name); }
      return next;
    });
  };

  const filteredCategories = CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())),
  })).filter(cat => cat.items.length > 0);

  const selectedArr = Array.from(selected);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.surface} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.cancelText}>\u2715 Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Interests</Text>
          <TouchableOpacity onPress={() => onDone(selectedArr)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.doneText, selected.size === 0 && styles.doneTextDisabled]}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>\u{1F50D}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search interests..."
            placeholderTextColor={`${colors.on_surface}66`}
            value={search}
            onChangeText={setSearch}
            selectionColor={colors.secondary}
          />
        </View>

        {/* Selected count */}
        {selected.size > 0 && (
          <View style={styles.selectedRow}>
            <Text style={styles.selectedLabel}>
              SELECTED: {selectedArr.slice(0, 5).map(n => {
                const found = CATEGORIES.flatMap(c => c.items).find(i => i.name === n);
                return found?.emoji ?? '';
              }).join(' ')}  ({selected.size}/{MAX})
            </Text>
          </View>
        )}

        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
          {filteredCategories.map(cat => (
            <View key={cat.label}>
              <Text style={styles.sectionLabel}>{cat.label}</Text>
              <View style={styles.chipsGrid}>
                {cat.items.map(item => {
                  const isSelected = selected.has(item.name);
                  const isDisabled = !isSelected && selected.size >= MAX;
                  return (
                    <TouchableOpacity
                      key={item.name}
                      style={[styles.chip, isSelected && styles.chipSelected, isDisabled && styles.chipDisabled]}
                      onPress={() => toggle(item.name)}
                      activeOpacity={isDisabled ? 1 : 0.75}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected, isDisabled && styles.chipTextDisabled]}>
                        {item.emoji} {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  cancelText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  doneText: { ...typography['label-lg'], color: colors.secondary_container },
  doneTextDisabled: { opacity: 0.4 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', marginHorizontal: rw(6.2), backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(6.2), marginBottom: rh(1.4), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26` },
  searchIcon: { fontSize: rf(1.9), marginRight: rw(2.6), opacity: 0.5 },
  searchInput: { flex: 1, ...typography['body-md'], color: colors.on_surface },
  selectedRow: { paddingHorizontal: rw(6.2), marginBottom: rh(1.4) },
  selectedLabel: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  scroll: { paddingHorizontal: rw(6.2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2), marginTop: rh(2.4) },
  chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  chip: { height: rh(4.8), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipSelected: { backgroundColor: colors.primary_container },
  chipDisabled: { backgroundColor: colors.surface_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextSelected: { color: colors.on_surface },
  chipTextDisabled: { color: `${colors.on_surface}4D` },
});
