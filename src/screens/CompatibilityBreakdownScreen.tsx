import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const BREAKDOWN = [
  { label: 'Lifestyle',    pct: 88 },
  { label: 'Values',       pct: 95 },
  { label: 'Personality',  pct: 90 },
  { label: 'Rel. Goals',   pct: 85 },
  { label: 'Interests',    pct: 92 },
];

const SHARED_INTERESTS = ['\u{1F3AE} Gaming', '\u{1F3B5} Music', '\u{1F4DA} Books', '\u2708\uFE0F Travel', '\u{1F355} Food'];

const QA_COMPARE = [
  { q: 'Morning or night owl?',  mine: 'Night Owl \u{1F319}', theirs: 'Night Owl \u{1F319}', match: true },
  { q: 'Political views?',       mine: 'Liberal',              theirs: 'Conservative',         match: false },
  { q: 'Want kids someday?',     mine: 'Yes',                  theirs: 'Yes',                  match: true },
  { q: 'Introvert or extrovert?', mine: 'Ambivert',            theirs: 'Extrovert',            match: true },
];

interface Props {
  onBack: () => void;
  onSeeAll: () => void;
}

export default function CompatibilityBreakdownScreen({ onBack, onSeeAll }: Props) {
  const insets = useSafeAreaInsets();
  const CIRCLE = rw(18.5); // ~72px

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compatibility</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Profile photos */}
        <View style={styles.photosRow}>
          <View style={styles.photoItem}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }} style={[styles.photo, { width: CIRCLE, height: CIRCLE, borderRadius: CIRCLE / 2 }]} />
            <Text style={styles.photoLabel}>You</Text>
          </View>
          <Text style={styles.heartIcon}>\u2764\uFE0F</Text>
          <View style={styles.photoItem}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }} style={[styles.photo, { width: CIRCLE, height: CIRCLE, borderRadius: CIRCLE / 2 }]} />
            <Text style={styles.photoLabel}>Sarah</Text>
          </View>
        </View>

        {/* Overall score */}
        <View style={styles.overallRow}>
          <View style={styles.overallTrack}>
            <LinearGradient colors={[colors.primary_container, colors.secondary_container]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.overallFill, { width: '92%' }]} />
          </View>
          <Text style={styles.overallPct}>92%</Text>
        </View>
        <Text style={styles.overallLabel}>OVERALL COMPATIBILITY</Text>

        {/* Score breakdown */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>SCORE BREAKDOWN</Text>
        <View style={styles.breakdownCard}>
          {BREAKDOWN.map((item, i) => (
            <View key={item.label} style={[styles.breakdownRow, i < BREAKDOWN.length - 1 && styles.breakdownDivider]}>
              <Text style={styles.breakdownLabel}>{item.label}</Text>
              <View style={styles.breakdownBarWrapper}>
                <View style={styles.breakdownTrack}>
                  <LinearGradient colors={[colors.primary_container, colors.secondary_container]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.breakdownFill, { width: `${item.pct}%` }]} />
                </View>
              </View>
              <Text style={styles.breakdownPct}>{item.pct}%</Text>
            </View>
          ))}
        </View>

        {/* Shared interests */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>SHARED INTERESTS</Text>
        <View style={styles.chipsWrap}>
          {SHARED_INTERESTS.map(i => (
            <View key={i} style={styles.sharedChip}>
              <Text style={styles.sharedChipText}>{i}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sharedCount}>{SHARED_INTERESTS.length} interests in common</Text>

        {/* Q&A comparison */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>Q&A COMPARISON</Text>
        <View style={styles.qaList}>
          {QA_COMPARE.map((q, i) => (
            <View key={i} style={styles.qaCard}>
              <View style={styles.qaHeader}>
                <Text style={styles.qaMatchIcon}>{q.match ? '\u2705' : '\u274C'}</Text>
                <Text style={styles.qaQuestion}>{q.q}</Text>
              </View>
              <View style={styles.qaAnswers}>
                <View style={styles.qaAnswerCol}>
                  <Text style={styles.qaWho}>You</Text>
                  <Text style={styles.qaAnswer}>{q.mine}</Text>
                </View>
                <View style={styles.qaAnswerCol}>
                  <Text style={styles.qaWho}>Sarah</Text>
                  <Text style={styles.qaAnswer}>{q.theirs}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.seeAllBtn} onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See All 47 Comparisons</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  scroll: { paddingHorizontal: rw(6.2) },
  photosRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: rw(5.1), marginBottom: rh(2.4) },
  photoItem: { alignItems: 'center', gap: rh(0.7) },
  photo: { borderWidth: 2, borderColor: colors.primary_container, backgroundColor: colors.surface_container_high },
  photoLabel: { ...typography['label-sm'], color: `${colors.on_surface}99` },
  heartIcon: { fontSize: rf(2.8) },
  overallRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1), marginBottom: rh(0.7) },
  overallTrack: { flex: 1, height: 12, backgroundColor: colors.surface_container, borderRadius: 9999, overflow: 'hidden' },
  overallFill: { height: '100%', borderRadius: 9999 },
  overallPct: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.secondary_container, width: rw(12.8), textAlign: 'right' },
  overallLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.5) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  breakdownCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(4.1), gap: rh(1.2) },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1), paddingVertical: rh(0.5) },
  breakdownDivider: { borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D`, paddingBottom: rh(1.2) },
  breakdownLabel: { ...typography['label-md'], color: colors.on_surface, width: rw(23.1) },
  breakdownBarWrapper: { flex: 1 },
  breakdownTrack: { height: 6, backgroundColor: colors.surface_container_lowest, borderRadius: 9999, overflow: 'hidden' },
  breakdownFill: { height: '100%', borderRadius: 9999 },
  breakdownPct: { ...typography['label-md'], color: colors.secondary_container, width: rw(10.3), textAlign: 'right' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1), marginBottom: rh(0.9) },
  sharedChip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  sharedChipText: { ...typography['label-md'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  sharedCount: { ...typography['label-sm'], color: colors.emerald, marginBottom: rh(0.5) },
  qaList: { gap: rh(1.2) },
  qaCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(1.2) },
  qaHeader: { flexDirection: 'row', alignItems: 'center', gap: rw(2.6) },
  qaMatchIcon: { fontSize: rf(1.9) },
  qaQuestion: { ...typography['label-md'], color: colors.tertiary, flex: 1 },
  qaAnswers: { flexDirection: 'row', gap: rw(4.1) },
  qaAnswerCol: { flex: 1 },
  qaWho: { ...typography['label-sm'], color: `${colors.on_surface}66`, marginBottom: rh(0.3) },
  qaAnswer: { ...typography['body-md'], color: colors.on_surface },
  seeAllBtn: { alignItems: 'center', paddingVertical: rh(2.4) },
  seeAllText: { ...typography['label-md'], color: colors.tertiary },
});
