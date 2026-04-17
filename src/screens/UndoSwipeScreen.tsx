import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface Props {
  isPremium?: boolean;
  lastProfile?: { name: string; age: number; photo: string; distance: string; compatibility: number };
  onUndo: () => void;
  onContinue: () => void;
  onUpgrade: () => void;
}

export default function UndoSwipeScreen({
  isPremium = true,
  lastProfile = { name: 'Sarah', age: 26, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300', distance: '2 km', compatibility: 92 },
  onUndo, onContinue, onUpgrade,
}: Props) {
  const insets = useSafeAreaInsets();
  const ICON_SIZE = rw(16.4);
  const PHOTO_SIZE = rw(30.8);

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.content}>
        {/* Undo icon */}
        <View style={[styles.iconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2 }]}>
          <Text style={styles.iconEmoji}>\u21A9\uFE0F</Text>
        </View>

        {isPremium ? (
          <>
            <Text style={styles.tag}>OOPS!</Text>
            <Text style={styles.headline}>Go Back?</Text>

            {/* Last profile card */}
            <View style={styles.profileCard}>
              <Image source={{ uri: lastProfile.photo }} style={[styles.profilePhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
              <Text style={styles.profileName}>{lastProfile.name}, {lastProfile.age}</Text>
              <View style={styles.profileMeta}>
                <Text style={styles.profileDist}>\u{1F4CD} {lastProfile.distance}</Text>
                <Text style={styles.profileCompat}>{lastProfile.compatibility}% \u2665</Text>
              </View>
            </View>

            <Text style={styles.body}>You skipped {lastProfile.name}. Want to go back?</Text>

            <TouchableOpacity style={styles.undoBtn} onPress={onUndo} activeOpacity={0.85}>
              <Text style={styles.undoBtnText}>\u21A9\uFE0F  Undo Last Swipe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueBtn} onPress={onContinue} activeOpacity={0.8}>
              <Text style={styles.continueBtnText}>Continue Swiping</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.premiumTag}>PREMIUM FEATURE</Text>
            <Text style={styles.headline}>Undo Last Swipe</Text>

            <LinearGradient colors={[colors.primary_container, colors.surface]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.upsellCard}>
              <Text style={styles.upsellIcon}>\u{1F451}</Text>
              <Text style={styles.upsellTag}>GOLD FEATURE</Text>
              <Text style={styles.upsellBody}>Upgrade to Gold to undo your last swipe anytime.</Text>
            </LinearGradient>

            <TouchableOpacity style={styles.undoBtn} onPress={onUpgrade} activeOpacity={0.85}>
              <Text style={styles.undoBtnText}>\u{1F451}  Upgrade to Gold</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onContinue}>
              <Text style={styles.maybeLater}>Maybe Later</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(6.2), gap: rh(1.9) },
  iconCircle: { backgroundColor: colors.surface_container, alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: rf(3.3) },
  tag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  premiumTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  headline: { fontFamily: 'NotoSerif', fontSize: rf(3.3), color: colors.on_surface, textAlign: 'center' },
  profileCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), alignItems: 'center', gap: rh(0.9) },
  profilePhoto: { borderWidth: 2, borderColor: colors.primary_container, backgroundColor: colors.surface_container_high },
  profileName: { ...typography['title-md'], color: colors.on_surface },
  profileMeta: { flexDirection: 'row', gap: rw(4.1) },
  profileDist: { ...typography['label-md'], color: colors.tertiary },
  profileCompat: { ...typography['label-md'], color: colors.emerald },
  body: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center' },
  undoBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  undoBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  continueBtn: { width: '100%', height: rh(6.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  continueBtnText: { ...typography['label-lg'], color: colors.primary },
  upsellCard: { width: '100%', borderRadius: rw(5.1), padding: rw(5.1), alignItems: 'center', gap: rh(0.9) },
  upsellIcon: { fontSize: rf(3.3) },
  upsellTag: { ...typography['label-sm'], color: colors.secondary_container, textTransform: 'uppercase', letterSpacing: 1.5 },
  upsellBody: { ...typography['body-md'], color: `${colors.on_surface}CC`, textAlign: 'center' },
  maybeLater: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(0.9) },
});
