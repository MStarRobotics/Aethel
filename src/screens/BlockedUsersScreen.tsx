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

interface BlockedUser {
  id: string; name: string; age: number; photo: string; blockedAgo: string;
}

const INITIAL_BLOCKED: BlockedUser[] = [
  { id: '1', name: 'John',  age: 30, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', blockedAgo: '3 days ago' },
  { id: '2', name: 'Mike',  age: 28, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', blockedAgo: '1 week ago' },
  { id: '3', name: 'Tom',   age: 35, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', blockedAgo: '2 weeks ago' },
];

interface Props { onBack: () => void; }

export default function BlockedUsersScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const [blocked, setBlocked] = useState<BlockedUser[]>(INITIAL_BLOCKED);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const PHOTO_SIZE = rw(12.3); // ~48px

  const confirmUser = blocked.find(u => u.id === confirmId);

  const handleUnblock = () => {
    if (!confirmId) return;
    setBlocked(prev => prev.filter(u => u.id !== confirmId));
    setConfirmId(null);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <View style={{ width: rw(12) }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {blocked.length > 0 ? (
          <>
            {/* Info card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>\u{1F6AB}</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoCount}>{blocked.length} blocked {blocked.length === 1 ? 'user' : 'users'}</Text>
                <Text style={styles.infoBody}>Blocked users cannot see your profile or message you.</Text>
              </View>
            </View>

            {/* Blocked list */}
            <View style={styles.list}>
              {blocked.map(user => (
                <View key={user.id} style={styles.userRow}>
                  <Image
                    source={{ uri: user.photo }}
                    style={[styles.photo, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]}
                    // grayscale via tintColor workaround — opacity conveys blocked state
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}, {user.age}</Text>
                    <Text style={styles.blockedDate}>Blocked {user.blockedAgo}</Text>
                  </View>
                  <TouchableOpacity style={styles.unblockBtn} onPress={() => setConfirmId(user.id)} activeOpacity={0.8}>
                    <Text style={styles.unblockBtnText}>Unblock</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>\u2705</Text>
            <Text style={styles.emptyTitle}>No blocked users</Text>
            <Text style={styles.emptyBody}>You haven't blocked anyone.</Text>
          </View>
        )}
      </ScrollView>

      {/* Unblock confirmation modal */}
      <Modal visible={confirmId !== null} transparent animationType="fade" onRequestClose={() => setConfirmId(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Unblock {confirmUser?.name}?</Text>
            <Text style={styles.modalBody}>They will be able to see your profile again.</Text>
            <TouchableOpacity style={styles.unblockConfirmBtn} onPress={handleUnblock} activeOpacity={0.85}>
              <Text style={styles.unblockConfirmText}>Unblock</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmId(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  scroll: { paddingHorizontal: rw(6.2) },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), marginBottom: rh(2.4) },
  infoIcon: { fontSize: rf(2.4), color: colors.primary_container },
  infoText: { flex: 1 },
  infoCount: { ...typography['label-md'], color: colors.on_surface, marginBottom: rh(0.4) },
  infoBody: { ...typography['body-md'], color: `${colors.on_surface}99` },
  list: { gap: rh(1) },
  userRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1) },
  photo: { backgroundColor: colors.surface_container_high, opacity: 0.6 },
  userInfo: { flex: 1 },
  userName: { ...typography['label-lg'], color: colors.on_surface, marginBottom: rh(0.3) },
  blockedDate: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  unblockBtn: { height: rh(3.8), paddingHorizontal: rw(3.6), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  unblockBtnText: { ...typography['label-md'], color: colors.primary },
  emptyState: { alignItems: 'center', paddingVertical: rh(10) },
  emptyIcon: { fontSize: rf(5.6), marginBottom: rh(1.9) },
  emptyTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(0.9) },
  emptyBody: { ...typography['body-md'], color: `${colors.on_surface}99` },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.88)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(6.2) },
  modalCard: { width: '100%', backgroundColor: colors.surface_container, borderRadius: rw(6.2), padding: rw(6.2), alignItems: 'center' },
  modalTitle: { ...typography['title-lg'], color: colors.on_surface, textAlign: 'center', marginBottom: rh(0.9) },
  modalBody: { ...typography['body-md'], color: `${colors.on_surface}B3`, textAlign: 'center', marginBottom: rh(2.8) },
  unblockConfirmBtn: { width: '100%', height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.4), ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } }) },
  unblockConfirmText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
  cancelText: { ...typography['label-md'], color: colors.tertiary, paddingVertical: rh(1.2) },
});
