import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  StatusBar,
  PanResponder,
  LayoutChangeEvent,
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

const TOTAL_STEPS = 6;
const CURRENT_STEP = 5;
const PROGRESS = CURRENT_STEP / TOTAL_STEPS; // 83.3%

const THUMB_SIZE = rw(6.2);   // 24px / 390 * 100
const TRACK_H = 4;

// ── Chip data ─────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = ['Men', 'Women', 'Non-Binary', 'Everyone'] as const;
type GenderOption = (typeof GENDER_OPTIONS)[number];

const GOAL_OPTIONS = ['Casual', 'Serious', 'Friendship', 'Open to anything'] as const;
type GoalOption = (typeof GOAL_OPTIONS)[number];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OnboardingStep5Data {
  genders: GenderOption[];
  ageMin: number;
  ageMax: number;
  distance: number;
  worldwide: boolean;
  goals: GoalOption[];
}

interface Props {
  onBack: () => void;
  onContinue: (data: OnboardingStep5Data) => void;
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function OnboardingStep5Screen({ onBack, onContinue }: Props) {
  const insets = useSafeAreaInsets();

  // Defaults per spec
  const [genders, setGenders] = useState<Set<GenderOption>>(new Set(['Everyone']));
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(35);
  const [distance, setDistance] = useState(50);
  const [worldwide, setWorldwide] = useState(false);
  const [goals, setGoals] = useState<Set<GoalOption>>(new Set(['Open to anything']));

  const toggleGender = useCallback((g: GenderOption) => {
    setGenders((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  }, []);

  const toggleGoal = useCallback((g: GoalOption) => {
    setGoals((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  }, []);

  const handleContinue = () => {
    onContinue({
      genders: Array.from(genders) as GenderOption[],
      ageMin,
      ageMax,
      distance,
      worldwide,
      goals: Array.from(goals) as GoalOption[],
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.surface_container_lowest}
        translucent
      />

      {/* Ambient glows */}
      <View style={styles.glowTopRight} pointerEvents="none" />
      <View style={styles.glowBottomLeft} pointerEvents="none" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
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
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + rh(16) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tag + Headline — asymmetric right margin */}
        <View style={styles.headingBlock}>
          <Text style={styles.tag}>YOUR PREFERENCES</Text>
          <Text style={styles.headline}>Who Are You Looking For?</Text>
        </View>

        {/* ── Section 1: Interested in ───────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>I'm interested in</Text>
          <View style={styles.chipsGrid}>
            {GENDER_OPTIONS.map((opt) => (
              <ChipButton
                key={opt}
                label={opt}
                selected={genders.has(opt)}
                onPress={() => toggleGender(opt)}
              />
            ))}
          </View>
        </View>

        {/* ── Section 2: Age range ───────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Age Range</Text>
          <RangeSlider
            min={18}
            max={80}
            valueMin={ageMin}
            valueMax={ageMax}
            onChangeMin={setAgeMin}
            onChangeMax={setAgeMax}
          />
          <Text style={styles.sliderLabel}>
            Showing ages {ageMin} – {ageMax}
          </Text>
        </View>

        {/* ── Section 3: Distance ────────────────────────────────────────── */}
        <View style={[styles.section, worldwide && styles.sectionDimmed]}>
          <Text style={styles.sectionLabel}>Maximum Distance</Text>
          <SingleSlider
            min={1}
            max={200}
            value={distance}
            onChange={setDistance}
            disabled={worldwide}
          />
          <Text style={[styles.sliderLabel, worldwide && styles.sliderLabelDimmed]}>
            Within {distance} km
          </Text>
        </View>

        {/* Worldwide checkbox */}
        <Pressable
          style={styles.checkboxRow}
          onPress={() => setWorldwide((v) => !v)}
          accessibilityLabel="Show worldwide matches"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: worldwide }}
        >
          <View style={[styles.checkbox, worldwide && styles.checkboxChecked]}>
            {worldwide && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Show worldwide matches</Text>
        </Pressable>

        {/* ── Section 4: Looking for ─────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Looking For</Text>
          <View style={styles.chipsGrid}>
            {GOAL_OPTIONS.map((opt) => (
              <ChipButton
                key={opt}
                label={opt}
                selected={goals.has(opt)}
                onPress={() => toggleGoal(opt)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky footer ──────────────────────────────────────────────────── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + rh(1.9) }]}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
          accessibilityLabel="Continue to step 6"
          accessibilityRole="button"
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── ChipButton ────────────────────────────────────────────────────────────────

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function ChipButton({ label, selected, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityLabel={label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ── RangeSlider ───────────────────────────────────────────────────────────────
// Custom two-thumb range slider built with PanResponder — no extra deps

interface RangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
}

function RangeSlider({
  min, max, valueMin, valueMax, onChangeMin, onChangeMax,
}: RangeSliderProps) {
  const trackWidth = useRef(0);

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  const toPercent = (v: number) => (v - min) / (max - min);
  const fromPercent = (p: number) => Math.round(min + p * (max - min));

  // Min thumb
  const minPan = useRef(new Animated.Value(toPercent(valueMin))).current;
  const minPanRef = useRef(toPercent(valueMin));

  const minResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        minPanRef.current = toPercent(valueMin);
      },
      onPanResponderMove: (_, gs) => {
        if (!trackWidth.current) return;
        const delta = gs.dx / trackWidth.current;
        const maxPercent = toPercent(valueMax) - 0.05;
        const next = clamp(minPanRef.current + delta, 0, maxPercent);
        minPan.setValue(next);
        onChangeMin(fromPercent(next));
      },
    })
  ).current;

  // Max thumb
  const maxPan = useRef(new Animated.Value(toPercent(valueMax))).current;
  const maxPanRef = useRef(toPercent(valueMax));

  const maxResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        maxPanRef.current = toPercent(valueMax);
      },
      onPanResponderMove: (_, gs) => {
        if (!trackWidth.current) return;
        const delta = gs.dx / trackWidth.current;
        const minPercent = toPercent(valueMin) + 0.05;
        const next = clamp(maxPanRef.current + delta, minPercent, 1);
        maxPan.setValue(next);
        onChangeMax(fromPercent(next));
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  const minLeft = minPan.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const maxLeft = maxPan.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const fillLeft = minPan.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const fillRight = maxPan.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', '0%'],
  });

  return (
    <View style={sliderStyles.wrapper} onLayout={onLayout}>
      {/* Track */}
      <View style={sliderStyles.track}>
        {/* Gradient fill between thumbs */}
        <Animated.View
          style={[
            sliderStyles.fill,
            { left: fillLeft, right: fillRight },
          ]}
        >
          <LinearGradient
            colors={[colors.primary_container, colors.secondary_container]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* Min thumb */}
      <Animated.View
        style={[sliderStyles.thumbWrapper, { left: minLeft }]}
        {...minResponder.panHandlers}
      >
        <View style={sliderStyles.thumb}>
          <View style={sliderStyles.thumbDot} />
        </View>
      </Animated.View>

      {/* Max thumb */}
      <Animated.View
        style={[sliderStyles.thumbWrapper, { left: maxLeft }]}
        {...maxResponder.panHandlers}
      >
        <View style={sliderStyles.thumb}>
          <View style={sliderStyles.thumbDot} />
        </View>
      </Animated.View>
    </View>
  );
}

// ── SingleSlider ──────────────────────────────────────────────────────────────

interface SingleSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}

function SingleSlider({ min, max, value, onChange, disabled }: SingleSliderProps) {
  const trackWidth = useRef(0);

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  const toPercent = (v: number) => (v - min) / (max - min);
  const fromPercent = (p: number) => Math.round(min + p * (max - min));

  const pan = useRef(new Animated.Value(toPercent(value))).current;
  const panRef = useRef(toPercent(value));

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        panRef.current = toPercent(value);
      },
      onPanResponderMove: (_, gs) => {
        if (!trackWidth.current || disabled) return;
        const delta = gs.dx / trackWidth.current;
        const next = clamp(panRef.current + delta, 0, 1);
        pan.setValue(next);
        onChange(fromPercent(next));
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  const thumbLeft = pan.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const fillWidth = pan.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[sliderStyles.wrapper, disabled && sliderStyles.wrapperDisabled]}
      onLayout={onLayout}
    >
      <View style={sliderStyles.track}>
        <Animated.View style={[sliderStyles.fill, { left: 0, width: fillWidth }]}>
          <LinearGradient
            colors={[colors.primary_container, colors.secondary_container]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      <Animated.View
        style={[sliderStyles.thumbWrapper, { left: thumbLeft }]}
        {...responder.panHandlers}
      >
        <View style={[sliderStyles.thumb, disabled && sliderStyles.thumbDisabled]}>
          <View style={sliderStyles.thumbDot} />
        </View>
      </Animated.View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: THUMB_SIZE + rh(1.2),
    justifyContent: 'center',
    marginBottom: rh(0.9),
  },

  wrapperDisabled: {
    opacity: 0.3,
  },

  track: {
    width: '100%',
    height: TRACK_H,
    backgroundColor: colors.surface_container,
    borderRadius: 9999,
    overflow: 'visible',
    position: 'relative',
  },

  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 9999,
    overflow: 'hidden',
  },

  thumbWrapper: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: -(THUMB_SIZE / 2),
    top: '50%',
    marginTop: -(THUMB_SIZE / 2) + TRACK_H / 2 - rh(0.6),
    alignItems: 'center',
    justifyContent: 'center',
  },

  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.secondary_container,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.secondary_container,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },

  thumbDisabled: {
    backgroundColor: colors.surface_container_high,
  },

  thumbDot: {
    width: rw(1.5),
    height: rw(1.5),
    borderRadius: rw(0.75),
    backgroundColor: '#FFFFFF',
  },
});

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface_container_lowest,
  },

  // Ambient glows
  glowTopRight: {
    position: 'absolute',
    top: -rw(20),
    right: -rw(20),
    width: rw(80),
    height: rw(60),
    borderRadius: rw(40),
    backgroundColor: 'rgba(178, 31, 60, 0.05)',
  },

  glowBottomLeft: {
    position: 'absolute',
    bottom: -rw(10),
    left: -rw(10),
    width: rw(60),
    height: rw(40),
    borderRadius: rw(30),
    backgroundColor: 'rgba(253, 139, 0, 0.05)',
  },

  // Header
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

  headerSpacer: { width: rw(10.3) },

  // Progress bar
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
    paddingHorizontal: rw(6.2),   // 24px left
    paddingRight: rw(12.3),        // 48px right — asymmetric per spec
    paddingTop: rh(3.6),
  },

  // Tag + Headline
  headingBlock: {
    marginBottom: rh(3.8),
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
  },

  // Section — 32px gap between sections
  section: {
    marginBottom: rh(3.8),
  },

  sectionDimmed: {
    opacity: 0.4,
  },

  sectionLabel: {
    ...typography['label-md'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    marginBottom: rh(1.9),
  },

  // Slider value label — emerald
  sliderLabel: {
    ...typography['label-sm'],
    color: colors.emerald,
    marginTop: rh(0.9),
  },

  sliderLabelDimmed: {
    color: `${colors.on_surface}66`,
  },

  // Chips — 2-column grid, 8px gap, pill shape
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rw(2.1),
  },

  chip: {
    height: rh(5.2),   // 44px
    paddingHorizontal: rw(5.1),
    borderRadius: 9999,
    backgroundColor: colors.tertiary_container,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: rw(25),
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

  // Worldwide checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(3.6),
    marginTop: rh(1.9),
    marginBottom: rh(3.8),
  },

  checkbox: {
    width: rw(5.6),
    height: rw(5.6),
    borderRadius: rw(1),
    borderWidth: 1.5,
    borderColor: 'rgba(89, 64, 65, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: colors.secondary_container,
    borderColor: colors.secondary_container,
  },

  checkmark: {
    fontSize: rf(1.3),
    color: colors.on_secondary,
    fontWeight: '700',
  },

  checkboxLabel: {
    ...typography['body-md'],
    color: `${colors.on_surface}CC`,
  },

  // Sticky footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: rw(6.2),
    paddingTop: rh(1.9),
    backgroundColor: 'rgba(21, 6, 41, 0.92)',
    ...Platform.select({
      ios: {
        shadowColor: colors.surface_container_lowest,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.7,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },

  continueBtn: {
    height: rh(6.6),
    backgroundColor: colors.secondary_container,
    borderRadius: 9999,
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
});
