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

const CATEGORIES = ['All', 'Gaming', 'Music', 'Food', 'Sports', 'Art', 'Tech', 'Books'];

interface Club {
  id: string; emoji: string; name: string; members: number;
  description: string; joined: boolean;
  memberPhotos: string[];
}

const CLUBS: Club[] = [
  {
    id: '1', emoji: '\u{1F3AE}', name: 'Gaming Club', members: 1247,
    description: 'For gamers who want to find their player 2',
    joined: true,
    memberPhotos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=60',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60',
    ],
  },
  {
    id: '2', emoji: '\u{1F4DA}', name: 'Book Lovers', members: 892,
    description: 'Share your latest reads and find your literary soulmate',
    joined: true,
    memberPhotos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=60',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60',
    ],
  },
  {
    id: '3', emoji: '\u{1F3B5}', name: 'Music Lovers', members: 2341,
    description: 'Share your playlists and find your rhythm',
    joined: false,
    memberPhotos: [],
  },
  {
    id: '4', emoji: '\u{1F355}', name: 'Foodies United', members: 1876,
    description: 'Discover restaurants and cooking partners',
    joined: false,
    memberPhotos: [],
  },
  {
    id: '5', emoji: '\u26BD', name: 'Sports Fans', members: 1103,
    description: 'Find your game-day companion',
    joined: false,
    memberPhotos: [],
  },
];

interface Props {
  onSearch: () => void;
  onClubDetail: (id: string) => void;
}

export default function ClubsScreen({ onSearch, onClubDetail }: Props) {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [clubs, setClubs] = useState(CLUBS);

  const myClubs = clubs.filter(c => c.joined);
  const discoverClubs = clubs.filter(c => {
    if (c.joined) return false;
    if (activeCategory === 'All') return true;
    return c.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      c.description.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const toggleJoin = (id: string) =>
    setClubs(prev => prev.map(c => c.id === id ? { ...c, joined: !c.joined } : c));

  const AVATAR_SIZE = rw(7.2); // ~28px

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface_container_lowest} translucent />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clubs</Text>
        <TouchableOpacity onPress={onSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.searchIcon}>\u{1F50D}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + rh(4) }]} showsVerticalScrollIndicator={false}>

        {/* My clubs */}
        {myClubs.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>MY CLUBS</Text>
            <View style={styles.cardList}>
              {myClubs.map(club => (
                <ClubCard
                  key={club.id} club={club} avatarSize={AVATAR_SIZE}
                  onView={() => onClubDetail(club.id)}
                  onToggle={() => toggleJoin(club.id)}
                />
              ))}
            </View>
          </>
        )}

        {/* Category chips */}
        <Text style={[styles.sectionLabel, { marginTop: rh(3.6) }]}>DISCOVER CLUBS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow} style={styles.chipsScroll}>
          {CATEGORIES.map(cat => {
            const isActive = cat === activeCategory;
            return (
              <TouchableOpacity key={cat} style={[styles.chip, isActive && styles.chipActive]} onPress={() => setActiveCategory(cat)} activeOpacity={0.75}>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Discover clubs */}
        <View style={styles.cardList}>
          {discoverClubs.map(club => (
            <ClubCard
              key={club.id} club={club} avatarSize={AVATAR_SIZE}
              onView={() => onClubDetail(club.id)}
              onToggle={() => toggleJoin(club.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ClubCard({ club, avatarSize, onView, onToggle }: {
  club: Club; avatarSize: number; onView: () => void; onToggle: () => void;
}) {
  return (
    <View style={styles.clubCard}>
      <View style={styles.clubCardTop}>
        <Text style={styles.clubEmoji}>{club.emoji}</Text>
        <View style={styles.clubInfo}>
          <Text style={styles.clubName}>{club.name}</Text>
          <Text style={styles.clubMembers}>{club.members.toLocaleString()} members</Text>
          {club.description ? <Text style={styles.clubDesc} numberOfLines={1}>{club.description}</Text> : null}
        </View>
      </View>
      {club.memberPhotos.length > 0 && (
        <View style={styles.avatarRow}>
          {club.memberPhotos.slice(0, 4).map((uri, i) => (
            <Image key={i} source={{ uri }} style={[styles.memberAvatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, marginLeft: i > 0 ? -rw(2.1) : 0 }]} />
          ))}
          {club.members > 4 && (
            <View style={[styles.memberMore, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, marginLeft: -rw(2.1) }]}>
              <Text style={styles.memberMoreText}>+{club.members - 4}</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.clubActions}>
        <TouchableOpacity style={styles.viewBtn} onPress={onView} activeOpacity={0.8}>
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
        {club.joined ? (
          <TouchableOpacity style={styles.leaveBtn} onPress={onToggle} activeOpacity={0.8}>
            <Text style={styles.leaveBtnText}>Leave</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.joinBtn} onPress={onToggle} activeOpacity={0.85}>
            <Text style={styles.joinBtnText}>Join Club</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface_container_lowest },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: rw(6.2), paddingVertical: rh(1.4) },
  headerTitle: { ...typography['title-lg'], color: colors.on_surface },
  searchIcon: { fontSize: rf(2.4), opacity: 0.7 },
  scroll: { paddingHorizontal: rw(6.2) },
  sectionLabel: { ...typography['label-sm'], color: colors.tertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: rh(1.4) },
  cardList: { gap: rh(1.4) },
  clubCard: { backgroundColor: colors.surface_container, borderRadius: rw(5.1), padding: rw(4.1), gap: rh(1.2) },
  clubCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: rw(3.1) },
  clubEmoji: { fontSize: rf(3.8), marginTop: rh(0.3) },
  clubInfo: { flex: 1 },
  clubName: { ...typography['title-md'], color: colors.on_surface, marginBottom: rh(0.3) },
  clubMembers: { ...typography['label-sm'], color: `${colors.on_surface}80`, marginBottom: rh(0.3) },
  clubDesc: { ...typography['body-md'], color: `${colors.on_surface}99` },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  memberAvatar: { backgroundColor: colors.surface_container_high, borderWidth: 2, borderColor: colors.surface_container },
  memberMore: { backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.surface_container },
  memberMoreText: { ...typography['label-sm'], color: colors.on_secondary, fontSize: rf(1.1) },
  clubActions: { flexDirection: 'row', gap: rw(2.6) },
  viewBtn: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  viewBtnText: { ...typography['label-md'], color: colors.primary },
  leaveBtn: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,178,182,0.20)', alignItems: 'center', justifyContent: 'center' },
  leaveBtnText: { ...typography['label-md'], color: colors.primary },
  joinBtn: { height: rh(4.3), paddingHorizontal: rw(5.1), borderRadius: 9999, backgroundColor: colors.secondary_container, alignItems: 'center', justifyContent: 'center' },
  joinBtnText: { ...typography['label-md'], color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
  chipsScroll: { flexGrow: 0, marginBottom: rh(1.9) },
  chipsRow: { gap: rw(2.1) },
  chip: { height: rh(4.3), paddingHorizontal: rw(4.1), borderRadius: 9999, backgroundColor: colors.tertiary_container, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.secondary_container },
  chipText: { ...typography['label-md'], color: colors.on_tertiary_container },
  chipTextActive: { color: colors.on_secondary, fontFamily: 'PlusJakartaSans-SemiBold' },
});
