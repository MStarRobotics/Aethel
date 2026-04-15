import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Animated,
  StatusBar,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

// Design canvas: 390 × 844 (iPhone 14)
// Width%  = (px / 390) * 100
// Height% = (px / 844) * 100
// Font%   = (px / sqrt(390 * 844)) * 100

const TOTAL_STEPS = 6;
const CURRENT_STEP = 1;
const PROGRESS = CURRENT_STEP / TOTAL_STEPS; // 16.7%

const GENDER_OPTIONS = [
  'Man',
  'Woman',
  'Non-Binary',
  'Other',
  'Prefer not to say',
] as const;

type Gender = (typeof GENDER_OPTIONS)[number];

// ── Date helpers ──────────────────────────────────────────────────────────────

const DAYS = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, '0')
);

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) =>
  String(currentYear - 17 - i)  // oldest first, youngest = currentYear-17
);

function calcAge(day: string, month: string, year: string): number | null {
  if (!day || !month || !year) return null;
  const monthIndex = MONTHS.indexOf(month);
  if (monthIndex === -1) return null;
  const dob = new Date(Number(year), monthIndex, Number(day));
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface OnboardingStep1Data {
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  gender: Gender;
}

interface Props {
  onBack: () => void;
  onContinue: (data: OnboardingStep1Data) => void;
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function OnboardingStep1Screen({ onBack, onContinue }: Props) {
  const insets = useSafeAreaInsets();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);

  // Validation errors
  const [errors, setErrors] = useState({
    firstName: false,
    dob: false,
    gender: false,
  });

  // Age gate modal
  const [showAgeGate, setShowAgeGate] = useState(false);

  // Focus animations for text inputs
  const firstNameFocused = useRef(new Animated.Value(0)).current;
  const lastNameFocused = useRef(new Animated.Value(0)).current;

  const animateFocus = (anim: Animated.Value, focused: boolean) => {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const firstNameBorder = firstNameFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [
      errors.firstName ? colors.primary_container : 'rgba(89,64,65,0.15)',
      colors.secondary,
    ],
  });

  const lastNameBorder = lastNameFocused.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(89,64,65,0.15)', colors.secondary],
  });

  // Derived age
  const age = useMemo(() => calcAge(day, month, year), [day, month, year]);

  // Validate and continue
  const handleContinue = useCallback(() => {
    const firstNameErr = firstName.trim().length < 2 || firstName.trim().length > 30;
    const dobErr = !day || !month || !year;
    const genderErr = gender === null;

    setErrors({ firstName: firstNameErr, dob: dobErr, gender: genderErr });

    if (firstNameErr || dobErr || genderErr) return;

    // Age gate — must be 18+
    if (age !== null && age < 18) {
      setShowAgeGate(true);
      return;
    }

    onContinue({ firstName: firstName.trim(), lastName: lastName.trim(), day, month, year, gender: gender! });
  }, [firstName, lastName, day, month, year, gender, age, onContinue]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      {/* ── Header bar ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aethel</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Progress bar ───────────────────────────────────────────────────── */}
      <View style={styles.progressTrack}>
        <LinearGradient
          colors={[colors.primary_container, colors.secondary_container]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${PROGRESS * 100}%` }]}
        />
      </View>

      {/* ── Scrollable content ─────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + rh(7)}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + rh(14) }, // clear sticky footer
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Tag + Headline */}
          <View style={styles.headingBlock}>
            <Text style={styles.tag}>STEP {CURRENT_STEP} OF {TOTAL_STEPS}</Text>
            <Text style={styles.headline}>Tell Us About Yourself</Text>
            <Text style={styles.subheadline}>Let's set up your profile</Text>
          </View>

          {/* ── First Name ─────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>FIRST NAME</Text>
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  borderBottomColor: firstNameBorder,
                  borderBottomWidth: errors.firstName ? 2 : 1,
                },
              ]}
            >
              <TextInput
                style={styles.inputText}
                value={firstName}
                onChangeText={(v) => {
                  setFirstName(v);
                  if (errors.firstName) setErrors((e) => ({ ...e, firstName: false }));
                }}
                placeholder="e.g. Julian"
                placeholderTextColor={`${colors.on_surface}4D`}
                autoCapitalize="words"
                returnKeyType="next"
                onFocus={() => animateFocus(firstNameFocused, true)}
                onBlur={() => animateFocus(firstNameFocused, false)}
                accessibilityLabel="First name"
              />
            </Animated.View>
            {errors.firstName && (
              <Text style={styles.errorText}>First name must be 2–30 characters</Text>
            )}
          </View>

          {/* ── Last Name (optional) ───────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>LAST NAME (OPTIONAL)</Text>
            <Animated.View
              style={[
                styles.inputContainer,
                { borderBottomColor: lastNameBorder, borderBottomWidth: 1 },
              ]}
            >
              <TextInput
                style={styles.inputText}
                value={lastName}
                onChangeText={setLastName}
                placeholder="e.g. Vance"
                placeholderTextColor={`${colors.on_surface}4D`}
                autoCapitalize="words"
                returnKeyType="next"
                onFocus={() => animateFocus(lastNameFocused, true)}
                onBlur={() => animateFocus(lastNameFocused, false)}
                accessibilityLabel="Last name (optional)"
              />
            </Animated.View>
          </View>

          {/* ── Date of Birth ──────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.fieldLabel, errors.dob && styles.fieldLabelError]}>
              DATE OF BIRTH
            </Text>
            <View style={styles.dobRow}>
              <PickerField
                label="Day"
                value={day}
                options={DAYS}
                onSelect={(v) => {
                  setDay(v);
                  if (errors.dob) setErrors((e) => ({ ...e, dob: false }));
                }}
                hasError={errors.dob}
                flex={1}
              />
              <PickerField
                label="Month"
                value={month}
                options={MONTHS}
                onSelect={(v) => {
                  setMonth(v);
                  if (errors.dob) setErrors((e) => ({ ...e, dob: false }));
                }}
                hasError={errors.dob}
                flex={2}
              />
              <PickerField
                label="Year"
                value={year}
                options={YEARS}
                onSelect={(v) => {
                  setYear(v);
                  if (errors.dob) setErrors((e) => ({ ...e, dob: false }));
                }}
                hasError={errors.dob}
                flex={1.4}
              />
            </View>
            {errors.dob && (
              <Text style={styles.errorText}>Please select your date of birth</Text>
            )}
            {age !== null && age >= 18 && (
              <Text style={styles.ageText}>You are {age} years old</Text>
            )}
          </View>

          {/* ── Gender ─────────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.fieldLabel, errors.gender && styles.fieldLabelError]}>
              I IDENTIFY AS
            </Text>
            <View style={styles.chipsGrid}>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.chip,
                    gender === option && styles.chipSelected,
                  ]}
                  onPress={() => {
                    setGender(option);
                    if (errors.gender) setErrors((e) => ({ ...e, gender: false }));
                  }}
                  activeOpacity={0.75}
                  accessibilityLabel={option}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: gender === option }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      gender === option && styles.chipTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender && (
              <Text style={styles.errorText}>Please select your gender identity</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Sticky footer CTA ──────────────────────────────────────────────── */}
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + rh(1.9) },
        ]}
      >
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
          accessibilityLabel="Continue to step 2"
          accessibilityRole="button"
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>

      {/* ── Age gate modal ─────────────────────────────────────────────────── */}
      <Modal
        visible={showAgeGate}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAgeGate(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>You must be 18 or older</Text>
            <Text style={styles.modalBody}>
              Aethel is only available to users aged 18 and above.
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setShowAgeGate(false)}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Text style={styles.modalBtnText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── PickerField ───────────────────────────────────────────────────────────────
// Native-style dropdown using a Modal + FlatList — works on both Android & iOS

interface PickerFieldProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (v: string) => void;
  hasError?: boolean;
  flex?: number;
}

function PickerField({ label, value, options, onSelect, hasError, flex = 1 }: PickerFieldProps) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <TouchableOpacity
        style={[
          styles.pickerBtn,
          { flex },
          hasError && styles.pickerBtnError,
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        accessibilityLabel={`Select ${label}`}
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.pickerBtnText,
            !value && styles.pickerBtnPlaceholder,
          ]}
          numberOfLines={1}
        >
          {value || label}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.pickerOverlay} onPress={() => setOpen(false)}>
          <View
            style={[
              styles.pickerSheet,
              { paddingBottom: insets.bottom + rh(2) },
            ]}
          >
            {/* Sheet handle */}
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              style={styles.sheetList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.sheetItem,
                    item === value && styles.sheetItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  accessibilityLabel={item}
                  accessibilityRole="menuitem"
                >
                  <Text
                    style={[
                      styles.sheetItemText,
                      item === value && styles.sheetItemTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && (
                    <Text style={styles.sheetItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },

  root: {
    flex: 1,
    backgroundColor: colors.surface_container_lowest,
  },

  // Header bar
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4.6),
    paddingVertical: rh(1.2),
    backgroundColor: colors.surface_container_lowest,
  },

  backBtn: {
    padding: rw(2),
    width: rw(10.3),
  },

  backIcon: {
    ...typography['title-lg'],
    color: colors.primary,
  },

  headerTitle: {
    ...typography['headline-sm'],
    color: colors.on_surface,
    fontStyle: 'italic',
  },

  headerSpacer: {
    width: rw(10.3),
  },

  // Progress bar — 4px track, gradient fill
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.surface_container,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 9999,
  },

  scroll: {
    paddingHorizontal: rw(6.2),   // 24px
    paddingTop: rh(3.6),
  },

  // Tag + Headline — asymmetric right margin
  headingBlock: {
    marginBottom: rh(3.8),
    paddingRight: rw(12.3),   // 48px asymmetric
  },

  tag: {
    ...typography['label-sm'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    marginBottom: rh(0.7),
  },

  headline: {
    ...typography['headline-md'],
    color: colors.on_surface,
    marginBottom: rh(0.7),
  },

  subheadline: {
    ...typography['body-md'],
    color: `${colors.on_surface}99`,   // 60% opacity
  },

  // Section spacing — 32px between sections
  section: {
    marginBottom: rh(3.8),
  },

  fieldLabel: {
    ...typography['label-md'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    marginBottom: rh(1.2),
  },

  fieldLabelError: {
    color: colors.primary_container,
  },

  // Text input — surface_container_highest bg, rounded top, ghost bottom border
  inputContainer: {
    backgroundColor: colors.surface_container_highest,
    height: rh(6.6),   // 56px
    paddingHorizontal: rw(4.1),
    borderTopLeftRadius: rw(3.1),
    borderTopRightRadius: rw(3.1),
    justifyContent: 'center',
  },

  inputText: {
    ...typography['body-lg'],
    color: colors.on_surface,
    padding: 0,
    margin: 0,
  },

  errorText: {
    ...typography['label-sm'],
    color: colors.primary_container,
    marginTop: rh(0.6),
  },

  ageText: {
    ...typography['label-sm'],
    color: colors.emerald,
    marginTop: rh(0.9),
  },

  // Date of birth — 3 pickers in a row, 8px gap
  dobRow: {
    flexDirection: 'row',
    gap: rw(2.1),   // 8px
  },

  // Picker button — same visual as input field
  pickerBtn: {
    backgroundColor: colors.surface_container_highest,
    height: rh(6.6),
    borderTopLeftRadius: rw(3.1),
    borderTopRightRadius: rw(3.1),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(89,64,65,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rw(3.1),
    justifyContent: 'space-between',
  },

  pickerBtnError: {
    borderBottomColor: colors.primary_container,
    borderBottomWidth: 2,
  },

  pickerBtnText: {
    ...typography['body-md'],
    color: colors.on_surface,
    flex: 1,
  },

  pickerBtnPlaceholder: {
    color: `${colors.on_surface}4D`,   // 30% opacity
  },

  chevron: {
    ...typography['title-md'],
    color: `${colors.on_surface}80`,   // 50% opacity
    transform: [{ rotate: '90deg' }],
  },

  // Gender chips — 2-column wrap grid
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rw(2.1),   // 8px
  },

  chip: {
    height: rh(5.2),   // 44px
    paddingHorizontal: rw(5.1),   // 20px
    borderRadius: 9999,
    backgroundColor: colors.tertiary_container,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipSelected: {
    backgroundColor: colors.primary_container,
  },

  chipText: {
    ...typography['label-md'],
    color: colors.on_tertiary_container,
  },

  chipTextSelected: {
    color: colors.on_surface,
  },

  // Sticky footer — glassmorphism per design spec
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: rw(6.2),
    paddingTop: rh(1.9),
    backgroundColor: 'rgba(21, 6, 41, 0.85)',
    ...Platform.select({
      ios: {
        shadowColor: colors.surface_container_lowest,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },

  continueBtn: {
    height: rh(6.6),   // 56px
    backgroundColor: colors.secondary_container,
    borderRadius: 9999,   // pill per HTML reference
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.secondary_container,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: { elevation: 6 },
    }),
  },

  continueBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },

  // Age gate modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(21, 6, 41, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rw(6.2),
  },

  modalCard: {
    width: '100%',
    backgroundColor: colors.surface_container,
    borderRadius: rw(4.1),   // 16px
    padding: rw(6.2),
    alignItems: 'center',
  },

  modalTitle: {
    ...typography['headline-sm'],
    color: colors.on_surface,
    textAlign: 'center',
    marginBottom: rh(1.4),
  },

  modalBody: {
    ...typography['body-md'],
    color: `${colors.on_surface}B3`,   // 70% opacity
    textAlign: 'center',
    marginBottom: rh(2.8),
  },

  modalBtn: {
    width: '100%',
    height: rh(6.6),
    backgroundColor: colors.secondary_container,
    borderRadius: rw(1),
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },

  // Bottom sheet picker
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(21, 6, 41, 0.6)',
    justifyContent: 'flex-end',
  },

  pickerSheet: {
    backgroundColor: colors.surface_container,
    borderTopLeftRadius: rw(6.2),   // 24px
    borderTopRightRadius: rw(6.2),
    paddingTop: rh(1.4),
    maxHeight: rh(55),
  },

  sheetHandle: {
    width: rw(8.2),   // 32px
    height: 4,
    borderRadius: 9999,
    backgroundColor: `${colors.on_surface}4D`,   // 30% opacity
    alignSelf: 'center',
    marginBottom: rh(1.9),
  },

  sheetTitle: {
    ...typography['title-lg'],
    color: colors.on_surface,
    textAlign: 'center',
    marginBottom: rh(1.4),
    paddingHorizontal: rw(6.2),
  },

  sheetList: {
    paddingHorizontal: rw(4.1),
  },

  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: rh(1.7),
    paddingHorizontal: rw(4.1),
    borderRadius: rw(2.1),
  },

  sheetItemSelected: {
    backgroundColor: `${colors.secondary_container}26`,   // 15% opacity
  },

  sheetItemText: {
    ...typography['body-lg'],
    color: `${colors.on_surface}CC`,   // 80% opacity
  },

  sheetItemTextSelected: {
    color: colors.secondary,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  sheetItemCheck: {
    ...typography['label-lg'],
    color: colors.secondary,
  },
});
