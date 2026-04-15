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
import TabBar, { TabName } from '../components/TabBar';

const PHOTO_H = rh(35.5); // 300px / 844 * 100

const INTERESTS = ['\u{1F3AE} Gaming', '\u{1F3B5} Music', '\u{1F4DA} Books', '\u{1F355} Food', '\u2708\uFE0F Travel', '\u{1F3A8} Art'];

const PROMPTS = [
  { q: 'The most spontaneous thing I\'ve done is...', a: 'Booked a one-way ticket to Bali \u{1F334}' },
  { q: 'I\'ll know it\'s love when...', a: 'We can sit in silence and it still feels like home \u{1F3E1}' },
];

const DETAILS = [
  { icon: '\u{1F4CF}', label: '5\'6"' },
  { icon: '\u{1F393}', label: 'Bachelor\'s' },
  { icon: '\u{1F4BC}', label: 'Software Engineer' },
  { icon: '\u{1F377}', label: 'Drinks socially' },
  { icon: '\u{1F6AC}', label: 'Non-smoker' },
  { icon: '\u{1F476}', label: 'Wants kids someday' },
];

interface Props {
  onEdit: () => void;
  onSettings: () => void;
  onPreview: () => void;
  onShare: () => void;
  onEditSection: (section: string) => void;
  onTabPress: (tab: TabName) => void;
  activeTab?: TabName;
}

