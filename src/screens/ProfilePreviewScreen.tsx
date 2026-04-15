import React from 'react';
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

const PHOTO_H = rh(35.5);
const INTERESTS = ['\u{1F3AE} Gaming', '\u{1F3B5} Music', '\u{1F4DA} Books', '\u{1F355} Food', '\u2708\uFE0F Travel'];
const DETAILS = [
  { icon: '\u{1F4CF}', label: '5\'6"' }, { icon: '\u{1F393}', label: 'Bachelor\'s' },
  { icon: '\u{1F4BC}', label: 'Software Engineer' }, { icon: '\u{1F377}', label: 'Drinks socially' },
];
const QA = [
  { q: 'Morning or night owl?', a: 'Night Owl \u{1F319}' },
  { q: 'Introvert or extrovert?', a: 'Ambivert \u{1F60A}' },
];

interface Props { onBack: () => void; onEdit: () => void; }

export default function ProfilePreviewScreen({ onBack, onEdit }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />
      {/* Preview banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>\u{1F441}\uFE0F  PREVIEW MODE  \u2014  This is how others see your profile</Text>
      </View>
      {/* Back */}
      <TouchableOpacity style={[styles.backBtn, { top: insets.top + rh(8) }]} onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Text style={styles.backText}>\u2190 Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
        {/* Photo */}
        <View style={styles.photoWrapper}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }} style={styles.photo} resizeMode="cover" />
          <LinearGradient colors={['transparent', colors.surface_container_lowest]} style={styles.photoGrad} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} pointerEvents="none" />
          <View style={styles.dots}>{[0,1,2,3,4].map(i => <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />)}</View>
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>Sarah, 26  \u2705</Text>
          <Text style={styles.location}>\u{1F4CD} New York, NY</Text>
          {/* Compat bar */}
          <View style={styles.compatWrapper}>
            <View style={styles.compatTrack}>
              <LinearGradient colors={[colors.primary_container, colors.secondary_container]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.compatFill, { width: '92%' }]} />
            </View>
            <View style={styles.compatRow}>
              <Text style={styles.compatLabel}>Compatibility Score</Text>
              <Text style={styles.compatPct}>92%</Text>
            </View>
          </View>
          {/* About */}
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <Text style={styles.bioText}>Coffee addict, book lover, and midnight adventurer. Looking for someone who can quote Oscar Wilde.</Text>
          {/* Interests */}
          <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>INTERESTS</Text>
          <View style={styles.chipsWrap}>{INTERESTS.map(i => <View key={i} style={styles.chip}><Text style={styles.chipText}>{i}</Text></View>)}</View>
          {/* Details */}
          <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>DETAILS</Text>
          <View style={styles.detailsGrid}>{DETAILS.map((d, i) => <View key={i} style={styles.detailRow}><Text style={styles.detailIcon}>{d.icon}</Text><Text style={styles.detailLabel}>{d.label}</Text></View>)}</View>
          {/* Q&A */}
          <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>Q&A ANSWERS</Text>
          {QA.map((q, i) => (
            <View key={i} style={styles.qaCard}>
              <Text style={styles.qaQ}>{q.q}</Text>
              <Text style={styles.qaA}>{q.a}</Text>
            </View>
          ))}
          {/* Edit button */}
          <TouchableOpacity style={styles.editBtn} onPress={onEdit} activeOpacity={0.8}>
            <Text style={styles.editBtnText}>\u270F\uFE0F  Edit My Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  banner: { backgroundColor: colors.primary_container, height: rh(6.6), alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(6.2) },
  bannerText: { ...typography['label-sm'], color: colors.on_surface, textTransform: 'uppercase', letterSpacing: 1 },
  backBtn: { position: 'absolute', left: rw(6.2), zIndex: 10, padding: rw(2) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  scroll: {},
  photoWrapper: { width: '100%', height: PHOTO_H, position: 'relative' },
  photo: { width: '100%', height: PHOTO_H, backgroundColor: colors.surface_container_high },
  photoGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: PHOTO_H * 0.5 },
  dots: { position: 'absolute', bottom: rh(1.4), alignSelf: 'center', flexDirection: 'row', gap: rw(1.5) },
  dot: { width: rw(2.1), height: rw(2.1), borderRadius: rw(1), backgroundColor: `${colors.on_surface}40` },
  dotActive: { width: rw(2.6), height: rw(2.6), backgroundColor: colors.secondary_container },
  content: { paddingHorizontal: rw(6.2), paddingTop: rh(2.4) },
  name: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(0.5) },
  location: { ...typography['label-md'], color: colors.tertiary, marginBottom: rh(2.4) },
  compatWrapper: { marginBottom: rh(2.8) },
  compatTrack: { width: '100%', height: 8, backgroundColor: colors.surface_container, borderRadius: 9999, overflow: 'hidden', marginBottom: rh(0.7) },
  compatFill: { height: '100%', borderRadius: 9999 },
  compatRow: { flexDirection: 'row', justifyContent: 'space-between' },
  compatLabel: { ...typography['label-sm'], color: `${colors.on_surface}80` },
  compatPct: { ...typography['label-md'], color: colors.secondary_container },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  bioText: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rh(1.2) },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: rw(2.1), width: '48%' },
  detailIcon: { fontSize: rf(1.9) },
  detailLabel: { ...typography['label-md'], color: `${colors.on_surface}CC` },
  qaCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), marginBottom: rh(1.2) },
  qaQ: { ...typography['label-md'], color: colors.tertiary, marginBottom: rh(0.5) },
  qaA: { ...typography['body-md'], color: colors.on_surface },
  editBtn: { height: rh(6.2), borderRadius: rw(1.5), borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center', marginTop: rh(2.8) },
  editBtnText: { ...typography['label-lg'], color: colors.primary },
});
