import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, Animated, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import TabBar, { TabName } from '../components/TabBar';

// Design canvas: 390 x 844

const TOTAL_QUESTIONS = 200;
const ANSWERED = 47;

const CATEGORIES = ['All', 'Lifestyle', 'Values', 'Personality', 'Fun', 'Serious', 'Answered'];

const IMPORTANCE_OPTIONS = [
  { id: 'not',      label: 'Not important' },
  { id: 'somewhat', label: 'Somewhat' },
  { id: 'very',     label: 'Very important' },
] as const;
type Importance = (typeof IMPORTANCE_OPTIONS)[number]['id'];

interface Question {
  id: string;
  category: string;
  text: string;
  options: { id: string; emoji: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'q1', category: 'Lifestyle',
    text: 'Are you a morning person or night owl?',
    options: [
      { id: 'morning', emoji: '\u{1F305}', label: 'Morning Person' },
      { id: 'night',   emoji: '\u{1F319}', label: 'Night Owl' },
      { id: 'neither', emoji: '\u{1F610}', label: 'Neither' },
    ],
  },
  {
    id: 'q2', category: 'Values',
    text: 'How do you feel about spontaneous plans?',
    options: [
      { id: 'love',    emoji: '\u{1F929}', label: 'Love them!' },
      { id: 'depends', emoji: '\u{1F914}', label: 'Depends on mood' },
      { id: 'prefer',  emoji: '\u{1F4C5}', label: 'Prefer planning ahead' },
    ],
  },
  {
    id: 'q3', category: 'Personality',
    text: 'How do you recharge after a long week?',
    options: [
      { id: 'solo',    emoji: '\u{1F4DA}', label: 'Solo time at home' },
      { id: 'friends', emoji: '\u{1F37B}', label: 'Out with friends' },
      { id: 'mix',     emoji: '\u{2696}',  label: 'Mix of both' },
    ],
  },
  {
    id: 'q4', category: 'Fun',
    text: 'Pick your ideal weekend activity:',
    options: [
      { id: 'hike',   emoji: '\u{1F9D7}', label: 'Hiking in nature' },
      { id: 'museum', emoji: '\u{1F3DB}', label: 'Museum or gallery' },
      { id: 'cook',   emoji: '\u{1F373}', label: 'Cooking at home' },
      { id: 'party',  emoji: '\u{1F389}', label: 'Party or event' },
    ],
  },
  {
    id: 'q5', category: 'Serious',
    text: 'How important is financial stability to you in a partner?',
    options: [
      { id: 'very',     emoji: '\u{1F4B0}', label: 'Very important' },
      { id: 'somewhat', emoji: '\u{1F44C}', label: 'Somewhat important' },
      { id: 'not',      emoji: '\u{1F49C}', label: 'Not a priority' },
    ],
  },
];

interface Answer { questionId: string; answerId: string; importance: Importance; }

interface Props {
  onSettings: () => void;
  onTabPress: (tab: TabName) => void;
  activeTab?: TabName;
}

