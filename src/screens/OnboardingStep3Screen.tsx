import React, { useState, useRef, useCallback } from 'react';
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
  KeyboardAvoidingView,
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

const TOTAL_STEPS = 6;
const CURRENT_STEP = 3;
const PROGRESS = CURRENT_STEP / TOTAL_STEPS; // 50%

const BIO_MAX = 500;
const BIO_WARN = 450; // counter turns crimson above this
const MAX_INTERESTS = 10;

// ── Interest data ─────────────────────────────────────────────────────────────

interface Interest {
  id: string;
  label: string;
  emoji: string;
}

const INTERESTS_INITIAL: Interest[] = [
  { id: 'gaming',    label: 'Gaming',    emoji: '🎮' },
  { id: 'music',     label: 'Music',     emoji: '🎵' },
  { id: 'reading',   label: 'Reading',   emoji: '📚' },
  { id: 'food',      label: 'Food',      emoji: '🍕' },
  { id: 'gym',       label: 'Gym',       emoji: '🏋️' },
  { id: 'travel',    label: 'Travel',    emoji: '✈️' },
  { id: 'art',       label: 'Art',       emoji: '🎨' },
  { id: 'pets',      label: 'Pets',      emoji: '🐶' },
];

const INTERESTS_MORE: Interest[] = [
  { id: 'cooking',   label: 'Cooking',   emoji: '🍳' },
  { id: 'photo',     label: 'Photography', emoji: '📷' },
  { id: 'writing',   label: 'Writing',   emoji: '✍️' },
  { id: 'dancing',   label: 'Dancing',   emoji: '💃' },
  { id: 'hiking',    label: 'Hiking',    emoji: '🥾' },
  { id: 'yoga',      label: 'Yoga',      emoji: '🧘' },
  { id: 'movies',    label: 'Movies',    emoji: '🎬' },
  { id: 'anime',     label: 'Anime',     emoji: '⛩️' },
  { id: 'podcasts',  label: 'Podcasts',  emoji: '🎙️' },
  { id: 'comedy',    label: 'Comedy',    emoji: '😂' },
  { id: 'concerts',  label: 'Concerts',  emoji: '🎤' },
  { id: 'running',   label: 'Running',   emoji: '🏃' },
  { id: 'cycling',   label: 'Cycling',   emoji: '🚴' },
  { id: 'swimming',  label: 'Swimming',  emoji: '🏊' },
  { id: 'football',  label: 'Football',  emoji: '⚽' },
  { id: 'tennis',    label: 'Tennis',    emoji: '🎾' },
  { id: 'coffee',    label: 'Coffee',    emoji: '☕' },
  { id: 'wine',      label: 'Wine',      emoji: '🍷' },
  { id: 'fashion',   label: 'Fashion',   emoji: '👗' },
  { id: 'diy',       label: 'DIY',       emoji: '🔨' },
  { id: 'boardgames',label: 'Board Games',emoji: '♟️' },
  { id: 'karaoke',   label: 'Karaoke',   emoji: '🎤' },
  { id: 'festivals', label: 'Festivals', emoji: '🎪' },
  { id: 'dogs',      label: 'Dogs',      emoji: '🐕' },
  { id: 'cats',      label: 'Cats',      emoji: '🐈' },
];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OnboardingStep3Data {
  bio: string;
  interests: string[];
}

interface Props {
  onBack: () => void;
  onContinue: (data: OnboardingStep3Data) => void;
  onSkip: () => void;
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function OnboardingStep3Screen({ onBack, onContinue, onSkip }: Props) {
  const insets = useSafeAreaInsets();

  const [bio, setBio] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showMore, setShowMore] = useState(false);

  // Textarea focus animation
  const bioFocused = useRef(new Animated.Value(0)).current;
  const animateFocus = (focused: boolean) => {
    Animated.timing(bioFocused, {
      toValue: focused ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  };

  const bioBorderColor = bioFocused.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(89,64,65,0.15)', colors.secondary],
  });

  const counterColor =
    bio.length >= BIO_WARN ? colors.primary_container : `${colors.on_surface}66`;

  const visibleInterests = showMore
    ? [...INTERESTS_INITIAL, ...INTERESTS_MORE]
    : INTERESTS_INITIAL;

