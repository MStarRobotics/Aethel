import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  Image, Platform, Animated, StatusBar, Modal, Pressable, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Design canvas: 390 x 844

const GENDER_OPTS = ['Man', 'Woman', 'Non-Binary', 'Other'] as const;
type Gender = (typeof GENDER_OPTS)[number];

const DETAIL_OPTS: Record<string, string[]> = {
  height:    ['4\'10"','5\'0"','5\'2"','5\'4"','5\'6"','5\'8"','5\'10"','6\'0"','6\'2"','6\'4"+'],
  education: ['High School','Some College','Bachelor\'s','Master\'s','PhD','Trade School'],
  drinking:  ['Never','Socially','Regularly'],
  smoking:   ['Never','Occasionally','Regularly'],
  kids:      ['Don\'t want','Want someday','Have & want more','Have & don\'t want more','Open to it'],
  religion:  ['Not religious','Christian','Muslim','Jewish','Hindu','Buddhist','Other'],
  politics:  ['Liberal','Moderate','Conservative','Apolitical'],
};

const INTERESTS_ALL = ['\u{1F3AE} Gaming','\u{1F3B5} Music','\u{1F4DA} Books','\u{1F355} Food','\u2708\uFE0F Travel','\u{1F3A8} Art','\u{1F3CB}\uFE0F Gym','\u{1F436} Pets','\u2615 Coffee','\u{1F377} Wine'];

