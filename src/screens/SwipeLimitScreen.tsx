import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const WHILE_YOU_WAIT = [
  { icon: '\u{1F4AC}', label: 'Answer More Questions', sub: 'Improve your matches' },
  { icon: '\u270F\uFE0F', label: 'Update Your Profile',   sub: 'Stand out from the crowd' },
  { icon: '\u{1F440}', label: 'Check Your Visitors',    sub: 'See who viewed you' },
];

interface Props {
  onUpgrade: () => void;
  onAnswerQuestions: () => void;
  onEditProfile: () => void;
  onVisitors: () => void;
}

export default function SwipeLimitScreen({ onUpgrade, onAnswerQuestions, onEditProfile, onVisitors }: Props) {
  const insets = useSafeAreaInsets();
  const ICON_SIZE = rw(20.5);

  const actions = [onAnswerQuestions, onEditProfile, onVisitors];

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.content}>
        {/* Empty heart icon */}
        <View style={[styles.iconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
          <Text style={styles.iconEmoji}>\u{1F494}</Text>
        </View>

        <Text style={styles.tag}>DAILY LIMIT REACHED</Text>
        <Text style={styles.headline}>You're Out of Likes!</Text>
        <Text style={styles.body}>You've used all your likes for today.</Text>

        {/* Countdown */}
        <View style={styles.countdownWrapper}>
          <Text style={styles.countdownLabel}>RESETS IN</Text>
          <Text style={styles.countdown}>18:32:45</Text>
        </View>

        {/* Upgrade card */}
        <LinearGradient colors={[colors.primary_container, colors.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.upgradeCard}>
          <Text style={styles.upgradeIcon}>\u{1F451}</Text>
          <Text style={styles.upgradeTag}>GET UNLIMITED LIKES WITH GOLD</Text>
          <Text style={styles.upgradeBody}>Never run out of likes again. Swipe as much as you want.</Text>
          <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade} activeOpacity={0.85}>
            <Text style={styles.upgradeBtnText}>Get Gold Now</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* While you wait */}
        <Text style={styles.sectionLabel}>WHILE YOU WAIT</Text>
        <View style={styles.actionList}>
          {WHILE_YOU_WAIT.map((item, i) => (
            <TouchableOpacity key={item.label} style={styles.actionCard} onPress={actions[i]} activeOpacity={0.8}>
              <Text style={styles.actionIcon}>{item.icon}</Text>
              <View style={styles.actionInfo}>
                <Text style={styles.actionLabel}>{item.label}</Text>
                <Text style={styles.actionSub}>{item.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>Come back tomorrow for more free likes!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  content: { flex: 1, paddingHorizontal: rw(6.2), alignItems: 'center', justifyContent: 'center', gap: rh(1.9) },
  iconCircle: { backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: rf(4.7), opacity: 0.4 },
  tag: { ...typography['label-sm'], color: colors.primary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center' },
  body: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center' },
  countdownWrapper: { alignItems: 'center', gap: rh(0.4) },
  countdownLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5 },
  countdown: { fontFamily: 'NotoSerif', fontSize: rf(5.3), color: colors.secondary_container, letterSpacing: -0.9 },
  upgradeCard: { width: '100%', borderRadius: rw(5.1), padding: rw(5.1), alignItems: 'center', gap: rh(0.9) },
  upgradeIcon: { fontSize: rf(3.3) },
  upgradeTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center' },
  upgradeBody: { ...typography['body-md'], color: `${colors.on_surface}CC`, textAlign: 'center' },
  upgradeBtn: { width: '100%', height: rh(5.7), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginTop: rh(0.5) },
  upgradeBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, alignSelf: 'flex-start' },
  actionList: { width: '100%', gap: rh(1) },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1) },
  actionIcon: { fontSize: rf(1.9), width: rw(6.2), textAlign: 'center' },
  actionInfo: { flex: 1 },
  actionLabel: { ...typography['label-lg'], color: colors.on_surface },
  actionSub: { ...typography['label-sm'], color: `${colors.on_surface}80` },
  footer: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'center' },
});
