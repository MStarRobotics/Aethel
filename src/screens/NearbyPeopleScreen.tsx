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

type ViewMode = 'map' | 'list';

interface NearbyUser {
  id: string; name: string; age: number; photo: string;
  distance: string; compatibility: number; online: boolean;
}

const NEARBY: NearbyUser[] = [
  { id: '1', name: 'Sarah',  age: 26, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', distance: '0.5 km', compatibility: 92, online: true },
  { id: '2', name: 'Emma',   age: 24, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100', distance: '1.2 km', compatibility: 87, online: false },
  { id: '3', name: 'Mia',    age: 28, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', distance: '2.1 km', compatibility: 84, online: true },
  { id: '4', name: 'Jordan', age: 25, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100', distance: '3.4 km', compatibility: 79, online: false },
];

// Simulated map pin positions (% of map area)
const MAP_PINS = [
  { id: '1', x: 35, y: 40, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60' },
  { id: '2', x: 60, y: 55, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=60' },
  { id: '3', x: 25, y: 65, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=60' },
];

interface Props {
  onBack: () => void;
  onProfile: (id: string) => void;
  onLike: (id: string) => void;
  onSettings: () => void;
}

export default function NearbyPeopleScreen({ onBack, onProfile, onLike, onSettings }: Props) {
  const insets = useSafeAreaInsets();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  const PHOTO_SIZE = rw(13.3);
  const PIN_SIZE = rw(10.3);
  const MAP_H = rh(35);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby People</Text>
        <TouchableOpacity onPress={onSettings} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.settingsIcon}>\u2699\uFE0F</Text>
        </TouchableOpacity>
      </View>

      {/* View toggle */}
      <View style={styles.toggleRow}>
        {(['map', 'list'] as ViewMode[]).map(mode => (
          <TouchableOpacity
            key={mode}
            style={[styles.chip, viewMode === mode && styles.chipActive]}
            onPress={() => setViewMode(mode)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, viewMode === mode && styles.chipTextActive]}>
              {mode === 'map' ? 'Map View' : 'List View'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Map placeholder */}
        {viewMode === 'map' && (
          <View style={[styles.mapContainer, { height: MAP_H }]}>
            {/* Dark map background */}
            <View style={styles.mapBg}>
              {/* Grid lines to simulate map */}
              {[0.2, 0.4, 0.6, 0.8].map(v => (
                <View key={`h${v}`} style={[styles.mapGridH, { top: `${v * 100}%` }]} />
              ))}
              {[0.25, 0.5, 0.75].map(v => (
                <View key={`v${v}`} style={[styles.mapGridV, { left: `${v * 100}%` }]} />
              ))}
              {/* You pin */}
              <View style={styles.youPin}>
                <Text style={styles.youPinIcon}>\u{1F4CD}</Text>
                <Text style={styles.youPinLabel}>You</Text>
              </View>
              {/* User pins */}
              {MAP_PINS.map(pin => (
                <TouchableOpacity
                  key={pin.id}
                  style={[styles.userPin, { left: `${pin.x}%`, top: `${pin.y}%`, width: PIN_SIZE, height: PIN_SIZE, borderRadius: PIN_SIZE / 2 }]}
                  onPress={() => setSelectedPin(selectedPin === pin.id ? null : pin.id)}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: pin.photo }} style={[styles.pinPhoto, { borderRadius: PIN_SIZE / 2 }]} />
                </TouchableOpacity>
              ))}
              {/* Mini popup */}
              {selectedPin && (() => {
                const user = NEARBY.find(u => u.id === selectedPin);
                if (!user) return null;
                return (
                  <View style={styles.miniPopup}>
                    <Image source={{ uri: user.photo }} style={styles.popupPhoto} />
                    <View style={styles.popupInfo}>
                      <Text style={styles.popupName}>{user.name}, {user.age}</Text>
                      <Text style={styles.popupDist}>\u{1F4CD} ~{user.distance}</Text>
                      <Text style={styles.popupCompat}>{user.compatibility}% compatible</Text>
                    </View>
                    <TouchableOpacity style={styles.popupLikeBtn} onPress={() => onLike(user.id)}>
                      <Text style={styles.popupLikeBtnText}>\u2665</Text>
                    </TouchableOpacity>
                  </View>
                );
              })()}
            </View>
          </View>
        )}

        {/* Nearby list */}
        <Text style={styles.sectionLabel}>NEARBY USERS</Text>
        <View style={styles.userList}>
          {NEARBY.map(user => (
            <View key={user.id} style={styles.userRow}>
              <View style={styles.photoWrapper}>
                <Image source={{ uri: user.photo }} style={[styles.photo, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
                {user.online && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}, {user.age}</Text>
                <Text style={styles.userDist}>\u{1F4CD} {user.distance}</Text>
                <Text style={styles.userCompat}>{user.compatibility}% match</Text>
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity style={styles.viewBtn} onPress={() => onProfile(user.id)} activeOpacity={0.8}>
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.likeBtn} onPress={() => onLike(user.id)} activeOpacity={0.85}>
                  <Text style={styles.likeBtnText}>\u2665</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.privacyNote}>Exact location never shown</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  settingsIcon: { fontSize: rf(2.1) },
  toggleRow: { flexDirection: 'row', gap: rw(2.1), paddingHorizontal: rw(6.2), marginBottom: rh(1.9) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  scroll: { paddingHorizontal: rw(6.2) },
  mapContainer: { marginBottom: rh(2.4), borderRadius: rw(4.1), overflow: 'hidden' },
  mapBg: { flex: 1, backgroundColor: colors.surface, position: 'relative' },
  mapGridH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: `${colors.on_surface}0D` },
  mapGridV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: `${colors.on_surface}0D` },
  youPin: { position: 'absolute', left: '50%', top: '50%', alignItems: 'center', transform: [{ translateX: -12 }, { translateY: -24 }] },
  youPinIcon: { fontSize: rf(2.8), color: colors.secondary_container },
  youPinLabel: { ...typography['label-sm'], color: colors.secondary_container },
  userPin: { position: 'absolute', borderWidth: 2, borderColor: colors.primary_container, overflow: 'hidden', transform: [{ translateX: -rw(5.1) }, { translateY: -rw(5.1) }] },
  pinPhoto: { width: '100%', height: '100%' },
  miniPopup: { position: 'absolute', bottom: rh(1.4), left: rw(4.1), right: rw(4.1), backgroundColor: `${colors.surface_variant}F2`, borderRadius: rw(4.1), flexDirection: 'row', alignItems: 'center', padding: rw(3.1), gap: rw(3.1) },
  popupPhoto: { width: rw(12.3), height: rw(12.3), borderRadius: rw(6.2) },
  popupInfo: { flex: 1 },
  popupName: { ...typography['title-md'], color: colors.on_surface },
  popupDist: { ...typography['label-sm'], color: colors.tertiary },
  popupCompat: { ...typography['label-sm'], color: colors.emerald },
  popupLikeBtn: { width: rw(10.3), height: rw(10.3), borderRadius: rw(5.1), backgroundColor: colors.primary_container, alignItems: 'center', justifyContent: 'center' },
  popupLikeBtnText: { fontSize: rf(2.1), color: '#FFFFFF' },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  userList: { gap: rh(1) },
  userRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1) },
  photoWrapper: { position: 'relative' },
  photo: { backgroundColor: colors.surface_container_high },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: rw(3.1), height: rw(3.1), borderRadius: rw(1.5), backgroundColor: colors.emerald, borderWidth: 2, borderColor: colors.surface_container },
  userInfo: { flex: 1 },
  userName: { ...typography['label-lg'], color: colors.on_surface, marginBottom: rh(0.3) },
  userDist: { ...typography['label-sm'], color: colors.tertiary, marginBottom: rh(0.2) },
  userCompat: { ...typography['label-sm'], color: colors.emerald },
  userActions: { flexDirection: 'row', gap: rw(2.1) },
  viewBtn: { height: rh(3.8), paddingHorizontal: rw(3.1), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  viewBtnText: { ...typography['label-md'], color: colors.primary },
  likeBtn: { width: rh(3.8), height: rh(3.8), borderRadius: 9999, backgroundColor: colors.primary_container, alignItems: 'center', justifyContent: 'center' },
  likeBtnText: { fontSize: rf(1.6), color: '#FFFFFF' },
  privacyNote: { ...typography['label-sm'], color: `${colors.on_surface}66`, textAlign: 'center', marginTop: rh(1.9) },
});
