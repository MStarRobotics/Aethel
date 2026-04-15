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
const CURRENT_STEP = 6;
const PROGRESS = 1; // 100%

// ── Question data ─────────────────────────────────────────────────────────────

interface Question {
  id: string;
  text: string;
  options: { id: string; emoji: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Do you prefer staying home or going out on weekends?',
    options: [
      { id: 'home',  emoji: '🏠', label: 'Staying Home' },
      { id: 'out',   emoji: '🎉', label: 'Going Out' },
      { id: 'mood',  emoji: '😐', label: 'Depends on mood' },
    ],
  },
  {
    id: 'q2',
    text: 'How do you handle conflict in a relationship?',
    options: [
      { id: 'talk',   emoji: '💬', label: 'Talk it out immediately' },
      { id: 'space',  emoji: '🚶', label: 'Need space first' },
      { id: 'avoid',  emoji: '🙈', label: 'Tend to avoid it' },
      { id: 'write',  emoji: '✍️', label: 'Write it down first' },
    ],
  },
  {
    id: 'q3',
    text: 'What best describes your communication style?',
    options: [
      { id: 'texter',  emoji: '📱', label: 'Constant texter' },
      { id: 'calls',   emoji: '📞', label: 'Prefer calls' },
      { id: 'quality', emoji: '🤝', label: 'Quality over quantity' },
      { id: 'space',   emoji: '🌙', label: 'Need my space' },
    ],
  },
  {
    id: 'q4',
    text: 'How important is physical fitness to you?',
    options: [
      { id: 'very',   emoji: '🏋️', label: 'Very — I work out daily' },
      { id: 'some',   emoji: '🚴', label: 'Somewhat active' },
      { id: 'casual', emoji: '🛋️', label: 'Casual walks count' },
      { id: 'mind',   emoji: '🧠', label: 'Mind over body' },
    ],
  },
  {
    id: 'q5',
    text: 'What kind of first date sounds most appealing?',
    options: [
      { id: 'coffee', emoji: '☕', label: 'Coffee & conversation' },
      { id: 'dinner', emoji: '🍽️', label: 'Fancy dinner' },
      { id: 'active', emoji: '🎳', label: 'Something active' },
      { id: 'art',    emoji: '🎨', label: 'Museum or gallery' },
    ],
  },
  {
    id: 'q6',
    text: 'How do you feel about long-distance relationships?',
    options: [
      { id: 'open',   emoji: '✈️', label: 'Open to it' },
      { id: 'no',     emoji: '🚫', label: 'Not for me' },
      { id: 'tried',  emoji: '💔', label: "Tried it, won't again" },
      { id: 'maybe',  emoji: '🤔', label: 'Depends on the person' },
    ],
  },
  {
    id: 'q7',
    text: 'How do you typically spend your free time?',
    options: [
      { id: 'social',  emoji: '👥', label: 'Socialising with friends' },
      { id: 'solo',    emoji: '📚', label: 'Solo hobbies' },
      { id: 'mix',     emoji: '⚖️', label: 'Mix of both' },
      { id: 'family',  emoji: '🏡', label: 'Family time' },
    ],
  },
  {
    id: 'q8',
    text: 'What role does humour play in your relationships?',
    options: [
      { id: 'core',    emoji: '😂', label: 'Essential — must make me laugh' },
      { id: 'nice',    emoji: '😊', label: 'Nice to have' },
      { id: 'serious', emoji: '🎭', label: 'I prefer depth over jokes' },
    ],
  },
  {
    id: 'q9',
    text: 'How do you feel about having children?',
    options: [
      { id: 'want',    emoji: '👶', label: 'Definitely want them' },
      { id: 'open',    emoji: '🤷', label: 'Open to it' },
      { id: 'no',      emoji: '🙅', label: "Don't want children" },
      { id: 'have',    emoji: '👨‍👩‍👧', label: 'Already have children' },
    ],
  },
  {
    id: 'q10',
    text: 'What does your ideal relationship look like in 5 years?',
    options: [
      { id: 'married',  emoji: '💍', label: 'Married or engaged' },
      { id: 'together', emoji: '🏠', label: 'Living together' },
      { id: 'growing',  emoji: '🌱', label: 'Still growing together' },
      { id: 'open',     emoji: '🌊', label: 'Going with the flow' },
    ],
  },
];

