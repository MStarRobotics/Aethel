import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface BoostHistory { id: string; date: string; views: number; likes: number; }

const HISTORY: BoostHistory[] = [
  { id: '1', date: 'Yesterday 8:00 PM', views: 89, likes: 12 },
  { id: '2', date: 'Monday 6:30 PM',    views: 64, likes: 7 },
];

const PURCHASE_OPTIONS = [
  { id: '1', label: '1 Boost',  price: '$2.99' },
  { id: '5', label: '5 Boosts', price: '$9.99' },
];

interface Props {
  onBack: () => void;
  onBuyBoost: (option: string) => void;
}

export default function ProfileBoostScreen({ onBack, onBuyBoost }: Props) {
  const insets = useSafeAreaInsets();
  const [boostActive] = useState(true);
  const [timeLeft] = useState('18:32');
  const progressAnim = useRef(new Animated.Value(0.65)).current; // 65% through boost

  // Pulse animation for the boost card
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!boostActive) return;
    const pulse = () => Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.01, duration: 1000, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1.0,  duration: 1000, useNativeDriver: true }),
    ]).start(() => pulse());
    pulse();
  }, [boostActive]);

  const STAT_CARD_W = (rw(100) - rw(6.2) * 2 - rw(2.1)) / 2;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Boost</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Active boost card */}
        {boostActive ? (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LinearGradient
              colors={[colors.primary_container, colors.secondary_container]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.boostCard}
            >
              <Text style={styles.boostIcon}>\u26A1</Text>
              <Text style={styles.boostActiveTag}>BOOST ACTIVE!</Text>
              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
              </View>
              <Text style={styles.boostCountdown}>{timeLeft} left</Text>
              <Text style={styles.boostDesc}>You're being shown to more people right now!</Text>
            </LinearGradient>
          </Animated.View>
        ) : (
          <View style={styles.noBoostCard}>
            <Text style={styles.noBoostIcon}>\u26A1</Text>
            <Text style={styles.noBoostTitle}>No Active Boost</Text>
            <Text style={styles.noBoostBody}>Activate a boost to get 10x more profile views for 30 minutes.</Text>
          </View>
        )}

        {/* Stats */}
        {boostActive && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>BOOST STATS</Text>
            <View style={styles.statsGrid}>
              {[
                { icon: '\u{1F440}', count: '47', label: 'Views' },
                { icon: '\u2764\uFE0F', count: '8',  label: 'Likes' },
                { icon: '\u{1F4AC}', count: '2',  label: 'Messages' },
              ].map(stat => (
                <View key={stat.label} style={[styles.statCard, { width: stat.label === 'Messages' ? STAT_CARD_W : STAT_CARD_W }]}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text style={styles.statCount}>{stat.count}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* History */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>BOOST HISTORY</Text>
        {HISTORY.length > 0 ? (
          <View style={styles.historyList}>
            {HISTORY.map(h => (
              <View key={h.id} style={styles.historyRow}>
                <Text style={styles.historyDate}>{h.date}</Text>
                <Text style={styles.historyStats}>\u{1F440} {h.views} views  \u2764\uFE0F {h.likes} likes</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyHistory}>No boost history yet.</Text>
        )}

        {/* Purchase */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>GET MORE BOOSTS</Text>
        <View style={styles.purchaseGrid}>
          {PURCHASE_OPTIONS.map(opt => (
            <TouchableOpacity key={opt.id} style={[styles.purchaseCard, { width: STAT_CARD_W }]} onPress={() => onBuyBoost(opt.id)} activeOpacity={0.8}>
              <Text style={styles.purchaseLabel}>{opt.label}</Text>
              <Text style={styles.purchasePrice}>{opt.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.useBoostBtn} activeOpacity={0.85}>
          <Text style={styles.useBoostBtnText}>\u26A1  Use a Boost</Text>
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
  boostCard: { borderRadius: rw(5.1), padding: rw(5.1), alignItems: 'center', gap: rh(1.2), marginBottom: rh(0.5) },
  boostIcon: { fontSize: rf(3.8) },
  boostActiveTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  progressTrack: { width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 9999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 9999 },
  boostCountdown: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface },
  boostDesc: { ...typography['body-md'], color: `${colors.on_surface}CC`, textAlign: 'center' },
  noBoostCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), alignItems: 'center', gap: rh(0.9) },
  noBoostIcon: { fontSize: rf(3.8) },
  noBoostTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface },
  noBoostBody: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center' },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(2.1) },
  statCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), alignItems: 'center', gap: rh(0.5) },
  statIcon: { fontSize: rf(2.4) },
  statCount: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface },
  statLabel: { ...typography['label-sm'], color: `${colors.on_surface}80` },
  historyList: { gap: rh(1) },
  historyRow: { backgroundColor: colors.surface_container, borderRadius: rw(3.1), padding: rw(4.1), gap: rh(0.5) },
  historyDate: { ...typography['label-sm'], color: colors.tertiary },
  historyStats: { ...typography['label-md'], color: `${colors.on_surface}B3` },
  emptyHistory: { ...typography['body-md'], color: `${colors.on_surface}66` },
  purchaseGrid: { flexDirection: 'row', gap: rw(2.1), marginBottom: rh(2.4) },
  purchaseCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), alignItems: 'center', gap: rh(0.5) },
  purchaseLabel: { ...typography['label-md'], color: colors.on_surface },
  purchasePrice: { ...typography['title-md'], color: colors.secondary_container },
  useBoostBtn: {
    height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999,
    alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  useBoostBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
});
