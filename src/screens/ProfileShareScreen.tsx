import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, StatusBar, Share, Clipboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const PROFILE_LINK = 'aethel.app/profile/sarah';

const SHARE_APPS = [
  { icon: '\u{1F4AC}', label: 'WhatsApp' },
  { icon: '\u{1F4F8}', label: 'Instagram' },
  { icon: '\u{1F4F1}', label: 'SMS' },
  { icon: '\u{1F426}', label: 'Twitter' },
  { icon: '\u{1F4E7}', label: 'Mail' },
  { icon: '\u22EF',    label: 'More' },
];

interface Props {
  onBack: () => void;
}

export default function ProfileShareScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(PROFILE_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try { await Share.share({ message: `Check out my Aethel profile! https://${PROFILE_LINK}`, url: `https://${PROFILE_LINK}` }); } catch {}
  };

  const PHOTO_SIZE = rw(20.5);
  const ICON_SIZE = rw(14.4);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share Profile</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Profile preview */}
        <View style={styles.profileCard}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }} style={[styles.profilePhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
          <Text style={styles.profileName}>Sarah, 26</Text>
          <Text style={styles.profileLocation}>\u{1F4CD} New York, NY</Text>
          <Text style={styles.profileVerified}>\u2705 Verified</Text>
        </View>

        {/* Share link */}
        <Text style={styles.sectionLabel}>SHARE LINK</Text>
        <View style={styles.linkCard}>
          <Text style={styles.linkText}>{PROFILE_LINK}</Text>
          <TouchableOpacity style={[styles.copyBtn, copied && styles.copyBtnDone]} onPress={handleCopy} activeOpacity={0.85}>
            <Text style={styles.copyBtnText}>{copied ? '\u2713' : 'Copy'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Text style={styles.shareBtnText}>\u2197\uFE0F  Share Link</Text>
        </TouchableOpacity>

        {/* QR code */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>QR CODE</Text>
        <View style={styles.qrCard}>
          {/* QR placeholder */}
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrPlaceholderText}>\u{1F4F7}</Text>
            <Text style={styles.qrPlaceholderLabel}>QR Code</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.saveQrBtn} activeOpacity={0.8}>
          <Text style={styles.saveQrBtnText}>\u{1F4BE}  Save QR Code</Text>
        </TouchableOpacity>

        {/* Share via */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>SHARE VIA</Text>
        <View style={styles.appsGrid}>
          {SHARE_APPS.map(app => (
            <TouchableOpacity key={app.label} style={styles.appItem} onPress={handleShare} activeOpacity={0.8}>
              <View style={[styles.appCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
                <Text style={styles.appIcon}>{app.icon}</Text>
              </View>
              <Text style={styles.appLabel}>{app.label}</Text>
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
  profileCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), alignItems: 'center', gap: rh(0.7), marginBottom: rh(2.8) },
  profilePhoto: { borderWidth: 2, borderColor: colors.primary_container, backgroundColor: colors.surface_container_high },
  profileName: { ...typography['title-md'], color: colors.on_surface },
  profileLocation: { ...typography['label-md'], color: colors.tertiary },
  profileVerified: { ...typography['label-sm'], color: colors.emerald },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(1.4) },
  linkText: { ...typography['body-md'], color: colors.on_surface, flex: 1 },
  copyBtn: { height: rh(3.8), paddingHorizontal: rw(3.6), borderRadius: 9999, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  copyBtnDone: { backgroundColor: colors.emerald },
  copyBtnText: { ...typography['label-md'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  shareBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(0.5), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  shareBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  qrCard: { backgroundColor: '#FFFFFF', borderRadius: rw(4.1), padding: rw(5.1), alignItems: 'center', marginBottom: rh(1.4) },
  qrPlaceholder: { width: rw(51.3), height: rw(51.3), alignItems: 'center', justifyContent: 'center', gap: rh(0.9) },
  qrPlaceholderText: { fontSize: rf(5.6) },
  qrPlaceholderLabel: { fontSize: rf(1.6), color: '#666', fontFamily: 'PlusJakartaSans' },
  saveQrBtn: { height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center', marginBottom: rh(0.5) },
  saveQrBtnText: { ...typography['label-lg'], color: colors.primary },
  appsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rw(4.1) },
  appItem: { alignItems: 'center', gap: rh(0.7), width: rw(14.4) },
  appCircle: { backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center' },
  appIcon: { fontSize: rf(2.8) },
  appLabel: { ...typography['label-sm'], color: `${colors.on_surface}B3`, textAlign: 'center' },
});
