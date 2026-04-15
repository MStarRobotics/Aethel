import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, TextInput, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const FILTERS = ['All', 'Unread', 'Archived'] as const;
type Filter = (typeof FILTERS)[number];

interface Conversation {
  id: string; name: string; age: number; photo: string; online: boolean;
  lastMessage: string; isMine: boolean; timestamp: string;
  unread: number; pinned: boolean;
}

const CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Sarah',  age: 26, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', online: true,  lastMessage: 'Hey! How are you doing?', isMine: false, timestamp: '2m',  unread: 2, pinned: true },
  { id: '2', name: 'Emma',   age: 24, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100', online: false, lastMessage: 'That sounds fun!',          isMine: false, timestamp: '1h',  unread: 0, pinned: false },
  { id: '3', name: 'Alex',   age: 28, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', online: false, lastMessage: 'Let me know!',               isMine: true,  timestamp: '2d',  unread: 0, pinned: false },
  { id: '4', name: 'Jordan', age: 25, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', online: true,  lastMessage: '\u{1F602}',                   isMine: false, timestamp: '1w',  unread: 1, pinned: false },
];

interface Props {
  onBack: () => void;
  onConversation: (id: string) => void;
  onCompose: () => void;
}

export default function ConversationListScreen({ onBack, onConversation, onCompose }: Props) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');

  const PHOTO_SIZE = rw(13.3); // ~52px

  const pinned = CONVERSATIONS.filter(c => c.pinned);
  const recent = CONVERSATIONS.filter(c => {
    if (c.pinned) return false;
    if (filter === 'Unread') return c.unread > 0;
    return true;
  }).filter(c =>
    search.length === 0 || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backText}>\u2190 Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversations</Text>
        <TouchableOpacity onPress={onCompose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.composeIcon}>\u270F\uFE0F</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>\u{1F50D}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations"
          placeholderTextColor={`${colors.on_surface}66`}
          value={search}
          onChangeText={setSearch}
          selectionColor={colors.secondary}
        />
      </View>

      {/* Filter chips */}
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

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* Pinned */}
        {pinned.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>PINNED</Text>
            <View style={styles.convList}>
              {pinned.map(c => (
                <ConvRow key={c.id} item={c} photoSize={PHOTO_SIZE} onPress={() => onConversation(c.id)} pinned />
              ))}
            </View>
          </>
        )}

        {/* Recent */}
        <Text style={[styles.sectionLabel, { marginTop: pinned.length > 0 ? rh(3.6) : 0 }]}>RECENT</Text>
        {recent.length > 0 ? (
          <View style={styles.convList}>
            {recent.map(c => (
              <ConvRow key={c.id} item={c} photoSize={PHOTO_SIZE} onPress={() => onConversation(c.id)} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>\u{1F4AC}</Text>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyBody}>Match with someone and start chatting!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ConvRow({ item, photoSize, onPress, pinned = false }: {
  item: Conversation; photoSize: number; onPress: () => void; pinned?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.convRow, pinned && styles.convRowPinned]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.photoWrapper}>
        <Image source={{ uri: item.photo }} style={[styles.photo, { width: photoSize, height: photoSize, borderRadius: photoSize / 2 }]} />
        {item.online && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.convBody}>
        <View style={styles.convTopRow}>
          <View style={styles.nameRow}>
            {pinned && <Text style={styles.pinIcon}>\u{1F4CC} </Text>}
            <Text style={[styles.convName, item.unread > 0 && styles.convNameUnread]} numberOfLines={1}>
              {item.name}, {item.age}
            </Text>
          </View>
          <Text style={styles.convTime}>{item.timestamp}</Text>
        </View>
        <View style={styles.convBottomRow}>
          <Text style={[styles.convMsg, item.unread > 0 && styles.convMsgUnread]} numberOfLines={1}>
            {item.isMine ? <Text style={styles.youPrefix}>You: </Text> : null}{item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  backText: { ...typography['label-md'], color: colors.tertiary },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  composeIcon: { fontSize: rf(2.1) },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', marginHorizontal: rw(6.2), backgroundColor: colors.surface_container_highest, borderRadius: rw(3.1), paddingHorizontal: rw(4.1), height: rh(6.2), marginBottom: rh(1.9), borderBottomWidth: 1, borderBottomColor: `${colors.outline_variant}26` },
  searchIcon: { fontSize: rf(1.9), marginRight: rw(2.6), opacity: 0.5 },
  searchInput: { flex: 1, ...typography['body-md'], color: colors.on_surface },
  filterRow: { flexDirection: 'row', gap: rw(2.1), paddingHorizontal: rw(6.2), marginBottom: rh(2.4) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  scroll: { paddingHorizontal: rw(6.2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  convList: { gap: rh(1) },
  convRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface_container, borderRadius: rw(4.1), padding: rw(4.1), gap: rw(3.1) },
  convRowPinned: { backgroundColor: colors.surface_container_high },
  photoWrapper: { position: 'relative' },
  photo: { backgroundColor: colors.surface_container_high },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: rw(3.1), height: rw(3.1), borderRadius: rw(1.5), backgroundColor: colors.emerald, borderWidth: 2, borderColor: colors.surface_container },
  convBody: { flex: 1 },
  convTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rh(0.4) },
  nameRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  pinIcon: { fontSize: rf(1.3), color: colors.secondary_container },
  convName: { ...typography['label-lg'], color: `${colors.on_surface}CC`, flex: 1 },
  convNameUnread: { color: colors.on_surface, fontFamily: 'PlusJakartaSans-SemiBold' },
  convTime: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  convBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  convMsg: { ...typography['body-md'], color: `${colors.on_surface}80`, flex: 1 },
  convMsgUnread: { color: `${colors.on_surface}CC`, fontFamily: 'PlusJakartaSans-SemiBold' },
  youPrefix: { color: colors.tertiary },
  unreadBadge: { backgroundColor: colors.secondary_container, borderRadius: 9999, minWidth: rw(5.1), height: rw(5.1), alignItems: 'center', justifyContent: 'center', paddingHorizontal: rw(1.5) },
  unreadText: { ...typography['label-sm'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  emptyState: { alignItems: 'center', paddingVertical: rh(7) },
  emptyIcon: { fontSize: rf(5.6), marginBottom: rh(1.9) },
  emptyTitle: { fontFamily: 'NotoSerif', fontSize: rf(2.8), color: colors.on_surface, marginBottom: rh(0.9) },
  emptyBody: { ...typography['body-md'], color: `${colors.on_surface}99`, textAlign: 'center' },
});
