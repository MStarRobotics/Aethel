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

interface TopPick { id: string; name: string; age: number; photo: string; compatibility: number; distance: string; bio: string; rank: number; }

const TOP_PICKS: TopPick[] = [
  { id: '1', name: 'Sarah',  age: 26, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', compatibility: 97, distance: '2 km',  bio: 'Coffee addict & book lover \u{1F4DA}', rank: 1 },
  { id: '2', name: 'Emma',   age: 24, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200', compatibility: 94, distance: '5 km',  bio: 'Artist & traveler', rank: 2 },
  { id: '3', name: 'Mia',    age: 28, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', compatibility: 91, distance: '8 km',  bio: 'Yoga & mindfulness', rank: 3 },
  { id: '4', name: 'Lily',   age: 25, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200', compatibility: 89, distance: '12 km', bio: 'Music & concerts', rank: 4 },
  { id: '5', name: 'Zoe',    age: 27, photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200', compatibility: 87, distance: '3 km',  bio: 'Foodie & chef', rank: 5 },
];

interface Props {
  onBack: () => void;
  onProfile: (id: string) => void;
  onLike: (id: string) => void;
  onSkip: (id: string) => void;
}

export default function DailyMatchesScreen({ onBack, onProfile, onLike, onSkip }: Props) {
  const insets = useSafeAreaInsets();
  const top = TOP_PICKS[0];
  const rest = TOP_PICKS.slice(1);
  const CARD_W = (rw(100) - rw(6.2) * 2 - rw(2.1)) / 2;
  const PHOTO_H = rh(19);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today's Top Picks</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Header card */}
        <LinearGradient colors={[colors.primary_container, colors.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerCard}>
          <Text style={styles.headerCardIcon}>\u2B50</Text>
          <View>
            <Text style={styles.headerCardTag}>YOUR TOP PICKS TODAY</Text>
            <Text style={styles.headerCardTimer}>Refreshes in 18:32:45</Text>
          </View>
        </LinearGradient>

        {/* #1 Best match */}
        <Text style={styles.rankLabel}>#1 BEST MATCH</Text>
        <TouchableOpacity style={styles.topCard} onPress={() => onProfile(top.id)} activeOpacity={0.9}>
          <View style={styles.topPhotoWrapper}>
            <Image source={{ uri: top.photo }} style={styles.topPhoto} resizeMode="cover" />
            <LinearGradient colors={['transparent', colors.surface_container_lowest]} start={{ x: 0, y: 0.5 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} pointerEvents="none" />
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>\u2B50 #1 TODAY</Text>
            </View>
          </View>
          <View style={styles.topCardContent}>
            <Text style={styles.topName}>{top.name}, {top.age}  \u{1F4CD} {top.distance}</Text>
            <View style={styles.compatTrack}>
              <LinearGradient colors={[colors.primary_container, colors.secondary_container]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.compatFill, { width: `${top.compatibility}%` }]} />
            </View>
            <Text style={styles.topBio}>{top.bio}</Text>
            <View style={styles.topActions}>
              <TouchableOpacity style={styles.skipCircle} onPress={() => onSkip(top.id)} activeOpacity={0.8}>
                <Text style={styles.skipCircleText}>\u2715</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.likeCircle} onPress={() => onLike(top.id)} activeOpacity={0.85}>
                <Text style={styles.likeCircleText}>\u2665</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* More picks grid */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>MORE TOP PICKS</Text>
        <View style={styles.grid}>
          {rest.map(pick => (
            <TouchableOpacity key={pick.id} style={[styles.gridCard, { width: CARD_W }]} onPress={() => onProfile(pick.id)} activeOpacity={0.85}>
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: pick.photo }} style={[styles.gridPhoto, { height: PHOTO_H }]} resizeMode="cover" />
                <LinearGradient colors={['transparent', colors.surface_container_lowest]} start={{ x: 0, y: 0.4 }} end={{ x: 0, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: rw(4.1) }]} pointerEvents="none" />
                <View style={styles.gridRankBadge}>
                  <Text style={styles.gridRankText}>\u2B50 #{pick.rank}</Text>
                </View>
              </View>
              <View style={styles.gridInfo}>
                <Text style={styles.gridName}>{pick.name}, {pick.age}</Text>
                <View style={styles.gridCompatTrack}>
                  <LinearGradient colors={[colors.primary_container, colors.secondary_container]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.gridCompatFill, { width: `${pick.compatibility}%` }]} />
                </View>
                <TouchableOpacity style={styles.gridLikeBtn} onPress={() => onLike(pick.id)} activeOpacity={0.85}>
                  <Text style={styles.gridLikeBtnText}>\u2665 Like</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  headerCard: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1), borderRadius: rw(5.1), padding: rw(4.1), marginBottom: rh(2.4) },
  headerCardIcon: { fontSize: rf(2.8) },
  headerCardTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  headerCardTimer: { fontFamily: 'NotoSerif', fontSize: rf(2.1), color: colors.on_surface },
  rankLabel: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  topCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), overflow: 'hidden', marginBottom: rh(0.5) },
  topPhotoWrapper: { height: rh(33.2), position: 'relative' },
  topPhoto: { width: '100%', height: '100%' },
  rankBadge: { position: 'absolute', top: rh(1.4), left: rw(4.1), backgroundColor: colors.secondary_container, paddingHorizontal: rw(3.1), paddingVertical: rh(0.4), borderRadius: 9999 },
  rankBadgeText: { ...typography['label-sm'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  topCardContent: { padding: rw(4.1), gap: rh(1) },
  topName: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface },
  compatTrack: { height: 8, backgroundColor: colors.surface_container_lowest, borderRadius: 9999, overflow: 'hidden' },
  compatFill: { height: '100%', borderRadius: 9999 },
  topBio: { ...typography['body-md'], color: `${colors.on_surface}B3` },
  topActions: { flexDirection: 'row', gap: rw(3.1) },
  skipCircle: { width: rw(14.4), height: rw(14.4), borderRadius: rw(7.2), backgroundColor: colors.surface_container_high, alignItems: 'center', justifyContent: 'center' },
  skipCircleText: { fontSize: rf(2.4), color: colors.on_surface },
  likeCircle: { width: rw(14.4), height: rw(14.4), borderRadius: rw(7.2), backgroundColor: colors.primary_container, alignItems: 'center', justifyContent: 'center' },
  likeCircleText: { fontSize: rf(2.4), color: '#FFFFFF' },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  gridCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), overflow: 'hidden' },
  gridPhoto: { width: '100%', borderRadius: rw(4.1) },
  gridRankBadge: { position: 'absolute', top: rh(0.9), left: rw(2.6), backgroundColor: colors.secondary_container, paddingHorizontal: rw(2.1), paddingVertical: rh(0.3), borderRadius: 9999 },
  gridRankText: { ...typography['label-sm'], color: colors.on_secondary, fontSize: rf(1.1) },
  gridInfo: { padding: rw(3.1), gap: rh(0.7) },
  gridName: { ...typography['label-md'], color: colors.on_surface },
  gridCompatTrack: { height: 4, backgroundColor: colors.surface_container_lowest, borderRadius: 9999, overflow: 'hidden' },
  gridCompatFill: { height: '100%', borderRadius: 9999 },
  gridLikeBtn: { height: rh(3.8), backgroundColor: colors.primary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  gridLikeBtnText: { ...typography['label-md'], color: '#FFFFFF' },
});
