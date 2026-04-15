import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, StatusBar, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const MEMBER_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80',
];

interface Props {
  onBack: () => void;
  onBrowseMembers: () => void;
}

export default function ClubDetailScreen({ onBack, onBrowseMembers }: Props) {
  const insets = useSafeAreaInsets();
  const [joined, setJoined] = useState(true);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const AVATAR_SIZE = rw(10.3); // ~40px
  const BANNER_H = rh(28);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Floating back button */}
      <TouchableOpacity style={[styles.floatBack, { top: insets.top + rh(1.2) }]} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.backText}>\u2190 Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Hero banner */}
        <View style={[styles.bannerWrapper, { height: BANNER_H }]}>
          <LinearGradient
            colors={[colors.primary_container, colors.surface]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600' }}
            style={[StyleSheet.absoluteFill, { opacity: 0.25 }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', colors.surface_container_lowest]}
            start={{ x: 0, y: 0.5 }} end={{ x: 0, y: 1 }}
            style={[StyleSheet.absoluteFill]}
            pointerEvents="none"
          />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerEmoji}>\u{1F3AE}</Text>
            <Text style={styles.bannerTitle}>Gaming Club</Text>
            <Text style={styles.bannerMeta}>1,247 members</Text>
            <Text style={styles.bannerDesc}>"For gamers who want to find their player 2"</Text>
          </View>
        </View>

        <View style={styles.content}>

          {/* Members section */}
          <Text style={styles.sectionLabel}>MEMBERS</Text>
          <View style={styles.membersRow}>
            {MEMBER_PHOTOS.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={[styles.memberAvatar, { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, marginLeft: i > 0 ? -rw(2.6) : 0 }]}
              />
            ))}
            <View style={[styles.memberMore, { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, marginLeft: -rw(2.6) }]}>
              <Text style={styles.memberMoreText}>+99</Text>
            </View>
          </View>

          {/* About */}
          <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>ABOUT</Text>
          <Text style={styles.aboutText}>
            A sanctuary for those who appreciate the artistry of digital worlds. We host weekly tournament nights, narrative lore discussions, and midnight co-op sessions. Whether you're into souls-likes or cozy sims, your next companion is here.
          </Text>

          {/* Featured match preview */}
          <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>DAILY MATCH POTENTIAL</Text>
          <View style={styles.matchPreview}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }}
              style={styles.matchPhoto}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', colors.surface_container_lowest]}
              start={{ x: 0, y: 0.4 }} end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.matchInfo}>
              <Text style={styles.matchCompat}>94% Compatibility</Text>
              <Text style={styles.matchName}>Leo, 26 \u2022 RPG Enthusiast</Text>
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity style={styles.browseBtn} onPress={onBrowseMembers} activeOpacity={0.85}>
            <Text style={styles.browseBtnText}>Browse Club Members</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.leaveBtn}
            onPress={() => joined ? setShowLeaveConfirm(true) : setJoined(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.leaveBtnText, !joined && styles.joinBtnText]}>
              {joined ? 'Leave Club' : 'Join Club'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Leave confirmation */}
      <Modal visible={showLeaveConfirm} transparent animationType="fade" onRequestClose={() => setShowLeaveConfirm(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Leave Gaming Club?</Text>
            <Text style={styles.modalBody}>You'll no longer see club members in your discovery feed.</Text>
            <TouchableOpacity style={styles.modalDestructiveBtn} onPress={() => { setJoined(false); setShowLeaveConfirm(false); }} activeOpacity={0.85}>
              <Text style={styles.modalDestructiveBtnText}>Leave Club</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLeaveConfirm(false)}>
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
  floatBack: { position: 'absolute', left: rw(6.2), zIndex: 10, padding: rw(2) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  scroll: {},
  bannerWrapper: { width: '100%', position: 'relative', justifyContent: 'flex-end' },
  bannerContent: { padding: rw(6.2), paddingBottom: rh(2.4) },
  bannerEmoji: { fontSize: rf(4.7), marginBottom: rh(0.7) },
  bannerTitle: { fontFamily: 'NotoSerif', fontSize: rf(3.8), color: colors.on_surface, marginBottom: rh(0.4) },
  bannerMeta: { ...typography['label-md'], color: `${colors.on_surface}B3`, marginBottom: rh(0.5) },
  bannerDesc: { ...typography['body-md'], color: `${colors.on_surface}99`, fontStyle: 'italic' },
  content: { paddingHorizontal: rw(6.2), paddingTop: rh(2.4) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  membersRow: { flexDirection: 'row', alignItems: 'center', marginBottom: rh(0.5) },
  memberAvatar: { backgroundColor: colors.surface_container_high, borderWidth: 2, borderColor: colors.surface_container_lowest },
  memberMore: { backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.surface_container_lowest },
  memberMoreText: { ...typography['label-sm'], color: colors.on_secondary, fontSize: rf(1.1) },
  aboutText: { ...typography['body-md'], color: `${colors.on_surface}B3`, lineHeight: rh(2.8) },
  matchPreview: { height: rh(23.7), borderRadius: rw(4.1), overflow: 'hidden', position: 'relative', marginBottom: rh(2.4) },
  matchPhoto: { width: '100%', height: '100%' },
  matchInfo: { position: 'absolute', bottom: rh(1.9), left: rw(4.1) },
  matchCompat: { ...typography['label-sm'], color: colors.primary, marginBottom: rh(0.3) },
  matchName: { fontFamily: 'NotoSerif', fontSize: rf(2.1), color: colors.on_surface },
  browseBtn: {
    height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999,
    alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4),
    ...Platform.select({
      ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  browseBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  leaveBtn: { height: rh(5.2), alignItems: 'center', justifyContent: 'center' },
  leaveBtnText: { ...typography['label-lg'], color: colors.primary_container },
  joinBtnText: { color: colors.secondary_container },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.88)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(6.2) },
  modalCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(6.2), padding: rw(6.2), alignItems: 'center' },
  modalTitle: { ...typography['title-lg'], color: colors.on_surface, textAlign: 'center', marginBottom: rh(0.9) },
  modalBody: { ...typography['body-md'], color: `${colors.on_surface}B3`, textAlign: 'center', marginBottom: rh(2.8) },
  modalDestructiveBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.primary_container, borderRadius: rw(1), alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4) },
  modalDestructiveBtnText: { ...typography['title-md'], color: '#FFFFFF', letterSpacing: 1 },
  cancelText: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(1.2) },
});
