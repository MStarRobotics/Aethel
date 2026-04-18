import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Modal, Pressable, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const LANGUAGES = [
  { flag: '\u{1F1FA}\u{1F1F8}', name: 'English (US)',  native: '' },
  { flag: '\u{1F1EC}\u{1F1E7}', name: 'English (UK)',  native: '' },
  { flag: '\u{1F1EE}\u{1F1F3}', name: 'Hindi',         native: '\u0939\u093F\u0928\u094D\u0926\u0940' },
  { flag: '\u{1F1EA}\u{1F1F8}', name: 'Spanish',       native: 'Espa\u00F1ol' },
  { flag: '\u{1F1EB}\u{1F1F7}', name: 'French',        native: 'Fran\u00E7ais' },
  { flag: '\u{1F1E9}\u{1F1EA}', name: 'German',        native: 'Deutsch' },
  { flag: '\u{1F1EF}\u{1F1F5}', name: 'Japanese',      native: '\u65E5\u672C\u8A9E' },
  { flag: '\u{1F1F0}\u{1F1F7}', name: 'Korean',        native: '\uD55C\uAD6D\uC5B4' },
  { flag: '\u{1F1E6}\u{1F1EA}', name: 'Arabic',        native: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629' },
];

interface Props { onBack: () => void; }

export default function LanguageRegionScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [language, setLanguage] = useState('English (US)');
  const [distance, setDistance] = useState<'km' | 'mi'>('km');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  const filteredLangs = LANGUAGES.filter(l => l.name.toLowerCase().includes(langSearch.toLowerCase()) || l.native.includes(langSearch));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language & Region</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>LANGUAGE</Text>
        <TouchableOpacity style={styles.navRow} onPress={() => setShowLangPicker(true)} activeOpacity={0.7}>
          <Text style={styles.rowIcon}>\u{1F310}</Text>
          <Text style={styles.rowLabel}>App Language</Text>
          <Text style={styles.rowValue}>{language}</Text>
          <Text style={styles.rowArrow}>\u203A</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>UNITS & FORMAT</Text>
        <View style={styles.card}>
          <Text style={styles.groupLabel}>Distance Units</Text>
          {[{ id: 'km', label: 'Kilometres (km)' }, { id: 'mi', label: 'Miles (mi)' }].map(opt => (
            <TouchableOpacity key={opt.id} style={styles.radioRow} onPress={() => setDistance(opt.id as 'km' | 'mi')} activeOpacity={0.7}>
              <View style={[styles.radioCircle, distance === opt.id && styles.radioCircleSelected]}>
                {distance === opt.id && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, { marginTop: rh(1.4) }]}>
          <Text style={styles.groupLabel}>Date Format</Text>
          {['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map(fmt => (
            <TouchableOpacity key={fmt} style={styles.radioRow} onPress={() => setDateFormat(fmt)} activeOpacity={0.7}>
              <View style={[styles.radioCircle, dateFormat === fmt && styles.radioCircleSelected]}>
                {dateFormat === fmt && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>{fmt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, { marginTop: rh(1.4) }]}>
          <Text style={styles.groupLabel}>Time Format</Text>
          {[{ id: '12h', label: '12-hour (AM/PM)' }, { id: '24h', label: '24-hour' }].map(opt => (
            <TouchableOpacity key={opt.id} style={styles.radioRow} onPress={() => setTimeFormat(opt.id)} activeOpacity={0.7}>
              <View style={[styles.radioCircle, timeFormat === opt.id && styles.radioCircleSelected]}>
                {timeFormat === opt.id && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>TIMEZONE</Text>
        <TouchableOpacity style={styles.navRow} activeOpacity={0.7}>
          <Text style={styles.rowIcon}>\u{1F550}</Text>
          <Text style={styles.rowLabel}>Timezone</Text>
          <Text style={styles.rowValue}>Auto (device)</Text>
          <Text style={styles.rowArrow}>\u203A</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>\u2713  Save Changes</Text>
        </TouchableOpacity>
        <Text style={styles.note}>Changes take effect immediately after saving.</Text>
      </ScrollView>

      {/* Language picker */}
      <Modal visible={showLangPicker} transparent animationType="slide" onRequestClose={() => setShowLangPicker(false)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setShowLangPicker(false)}>
          <Pressable style={[styles.langSheet, { paddingBottom: insets.bottom + rh(2) }]} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLangPicker(false)}><Text style={styles.sheetClose}>\u2715</Text></TouchableOpacity>
            </View>
            <View style={styles.searchWrapper}>
              <Text style={styles.searchIcon}>\u{1F50D}</Text>
              <TextInput style={styles.searchInput} placeholder="Search language..." placeholderTextColor={`${colors.on_surface}66`} value={langSearch} onChangeText={setLangSearch} selectionColor={colors.secondary} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.langList}>
              {filteredLangs.map(lang => (
                <TouchableOpacity key={lang.name} style={styles.langRow} onPress={() => { setLanguage(lang.name); setShowLangPicker(false); }} activeOpacity={0.7}>
                  <Text style={styles.langFlag}>{lang.flag}</Text>
                  <Text style={styles.langName}>{lang.name}</Text>
                  {lang.native ? <Text style={styles.langNative}>{lang.native}</Text> : null}
                  {language === lang.name && <Text style={styles.langCheck}>\u2713</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  navRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(3.1), height: rh(6.6), paddingHorizontal: rw(4.1), gap: rw(3.1) },
  rowIcon: { fontSize: rf(1.9), width: rw(6.2), textAlign: 'center' },
  rowLabel: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  rowValue: { ...typography['body-md'], color: `${colors.on_surface}99` },
  rowArrow: { ...typography['title-lg'], color: `${colors.on_surface}66` },
  card: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), padding: rw(4.1), gap: rh(1.4) },
  groupLabel: { ...typography['label-md'], color: `${colors.on_surface}B3`, marginBottom: rh(0.5) },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  radioCircle: { width: rw(5.1), height: rw(5.1), borderRadius: rw(2.6), borderWidth: 2, borderColor: `${colors.outline_variant}4D`, alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: colors.secondary_container, backgroundColor: colors.secondary_container },
  radioDot: { width: rw(2.1), height: rw(2.1), borderRadius: rw(1.1), backgroundColor: '#FFFFFF' },
  radioLabel: { ...typography['body-md'], color: colors.on_surface },
  saveBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: rh(3.6), marginBottom: rh(1.4), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  saveBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  note: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'center' },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  langSheet: { backgroundColor: `${colors.surface_variant}F2`, borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), maxHeight: rh(75) },
  sheetHandle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.4) },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), marginBottom: rh(1.4) },
  sheetTitle: { ...typography['title-md'], color: colors.on_surface },
  sheetClose: { ...typography['title-md'], color: colors.tertiary },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', marginHorizontal: rw(6.2), backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(5.7), marginBottom: rh(1.4), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26` },
  searchIcon: { fontSize: rf(1.9), marginRight: rw(2.6), opacity: 0.5 },
  searchInput: { flex: 1, ...typography['body-md'], color: colors.on_surface },
  langList: { paddingHorizontal: rw(6.2), gap: rh(0.5), paddingBottom: rh(2) },
  langRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(3.1), height: rh(6.2), paddingHorizontal: rw(4.1), gap: rw(3.1) },
  langFlag: { fontSize: rf(2.1) },
  langName: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  langNative: { ...typography['body-md'], color: `${colors.on_surface}99` },
  langCheck: { ...typography['label-lg'], color: colors.secondary_container },
});