const IMPORTANCE_OPTIONS = [
  { id: 'not',      label: 'Not important' },
  { id: 'somewhat', label: 'Somewhat' },
  { id: 'very',     label: 'Very important' },
] as const;

type ImportanceLevel = (typeof IMPORTANCE_OPTIONS)[number]['id'];

// ── Types ─────────────────────────────────────────────────────────────────────

interface Answer {
  questionId: string;
  answerId: string;
  importance: ImportanceLevel;
}

export interface OnboardingStep6Data {
  answers: Answer[];
}

interface Props {
  onBack: () => void;
  onFinish: (data: OnboardingStep6Data) => void;
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function OnboardingStep6Screen({ onBack, onFinish }: Props) {
  const insets = useSafeAreaInsets();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Per-question state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedImportance, setSelectedImportance] = useState<ImportanceLevel | null>(null);

  // Animations
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardTranslateX = useRef(new Animated.Value(0)).current;
  const importanceSlide = useRef(new Animated.Value(0)).current; // 0=hidden, 1=visible

  const question = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;
  const canAdvance = selectedAnswer !== null && selectedImportance !== null;

  // Show importance panel when answer is selected
  const handleSelectAnswer = useCallback((answerId: string) => {
    setSelectedAnswer(answerId);
    setSelectedImportance(null);
    Animated.spring(importanceSlide, {
      toValue: 1,
      tension: 80,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [importanceSlide]);

  const handleSelectImportance = useCallback((level: ImportanceLevel) => {
    setSelectedImportance(level);
  }, []);

  // Transition to next question
  const advanceQuestion = useCallback(() => {
    if (!selectedAnswer || !selectedImportance) return;

    const newAnswer: Answer = {
      questionId: question.id,
      answerId: selectedAnswer,
      importance: selectedImportance,
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (isLast) {
      onFinish({ answers: updatedAnswers });
      return;
    }

    // Slide out left, reset, slide in from right
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(cardTranslateX, { toValue: -rw(20), duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setSelectedImportance(null);
      importanceSlide.setValue(0);
      cardTranslateX.setValue(rw(20));
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(cardTranslateX, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  }, [selectedAnswer, selectedImportance, question, answers, isLast, onFinish,
      cardOpacity, cardTranslateX, importanceSlide]);

  const handleSkip = useCallback(() => {
    if (isLast) {
      onFinish({ answers });
      return;
    }
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(cardTranslateX, { toValue: -rw(20), duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setSelectedImportance(null);
      importanceSlide.setValue(0);
      cardTranslateX.setValue(rw(20));
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(cardTranslateX, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    });
  }, [isLast, answers, onFinish, cardOpacity, cardTranslateX, importanceSlide]);

  const handleBack = useCallback(() => {
    if (currentIndex === 0) {
      onBack();
      return;
    }
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(cardTranslateX, { toValue: rw(20), duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex((i) => i - 1);
      setSelectedAnswer(null);
      setSelectedImportance(null);
      importanceSlide.setValue(0);
      cardTranslateX.setValue(-rw(20));
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(cardTranslateX, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  }, [currentIndex, onBack, cardOpacity, cardTranslateX, importanceSlide]);

  const importanceTranslateY = importanceSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [rh(4), 0],
  });

  const importanceOpacity = importanceSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

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
          onPress={handleBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel={currentIndex === 0 ? 'Go back' : 'Previous question'}
          accessibilityRole="button"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aethel</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Progress bar — 100% full ────────────────────────────────────────── */}
      <View style={styles.progressTrack}>
        <LinearGradient
          colors={[colors.primary_container, colors.secondary_container]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.progressFull}
        />
      </View>

      {/* ── Scrollable content ─────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + rh(4) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tag + Headline */}
        <View style={styles.headingBlock}>
          <Text style={styles.tag}>ALMOST THERE 🎉</Text>
          <Text style={styles.headline}>Let's Find Your Match</Text>
          <Text style={styles.subheadline}>
            Answer a few questions to find your best matches.
          </Text>
        </View>

        {/* ── Question card ───────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ translateX: cardTranslateX }],
            },
          ]}
        >
          {/* Question text */}
          <Text style={styles.questionText}>{question.text}</Text>

          {/* Answer options */}
          <View style={styles.optionsList}>
            {question.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.optionBtn,
                    isSelected && styles.optionBtnSelected,
                  ]}
                  onPress={() => handleSelectAnswer(opt.id)}
                  activeOpacity={0.75}
                  accessibilityLabel={opt.label}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <Text style={styles.optionCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Skip */}
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSkip}
            accessibilityLabel="Skip this question"
            accessibilityRole="button"
          >
            <Text style={styles.skipText}>⏭ Skip this one</Text>
          </TouchableOpacity>

          {/* ── Importance rating — slides up after answer ──────────────── */}
          {selectedAnswer !== null && (
            <Animated.View
              style={[
                styles.importanceBlock,
                {
                  opacity: importanceOpacity,
                  transform: [{ translateY: importanceTranslateY }],
                },
              ]}
            >
              <Text style={styles.importanceLabel}>
                How important is this in a partner?
              </Text>
              <View style={styles.importanceChips}>
                {IMPORTANCE_OPTIONS.map((opt) => {
                  const isSelected = selectedImportance === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.importanceChip,
                        isSelected && styles.importanceChipSelected,
                      ]}
                      onPress={() => handleSelectImportance(opt.id as ImportanceLevel)}
                      activeOpacity={0.75}
                      accessibilityLabel={opt.label}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.importanceChipText,
                          isSelected && styles.importanceChipTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          )}
        </Animated.View>

        {/* ── Progress dots + counter ─────────────────────────────────────── */}
        <View style={styles.progressSection}>
          <Text style={styles.questionCounter}>
            Question {currentIndex + 1} of {QUESTIONS.length}
          </Text>
          <View style={styles.dotsRow}>
            {QUESTIONS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i <= currentIndex ? styles.dotFilled : styles.dotEmpty,
                ]}
              />
            ))}
          </View>
        </View>

        {/* ── Finish button — only on last question ──────────────────────── */}
        {isLast && (
          <TouchableOpacity
            style={[
              styles.finishBtn,
              !canAdvance && styles.finishBtnDisabled,
            ]}
            onPress={advanceQuestion}
            disabled={!canAdvance}
            activeOpacity={0.85}
            accessibilityLabel="Finish and find matches"
            accessibilityRole="button"
          >
            <Text style={styles.finishBtnText}>Finish & Find Matches →</Text>
          </TouchableOpacity>
        )}

        {/* Next button — all questions except last */}
        {!isLast && canAdvance && (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={advanceQuestion}
            activeOpacity={0.85}
            accessibilityLabel="Next question"
            accessibilityRole="button"
          >
            <Text style={styles.nextBtnText}>Next →</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

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

  // Progress bar — 100% full
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: colors.surface_container,
    overflow: 'hidden',
  },

  progressFull: {
    height: '100%',
    width: '100%',
    borderRadius: 9999,
  },

  scroll: {
    paddingHorizontal: rw(6.2),
    paddingTop: rh(3.6),
  },

  // Tag + Headline — asymmetric right margin
  headingBlock: {
    marginBottom: rh(3.6),
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

  // Question card — surface_container bg, 20px radius, no border
  card: {
    backgroundColor: colors.surface_container,
    borderRadius: rw(5.1),   // 20px / 390 * 100
    padding: rw(6.2),        // 24px
    marginBottom: rh(3.6),
    ...Platform.select({
      ios: {
        shadowColor: colors.surface_container_lowest,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 40,
      },
      android: { elevation: 4 },
    }),
  },

  // Question text — Noto Serif, title-lg weight
  questionText: {
    fontFamily: 'NotoSerif',
    fontSize: rf(2.6),   // title-lg ~22px
    fontWeight: '600',
    color: colors.on_surface,
    letterSpacing: -0.3,
    lineHeight: rf(3.6),
    marginBottom: rh(2.8),
  },

  // Answer options list
  optionsList: {
    gap: rh(1.2),
    marginBottom: rh(1.9),
  },

  optionBtn: {
    height: rh(6.2),   // 52px
    backgroundColor: colors.surface_container_high,
    borderRadius: rw(3.1),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rw(4.1),
    gap: rw(3.1),
  },

  optionBtnSelected: {
    backgroundColor: colors.primary_container,
  },

  optionEmoji: {
    fontSize: rf(2.1),
    width: rw(6.2),
    textAlign: 'center',
  },

  optionText: {
    ...typography['body-lg'],
    color: colors.on_surface,
    flex: 1,
  },

  optionTextSelected: {
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  optionCheck: {
    ...typography['label-lg'],
    color: colors.on_surface,
  },

  // Skip button — tertiary text link
  skipBtn: {
    alignSelf: 'center',
    paddingVertical: rh(1.2),
    marginBottom: rh(0.9),
  },

  skipText: {
    ...typography['label-lg'],
    color: colors.tertiary,
    opacity: 0.7,
  },

  // Importance rating — slides up after answer
  importanceBlock: {
    borderTopWidth: 1,
    borderTopColor: `${colors.on_surface}0D`,   // 5% opacity
    paddingTop: rh(1.9),
    marginTop: rh(0.9),
  },

  importanceLabel: {
    ...typography['label-md'],
    color: colors.tertiary,
    textAlign: 'center',
    marginBottom: rh(1.4),
  },

  importanceChips: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: rw(2.1),
    flexWrap: 'wrap',
  },

  importanceChip: {
    height: rh(4.3),
    paddingHorizontal: rw(3.6),
    borderRadius: 9999,
    backgroundColor: colors.surface_container_high,
    alignItems: 'center',
    justifyContent: 'center',
  },

  importanceChipSelected: {
    backgroundColor: colors.primary_container,
  },

  importanceChipText: {
    ...typography['label-md'],
    color: `${colors.on_surface}CC`,
  },

  importanceChipTextSelected: {
    color: colors.on_surface,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },

  // Progress dots + counter
  progressSection: {
    alignItems: 'center',
    marginBottom: rh(3.6),
    gap: rh(1.2),
  },

  questionCounter: {
    ...typography['label-sm'],
    color: `${colors.on_surface}80`,
  },

  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rw(1.5),   // 6px
  },

  dot: {
    borderRadius: 9999,
  },

  dotFilled: {
    width: rw(2.6),    // 10px
    height: rw(2.6),
    backgroundColor: colors.secondary_container,
  },

  dotEmpty: {
    width: rw(2.1),    // 8px
    height: rw(2.1),
    backgroundColor: `${colors.on_surface}40`,   // 25% opacity
  },

  // Next button — shown when answer + importance selected (non-last questions)
  nextBtn: {
    height: rh(6.6),
    backgroundColor: colors.secondary_container,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(2.4),
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

  nextBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },

  // Finish button — only on last question
  finishBtn: {
    height: rh(6.6),
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(2.4),
    overflow: 'hidden',
    backgroundColor: colors.secondary_container,
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

  finishBtnDisabled: {
    backgroundColor: colors.surface_container,
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
    }),
  },

  finishBtnText: {
    ...typography['title-md'],
    color: colors.on_secondary,
    letterSpacing: 1,
  },
});
