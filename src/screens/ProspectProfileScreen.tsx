import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, StatusBar, Modal, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const PHOTO_H = rh(45);
const MY_INTERESTS = new Set(['\u{1F3AE} Gaming', '\u{1F3B5} Music', '\u{1F4DA} Books']);
const THEIR_INTERESTS = ['\u{1F3AE} Gaming', '\u{1F3B5} Music', '\u{1F4DA} Books', '\u{1F355} Food', '\u2708\uFE0F Travel'];
const DETAILS = [
  { icon: '\u{1F4CF}', label: '5\'6"' }, { icon: '\u{1F393}', label: 'Bachelor\'s' },
  { icon: '\u{1F4BC}', label: 'Software Engineer' }, { icon: '\u{1F377}', label: 'Drinks socially' },
  { icon: '\u{1F6AC}', label: 'Non-smoker' }, { icon: '\u{1F476}', label: 'Wants kids someday' },
];
const QA_COMPARE = [
  { q: 'Morning or night owl?', mine: 'Night Owl \u{1F319}', theirs: 'Night Owl \u{1F319}', match: true },
  { q: 'Introvert or extrovert?', mine: 'Introvert', theirs: 'Extrovert', match: false },
];
const WHY_COMPAT = [
  { text: 'Both night owls', match: true },
  { text: 'Both love gaming', match: true },
  { text: 'Similar values', match: true },
  { text: 'Different on politics', match: false },
];
const MORE_MENU = ['Report Profile', 'Block User', 'Share Profile Link', 'Unmatch'];

interface Props {
  onBack: () => void;
  onSkip: () => void;
  onLike: () => void;
  onMessage: () => void;
}