export default function QAScreen({ onSettings, onTabPress, activeTab = 'qa' }: Props) {
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedImportance, setSelectedImportance] = useState<Importance | null>(null);

  const importanceSlide = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardTranslateX = useRef(new Animated.Value(0)).current;

  const filtered = category === 'All'
    ? QUESTIONS
    : QUESTIONS.filter(q => q.category === category);

  const question = filtered[currentIndex] ?? filtered[0];
  const canAdvance = selectedAnswer !== null && selectedImportance !== null;
  const progress = ANSWERED / TOTAL_QUESTIONS;

  const handleSelectAnswer = useCallback((id: string) => {
    setSelectedAnswer(id);
    setSelectedImportance(null);
    Animated.spring(importanceSlide, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }).start();
  }, [importanceSlide]);

  const transition = useCallback((dir: 'next' | 'prev') => {
    const toX = dir === 'next' ? -rw(20) : rw(20);
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(cardTranslateX, { toValue: toX, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setCurrentIndex(i => {
        const next = dir === 'next' ? Math.min(i + 1, filtered.length - 1) : Math.max(i - 1, 0);
        return next;
      });
      setSelectedAnswer(null);
      setSelectedImportance(null);
      importanceSlide.setValue(0);
      cardTranslateX.setValue(dir === 'next' ? rw(20) : -rw(20));
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(cardTranslateX, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  }, [filtered.length, cardOpacity, cardTranslateX, importanceSlide]);

  const handleNext = useCallback(() => {
    if (canAdvance && question) {
      setAnswers(prev => [...prev, { questionId: question.id, answerId: selectedAnswer!, importance: selectedImportance! }]);
    }
    transition('next');
  }, [canAdvance, question, selectedAnswer, selectedImportance, transition]);

  const handleSkip = useCallback(() => transition('next'), [transition]);
  const handlePrev = useCallback(() => transition('prev'), [transition]);

  const importanceTranslateY = importanceSlide.interpolate({ inputRange: [0, 1], outputRange: [rh(4), 0] });
  const importanceOpacity = importanceSlide.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Q&A</Text>
        <TouchableOpacity onPress={onSettings} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.headerIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(12) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>{ANSWERED} Questions Answered</Text>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[colors.primary_container, colors.secondary_container]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <Text style={styles.progressSub}>{ANSWERED} / {TOTAL_QUESTIONS} — keep going for better matches!</Text>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          style={styles.chipsScroll}
        >
          {CATEGORIES.map(cat => {
            const isActive = cat === category;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => { setCategory(cat); setCurrentIndex(0); setSelectedAnswer(null); setSelectedImportance(null); importanceSlide.setValue(0); }}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Question card */}
        {question && (
          <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ translateX: cardTranslateX }] }]}>
            <Text style={styles.questionText}>{question.text}</Text>

            <View style={styles.optionsList}>
              {question.options.map(opt => {
                const isSel = selectedAnswer === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionBtn, isSel && styles.optionBtnSelected]}
                    onPress={() => handleSelectAnswer(opt.id)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                    <Text style={[styles.optionText, isSel && styles.optionTextSelected]}>{opt.label}</Text>
                    {isSel && <Text style={styles.optionCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipText}>⏭ Skip this one</Text>
            </TouchableOpacity>

            {selectedAnswer !== null && (
              <Animated.View style={[styles.importanceBlock, { opacity: importanceOpacity, transform: [{ translateY: importanceTranslateY }] }]}>
                <Text style={styles.importanceLabel}>HOW IMPORTANT IS THIS IN A PARTNER?</Text>
                <View style={styles.importanceChips}>
                  {IMPORTANCE_OPTIONS.map(opt => {
                    const isSel = selectedImportance === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[styles.importanceChip, isSel && styles.importanceChipSelected]}
                        onPress={() => setSelectedImportance(opt.id as Importance)}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.importanceChipText, isSel && styles.importanceChipTextSelected]}>{opt.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* Prev / Skip / Next nav */}
        <View style={styles.navRow}>
          <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0} style={styles.navBtn}>
            <Text style={[styles.navText, currentIndex === 0 && styles.navTextDisabled]}>← Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkip} style={styles.navBtn}>
            <Text style={styles.navText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.navBtn}>
            <Text style={[styles.navText, !canAdvance && styles.navTextMuted]}>Next →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TabBar active={activeTab} onPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  headerIcon: { fontSize: rf(2.4), opacity: 0.7 },
  scroll: { paddingHorizontal: rw(6.2), paddingTop: rh(1.4) },

  progressCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), marginBottom: rh(2.4), ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 24 }, android: { elevation: 4 } }) },
  progressTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(1.4) },
  progressTrack: { width: '100%', height: 6, backgroundColor: colors.surface_container_lowest, borderRadius: 9999, overflow: 'hidden', marginBottom: rh(0.9) },
  progressFill: { height: '100%', borderRadius: 9999 },
  progressSub: { ...typography['body-md'], color: `${colors.on_surface}99` },

  chipsScroll: { flexGrow: 0, marginBottom: rh(2.4) },
  chipsRow: { gap: rw(2.1), paddingVertical: rh(0.5) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },

  card: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(6.2), marginBottom: rh(2.4), ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 24 }, android: { elevation: 4 } }) },
  questionText: { fontFamily: 'NotoSerif', fontSize: rf(2.6), fontWeight: '600', color: colors.on_surface, letterSpacing: -0.3, lineHeight: rf(3.6), marginBottom: rh(2.8), textAlign: 'center' },

  optionsList: { gap: rh(1.2), marginBottom: rh(1.9) },
  optionBtn: { height: rh(6.2), backgroundColor: colors.surface_container_high, borderRadius: rw(3.1), flexDirection: 'row', alignItems: 'center', paddingHorizontal: rw(4.1), gap: rw(3.1) },
  optionBtnSelected: { backgroundColor: colors.primary_container },
  optionEmoji: { fontSize: rf(2.1), width: rw(6.2), textAlign: 'center' },
  optionText: { ...typography['body-lg'], color: colors.on_surface, flex: 1 },
  optionTextSelected: { fontFamily: 'PlusJakartaSans-SemiBold' },
  optionCheck: { ...typography['label-lg'], color: colors.on_surface },

  skipBtn: { alignSelf: 'center', paddingVertical: rh(1.2), marginBottom: rh(0.9) },
  skipText: { ...typography['label-lg'], color: colors.tertiary, opacity: 0.7 },

  importanceBlock: { borderTopWidth: 1, borderTopColor: `${colors.on_surface}0D`, paddingTop: rh(1.9), marginTop: rh(0.9) },
  importanceLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center', marginBottom: rh(1.4) },
  importanceChips: { flexDirection: 'row', justifyContent: 'center', gap: rw(2.1), flexWrap: 'wrap' },
  importanceChip: { height: rh(3.8), paddingHorizontal: rw(3.6), borderRadius: 9999, backgroundColor: colors.surface_container_high, alignItems: 'center', justifyContent: 'center' },
  importanceChipSelected: { backgroundColor: colors.primary_container },
  importanceChipText: { ...typography['label-md'], color: `${colors.on_surface}CC` },
  importanceChipTextSelected: { color: colors.on_surface, fontFamily: 'PlusJakartaSans-SemiBold' },

  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: rw(2.1), marginBottom: rh(2.4) },
  navBtn: { paddingVertical: rh(1.2), paddingHorizontal: rw(2.1) },
  navText: { ...typography['label-lg'], color: colors.tertiary },
  navTextDisabled: { opacity: 0.3 },
  navTextMuted: { opacity: 0.5 },
});
