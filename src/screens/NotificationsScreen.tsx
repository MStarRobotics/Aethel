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

const FILTERS = ['All', 'Matches', 'Messages', 'Likes', 'Visitors'] as const;
type Filter = (typeof FILTERS)[number];

type NotifType = 'match' | 'message' | 'like' | 'superlike' | 'view';

interface Notification {
  id: string; type: NotifType; name: string; photo: string;
  body: string; timestamp: string; read: boolean; section: 'today' | 'yesterday';
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'match',     name: 'Sarah',  photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', body: 'You matched with Sarah, 26',          timestamp: '2 minutes ago',    read: false, section: 'today' },
  { id: '2', type: 'message',   name: 'Emma',   photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100', body: 'Emma: "Hey! How are you doing?"',    timestamp: '15 minutes ago',   read: false, section: 'today' },
  { id: '3', type: 'like',      name: 'Alex',   photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', body: 'Alex liked your profile',            timestamp: '1 hour ago',       read: true,  section: 'today' },
  { id: '4', type: 'view',      name: 'Jordan', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', body: 'Jordan viewed your profile',         timestamp: '3 hours ago',      read: true,  section: 'today' },
  { id: '5', type: 'superlike', name: 'Mia',    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', body: 'Mia super liked you!',               timestamp: 'Yesterday 8:30 PM', read: true,  section: 'yesterday' },
  { id: '6', type: 'match',     name: 'Lily',   photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100', body: 'You matched with Lily, 25',          timestamp: 'Yesterday 6:00 PM', read: true,  section: 'yesterday' },
];

const TYPE_CONFIG: Record<NotifType, { icon: string; label: string; labelColor: string; iconBg: string }> = {
  match:     { icon: '\u{1F389}', label: 'New Match!',   labelColor: colors.secondary_container, iconBg: colors.secondary_container },
  message:   { icon: '\u{1F4AC}', label: 'New Message',  labelColor: colors.tertiary,            iconBg: colors.tertiary_container },
  like:      { icon: '\u2764\uFE0F', label: 'New Like',  labelColor: colors.primary_container,   iconBg: colors.primary_container },
  superlike: { icon: '\u2B50',    label: 'Super Like!',  labelColor: colors.secondary_container, iconBg: colors.secondary_container },
  view:      { icon: '\u{1F440}', label: 'Profile View', labelColor: `${colors.on_surface}99`,   iconBg: colors.surface_container_high },
};

const FILTER_TYPES: Record<Filter, NotifType[] | null> = {
  All:      null,
  Matches:  ['match'],
  Messages: ['message'],
  Likes:    ['like', 'superlike'],
  Visitors: ['view'],
};

interface Props {
  onBack: () => void;
  onSettings: () => void;
  onNotifPress: (notif: Notification) => void;
}

export default function NotificationsScreen({ onBack, onSettings, onNotifPress }: Props) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('All');

  const allowedTypes = FILTER_TYPES[filter];
  const filtered = allowedTypes
    ? NOTIFICATIONS.filter(n => allowedTypes.includes(n.type))
    : NOTIFICATIONS;

  const todayItems = filtered.filter(n => n.section === 'today');
  const yesterdayItems = filtered.filter(n => n.section === 'yesterday');

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={onSettings} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.settingsIcon}>\u2699\uFE0F</Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow} style={styles.filterScroll}>
        {FILTERS.map(f => {
          const isActive = f === filter;
          return (
            <TouchableOpacity key={f} style={[styles.chip, isActive && styles.chipActive]} onPress={() => setFilter(f)} activeOpacity={0.75}>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {todayItems.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>TODAY</Text>
            <View style={styles.notifList}>
              {todayItems.map(n => <NotifRow key={n.id} item={n} onPress={() => onNotifPress(n)} />)}
            </View>
          </>
        )}

        {yesterdayItems.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>YESTERDAY</Text>
            <View style={styles.notifList}>
              {yesterdayItems.map(n => <NotifRow key={n.id} item={n} onPress={() => onNotifPress(n)} />)}
            </View>
          </>
        )}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>\u{1F514}</Text>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyBody}>You're all caught up!</Text>
          </View>
        )}

        {filtered.length > 0 && (
          <TouchableOpacity style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark All as Read</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

function NotifRow({ item, onPress }: { item: Notification; onPress: () => void }) {
  const cfg = TYPE_CONFIG[item.type];
  const ICON_SIZE = rw(10.3); // ~40px
  const PHOTO_SIZE = rw(10.3);

  return (
    <TouchableOpacity
      style={[styles.notifRow, !item.read && styles.notifRowUnread]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Unread indicator */}
      {!item.read && <View style={styles.unreadBar} />}

      {/* Icon + photo stack */}
      <View style={styles.iconStack}>
        <View style={[styles.typeIconCircle, { width: ICON_SIZE, height: ICON_SIZE, borderRadius: ICON_SIZE / 2, backgroundColor: cfg.iconBg }]}>
          <Text style={styles.typeIcon}>{cfg.icon}</Text>
        </View>
        <Image source={{ uri: item.photo }} style={[styles.notifPhoto, { width: PHOTO_SIZE * 0.75, height: PHOTO_SIZE * 0.75, borderRadius: PHOTO_SIZE * 0.375 }]} />
      </View>

      {/* Content */}
      <View style={styles.notifContent}>
        <Text style={[styles.notifLabel, { color: cfg.labelColor }]}>{cfg.label}</Text>
        <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.notifTime}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  settingsIcon: { fontSize: rf(2.1) },
  filterScroll: { flexGrow: 0, marginBottom: rh(2.4) },
  filterRow: { paddingHorizontal: rw(6.2), gap: rw(2.1) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  scroll: { paddingHorizontal: rw(6.2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  notifList: { gap: rh(1) },
  notifRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1), overflow: 'hidden' },
  notifRowUnread: { backgroundColor: colors.surface_container_high },
  unreadBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.secondary_container, borderTopLeftRadius: rw(4.1), borderBottomLeftRadius: rw(4.1) },
  iconStack: { position: 'relative', width: rw(10.3) + rw(4), height: rw(10.3) },
  typeIconCircle: { alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0 },
  typeIcon: { fontSize: rf(1.9) },
  notifPhoto: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.surface_container_high, borderWidth: 2, borderColor: colors.surface_container },
  notifContent: { flex: 1 },
  notifLabel: { ...typography['label-md'], marginBottom: rh(0.3) },
  notifBody: { ...typography['body-md'], color: `${colors.on_surface}CC`, marginBottom: rh(0.3) },
  notifTime: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  emptyState: { alignItems: 'center', paddingVertical: rh(7) },
  emptyIcon: { fontSize: rf(5.6), marginBottom: rh(1.9) },
  emptyTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(0.9) },
  emptyBody: { ...typography['body-md'], color: `${colors.on_surface}99` },
  markAllBtn: { alignItems: 'center', paddingVertical: rh(2.4), marginTop: rh(1.9) },
  markAllText: { ...typography['label-md'], color: colors.tertiary },
});
