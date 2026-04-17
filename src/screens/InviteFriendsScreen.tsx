import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, StatusBar, Share, Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const INVITE_LINK = 'aethel.app/invite/sarah123';

const SHARE_APPS = [
  { icon: '\u{1F4F1}', label: 'SMS' },
  { icon: '\u{1F4E7}', label: 'Mail' },
  { icon: '\u{1F4AC}', label: 'WhatsApp' },
  { icon: '\u{1F426}', label: 'Twitter' },
];

const REFERRALS = [
  { id: '1', name: 'Alex', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80', joinedAgo: '2 days ago', rewarded: true },
  { id: '2', name: 'Jordan', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80', joinedAgo: '1 week ago', rewarded: true },
  { id: '3', name: 'Casey', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80', joinedAgo: '2 weeks ago', rewarded: false },
];

interface Props {
  onBack: () => void;
}

export default function InviteFriendsScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(INVITE_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Join me on Aethel! ${INVITE_LINK}`, url: `https://${INVITE_LINK}` });
    } catch {}
  };

  const ICON_SIZE = rw(14.4); // ~56px
  const PHOTO_SIZE = rw(10.3);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Hero card */}
        <LinearGradient colors={[colors.primary_container, colors.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
          <Text style={styles.heroIcon}>\u{1F381}</Text>
          <Text style={styles.heroTag}>INVITE & EARN</Text>
          <Text style={styles.heroBody}>For every friend who joins, you both get</Text>
          <Text style={styles.heroHighlight}>1 week of Gold FREE!</Text>
        </LinearGradient>

        {/* Invite link */}
        <Text style={styles.sectionLabel}>YOUR INVITE LINK</Text>
        <View style={styles.linkCard}>
          <Text style={styles.linkText}>{INVITE_LINK}</Text>
          <TouchableOpacity style={[styles.copyBtn, copied && styles.copyBtnDone]} onPress={handleCopy} activeOpacity={0.85}>
            <Text style={styles.copyBtnText}>{copied ? '\u2713' : 'Copy'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Text style={styles.shareBtnText}>\u2197\uFE0F  Share Invite Link</Text>
        </TouchableOpacity>

        {/* Share via */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>SHARE VIA</Text>
        <View style={styles.appsGrid}>
          {SHARE_APPS.map(app => (
            <TouchableOpacity key={app.label} style={styles.appItem} onPress={handleShare} activeOpacity={0.8}>
              <View style={[styles.appIconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
                <Text style={styles.appIcon}>{app.icon}</Text>
              </View>
              <Text style={styles.appLabel}>{app.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Referrals */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>YOUR REFERRALS</Text>
        <View style={styles.statsCard}>
          <Text style={styles.statText}>{REFERRALS.length} friends joined</Text>
          <Text style={styles.statRewards}>{REFERRALS.filter(r => r.rewarded).length} rewards earned</Text>
        </View>

        <View style={styles.referralList}>
          {REFERRALS.map(ref => (
            <View key={ref.id} style={styles.referralRow}>
              <Image source={{ uri: ref.photo }} style={[styles.refPhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
              <View style={styles.refInfo}>
                <Text style={styles.refName}>{ref.name} joined {ref.joinedAgo}</Text>
                {ref.rewarded && <Text style={styles.refReward}>\u2705 Reward earned</Text>}
              </View>
            </View>
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
  heroCard: { borderRadius: rw(5.1), padding: rw(5.1), gap: rh(0.7), marginBottom: rh(2.8) },
  heroIcon: { fontSize: rf(3.8) },
  heroTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  heroBody: { ...typography['body-md'], color: `${colors.on_surface}CC` },
  heroHighlight: { ...typography['title-md'], color: colors.on_surface },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(1.4) },
  linkText: { ...typography['body-md'], color: colors.on_surface, flex: 1, fontFamily: 'PlusJakartaSans' },
  copyBtn: { height: rh(3.8), paddingHorizontal: rw(3.6), borderRadius: 9999, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  copyBtnDone: { backgroundColor: colors.emerald },
  copyBtnText: { ...typography['label-md'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  shareBtn: {
    height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999,
    alignItems: 'center', justifyContent: 'center', marginBottom: rh(0.5),
    ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }),
  },
  shareBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  appsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: rh(0.5) },
  appItem: { alignItems: 'center', gap: rh(0.7) },
  appIconCircle: { backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center' },
  appIcon: { fontSize: rf(2.8) },
  appLabel: { ...typography['label-sm'], color: `${colors.on_surface}B3` },
  statsCard: { backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rh(0.5), marginBottom: rh(1.4) },
  statText: { ...typography['label-md'], color: colors.on_surface },
  statRewards: { ...typography['label-md'], color: colors.emerald },
  referralList: { gap: rh(1) },
  referralRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(3.1), padding: rw(4.1), gap: rw(3.1) },
  refPhoto: { backgroundColor: colors.surface_container_high },
  refInfo: { flex: 1 },
  refName: { ...typography['label-md'], color: colors.on_surface, marginBottom: rh(0.3) },
  refReward: { ...typography['label-sm'], color: colors.emerald },
});