export default function MyProfileScreen({ onEdit, onSettings, onPreview, onShare, onEditSection, onTabPress, activeTab = 'profile' }: Props) {
  const insets = useSafeAreaInsets();
  const STRENGTH = 80;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.headerIcon}>\u270F\uFE0F</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettings} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.headerIcon}>\u2699\uFE0F</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(12) }]} showsVerticalScrollIndicator={false}>
        {/* Profile photo */}
        <View style={styles.photoWrapper}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }} style={styles.photo} resizeMode="cover" />
          <LinearGradient colors={['transparent', colors.surface_container_lowest]} style={styles.photoGradient} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} pointerEvents="none" />
          <View style={styles.photoDots}>
            {[0,1,2,3,4,5].map(i => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          {/* Name + location */}
          <Text style={styles.name}>Sarah Johnson, 26</Text>
          <Text style={styles.location}>\u{1F4CD} New York, NY</Text>
          <Text style={styles.verified}>\u2705 Verified</Text>

          {/* Profile strength card */}
          <View style={styles.strengthCard}>
            <View style={styles.strengthHeader}>
              <Text style={styles.strengthLabel}>PROFILE STRENGTH</Text>
              <Text style={styles.strengthPct}>{STRENGTH}%</Text>
            </View>
            <View style={styles.strengthTrack}>
              <LinearGradient colors={[colors.primary_container, colors.secondary_container]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.strengthFill, { width: `${STRENGTH}%` }]} />
            </View>
            <Text style={styles.strengthSub}>Add more to get better matches!</Text>
          </View>

          {/* About me */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>ABOUT ME</Text>
              <TouchableOpacity onPress={() => onEditSection('bio')}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
            </View>
            <Text style={styles.bioText}>Coffee addict, book lover, and midnight adventurer. Looking for someone who can quote Oscar Wilde and isn't afraid of spontaneous road trips \u{1F697}</Text>
          </View>

          {/* Prompts */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>PROMPTS</Text>
            </View>
            {PROMPTS.map((p, i) => (
              <View key={i} style={styles.promptCard}>
                <Text style={styles.promptQ}>{p.q}</Text>
                <Text style={styles.promptA}>{p.a}</Text>
              </View>
            ))}
            <TouchableOpacity onPress={() => onEditSection('prompts')}><Text style={styles.editLink}>Edit Prompts</Text></TouchableOpacity>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>INTERESTS</Text>
              <TouchableOpacity onPress={() => onEditSection('interests')}><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.chipsWrap}>
              {INTERESTS.map(i => (
                <View key={i} style={styles.interestChip}>
                  <Text style={styles.interestChipText}>{i}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>DETAILS</Text>
              <TouchableOpacity onPress={() => onEditSection('details')}><Text style={styles.editLink}>Edit Details</Text></TouchableOpacity>
            </View>
            <View style={styles.detailsGrid}>
              {DETAILS.map((d, i) => (
                <View key={i} style={styles.detailRow}>
                  <Text style={styles.detailIcon}>{d.icon}</Text>
                  <Text style={styles.detailLabel}>{d.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Q&A */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Q&A ANSWERS</Text>
            </View>
            <Text style={styles.qaCount}>47 questions answered</Text>
            <TouchableOpacity onPress={() => onEditSection('qa')}><Text style={styles.editLink}>View / Edit Answers</Text></TouchableOpacity>
          </View>

          {/* Action buttons */}
          <TouchableOpacity style={styles.ghostBtn} onPress={onPreview} activeOpacity={0.8}>
            <Text style={styles.ghostBtnText}>\u{1F441}\uFE0F  Preview My Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ghostBtn, { marginTop: rh(1.4) }]} onPress={onShare} activeOpacity={0.8}>
            <Text style={styles.ghostBtnText}>\u21D7  Share My Profile</Text>
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
  headerIcons: { flexDirection: 'row', gap: rw(3.6) },
  headerIcon: { fontSize: rf(2.4), opacity: 0.7 },
  scroll: {},
  photoWrapper: { width: '100%', height: PHOTO_H, position: 'relative' },
  photo: { width: '100%', height: PHOTO_H, backgroundColor: colors.surface_container_high },
  photoGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: PHOTO_H * 0.5 },
  photoDots: { position: 'absolute', bottom: rh(1.4), alignSelf: 'center', flexDirection: 'row', gap: rw(1.5) },
  dot: { width: rw(2.1), height: rw(2.1), borderRadius: rw(1), backgroundColor: `${colors.on_surface}40` },
  dotActive: { width: rw(2.6), height: rw(2.6), backgroundColor: colors.secondary_container },
  content: { paddingHorizontal: rw(6.2), paddingTop: rh(2.4) },
  name: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(0.5) },
  location: { ...typography['label-md'], color: colors.tertiary, marginBottom: rh(0.4) },
  verified: { ...typography['label-sm'], color: colors.emerald, marginBottom: rh(2.8) },
  strengthCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), marginBottom: rh(3.8), ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 20 }, android: { elevation: 3 } }) },
  strengthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rh(1.2) },
  strengthLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5 },
  strengthPct: { ...typography['label-lg'], color: colors.secondary_container },
  strengthTrack: { width: '100%', height: 6, backgroundColor: colors.surface_container_lowest, borderRadius: 9999, overflow: 'hidden', marginBottom: rh(0.9) },
  strengthFill: { height: '100%', borderRadius: 9999 },
  strengthSub: { ...typography['body-md'], color: `${colors.on_surface}99` },
  section: { marginBottom: rh(3.8) },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rh(1.4) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5 },
  editLink: { ...typography['label-md'], color: colors.tertiary },
  bioText: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  promptCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), marginBottom: rh(1.2) },
  promptQ: { ...typography['label-sm'], color: colors.tertiary, marginBottom: rh(0.7) },
  promptA: { fontFamily: 'NotoSerif', fontSize: rf(1.9), color: colors.on_surface, lineHeight: rf(2.8) },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  interestChip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  interestChipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rh(1.2) },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: rw(2.1), width: '48%' },
  detailIcon: { fontSize: rf(1.9) },
  detailLabel: { ...typography['label-md'], color: `${colors.on_surface}CC` },
  qaCount: { ...typography['body-md'], color: `${colors.on_surface}B3`, marginBottom: rh(0.7) },
  ghostBtn: { height: rh(6.2), borderRadius: rw(1.5), borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  ghostBtnText: { ...typography['label-lg'], color: colors.primary },
});