interface Props {
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function EditProfileScreen({ onBack, onSave }: Props) {
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('Sarah');
  const [bio, setBio] = useState('Coffee addict, book lover, and midnight adventurer.');
  const [gender, setGender] = useState<Gender>('Woman');
  const [interests, setInterests] = useState<Set<string>>(new Set(['\u{1F3AE} Gaming','\u{1F3B5} Music','\u{1F4DA} Books']));
  const [details, setDetails] = useState<Record<string, string>>({ height: '5\'6"', education: 'Bachelor\'s', drinking: 'Socially', smoking: 'Never', kids: 'Want someday', religion: 'Not religious', politics: 'Moderate' });
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [location] = useState('New York, NY');
  const [saved, setSaved] = useState(false);
  const [unsavedModal, setUnsavedModal] = useState(false);
  const [pickerKey, setPickerKey] = useState<string | null>(null);

  // Focus animation for bio
  const bioFocused = useRef(new Animated.Value(0)).current;
  const bioBorder = bioFocused.interpolate({ inputRange: [0,1], outputRange: ['rgba(89,64,65,0.15)', colors.secondary] });

  const firstNameFocused = useRef(new Animated.Value(0)).current;
  const firstNameBorder = firstNameFocused.interpolate({ inputRange: [0,1], outputRange: ['rgba(89,64,65,0.15)', colors.secondary] });

  const toggleInterest = (i: string) => {
    setInterests(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleBack = () => {
    setUnsavedModal(true);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave({ firstName, bio, gender, interests: Array.from(interests), details, jobTitle });
  };

  const MAIN_SLOT = rw(30.8);  // 120px
  const SEC_SLOT  = rw(20.5);  // 80px

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.saveText, saved && styles.saveTextSaved]}>{saved ? 'Saved \u2713' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* PHOTOS */}
        <Text style={styles.sectionLabel}>PHOTOS</Text>
        <View style={styles.photoGrid}>
          {/* Main slot */}
          <View style={styles.photoSlotWrapper}>
            <View style={[styles.photoSlot, { width: MAIN_SLOT, height: MAIN_SLOT, borderRadius: rw(4.1) }]}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              <View style={styles.mainBadge}><Text style={styles.mainBadgeText}>MAIN</Text></View>
            </View>
            <View style={styles.deleteBtn}><Text style={styles.deleteBtnText}>\u00D7</Text></View>
          </View>
          {/* Secondary slots */}
          {[1,2,3,4].map(i => (
            <View key={i} style={styles.photoSlotWrapper}>
              <View style={[styles.photoSlot, styles.photoSlotEmpty, { width: SEC_SLOT, height: SEC_SLOT, borderRadius: rw(4.1) }]}>
                <Text style={styles.addPhotoIcon}>+</Text>
              </View>
            </View>
          ))}
        </View>

        {/* BASIC INFO */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.8) }]}>BASIC INFO</Text>

        <Text style={styles.fieldLabel}>First Name</Text>
        <Animated.View style={[styles.inputContainer, { borderBottomColor: firstNameBorder, borderBottomWidth: 1 }]}>
          <TextInput style={styles.inputText} value={firstName} onChangeText={setFirstName} autoCapitalize="words" onFocus={() => Animated.timing(firstNameFocused, { toValue: 1, duration: 180, useNativeDriver: false }).start()} onBlur={() => Animated.timing(firstNameFocused, { toValue: 0, duration: 180, useNativeDriver: false }).start()} />
        </Animated.View>

        <Text style={[styles.fieldLabel, { marginTop: rh(1.9) }]}>Gender</Text>
        <View style={styles.chipsRow}>
          {GENDER_OPTS.map(g => (
            <TouchableOpacity key={g} style={[styles.chip, gender === g && styles.chipSelected]} onPress={() => setGender(g)} activeOpacity={0.75}>
              <Text style={[styles.chipText, gender === g && styles.chipTextSelected]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ABOUT ME */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.8) }]}>ABOUT ME</Text>
        <Animated.View style={[styles.textareaContainer, { borderBottomColor: bioBorder, borderBottomWidth: 1 }]}>
          <TextInput style={styles.textarea} value={bio} onChangeText={v => setBio(v.slice(0, 500))} multiline textAlignVertical="top" maxLength={500} onFocus={() => Animated.timing(bioFocused, { toValue: 1, duration: 180, useNativeDriver: false }).start()} onBlur={() => Animated.timing(bioFocused, { toValue: 0, duration: 180, useNativeDriver: false }).start()} />
        </Animated.View>
        <Text style={styles.charCount}>{bio.length} / 500</Text>

        {/* PROMPTS */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.8) }]}>PROMPTS (1/3)</Text>
        <View style={styles.promptCard}>
          <Text style={styles.promptQ}>The most spontaneous thing I've done is...</Text>
          <Text style={styles.promptA}>Booked a one-way ticket to Bali \u{1F334}</Text>
          <TouchableOpacity style={styles.promptEditBtn}><Text style={styles.editLink}>\u270F\uFE0F Edit</Text></TouchableOpacity>
        </View>
        <View style={styles.promptEmpty}>
          <Text style={styles.promptEmptyText}>+ Add a prompt</Text>
        </View>
        <TouchableOpacity><Text style={styles.editLink}>Edit Prompts</Text></TouchableOpacity>

        {/* INTERESTS */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.8) }]}>INTERESTS</Text>
        <View style={styles.chipsRow}>
          {INTERESTS_ALL.map(i => {
            const isSel = interests.has(i);
            return (
              <TouchableOpacity key={i} style={[styles.chip, isSel && styles.chipSelected]} onPress={() => toggleInterest(i)} activeOpacity={0.75}>
                <Text style={[styles.chipText, isSel && styles.chipTextSelected]}>{i}{isSel ? ' \u00D7' : ''}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* DETAILS */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.8) }]}>DETAILS</Text>
        <Text style={styles.fieldLabel}>Job Title</Text>
        <Animated.View style={[styles.inputContainer, { borderBottomColor: 'rgba(89,64,65,0.15)', borderBottomWidth: 1 }]}>
          <TextInput style={styles.inputText} value={jobTitle} onChangeText={setJobTitle} autoCapitalize="words" />
        </Animated.View>
        {Object.entries(details).map(([key, val]) => (
          <View key={key} style={{ marginTop: rh(1.9) }}>
            <Text style={styles.fieldLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <TouchableOpacity style={styles.dropdownBtn} onPress={() => setPickerKey(key)} activeOpacity={0.8}>
              <Text style={styles.dropdownValue}>{val}</Text>
              <Text style={styles.dropdownChevron}>\u203A</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* LOCATION */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.8) }]}>LOCATION</Text>
        <Text style={styles.locationText}>\u{1F4CD} {location}</Text>
        <TouchableOpacity><Text style={styles.editLink}>Change Location</Text></TouchableOpacity>

        {/* Save button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Picker modal */}
      {pickerKey && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setPickerKey(null)}>
          <Pressable style={styles.pickerOverlay} onPress={() => setPickerKey(null)}>
            <View style={[styles.pickerSheet, { paddingBottom: insets.bottom + rh(2) }]}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>{pickerKey.charAt(0).toUpperCase() + pickerKey.slice(1)}</Text>
              <ScrollView style={styles.pickerList} showsVerticalScrollIndicator={false}>
                {(DETAIL_OPTS[pickerKey] ?? []).map(opt => (
                  <TouchableOpacity key={opt} style={[styles.pickerItem, details[pickerKey] === opt && styles.pickerItemActive]} onPress={() => { setDetails(d => ({ ...d, [pickerKey]: opt })); setPickerKey(null); }}>
                    <Text style={[styles.pickerItemText, details[pickerKey] === opt && styles.pickerItemTextActive]}>{opt}</Text>
                    {details[pickerKey] === opt && <Text style={styles.pickerCheck}>\u2713</Text>}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Unsaved changes modal */}
      <Modal visible={unsavedModal} transparent animationType="fade" onRequestClose={() => setUnsavedModal(false)}>
        <View style={styles.unsavedOverlay}>
          <View style={styles.unsavedCard}>
            <Text style={styles.unsavedTitle}>Unsaved Changes</Text>
            <Text style={styles.unsavedBody}>Save before leaving?</Text>
            <TouchableOpacity style={styles.unsavedSaveBtn} onPress={() => { handleSave(); setUnsavedModal(false); onBack(); }} activeOpacity={0.85}>
              <Text style={styles.unsavedSaveBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.unsavedDiscardBtn} onPress={() => { setUnsavedModal(false); onBack(); }} activeOpacity={0.8}>
              <Text style={styles.unsavedDiscardText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUnsavedModal(false)}>
              <Text style={styles.unsavedCancelText}>Cancel</Text>
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
  saveText: { ...typography['label-lg'], color: colors.secondary_container },
  saveTextSaved: { color: colors.emerald },
  scroll: { paddingHorizontal: rw(6.2), paddingTop: rh(1.4) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  fieldLabel: { ...typography['label-md'], color: colors.tertiary, marginBottom: rh(0.7) },
  editLink: { ...typography['label-md'], color: colors.tertiary, marginTop: rh(0.9) },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  photoSlotWrapper: { position: 'relative' },
  photoSlot: { backgroundColor: colors.surface_container, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  photoSlotEmpty: { borderStyle: 'dashed' },
  addPhotoIcon: { fontSize: rf(3.3), color: `${colors.on_surface}4D` },
  mainBadge: { position: 'absolute', bottom: rw(2.1), left: rw(2.1), backgroundColor: colors.secondary_container, borderRadius: 9999, paddingHorizontal: rw(2.1), paddingVertical: rh(0.3) },
  mainBadgeText: { ...typography['label-sm'], color: colors.on_secondary, letterSpacing: 1 },
  deleteBtn: { position: 'absolute', top: rw(1.5), right: rw(1.5), width: rw(6.2), height: rw(6.2), borderRadius: rw(3.1), backgroundColor: colors.primary_container, alignItems: 'center', justifyContent: 'center' },
  deleteBtnText: { fontSize: rf(2.1), color: '#FFFFFF', lineHeight: rf(2.4) },
  inputContainer: { backgroundColor: colors.surface_container_highest, height: rh(6.6), borderTopLeftRadius: rw(3.1), borderTopRightRadius: rw(3.1), paddingHorizontal: rw(4.1), justifyContent: 'center' },
  inputText: { ...typography['body-lg'], color: colors.on_surface, padding: 0, margin: 0 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1), marginBottom: rh(0.9) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipSelected: { backgroundColor: colors.primary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextSelected: { color: colors.on_surface },
  textareaContainer: { backgroundColor: colors.surface_container_highest, borderTopLeftRadius: rw(3.1), borderTopRightRadius: rw(3.1), paddingHorizontal: rw(4.1), paddingVertical: rh(1.4), minHeight: rh(14.2) },
  textarea: { ...typography['body-lg'], color: colors.on_surface, minHeight: rh(11.4), padding: 0, margin: 0 },
  charCount: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'right', marginTop: rh(0.5), marginBottom: rh(0.9) },
  promptCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), marginBottom: rh(1.2) },
  promptQ: { ...typography['label-sm'], color: colors.tertiary, marginBottom: rh(0.7) },
  promptA: { fontFamily: 'NotoSerif', fontSize: rf(1.9), color: colors.on_surface, lineHeight: rf(2.8) },
  promptEditBtn: { alignSelf: 'flex-end', marginTop: rh(0.9) },
  promptEmpty: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), alignItems: 'center', marginBottom: rh(1.2) },
  promptEmptyText: { ...typography['body-md'], color: `${colors.on_surface}4D` },
  dropdownBtn: { backgroundColor: colors.surface_container_highest, height: rh(6.6), borderTopLeftRadius: rw(3.1), borderTopRightRadius: rw(3.1), borderBottomWidth: 1, borderBottomColor: 'rgba(89,64,65,0.15)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: rw(4.1), justifyContent: 'space-between' },
  dropdownValue: { ...typography['body-lg'], color: colors.on_surface },
  dropdownChevron: { ...typography['title-md'], color: `${colors.on_surface}80`, transform: [{ rotate: '90deg' }] },
  locationText: { ...typography['label-md'], color: colors.emerald, marginBottom: rh(0.7) },
  saveBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: rh(3.8), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12 }, android: { elevation: 6 } }) },
  saveBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  pickerSheet: { backgroundColor: colors.surface_container, borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), paddingHorizontal: rw(6.2) },
  sheetHandle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.9) },
  sheetTitle: { ...typography['title-lg'], color: colors.on_surface, marginBottom: rh(1.4) },
  pickerList: { maxHeight: rh(40) },
  pickerItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: rh(1.7), paddingHorizontal: rw(2.1), borderRadius: rw(2.1) },
  pickerItemActive: { backgroundColor: `${colors.secondary_container}26` },
  pickerItemText: { ...typography['body-lg'], color: `${colors.on_surface}CC` },
  pickerItemTextActive: { color: colors.secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  pickerCheck: { ...typography['label-lg'], color: colors.secondary },
  unsavedOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.88)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(6.2) },
  unsavedCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(6.2), padding: rw(6.2), alignItems: 'center' },
  unsavedTitle: { ...typography['title-lg'], color: colors.on_surface, marginBottom: rh(0.9) },
  unsavedBody: { ...typography['body-md'], color: `${colors.on_surface}B3`, marginBottom: rh(2.8) },
  unsavedSaveBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: rw(1), alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  unsavedSaveBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  unsavedDiscardBtn: { width: '100%', height: rh(6.6), borderRadius: rw(1), borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  unsavedDiscardText: { ...typography['label-lg'], color: colors.tertiary },
  unsavedCancelText: { ...typography['body-md'], color: `${colors.on_surface}80`, paddingVertical: rh(1.2) },
});