export default function ProspectProfileScreen({ onBack, onSkip, onLike, onMessage }: Props) {
  const insets = useSafeAreaInsets();
  const [showMore, setShowMore] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const sharedCount = THEIR_INTERESTS.filter(i => MY_INTERESTS.has(i)).length;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />
      {/* Floating header */}
      <View style={[styles.floatHeader, { top: insets.top + rh(1.2) }]}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowMore(true)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.moreText}>\u22EE More</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
        {/* Photo */}
        <View style={styles.photoWrapper}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }} style={styles.photo} resizeMode="cover" />
          <LinearGradient colors={['transparent', colors.surface_container_lowest]} style={styles.photoGrad} start={{ x: 0, y: 0.6 }} end={{ x: 0, y: 1 }} pointerEvents="none" />
          <View style={styles.dots}>{[0,1,2,3,4].map(i => <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />)}</View>
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>Sarah, 26  \u2705</Text>
          <Text style={styles.location}>\u{1F4CD} 2 km away \u00B7 New York, NY</Text>
          {/* Compat card */}
          <View style={styles.compatCard}>
            <View style={styles.compatTrack}>
              <LinearGradient colors={[colors.primary_container, colors.secondary_container]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.compatFill, { width: '92%' }]} />
            </View>
            <View style={styles.compatRow}>
              <View>
                <Text style={styles.compatLabel}>COMPATIBILITY MATCH</Text>
                <Text style={styles.compatPct}>92%</Text>
              </View>
              <TouchableOpacity onPress={() => setShowWhy(true)}>
                <Text style={styles.seeWhy}>See Why \u2192</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* About */}
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <Text style={styles.bioText}>Coffee addict, book lover, and midnight adventurer. Looking for someone who can quote Oscar Wilde and isn't afraid of spontaneous road trips.</Text>
          {/* Interests */}
          <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>INTERESTS</Text>
          <View style={styles.chipsWrap}>
            {THEIR_INTERESTS.map(i => {
              const shared = MY_INTERESTS.has(i);
              return <View key={i} style={[styles.chip, shared && styles.chipShared]}><Text style={[styles.chipText, shared && styles.chipTextShared]}>{i}</Text></View>;
            })}
          </View>
          {sharedCount > 0 && <Text style={styles.sharedCount}>{sharedCount} interests in common</Text>}
          {/* Details */}
          <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>DETAILS</Text>
          <View style={styles.detailsGrid}>{DETAILS.map((d, i) => <View key={i} style={styles.detailRow}><Text style={styles.detailIcon}>{d.icon}</Text><Text style={styles.detailLabel}>{d.label}</Text></View>)}</View>
          {/* Q&A */}
          <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>Q&A ANSWERS</Text>
          {QA_COMPARE.map((q, i) => (
            <View key={i} style={styles.qaCard}>
              <View style={styles.qaHeader}>
                <Text style={styles.qaMatch}>{q.match ? '\u2705' : '\u274C'}</Text>
                <Text style={styles.qaQ}>{q.q}</Text>
              </View>
              <Text style={styles.qaRow}><Text style={styles.qaLabel}>Sarah: </Text>{q.theirs}</Text>
              <Text style={styles.qaRow}><Text style={styles.qaLabel}>You: </Text>{q.mine}</Text>
            </View>
          ))}
          <TouchableOpacity><Text style={styles.seeAll}>See All 47 Answers</Text></TouchableOpacity>
          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.8}>
              <Text style={styles.skipBtnText}>\u2715 Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeBtn} onPress={onLike} activeOpacity={0.8}>
              <Text style={styles.likeBtnText}>\u2665 Like</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.messageBtn} onPress={onMessage} activeOpacity={0.85}>
            <Text style={styles.messageBtnText}>\u{1F4AC} Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* More menu */}
      <Modal visible={showMore} transparent animationType="slide" onRequestClose={() => setShowMore(false)}>
        <Pressable style={styles.sheetOverlay} onPress={() => setShowMore(false)}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + rh(2) }]}>
            <View style={styles.sheetHandle} />
            {MORE_MENU.map((item, i) => (
              <TouchableOpacity key={item} style={styles.sheetItem} onPress={() => setShowMore(false)}>
                <Text style={[styles.sheetItemText, item === 'Unmatch' && styles.sheetItemDestructive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
      {/* Why compatible modal */}
      <Modal visible={showWhy} transparent animationType="fade" onRequestClose={() => setShowWhy(false)}>
        <View style={styles.whyOverlay}>
          <View style={styles.whyCard}>
            <Text style={styles.whyTitle}>WHY 92% COMPATIBLE?</Text>
            {WHY_COMPAT.map((w, i) => (
              <View key={i} style={styles.whyRow}>
                <Text style={styles.whyIcon}>{w.match ? '\u2705' : '\u274C'}</Text>
                <Text style={styles.whyText}>{w.text}</Text>
              </View>
            ))}
            <TouchableOpacity onPress={() => setShowWhy(false)} style={styles.whyClose}>
              <Text style={styles.whyCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  floatHeader: { position: 'absolute', left: rw(6.2), right: rw(6.2), flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  backText: { ...typography['label-md'], color: colors.tertiary },
  moreText: { ...typography['label-md'], color: colors.tertiary },
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
  compatCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), marginBottom: rh(2.8) },
  compatTrack: { width: '100%', height: 8, backgroundColor: colors.surface_container_lowest, borderRadius: 9999, overflow: 'hidden', marginBottom: rh(1.2) },
  compatFill: { height: '100%', borderRadius: 9999 },
  compatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  compatLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5 },
  compatPct: { ...typography['headline-sm'], color: colors.secondary_container, fontFamily: 'NotoSerif' },
  seeWhy: { ...typography['label-md'], color: colors.tertiary },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  bioText: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipShared: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextShared: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  sharedCount: { ...typography['label-sm'], color: colors.emerald, marginTop: rh(0.9) },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rh(1.2) },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: rw(2.1), width: '48%' },
  detailIcon: { fontSize: rf(1.9) },
  detailLabel: { ...typography['label-md'], color: `${colors.on_surface}CC` },
  qaCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), marginBottom: rh(1.2) },
  qaHeader: { flexDirection: 'row', alignItems: 'center', gap: rw(2.1), marginBottom: rh(0.9) },
  qaMatch: { fontSize: rf(2.1) },
  qaQ: { ...typography['label-md'], color: colors.tertiary, flex: 1 },
  qaRow: { ...typography['body-md'], color: colors.on_surface, marginBottom: rh(0.3) },
  qaLabel: { color: colors.tertiary },
  seeAll: { ...typography['label-md'], color: colors.tertiary, marginBottom: rh(2.8) },
  actionRow: { flexDirection: 'row', gap: rw(3.1), marginBottom: rh(1.4) },
  skipBtn: { flex: 1, height: rh(6.6), backgroundColor: colors.surface_container_high, borderRadius: rw(1.5), alignItems: 'center', justifyContent: 'center' },
  skipBtnText: { ...typography['label-lg'], color: colors.on_surface },
  likeBtn: { flex: 1, height: rh(6.6), backgroundColor: colors.primary_container, borderRadius: rw(1.5), alignItems: 'center', justifyContent: 'center' },
  likeBtnText: { ...typography['label-lg'], color: '#FFFFFF' },
  messageBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12 }, android: { elevation: 6 } }) },
  messageBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface_container, borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), paddingHorizontal: rw(6.2) },
  sheetHandle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(1.9) },
  sheetItem: { paddingVertical: rh(1.9), borderBottomWidth: 1, borderBottomColor: `${colors.on_surface}0D` },
  sheetItemText: { ...typography['body-lg'], color: colors.on_surface },
  sheetItemDestructive: { color: colors.primary_container },
  whyOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.88)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(6.2) },
  whyCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(6.2), padding: rw(6.2) },
  whyTitle: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.9) },
  whyRow: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1), marginBottom: rh(1.2) },
  whyIcon: { fontSize: rf(2.1) },
  whyText: { ...typography['body-md'], color: colors.on_surface },
  whyClose: { alignSelf: 'center', paddingVertical: rh(1.4), marginTop: rh(0.9) },
  whyCloseText: { ...typography['label-md'], color: colors.tertiary },
});
