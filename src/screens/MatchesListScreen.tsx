import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, StatusBar, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const FILTERS = ['New', 'All', 'Messaged'] as const;
type Filter = (typeof FILTERS)[number];

interface Match {
  id: string; name: string; age: number; photo: string; online: boolean;
  distance: string; compatibility: number; timestamp: string;
  lastMessage?: string; messaged: boolean;
}

const MATCHES: Match[] = [
  { id: '1', name: 'Sarah',  age: 26, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', online: true,  distance: '2 km',  compatibility: 92, timestamp: '2h',  messaged: false },
  { id: '2', name: 'Emma',   age: 24, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100', online: false, distance: '5 km',  compatibility: 87, timestamp: '1d',  messaged: false },
  { id: '3', name: 'Mia',    age: 28, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', online: true,  distance: '8 km',  compatibility: 85, timestamp: '3d',  messaged: true, lastMessage: 'Hey! How are you doing?' },
  { id: '4', name: 'Lily',   age: 25, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100', online: false, distance: '12 km', compatibility: 81, timestamp: '1w',  messaged: true, lastMessage: 'That sounds like fun!' },
];

interface Props {
  onBack: () => void;
  onProfile: (id: string) => void;
  onMessage: (id: string) => void;
  onSearch: () => void;
}

export default function MatchesListScreen({ onBack, onProfile, onMessage, onSearch }: Props) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('All');
  const [unmatchId, setUnmatchId] = useState<string | null>(null);
  const PHOTO_SIZE = rw(14.4); // 56px

  const filtered = filter === 'New' ? MATCHES.filter(m => !m.messaged)
    : filter === 'Messaged' ? MATCHES.filter(m => m.messaged)
    : MATCHES;

  const newMatches = MATCHES.filter(m => !m.messaged);
  const allMatches = MATCHES.filter(m => m.messaged);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Matches</Text>
        <TouchableOpacity onPress={onSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.searchIcon}>\u{1F50D}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
        {/* Count card */}
        <View style={styles.countCard}>
          <Text style={styles.countTitle}>\u{1F495} You have {MATCHES.length} matches!</Text>
        </View>
        {/* Filter chips */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => {
            const isActive = f === filter;
            return (
              <TouchableOpacity key={f} style={[styles.chip, isActive && styles.chipActive]} onPress={() => setFilter(f)} activeOpacity={0.75}>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* New matches section */}
        {(filter === 'All' || filter === 'New') && newMatches.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>NEW MATCHES</Text>
            <Text style={styles.sectionSub}>Not yet messaged</Text>
            <View style={styles.matchList}>
              {newMatches.map(m => (
                <TouchableOpacity key={m.id} style={styles.matchRow} onPress={() => onProfile(m.id)} onLongPress={() => setUnmatchId(m.id)} activeOpacity={0.85}>
                  <View style={styles.photoWrapper}>
                    <Image source={{ uri: m.photo }} style={[styles.photo, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
                    {m.online && <View style={styles.onlineDot} />}
                  </View>
                  <View style={styles.matchInfo}>
                    <View style={styles.matchTopRow}>
                      <Text style={styles.matchName}>{m.name}, {m.age}</Text>
                      <Text style={styles.matchTime}>{m.timestamp}</Text>
                    </View>
                    <View style={styles.matchMeta}>
                      <Text style={styles.matchDist}>\u{1F4CD} {m.distance}</Text>
                      <Text style={styles.matchCompat}>{m.compatibility}% \u2665</Text>
                    </View>
                    <Text style={styles.matchedAt}>Matched {m.timestamp} ago</Text>
                  </View>
                  <TouchableOpacity style={styles.helloBtn} onPress={() => onMessage(m.id)} activeOpacity={0.85}>
                    <Text style={styles.helloBtnText}>Say Hello \u{1F44B}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        {/* All matches section */}
        {(filter === 'All' || filter === 'Messaged') && allMatches.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>ALL MATCHES</Text>
            <View style={styles.matchList}>
              {allMatches.map(m => (
                <TouchableOpacity key={m.id} style={styles.matchRow} onPress={() => onProfile(m.id)} onLongPress={() => setUnmatchId(m.id)} activeOpacity={0.85}>
                  <View style={styles.photoWrapper}>
                    <Image source={{ uri: m.photo }} style={[styles.photo, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
                    {m.online && <View style={styles.onlineDot} />}
                  </View>
                  <View style={styles.matchInfo}>
                    <View style={styles.matchTopRow}>
                      <Text style={styles.matchName}>{m.name}, {m.age}</Text>
                      <Text style={styles.matchTime}>{m.timestamp}</Text>
                    </View>
                    {m.lastMessage && <Text style={styles.lastMsg} numberOfLines={1}>\u{1F4AC} "{m.lastMessage}"</Text>}
                  </View>
                  <TouchableOpacity style={styles.chatBtn} onPress={() => onMessage(m.id)} activeOpacity={0.8}>
                    <Text style={styles.chatBtnText}>Chat</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>\u{1F495}</Text>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptyBody}>Keep swiping! Your match is out there.</Text>
          </View>
        )}
      </ScrollView>
      {/* Unmatch confirmation */}
      <Modal visible={unmatchId !== null} transparent animationType="fade" onRequestClose={() => setUnmatchId(null)}>
        <View style={styles.unmatchOverlay}>
          <View style={styles.unmatchCard}>
            <Text style={styles.unmatchTitle}>Unmatch with {MATCHES.find(m => m.id === unmatchId)?.name}?</Text>
            <Text style={styles.unmatchBody}>This will delete your conversation.</Text>
            <TouchableOpacity style={styles.unmatchBtn} onPress={() => setUnmatchId(null)} activeOpacity={0.85}>
              <Text style={styles.unmatchBtnText}>Unmatch</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUnmatchId(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  searchIcon: { fontSize: rf(2.4), opacity: 0.7 },
  scroll: { paddingHorizontal: rw(6.2) },
  countCard: { backgroundColor: colors.primary_container, borderRadius: rw(5.1), padding: rw(5.1), marginBottom: rh(2.4), ...Platform.select({ ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 16 }, android: { elevation: 6 } }) },
  countTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface },
  filterRow: { flexDirection: 'row', gap: rw(2.1), marginBottom: rh(2.4) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.5) },
  sectionSub: { ...typography['label-sm'], color: `${colors.on_surface}66`, marginBottom: rh(1.4) },
  matchList: { gap: rh(1) },
  matchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1) },
  photoWrapper: { position: 'relative' },
  photo: { backgroundColor: colors.surface_container_high },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: rw(3.1), height: rw(3.1), borderRadius: rw(1.5), backgroundColor: colors.emerald, borderWidth: 2, borderColor: colors.surface_container },
  matchInfo: { flex: 1 },
  matchTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rh(0.4) },
  matchName: { ...typography['label-lg'], color: colors.on_surface },
  matchTime: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  matchMeta: { flexDirection: 'row', gap: rw(3.1), marginBottom: rh(0.3) },
  matchDist: { ...typography['label-sm'], color: colors.tertiary },
  matchCompat: { ...typography['label-sm'], color: colors.emerald },
  matchedAt: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  lastMsg: { ...typography['body-md'], color: `${colors.on_surface}99` },
  helloBtn: { height: rh(3.8), paddingHorizontal: rw(3.6), borderRadius: 9999, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  helloBtnText: { ...typography['label-md'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  chatBtn: { height: rh(3.8), paddingHorizontal: rw(3.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  chatBtnText: { ...typography['label-md'], color: colors.primary },
  emptyState: { alignItems: 'center', paddingVertical: rh(7) },
  emptyIcon: { fontSize: rf(5.6), marginBottom: rh(1.9) },
  emptyTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(0.9) },
  emptyBody: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center' },
  unmatchOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.88)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(6.2) },
  unmatchCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(6.2), padding: rw(6.2), alignItems: 'center' },
  unmatchTitle: { ...typography['title-lg'], color: colors.on_surface, textAlign: 'center', marginBottom: rh(0.9) },
  unmatchBody: { ...typography['body-md'], color: `${colors.on_surface}B3`, textAlign: 'center', marginBottom: rh(2.8) },
  unmatchBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.primary_container, borderRadius: rw(1), alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  unmatchBtnText: { ...typography['title-md'], color: '#FFFFFF', letterSpacing: 1 },
  cancelText: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(1.2) },
});
