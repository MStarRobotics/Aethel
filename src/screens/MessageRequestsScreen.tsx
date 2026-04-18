import React, { useState } from 'react';
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

const FILTERS = ['All', 'Liked You', 'Visitors'] as const;
type Filter = (typeof FILTERS)[number];

interface Request { id: string; name: string; age: number; photo: string; type: 'like' | 'visit'; message: string; timeAgo: string; locked: boolean; }

const REQUESTS: Request[] = [
  { id: '1', name: 'Alex',   age: 28, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', type: 'like',  message: 'Hey! I love your taste in books', timeAgo: '2h', locked: false },
  { id: '2', name: 'Jordan', age: 25, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', type: 'visit', message: 'We have so much in common!',         timeAgo: '5h', locked: false },
  { id: '3', name: '???',    age: 0,  photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100', type: 'like',  message: '',                                  timeAgo: '1d', locked: true },
];

interface Props { onBack: () => void; onAccept: (id: string) => void; onProfile: (id: string) => void; onUnlock: () => void; }

export default function MessageRequestsScreen({ onBack, onAccept, onProfile, onUnlock }: Props) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('All');
  const [requests, setRequests] = useState(REQUESTS);
  const PHOTO_SIZE = rw(13.3);

  const decline = (id: string) => setRequests(prev => prev.filter(r => r.id !== id));

  const filtered = requests.filter(r => {
    if (filter === 'Liked You') return r.type === 'like';
    if (filter === 'Visitors') return r.type === 'visit';
    return true;
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message Requests</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>\u{1F4AC} {requests.filter(r => !r.locked).length} people want to connect with you</Text>
        <Text style={styles.infoSub}>Accept to start chatting</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} style={[styles.chip, filter === f && styles.chipActive]} onPress={() => setFilter(f)} activeOpacity={0.75}>
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
        {filtered.length > 0 ? (
          <View style={styles.requestList}>
            {filtered.map(req => (
              <View key={req.id} style={styles.requestRow}>
                {req.locked ? (
                  <>
                    <Image source={{ uri: req.photo }} style={[styles.photo, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2, opacity: 0.3 }]} blurRadius={8} />
                    <View style={styles.requestInfo}>
                      <Text style={styles.lockedName}>???, ??</Text>
                    </View>
                    <TouchableOpacity style={styles.unlockBtn} onPress={onUnlock} activeOpacity={0.85}>
                      <Text style={styles.unlockBtnText}>\u{1F451} Unlock</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Image source={{ uri: req.photo }} style={[styles.photo, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
                    <View style={styles.requestInfo}>
                      <Text style={styles.requestName}>{req.name}, {req.age}</Text>
                      <Text style={[styles.requestType, req.type === 'like' ? styles.likeType : styles.visitType]}>
                        {req.type === 'like' ? '\u2764\uFE0F Liked your profile' : '\u{1F440} Visited your profile'}
                      </Text>
                      {req.message ? <Text style={styles.requestMsg} numberOfLines={2}>"{req.message}"</Text> : null}
                    </View>
                    <View style={styles.requestActions}>
                      <Text style={styles.requestTime}>{req.timeAgo}</Text>
                      <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(req.id)} activeOpacity={0.85}>
                        <Text style={styles.acceptBtnText}>\u2713</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.declineBtn} onPress={() => decline(req.id)} activeOpacity={0.8}>
                        <Text style={styles.declineBtnText}>\u2715</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>\u{1F4AC}</Text>
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptyBody}>When someone likes you or visits your profile, their message will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  infoCard: { marginHorizontal: rw(6.2), backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), marginBottom: rh(1.9) },
  infoText: { ...typography['label-md'], color: colors.on_surface },
  infoSub: { ...typography['body-md'], color: `${colors.on_surface}99` },
  filterRow: { flexDirection: 'row', gap: rw(2.1), paddingHorizontal: rw(6.2), marginBottom: rh(1.9) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  scroll: { paddingHorizontal: rw(6.2) },
  requestList: { gap: rh(1) },
  requestRow: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1) },
  photo: { backgroundColor: colors.surface_container_high },
  requestInfo: { flex: 1 },
  requestName: { ...typography['label-lg'], color: colors.on_surface, marginBottom: rh(0.3) },
  requestType: { ...typography['label-sm'], marginBottom: rh(0.4) },
  likeType: { color: colors.primary_container },
  visitType: { color: colors.tertiary },
  requestMsg: { ...typography['body-md'], color: `${colors.on_surface}99` },
  requestActions: { alignItems: 'flex-end', gap: rh(0.7) },
  requestTime: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  acceptBtn: { width: rw(9.2), height: rw(9.2), borderRadius: rw(4.6), backgroundColor: colors.emerald, alignItems: 'center', justifyContent: 'center' },
  acceptBtnText: { fontSize: rf(1.9), color: '#FFFFFF' },
  declineBtn: { width: rw(9.2), height: rw(9.2), borderRadius: rw(4.6), borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  declineBtnText: { fontSize: rf(1.9), color: colors.primary },
  lockedName: { ...typography['label-lg'], color: `${colors.on_surface}4D` },
  unlockBtn: { height: rh(3.8), paddingHorizontal: rw(3.1), borderRadius: 9999, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  unlockBtnText: { ...typography['label-md'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  emptyState: { alignItems: 'center', paddingVertical: rh(7) },
  emptyIcon: { fontSize: rf(5.6), marginBottom: rh(1.9) },
  emptyTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(0.9) },
  emptyBody: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center' },
});