  const toggleInterest = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_INTERESTS) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleContinue = () => {
    onContinue({ bio: bio.trim(), interests: Array.from(selected) });
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + rh(7)}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + rh(16) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Tag + Headline */}
          <View style={styles.headingBlock}>
            <Text style={styles.tag}>ABOUT YOU</Text>
            <Text style={styles.headline}>Tell Your Story</Text>
            <Text style={styles.subheadline}>
              Tell people what makes you, you.
            </Text>
          </View>

          {/* ── Bio textarea ───────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Animated.View
              style={[
                styles.textareaContainer,
                {
                  borderBottomColor: bioBorderColor,
                  borderBottomWidth: 1,
                },
              ]}
            >
              <TextInput
                style={styles.textarea}
                value={bio}
                onChangeText={(v) => setBio(v.slice(0, BIO_MAX))}
                placeholder="Capture your essence here..."
                placeholderTextColor={`${colors.on_surface}4D`}
                multiline
                textAlignVertical="top"
                maxLength={BIO_MAX}
                onFocus={() => animateFocus(true)}
                onBlur={() => animateFocus(false)}
                accessibilityLabel="Bio"
                accessibilityHint={`Maximum ${BIO_MAX} characters`}
              />
            </Animated.View>
            {/* Character counter — right-aligned, turns crimson near limit */}
            <Text style={[styles.counter, { color: counterColor }]}>
              {bio.length} / {BIO_MAX}
            </Text>
          </View>

          {/* ── Interests ──────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.interestsHeader}>
              <View>
                <Text style={styles.interestsLabel}>YOUR INTERESTS</Text>
                <Text style={styles.interestsSubLabel}>
                  {selected.size} / {MAX_INTERESTS} selected
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowMore((v) => !v)}
                accessibilityLabel={showMore ? 'Show fewer interests' : 'Show more interests'}
                accessibilityRole="button"
              >
                <Text style={styles.showMoreLink}>
                  {showMore ? '− Show less' : '+ Show more interests'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chipsGrid}>
              {visibleInterests.map((item) => {
                const isSelected = selected.has(item.id);
                const isDisabled = !isSelected && selected.size >= MAX_INTERESTS;
                return (
                  <InterestChip
                    key={item.id}
                    item={item}
                    selected={isSelected}
                    disabled={isDisabled}
                    onPress={() => toggleInterest(item.id)}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Sticky footer ──────────────────────────────────────────────────── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + rh(1.9) }]}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
          accessibilityLabel="Continue to step 4"
          accessibilityRole="button"
        >
          <Text style={styles.continueBtnText}>Continue →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={onSkip}
          accessibilityLabel="Skip for now"
          accessibilityRole="button"
        >
          <Text style={styles.skipBtnText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── InterestChip ──────────────────────────────────────────────────────────────

interface ChipProps {
  item: Interest;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}

function InterestChip({ item, selected, disabled, onPress }: ChipProps) {
  const bg = selected
    ? colors.primary_container
    : disabled
    ? colors.surface_container
    : colors.tertiary_container;

  const textColor = selected
    ? colors.on_surface
    : disabled
    ? `${colors.on_surface}4D`   // 30% opacity
    : colors.on_tertiary_container;

  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor: bg }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      accessibilityLabel={item.label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
    >
      <Text style={styles.chipEmoji}>{item.emoji}</Text>
      <Text style={[styles.chipText, { color: textColor }]}>{item.label}</Text>
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },

  root: {
    flex: 1,
    backgroundColor: colors.surface_container_lowest,
  },

  // Ambient glows
  glowTopRight: {
    position: 'absolute',
    top: -rw(10),
    right: -rw(10),
    width: rw(60),
    height: rw(60),
    borderRadius: rw(30),
    backgroundColor: 'rgba(255, 178, 182, 0.05)',
  },

  glowBottomLeft: {
    position: 'absolute',
    bottom: -rw(5),
    left: -rw(5),
    width: rw(50),
    height: rw(50),
    borderRadius: rw(25),
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

  headerSpacer: {
    width: rw(10.3),
  },

  // Progress bar — 4px, gradient fill
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
    paddingHorizontal: rw(6.2),
    paddingTop: rh(3.6),
  },

  // Tag + Headline — asymmetric right margin
  headingBlock: {
    marginBottom: rh(3.8),
    paddingRight: rw(12.3),
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
    color: `${colors.on_surface}99`,
  },

  // Section spacing
  section: {
    marginBottom: rh(3.8),
  },

  // Bio textarea — surface_container_highest bg, rounded top, ghost bottom border
  textareaContainer: {
    backgroundColor: colors.surface_container_highest,
    borderTopLeftRadius: rw(3.1),
    borderTopRightRadius: rw(3.1),
    paddingHorizontal: rw(4.1),
    paddingTop: rh(1.4),
    paddingBottom: rh(1.4),
    minHeight: rh(14.2),   // 120px / 844 * 100
  },

  textarea: {
    ...typography['body-lg'],
    color: colors.on_surface,
    minHeight: rh(11.4),   // inner text area
    padding: 0,
    margin: 0,
  },

  // Character counter — right-aligned, dynamic color
  counter: {
    ...typography['label-sm'],
    textAlign: 'right',
    marginTop: rh(0.7),
  },

  // Interests header row
  interestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: rh(1.9),
  },

  interestsLabel: {
    ...typography['label-sm'],
    color: colors.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  interestsSubLabel: {
    ...typography['label-sm'],
    color: `${colors.on_surface}80`,
    marginTop: rh(0.4),
  },

  showMoreLink: {
    ...typography['label-md'],
    color: colors.tertiary,
  },

  // Chips — 2-column grid, 8px gap, pill shape
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rw(2.1),
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(2.1),
    height: rh(4.7),        // 40px / 844 * 100
    paddingHorizontal: rw(4.1),  // 16px
    borderRadius: 9999,
  },

  chipEmoji: {
    fontSize: rf(1.9),
  },

  chipText: {
    ...typography['label-md'],
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
    marginBottom: rh(0.9),
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

  skipBtn: {
    alignItems: 'center',
    paddingVertical: rh(1.2),
  },

  skipBtnText: {
    ...typography['label-md'],
    color: colors.tertiary,
  },
});
