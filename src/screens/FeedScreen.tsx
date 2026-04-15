import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput,
  Platform, Animated, StatusBar, Modal, Pressable, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf,
} from 'react-native-responsive-dimensions';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import TabBar, { TabName } from '../components/TabBar';

// Design canvas: 390 x 844

const FILTERS = ['All', 'Matches', 'Community'] as const;
type Filter = (typeof FILTERS)[number];

type CardType = 'match' | 'view' | 'like' | 'superlike' | 'community';

interface FeedItem {
  id: string;
  type: CardType;
  name: string;
  age?: number;
  photo: string;
  online?: boolean;
  timestamp: string;
  // community only
  postText?: string;
  likes?: number;
  comments?: number;
}

const MOCK_FEED: FeedItem[] = [
  { id: '1', type: 'match',     name: 'Sarah',  age: 26, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', online: true,  timestamp: '2h ago' },
  { id: '2', type: 'view',      name: 'Emma',   age: 24, photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100', online: false, timestamp: '5h ago' },
  { id: '3', type: 'like',      name: 'Alex',   age: 27, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', online: false, timestamp: 'Yesterday' },
  { id: '4', type: 'superlike', name: 'Mia',    age: 28, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', online: true,  timestamp: '3h ago' },
  { id: '5', type: 'community', name: 'Jordan', age: 25, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', online: false, timestamp: '10m ago', postText: 'Anyone else love hiking in the rain? \u{1F327}\uFE0F Looking for someone who doesn\'t mind getting their boots a little muddy.', likes: 24, comments: 8 },
  { id: '6', type: 'match',     name: 'Lily',   age: 25, photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100', online: true,  timestamp: '1d ago' },
];

const CARD_LABEL: Record<CardType, { emoji: string; text: string; color: string }> = {
  match:     { emoji: '\u{1F389}', text: 'NEW MATCH',    color: colors.secondary_container },
  view:      { emoji: '\u{1F440}', text: 'PROFILE VIEW', color: colors.tertiary },
  like:      { emoji: '\u2764\uFE0F', text: 'NEW LIKE',  color: colors.primary_container },
  superlike: { emoji: '\u2B50', text: 'SUPER LIKE',      color: colors.secondary_container },
  community: { emoji: '', text: '', color: '' },
};

interface Props {
  onSendMessage: (id: string) => void;
  onViewProfile: (id: string) => void;
  onLike: (id: string) => void;
  onNotifications: () => void;
  onTabPress: (tab: TabName) => void;
  activeTab?: TabName;
}

export default function FeedScreen({
  onSendMessage, onViewProfile, onLike, onNotifications, onTabPress, activeTab = 'feed',
}: Props) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('All');
  const [composerVisible, setComposerVisible] = useState(false);
  const [postText, setPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const composerFocused = useRef(new Animated.Value(0)).current;

  const filtered = filter === 'All' ? MOCK_FEED
    : filter === 'Matches' ? MOCK_FEED.filter(i => i.type === 'match' || i.type === 'superlike')
    : MOCK_FEED.filter(i => i.type === 'community');

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const PHOTO_SIZE = rw(12.3); // 48px

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <TouchableOpacity onPress={onNotifications} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.headerIcon}>\u{1F514}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => {
          const isActive = f === filter;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feed list */}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(14) }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map(item => {
          if (item.type === 'community') {
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.communityHeader}>
                  <View style={styles.photoWrapper}>
                    <Image source={{ uri: item.photo }} style={[styles.photo, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
                    {item.online && <View style={styles.onlineDot} />}
                  </View>
                  <View style={styles.communityMeta}>
                    <Text style={styles.communityName}>{item.name}, {item.age}</Text>
                    <Text style={styles.communitySubtitle}>Community Post \u2022 {item.timestamp}</Text>
                  </View>
                </View>
                <Text style={styles.communityPost}>"{item.postText}"</Text>
                <View style={styles.reactionBar}>
                  <TouchableOpacity style={styles.reactionBtn} onPress={() => toggleLike(item.id)}>
                    <Text style={[styles.reactionIcon, likedPosts.has(item.id) && styles.reactionIconLiked]}>\u2764\uFE0F</Text>
                    <Text style={styles.reactionCount}>{(item.likes ?? 0) + (likedPosts.has(item.id) ? 1 : 0)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reactionBtn}>
                    <Text style={styles.reactionIcon}>\u{1F4AC}</Text>
                    <Text style={styles.reactionCount}>{item.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.reactionBtn, styles.reactionShare]}>
                    <Text style={styles.reactionShareText}>\u21D7 Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          const label = CARD_LABEL[item.type];
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <Text style={[styles.cardLabel, { color: label.color }]}>{label.emoji} {label.text}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.photoWrapper}>
                  <Image source={{ uri: item.photo }} style={[styles.photo, { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_SIZE / 2 }]} />
                  {item.online && <View style={styles.onlineDot} />}
                </View>
                <View style={styles.cardBodyText}>
                  {item.type === 'match' || item.type === 'superlike' ? (
                    <Text style={styles.cardBodyMain}>You matched with <Text style={styles.bold}>{item.name}, {item.age}</Text></Text>
                  ) : item.type === 'view' ? (
                    <Text style={styles.cardBodyMain}><Text style={styles.bold}>{item.name}</Text> viewed your profile</Text>
                  ) : (
                    <Text style={styles.cardBodyMain}><Text style={styles.bold}>{item.name}</Text> liked your profile</Text>
                  )}
                </View>
                <View style={styles.cardActions}>
                  {(item.type === 'match' || item.type === 'superlike') ? (
                    <TouchableOpacity style={styles.primaryActionBtn} onPress={() => onSendMessage(item.id)} activeOpacity={0.85}>
                      <Text style={styles.primaryActionText}>Send Message</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.dualActions}>
                      <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => onViewProfile(item.id)} activeOpacity={0.8}>
                        <Text style={styles.secondaryActionText}>View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.likeCircleBtn, item.type === 'like' && styles.likeCircleBtnCrimson]}
                        onPress={() => onLike(item.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.likeCircleIcon}>\u2665</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + rh(12) }]}
        onPress={() => setComposerVisible(true)}
        activeOpacity={0.85}
        accessibilityLabel="Compose post"
        accessibilityRole="button"
      >
        <Text style={styles.fabIcon}>\u270F\uFE0F</Text>
      </TouchableOpacity>

      <TabBar active={activeTab} onPress={onTabPress} />

      {/* Post composer bottom sheet */}
      <Modal visible={composerVisible} transparent animationType="slide" onRequestClose={() => setComposerVisible(false)}>
        <Pressable style={styles.composerOverlay} onPress={() => setComposerVisible(false)}>
          <View style={[styles.composerSheet, { paddingBottom: insets.bottom + rh(2) }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.composerLabel}>WHAT'S ON YOUR MIND?</Text>
            <Animated.View style={[styles.composerInputWrapper, { borderBottomColor: composerFocused.interpolate({ inputRange: [0,1], outputRange: ['rgba(89,64,65,0.15)', colors.secondary] }), borderBottomWidth: 1 }]}>
              <TextInput
                style={styles.composerInput}
                value={postText}
                onChangeText={setPostText}
                placeholder="Write something..."
                placeholderTextColor={`${colors.on_surface}4D`}
                multiline
                textAlignVertical="top"
                onFocus={() => Animated.timing(composerFocused, { toValue: 1, duration: 180, useNativeDriver: false }).start()}
                onBlur={() => Animated.timing(composerFocused, { toValue: 0, duration: 180, useNativeDriver: false }).start()}
              />
            </Animated.View>
            <View style={styles.composerOptions}>
              <TouchableOpacity style={styles.composerOption}>
                <Text style={styles.composerOptionText}>\u{1F5BC}\uFE0F  Add Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.composerOption}>
                <Text style={styles.composerOptionText}>\u{1F4CD}  Add Location</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.postBtn, !postText.trim() && styles.postBtnDisabled]}
              onPress={() => { if (postText.trim()) { setComposerVisible(false); setPostText(''); } }}
              activeOpacity={0.85}
            >
              <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  headerIcon: { fontSize: rf(2.4), opacity: 0.7 },

  filterRow: { flexDirection: 'row', gap: rw(2.1), paddingHorizontal: rw(6.2), marginBottom: rh(1.9) },
  filterChip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  filterChipActive: { backgroundColor: colors.secondary_container },
  filterChipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  filterChipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },

  scroll: { paddingHorizontal: rw(6.2), gap: rh(1.9) },

  card: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(5.1), ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 20 }, android: { elevation: 3 } }) },

  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rh(1.4) },
  cardLabel: { ...typography['label-sm'], textTransform: 'uppercase', letterSpacing: 1.5 },
  timestamp: { ...typography['label-sm'], color: `${colors.on_surface}66` },

  cardBody: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1) },
  photoWrapper: { position: 'relative' },
  photo: { backgroundColor: colors.surface_container_high },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: rw(3.1), height: rw(3.1), borderRadius: rw(1.5), backgroundColor: colors.emerald, borderWidth: 2, borderColor: colors.surface_container },
  cardBodyText: { flex: 1 },
  cardBodyMain: { ...typography['body-md'], color: colors.on_surface },
  bold: { fontFamily: 'PlusJakartaSans-SemiBold' },
  cardActions: { alignItems: 'flex-end' },

  primaryActionBtn: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  primaryActionText: { ...typography['label-md'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },

  dualActions: { flexDirection: 'row', gap: rw(2.1), alignItems: 'center' },
  secondaryActionBtn: { height: rh(4.3), paddingHorizontal: rw(3.6), borderRadius: 9999, backgroundColor: colors.surface_container_high, alignItems: 'center', justifyContent: 'center' },
  secondaryActionText: { ...typography['label-md'], color: colors.on_surface },
  likeCircleBtn: { width: rw(10.3), height: rw(10.3), borderRadius: rw(5.1), backgroundColor: colors.surface_container_high, alignItems: 'center', justifyContent: 'center' },
  likeCircleBtnCrimson: { backgroundColor: colors.primary_container },
  likeCircleIcon: { fontSize: rf(2.1), color: '#FFFFFF' },

  communityHeader: { flexDirection: 'row', alignItems: 'center', gap: rw(3.1), marginBottom: rh(1.4) },
  communityMeta: { flex: 1 },
  communityName: { ...typography['label-lg'], color: colors.on_surface },
  communitySubtitle: { ...typography['label-sm'], color: `${colors.on_surface}66` },
  communityPost: { fontFamily: 'NotoSerif', fontSize: rf(2.1), color: colors.on_surface, lineHeight: rf(3.1), fontStyle: 'italic', marginBottom: rh(1.9) },

  reactionBar: { flexDirection: 'row', alignItems: 'center', gap: rw(4.1), borderTopWidth: 1, borderTopColor: `${colors.on_surface}0D`, paddingTop: rh(1.4) },
  reactionBtn: { flexDirection: 'row', alignItems: 'center', gap: rw(1.5) },
  reactionIcon: { fontSize: rf(1.9), opacity: 0.7 },
  reactionIconLiked: { opacity: 1 },
  reactionCount: { ...typography['label-md'], color: `${colors.on_surface}99` },
  reactionShare: { marginLeft: 'auto' },
  reactionShareText: { ...typography['label-md'], color: colors.tertiary },

  fab: { position: 'absolute', right: rw(6.2), width: rw(14.4), height: rw(14.4), borderRadius: rw(7.2), backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: colors.secondary_container, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 20 }, android: { elevation: 8 } }) },
  fabIcon: { fontSize: rf(2.6) },

  composerOverlay: { flex: 1, backgroundColor: 'rgba(21,6,41,0.6)', justifyContent: 'flex-end' },
  composerSheet: { backgroundColor: 'rgba(46,26,64,0.97)', borderTopLeftRadius: rw(6.2), borderTopRightRadius: rw(6.2), paddingTop: rh(1.4), paddingHorizontal: rw(6.2) },
  sheetHandle: { width: rw(8.2), height: 4, borderRadius: 9999, backgroundColor: `${colors.on_surface}4D`, alignSelf: 'center', marginBottom: rh(2.4) },
  composerLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  composerInputWrapper: { backgroundColor: colors.surface_container_highest, borderTopLeftRadius: rw(3.1), borderTopRightRadius: rw(3.1), paddingHorizontal: rw(4.1), paddingVertical: rh(1.4), marginBottom: rh(1.9) },
  composerInput: { ...typography['body-lg'], color: colors.on_surface, minHeight: rh(11.4), padding: 0, margin: 0 },
  composerOptions: { gap: rh(1.2), marginBottom: rh(2.4) },
  composerOption: { paddingVertical: rh(0.9) },
  composerOptionText: { ...typography['body-md'], color: colors.on_surface },
  postBtn: { height: rh(6.6), backgroundColor: colors.secondary_container, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: rh(1.2) },
  postBtnDisabled: { backgroundColor: colors.surface_container, ...Platform.select({ ios: { shadowOpacity: 0 }, android: { elevation: 0 } }) },
  postBtnText: { ...typography['title-md'], color: colors.on_secondary, letterSpacing: 1 },
});
