import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, StatusBar,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type ThemeOption = 'light' | 'dark' | 'system';

const THEMES: { id: ThemeOption; icon: string; label: string }[] = [
  { id: 'light',  icon: '\u2600\uFE0F', label: 'Light' },
  { id: 'dark',   icon: '\u{1F319}',    label: 'Dark' },
  { id: 'system', icon: '\u{1F4F1}',    label: 'System Default' },
];

const ACCENT_COLORS = [
  { id: 'purple', hex: '#1A0B2E', label: 'Purple' },
  { id: 'red',    hex: '#B21F3C', label: 'Red' },
  { id: 'orange', hex: '#FD8B00', label: 'Orange' },
  { id: 'yellow', hex: '#F5C518', label: 'Yellow' },
  { id: 'green',  hex: '#2E8B57', label: 'Green' },
  { id: 'blue',   hex: '#1E6FD9', label: 'Blue' },
  { id: 'pink',   hex: '#F8C8DC', label: 'Pink' },
  { id: 'black',  hex: '#0A0A0A', label: 'Black' },
];

interface Props { onBack: () => void; }

export default function AppearanceSettingsScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [theme, setTheme] = useState<ThemeOption>('dark');
  const [accent, setAccent] = useState('orange');
  const [textSize, setTextSize] = useState(0.5); // 0–1

  const SWATCH_SIZE = rw(10.3); // ~40px

  const previewFontSize = rf(1.6 + textSize * 0.8); // scales from ~1.6 to ~2.4

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Theme */}
        <Text style={styles.sectionLabel}>THEME</Text>
        <View style={styles.themeGrid}>
          {THEMES.slice(0, 2).map(t => (
            <TouchableOpacity
              key={t.id}
              style={[styles.themeCard, { flex: 1 }, theme === t.id && styles.themeCardSelected]}
              onPress={() => setTheme(t.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.themeIcon}>{t.icon}</Text>
              <Text style={styles.themeLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.themeCardFull, theme === 'system' && styles.themeCardSelected]}
          onPress={() => setTheme('system')}
          activeOpacity={0.8}
        >
          <Text style={styles.themeIcon}>{THEMES[2].icon}</Text>
          <Text style={styles.themeLabel}>{THEMES[2].label}</Text>
        </TouchableOpacity>

        {/* Accent color */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>ACCENT COLOR</Text>
        <View style={styles.swatchGrid}>
          {ACCENT_COLORS.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[styles.swatch, { width: SWATCH_SIZE, height: SWATCH_SIZE, borderRadius: SWATCH_SIZE / 2, backgroundColor: c.hex }]}
              onPress={() => setAccent(c.id)}
              activeOpacity={0.8}
            >
              {accent === c.id && <Text style={styles.swatchCheck}>\u2713</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Text size */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>TEXT SIZE</Text>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabelSmall}>A</Text>
          <View style={styles.sliderWrapper}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={textSize}
              onValueChange={setTextSize}
              minimumTrackTintColor={colors.secondary_container}
              maximumTrackTintColor={colors.surface_container}
              thumbTintColor={colors.secondary_container}
            />
          </View>
          <Text style={styles.sliderLabelLarge}>A</Text>
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderSubLabel}>Small</Text>
          <Text style={styles.sliderSubLabel}>Large</Text>
        </View>

        {/* Preview */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>PREVIEW</Text>
        <View style={styles.previewCard}>
          <Text style={[styles.previewText, { fontSize: previewFontSize }]}>
            This is how text will look in the app.
          </Text>
          <Text style={[styles.previewSubText, { fontSize: previewFontSize * 0.85 }]}>
            Sarah, 26 \u2022 New York, NY \u2022 92% compatible
          </Text>
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
  themeGrid: { flexDirection: 'row', gap: rw(2.1), marginBottom: rh(1.2) },
  themeCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), height: rh(8.5), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rw(2.1) },
  themeCardFull: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), height: rh(6.6), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rw(2.1) },
  themeCardSelected: { backgroundColor: colors.surface_container_high, borderLeftWidth: 3, borderLeftColor: colors.secondary_container },
  themeIcon: { fontSize: rf(2.1) },
  themeLabel: { ...typography['label-lg'], color: colors.on_surface },
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.6) },
  swatch: { alignItems: 'center', justifyContent: 'center' },
  swatchCheck: { fontSize: rf(1.9), color: '#FFFFFF', fontWeight: '700' },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  sliderLabelSmall: { ...typography['label-sm'], color: `${colors.on_surface}80`, fontSize: rf(1.3) },
  sliderLabelLarge: { ...typography['label-sm'], color: `${colors.on_surface}80`, fontSize: rf(2.1) },
  sliderWrapper: { flex: 1 },
  slider: { width: '100%', height: rh(4.3) },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -rh(0.5) },
  sliderSubLabel: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  previewCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(0.7) },
  previewText: { color: colors.on_surface, fontFamily: 'PlusJakartaSans' },
  previewSubText: { color: `${colors.on_surface}99`, fontFamily: 'PlusJakartaSans' },
});
