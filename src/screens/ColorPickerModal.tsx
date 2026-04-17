import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Modal, Pressable, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const PRESETS = [
  { id: 'purple', hex: '#1A0B2E' }, { id: 'red',    hex: '#B21F3C' },
  { id: 'orange', hex: '#FD8B00' }, { id: 'yellow', hex: '#F5C518' },
  { id: 'green',  hex: '#2E8B57' }, { id: 'blue',   hex: '#1E6FD9' },
  { id: 'pink',   hex: '#F8C8DC' }, { id: 'black',  hex: '#0A0A0A' },
];

// Simple luminance check for text contrast
function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

interface Props {
  visible: boolean;
  initialColor?: string;
  onClose: () => void;
  onApply: (hex: string) => void;
}

export default function ColorPickerModal({ visible, initialColor = '#FD8B00', onClose, onApply }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedHex, setSelectedHex] = useState(initialColor);
  const [hexInput, setHexInput] = useState(initialColor);

  const handlePreset = (hex: string) => {
    setSelectedHex(hex);
    setHexInput(hex);
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) setSelectedHex(val);
  };

  const SWATCH_SIZE = rw(10.3);
  const previewTextColor = isLight(selectedHex) ? '#000000' : '#FFFFFF';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + rh(2) }]} onPress={() => {}}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Choose Color</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeBtn}>\u2715</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Color wheel placeholder */}
            <View style={styles.wheelCard}>
              <View style={styles.wheelPlaceholder}>
                <View style={[styles.wheelInner, { backgroundColor: selectedHex }]} />
                <Text style={styles.wheelLabel}>Color Wheel</Text>
              </View>
            </View>

            {/* Presets */}
            <Text style={styles.sectionLabel}>PRESETS</Text>
            <View style={styles.swatchGrid}>
              {PRESETS.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.swatch, { width: SWATCH_SIZE, height: SWATCH_SIZE, borderRadius: SWATCH_SIZE / 2, backgroundColor: p.hex }]}
                  onPress={() => handlePreset(p.hex)}
                  activeOpacity={0.8}
                >
                  {selectedHex === p.hex && (
                    <Text style={[styles.swatchCheck, { color: isLight(p.hex) ? '#000' : '#FFF' }]}>\u2713</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Hex input */}
            <Text style={[styles.sectionLabel, { marginTop: rh(2.4) }]}>HEX</Text>
            <View style={styles.hexWrapper}>
              <View style={[styles.hexPreview, { backgroundColor: selectedHex }]} />
              <TextInput
                style={styles.hexInput}
                value={hexInput}
                onChangeText={handleHexChange}
                placeholder="#000000"
                placeholderTextColor={`${colors.on_surface}66`}
                autoCapitalize="characters"
                maxLength={7}
                selectionColor={colors.secondary}
              />
            </View>

            {/* Preview */}
            <Text style={[styles.sectionLabel, { marginTop: rh(2.4) }]}>PREVIEW</Text>
            <View style={[styles.previewBtn, { backgroundColor: selectedHex }]}>
              <Text style={[styles.previewBtnText, { color: previewTextColor }]}>Button Text</Text>
            </View>

            {/* Apply */}
            <TouchableOpacity style={styles.applyBtn} onPress={() => { onApply(selectedHex); onClose(); }} activeOpacity={0.85}>
              <Text style={styles.applyBtnText}>Apply Color</Text>
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
  wheelCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), alignItems: 'center', marginBottom: rh(2.4) },
  wheelPlaceholder: { width: rw(51.3), height: rw(51.3), borderRadius: rw(25.6), alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  wheelInner: { position: 'absolute', width: '100%', height: '100%', opacity: 0.8 },
  wheelLabel: { ...typography['label-sm'], color: `${colors.on_surface}80` },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.2) },
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.6) },
  swatch: { alignItems: 'center', justifyContent: 'center' },
  swatchCheck: { fontSize: rf(1.9), fontWeight: '700' },
  hexWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(6.2), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26`, gap: rw(3.1) },
  hexPreview: { width: rw(6.2), height: rw(6.2), borderRadius: rw(3.1) },
  hexInput: { flex: 1, ...typography['body-md'], color: colors.on_surface, fontFamily: 'PlusJakartaSans' },
  previewBtn: { height: rh(6.2), borderRadius: rw(1.5), alignItems: 'center', justifyContent: 'center', marginBottom: rh(2.4) },
  previewBtnText: { ...typography['title-md'], letterSpacing: 1 },
  applyBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  applyBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
});
