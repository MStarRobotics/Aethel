import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Icebreaker { id: string; signal: string; question: string; }

const ICEBREAKERS: Icebreaker[] = [
  { id: '1', signal: '\u{1F319} You\'re both night owls',    question: 'Do you have a go-to late-night activity?' },
  { id: '2', signal: '\u{1F3AE} Both love gaming',           question: 'What\'s the last game that kept you up all night?' },
  { id: '3', signal: '\u{1F4DA} You both love books',        question: 'What\'s a book you\'d recommend to anyone?' },
];

interface Props {
  onBack: () => void;
  onUseOpener: (question: string) => void;
  onWriteOwn: () => void;
  onAnswerQuestions: () => void;
}

export default function IcebreakerScreen({ onBack, onUseOpener, onWriteOwn, onAnswerQuestions }: Props) {
  const insets = useSafeAreaInsets();
  const PHOTO_SIZE = rw(12.3);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.tag}>START THE CONVERSATION</Text>
        <Text style={styles.headline}>Break the Ice with Sarah \u{1F9CA}</Text>

        {/* Match context */}
        <View style={styles.matchCard}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }} style={[styles.matchPhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
          <View>
            <Text style={styles.matchName}>Sarah, 26</Text>
            <Text style={styles.matchCompat}>92% Compatible</Text>
            <Text style={styles.matchShared}>3 shared interests</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>BASED ON YOUR SHARED ANSWERS</Text>

        {ICEBREAKERS.map(item => (
          <View key={item.id} style={styles.icebreakerCard}>
            <Text style={styles.signal}>{item.signal}</Text>
            <Text style={styles.question}>"{item.question}"</Text>
            <TouchableOpacity style={styles.useBtn} onPress={() => onUseOpener(item.question)} activeOpacity={0.85}>
              <Text style={styles.useBtnText}>Use This Opener</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.showMoreLink}>
          <Text style={styles.showMoreText}>\u{1F504} Show More Suggestions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostBtn} onPress={onWriteOwn} activeOpacity={0.8}>
          <Text style={styles.ghostBtnText}>\u270F\uFE0F  Write My Own Message</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  scroll: { paddingHorizontal: rw(6.2) },
  tag: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.7) },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, marginBottom: rh(2.4) },
  matchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(2.8) },
  matchPhoto: { borderWidth: 2, borderColor: colors.primary_container, backgroundColor: colors.surface_container_high },
  matchName: { ...typography['title-md'], color: colors.on_surface },
  matchCompat: { ...typography['label-sm'], color: colors.emerald },
  matchShared: { ...typography['label-sm'], color: colors.tertiary },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  icebreakerCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(4.1), gap: rh(1.2), marginBottom: rh(1.4) },
  signal: { ...typography['label-md'], color: colors.secondary_container },
  question: { fontFamily: 'NotoSerif', fontSize: rf(1.9), color: colors.on_surface, lineHeight: rh(3.1) },
  useBtn: { height: rh(5.2), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8 }, android: { elevation: 4 } }) },
  useBtnText: { ...typography['label-lg'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  showMoreLink: { alignItems: 'center', paddingVertical: rh(1.9) },
  showMoreText: { ...typography['label-md'], color: colors.tertiary },
  ghostBtn: { height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  ghostBtnText: { ...typography['label-lg'], color: colors.primary },
});
