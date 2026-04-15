import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import TabBar, { TabName } from '../components/TabBar';

const FILTERS = ['Matches', 'Chats', 'Requests'] as const;
type Filter = (typeof FILTERS)[number];

interface Match { id: string; name: string; photo: string; online: boolean; }
interface Conversation {
  id: string; name: string; age: number; photo: string; online: boolean;
  lastMessage: string; isMine: boolean; timestamp: string;
  unread: number; verified: boolean;
}

const MATCHES: Match[] = [
  { id: '1', name: 'Sarah',  photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', online: true },
  { id: '2', name: 'Emma',   photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100', online: false },
  { id: '3', name: 'Mia',    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', online: true },
  { id: '4', name: 'Lily',   photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100', online: false },
  { id: '5', name: 'Zoe',    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100', online: true },
];

const CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Sarah',  age: 26, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', online: true,  lastMessage: 'Hey! How are you doing?', isMine: false, timestamp: '2m',  unread: 2, verified: true },
  { id: '2', name: 'Emma',   age: 24, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100', online: false, lastMessage: 'That sounds fun!',          isMine: false, timestamp: '1h',  unread: 0, verified: false },
  { id: '3', name: 'Alex',   age: 28, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', online: false, lastMessage: 'Let me know!',               isMine: true,  timestamp: '2d',  unread: 0, verified: false },
  { id: '4', name: 'Jordan', age: 25, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', online: true,  lastMessage: '\u{1F602}',                   isMine: false, timestamp: '1w',  unread: 1, verified: true },
];

interface Props {
  onConversation: (id: string) => void;
  onSearch: () => void;
  onCompose: () => void;
  onTabPress: (tab: TabName) => void;
  activeTab?: TabName;
}

export default function MessagesScreen({ onConversation, onSearch, onCompose, onTabPress, activeTab = 'messages' }: Props) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('Chats');

  const AVATAR = rw(16.4);  // 64px
  const CONV_PHOTO = rw(13.3); // 52px

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.headerIcon}>\u{1F50D}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCompose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.headerIcon}>\u270F\uFE0F</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map(f => {
          const isActive = f === filter;
          return (
            <TouchableOpacity key={f} style={[styles.chip, isActive && styles.chipActive]} onPress={() => setFilter(f)} activeOpacity={0.75}>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(12) }]} showsVerticalScrollIndicator={false}>
        {/* New matches row */}
        <Text style={styles.sectionLabel}>NEW MATCHES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.matchesRow} style={styles.matchesScroll}>
          {MATCHES.map(m => (
            <TouchableOpacity key={m.id} style={styles.matchItem} onPress={() => onConversation(m.id)} activeOpacity={0.8}>
              <View style={styles.matchAvatarWrapper}>
                <Image source={{ uri: m.photo }} style={[styles.matchAvatar, { width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 }]} />
                {m.online && <View style={[styles.onlineRing, { width: AVATAR + 6, height: AVATAR + 6, borderRadius: (AVATAR + 6) / 2 }]} />}
                {m.online && <View style={styles.onlineDotSmall} />}
              </View>
              <Text style={styles.matchName} numberOfLines={1}>{m.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Conversations */}
        <Text style={[styles.sectionLabel, { marginTop: rh(2.8) }]}>CONVERSATIONS</Text>
        <View style={styles.convList}>
          {CONVERSATIONS.map(c => (
            <TouchableOpacity key={c.id} style={styles.convRow} onPress={() => onConversation(c.id)} activeOpacity={0.8}>
              <View style={styles.convPhotoWrapper}>
                <Image source={{ uri: c.photo }} style={[styles.convPhoto, { width: CONV_PHOTO, height: CONV_PHOTO, borderRadius: CONV_PHOTO / 2 }]} />
                {c.online && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.convBody}>
                <View style={styles.convTopRow}>
                  <View style={styles.convNameRow}>
                    <Text style={[styles.convName, c.unread > 0 && styles.convNameUnread]}>{c.name}, {c.age}</Text>
                    {c.verified && <Text style={styles.verifiedBadge}> \u2713</Text>}
                  </View>
                  <Text style={styles.convTime}>{c.timestamp}</Text>
                </View>
                <View style={styles.convBottomRow}>
                  <Text style={[styles.convMsg, c.unread > 0 && styles.convMsgUnread]} numberOfLines={1}>
                    {c.isMine ? <Text style={styles.youPrefix}>You: </Text> : null}{c.lastMessage}
                  </Text>
                  {c.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{c.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TabBar active={activeTab} onPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  headerIcons: { flexDirection: 'row', gap: rw(3.6) },
  headerIcon: { fontSize: rf(2.4), opacity: 0.7 },
  filterRow: { flexDirection: 'row', gap: rw(2.1), paddingHorizontal: rw(6.2), marginBottom: rh(2.4) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  scroll: { paddingHorizontal: rw(6.2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  matchesScroll: { flexGrow: 0, marginBottom: rh(0.5) },
  matchesRow: { gap: rw(3.1), paddingVertical: rh(0.5) },
  matchItem: { alignItems: 'center', width: rw(16.4) },
  matchAvatarWrapper: { position: 'relative', marginBottom: rh(0.7) },
  matchAvatar: { backgroundColor: colors.surface_container },
  onlineRing: { position: 'absolute', top: -3, left: -3, borderWidth: 3, borderColor: colors.emerald, borderRadius: 9999 },
  onlineDotSmall: { position: 'absolute', bottom: 2, right: 2, width: rw(2.6), height: rw(2.6), borderRadius: rw(1.3), backgroundColor: colors.emerald, borderWidth: 2, borderColor: colors.surface_container_lowest },
  matchName: { ...typography['label-sm'], color: `${colors.on_surface}B3`, textAlign: 'center' },
  convList: { gap: rh(1) },
  convRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1) },
  convPhotoWrapper: { position: 'relative' },
  convPhoto: { backgroundColor: colors.surface_container_high },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: rw(3.1), height: rw(3.1), borderRadius: rw(1.5), backgroundColor: colors.emerald, borderWidth: 2, borderColor: colors.surface_container },
  convBody: { flex: 1 },
  convTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rh(0.4) },
  convNameRow: { flexDirection: 'row', alignItems: 'center' },
  convName: { ...typography['label-lg'], color: colors.on_surface },
  convNameUnread: { fontFamily: 'PlusJakartaSans-SemiBold' },
  verifiedBadge: { ...typography['label-sm'], color: colors.emerald },
  convTime: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  convBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  convMsg: { ...typography['body-md'], color: `${colors.on_surface}99`, flex: 1 },
  convMsgUnread: { color: colors.on_surface, fontFamily: 'PlusJakartaSans-SemiBold' },
  youPrefix: { color: colors.tertiary },
  unreadBadge: { backgroundColor: colors.secondary_container, borderRadius: 9999, minWidth: rw(5.1), height: rw(5.1), alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(1.5) },
  unreadText: { ...typography['label-sm'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
});
