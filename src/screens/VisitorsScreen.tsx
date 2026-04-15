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
import TabBar, { TabName } from '../components/TabBar';

const TIME_FILTERS = ['Today', 'This Week', 'All Time'] as const;
type TimeFilter = (typeof TIME_FILTERS)[number];

interface Visitor {
  id: string; name: string; age: number; photo: string; online: boolean;
  distance: string; compatibility: number; timestamp: string; locked: boolean;
}

const VISITORS: Visitor[] = [
  { id: '1', name: 'Sarah',  age: 26, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', online: true,  distance: '2 km',  compatibility: 92, timestamp: '5m',  locked: false },
  { id: '2', name: 'Emma',   age: 24, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100', online: false, distance: '5 km',  compatibility: 87, timestamp: '1h',  locked: false },
  { id: '3', name: 'Mia',    age: 28, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', online: true,  distance: '8 km',  compatibility: 85, timestamp: '3h',  locked: false },
  { id: '4', name: '???',    age: 0,  photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100', online: false, distance: '?? km', compatibility: 0,  timestamp: '5h',  locked: true },
  { id: '5', name: '???',    age: 0,  photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100', online: false, distance: '?? km', compatibility: 0,  timestamp: '1d',  locked: true },
];

interface Props {
  onViewProfile: (id: string) => void;
  onLike: (id: string) => void;
  onMessage: (id: string) => void;
  onUnlock: () => void;
  onNotifications: () => void;
  onTabPress: (tab: TabName) => void;
  activeTab?: TabName;
}

export default function VisitorsScreen({ onViewProfile, onLike, onMessage, onUnlock, onNotifications, onTabPress, activeTab = 'profile' }: Props) {
  const insets = useSafeAreaInsets();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Today');
  const PHOTO_SIZE = rw(14.4); // 56px

  const visibleCount = VISITORS.filter(v => !v.locked).length;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Visitors</Text>
        <TouchableOpacity onPress={onNotifications} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.headerIcon}>\u{1F514}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(12) }]} showsVerticalScrollIndicator={false}>
        {/* Summary card — crimson bg */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCount}>\u{1F440} {VISITORS.length} people visited your profile today</Text>
          <Text style={styles.summarySubtext}>Keep your profile updated to get more views!</Text>
        </View>

        {/* Time filter chips */}
        <View style={styles.filterRow}>
          {TIME_FILTERS.map(f => {
            const isActive = f === timeFilter;
            return (
              <TouchableOpacity key={f} style={[styles.chip, isActive && styles.chipActive]} onPress={() => setTimeFilter(f)} activeOpacity={0.75}>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Visitor rows */}
        <View style={styles.visitorList}>
          {VISITORS.map(v => {
            if (v.locked) {
              return (
                <View key={v.id} style={styles.lockedCard}>
                  <View style={styles.lockedPhotoWrapper}>
                    <Image source={{ uri: v.photo }} style={[styles.lockedPhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} blurRadius={10} />
                    <View style={styles.lockedOverlay}>
                      <Text style={styles.lockIcon}>\u{1F512}</Text>
                    </View>
                  </View>
                  <View style={styles.lockedBody}>
                    <Text style={styles.lockedName}>???, ??</Text>
                    <Text style={styles.lockedSub}>Unlock to see who visited</Text>
                  </View>
                  <TouchableOpacity style={styles.unlockBtn} onPress={onUnlock} activeOpacity={0.85}>
                    <Text style={styles.unlockBtnText}>\u{1F451} Unlock</Text>
                  </TouchableOpacity>
                </View>
              );
            }
            return (
              <View key={v.id} style={styles.visitorCard}>
                <View style={styles.visitorTop}>
                  <View style={styles.photoWrapper}>
                    <Image source={{ uri: v.photo }} style={[styles.visitorPhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
                    {v.online && <View style={styles.onlineDot} />}
                  </View>
                  <View style={styles.visitorInfo}>
                    <Text style={styles.visitorName}>{v.name}, {v.age}</Text>
                    <View style={styles.visitorMeta}>
                      <Text style={styles.visitorDist}>\u{1F4CD} {v.distance}</Text>
                      <Text style={styles.visitorCompat}>{v.compatibility}% \u2665</Text>
                    </View>
                  </View>
                  <Text style={styles.visitorTime}>{v.timestamp}</Text>
                </View>
                <View style={styles.visitorActions}>
                  <TouchableOpacity style={styles.actionBtnGhost} onPress={() => onViewProfile(v.id)} activeOpacity={0.8}>
                    <Text style={styles.actionBtnGhostText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnCrimson} onPress={() => onLike(v.id)} activeOpacity={0.8}>
                    <Text style={styles.actionBtnText}>\u2665 Like</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnOrange} onPress={() => onMessage(v.id)} activeOpacity={0.8}>
                    <Text style={styles.actionBtnText}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.loadMore}>
          <Text style={styles.loadMoreText}>Load More...</Text>
        </TouchableOpacity>
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
  scroll: { paddingHorizontal: rw(6.2) },
  summaryCard: { backgroundColor: colors.primary_container, borderRadius: rw(5.1), padding: rw(5.1), marginBottom: rh(2.4), ...Platform.select({ ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 16 }, android: { elevation: 6 } }) },
  summaryCount: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(0.7) },
  summarySubtext: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  filterRow: { flexDirection: 'row', gap: rw(2.1), marginBottom: rh(2.4) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  visitorList: { gap: rh(1) },
  visitorCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(1.4) },
  visitorTop: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  photoWrapper: { position: 'relative' },
  visitorPhoto: { backgroundColor: colors.surface_container_high },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: rw(3.1), height: rw(3.1), borderRadius: rw(1.5), backgroundColor: colors.emerald, borderWidth: 2, borderColor: colors.surface_container },
  visitorInfo: { flex: 1 },
  visitorName: { ...typography['label-lg'], color: colors.on_surface, marginBottom: rh(0.4) },
  visitorMeta: { flexDirection: 'row', gap: rw(3.1) },
  visitorDist: { ...typography['label-sm'], color: colors.tertiary },
  visitorCompat: { ...typography['label-sm'], color: colors.emerald },
  visitorTime: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  visitorActions: { flexDirection: 'row', gap: rw(2.1) },
  actionBtnGhost: { height: rh(3.8), paddingHorizontal: rw(3.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  actionBtnGhostText: { ...typography['label-md'], color: colors.primary },
  actionBtnCrimson: { height: rh(3.8), paddingHorizontal: rw(3.6), borderRadius: 9999, backgroundColor: colors.primary_container, alignItems: 'center', justifyContent: 'center' },
  actionBtnOrange: { height: rh(3.8), paddingHorizontal: rw(3.6), borderRadius: 9999, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { ...typography['label-md'], color: colors.on_surface },
  lockedCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  lockedPhotoWrapper: { position: 'relative' },
  lockedPhoto: { backgroundColor: colors.surface_container_high },
  lockedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  lockIcon: { fontSize: rf(2.1) },
  lockedBody: { flex: 1 },
  lockedName: { ...typography['label-lg'], color: `${colors.on_surface}4D`, marginBottom: rh(0.4) },
  lockedSub: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  unlockBtn: { height: rh(3.8), paddingHorizontal: rw(3.6), borderRadius: 9999, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  unlockBtnText: { ...typography['label-md'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  loadMore: { alignItems: 'center', paddingVertical: rh(2.4) },
  loadMoreText: { ...typography['label-md'], color: colors.tertiary },
});
