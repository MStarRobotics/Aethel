import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, StatusBar, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Liker { id: string; name: string; age: number; photo: string; locked: boolean; }

const LIKERS: Liker[] = [
  { id: '1', name: 'Sarah',  age: 26, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', locked: false },
  { id: '2', name: 'Emma',   age: 24, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200', locked: false },
  { id: '3', name: 'Mia',    age: 28, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', locked: false },
  { id: '4', name: '???',    age: 0,  photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200', locked: true },
  { id: '5', name: '???',    age: 0,  photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200', locked: true },
  { id: '6', name: '???',    age: 0,  photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', locked: true },
];

interface Props {
  onBack: () => void;
  onProfile: (id: string) => void;
  onLike: (id: string) => void;
  onUnlock: () => void;
}

export default function LikesReceivedScreen({ onBack, onProfile, onLike, onUnlock }: Props) {
  const insets = useSafeAreaInsets();
  const cardW = (rw(100) - rw(6.2) * 2 - rw(2.1)) / 2;
  const photoH = rh(19);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Likes Received</Text>
        <View style={{ width: rw(12) }} />
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>
        {/* Summary banner */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>\u2764\uFE0F {LIKERS.length} people liked you!</Text>
          <Text style={styles.summarySub}>Like them back to match!</Text>
        </View>
        {/* Grid */}
        <View style={styles.grid}>
          {LIKERS.map(item => (
            <TouchableOpacity key={item.id} style={[styles.card, { width: cardW }]} onPress={() => !item.locked && onProfile(item.id)} activeOpacity={item.locked ? 1 : 0.85}>
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: item.photo }} style={[styles.cardPhoto, { height: photoH }]} resizeMode="cover" blurRadius={item.locked ? 10 : 0} />
                {item.locked && (
                  <View style={styles.lockedOverlay}>
                    <Text style={styles.lockIcon}>\u{1F512}</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardInfo}>
                {item.locked ? (
                  <>
                    <Text style={styles.lockedName}>???, ??</Text>
                    <TouchableOpacity style={styles.unlockBtn} onPress={onUnlock} activeOpacity={0.85}>
                      <Text style={styles.unlockBtnText}>\u{1F451} Unlock</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.cardName}>{item.name}, {item.age}</Text>
                    <Text style={styles.likedLabel}>\u2764\uFE0F Liked you</Text>
                    <TouchableOpacity style={styles.likeBtn} onPress={() => onLike(item.id)} activeOpacity={0.85}>
                      <Text style={styles.likeBtnText}>\u2665 Like Back</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* Premium upsell */}
        <View style={styles.upsellCard}>
          <Text style={styles.upsellIcon}>\u{1F451}</Text>
          <Text style={styles.upsellTitle}>UNLOCK ALL WITH GOLD</Text>
          <Text style={styles.upsellBody}>See everyone who likes you — upgrade now!</Text>
          <TouchableOpacity style={styles.upsellBtn} onPress={onUnlock} activeOpacity={0.85}>
            <Text style={styles.upsellBtnText}>Get Gold Now</Text>
          </TouchableOpacity>
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
  summaryCard: { backgroundColor: colors.primary_container, borderRadius: rw(5.1), padding: rw(5.1), marginBottom: rh(2.4), ...Platform.select({ ios: { shadowColor: colors.primary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 16 }, android: { elevation: 6 } }) },
  summaryTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(0.5) },
  summarySub: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1), marginBottom: rh(2.4) },
  card: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), overflow: 'hidden' },
  cardPhoto: { width: '100%', backgroundColor: colors.surface_container_high },
  lockedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(21,6,41,0.6)', alignItems: 'center', justifyContent: 'center' },
  lockIcon: { fontSize: rf(3.3) },
  cardInfo: { padding: rw(3.1) },
  cardName: { ...typography['label-lg'], color: colors.on_surface, marginBottom: rh(0.4) },
  likedLabel: { ...typography['label-sm'], color: colors.primary_container, marginBottom: rh(0.9) },
  likeBtn: { height: rh(3.8), backgroundColor: colors.primary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  likeBtnText: { ...typography['label-md'], color: '#FFFFFF' },
  lockedName: { ...typography['label-lg'], color: `${colors.on_surface}4D`, marginBottom: rh(0.9) },
  unlockBtn: { height: rh(3.8), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  unlockBtnText: { ...typography['label-md'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  upsellCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), alignItems: 'center' },
  upsellIcon: { fontSize: rf(3.8), marginBottom: rh(0.9) },
  upsellTitle: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(0.9) },
  upsellBody: { ...typography['body-md'], color: `${colors.on_surface}B3`, textAlign: 'center', marginBottom: rh(1.9) },
  upsellBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' },
  upsellBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
});
